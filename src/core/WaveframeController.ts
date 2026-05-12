import { PlayerCore, PlayerState } from './PlayerCore';
import { PeakAnalyzer } from './PeakAnalyzer';

/**
 * Represents the complete state of the Waveframe controller, combining playback and analysis.
 */
export type EngineState = PlayerState & {
  /** The current set of generated or provided waveform peaks (0-1 range) */
  peaks: number[];
  /** Whether an audio analysis process is currently in progress */
  isAnalyzing: boolean;
  /** Any error message encountered during playback or analysis */
  error: string | null;
};

/**
 * A callback function that receives the latest EngineState.
 */
export type EngineListener = (state: EngineState) => void;

/**
 * The orchestrator class for Waveframe. 
 * 
 * It manages the lifecycle of audio playback and waveform analysis, providing a unified 
 * store-like interface that can be easily consumed by React or other frameworks.
 * 
 * @example
 * ```typescript
 * const controller = new WaveframeController();
 * 
 * // Load from URL (automatic analysis if peaks omitted)
 * controller.load('https://example.com/audio.mp3');
 * 
 * // Load from Blob with pre-computed peaks
 * controller.load(myBlob, [0.1, 0.5, 0.8]);
 * 
 * // Subscription
 * const unsubscribe = controller.subscribe((state) => {
 *   console.log('Current time:', state.currentTime);
 * });
 * ```
 */
export class WaveframeController {
  private player: PlayerCore;
  private analyzer: PeakAnalyzer;
  private listeners: Set<EngineListener> = new Set();
  private _state: EngineState;

  private _media: string | Blob | null = null;
  private _objectUrl: string | null = null;
  private _isDisposed: boolean = false;

  /**
   * Creates a new instance of the WaveframeController.
   * Initializes internal PlayerCore and PeakAnalyzer.
   */
  constructor() {
    this.player = new PlayerCore();
    this.analyzer = new PeakAnalyzer();
    
    this._state = {
      ...this.player.state,
      peaks: [],
      isAnalyzing: false,
      error: null,
    };

    // Subscribe to player updates
    this.player.subscribe((playerState) => {
      this.updateState({ ...playerState });
    });
  }

  /**
   * Returns whether the controller has been disposed and is no longer usable.
   */
  public get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Internal method to update the state and notify all subscribers.
   */
  private updateState(patch: Partial<EngineState>) {
    this._state = { ...this._state, ...patch };
    this.notify();
  }

  /**
   * Notifies all registered listeners of a state change.
   */
  private notify() {
    this.listeners.forEach(l => l(this._state));
  }

  // --- Store Interface ---

  /**
   * Registers a listener to be called whenever the engine state changes.
   * @param listener The callback function.
   * @returns An unsubscribe function.
   */
  public subscribe(listener: EngineListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Returns a snapshot of the current engine state.
   * Useful for `useSyncExternalStore`.
   */
  public getSnapshot(): EngineState {
    return this._state;
  }

  /**
   * Returns the current engine state.
   */
  public get state(): EngineState {
    return this._state;
  }

  // --- Actions ---

  /**
   * Resets the audio player and analyzer, clearing state and current media.
   */
  public reset() {
    this.revokeOldSource();
    this._media = null;
    this.player.dispose();
    this.analyzer.dispose();
    
    // Re-initialize player and analyzer
    this.player = new PlayerCore();
    this.analyzer = new PeakAnalyzer();

    // Re-subscribe to new player
    this.player.subscribe((playerState) => {
      this.updateState({ ...playerState });
    });

    this._isDisposed = false;
    this.updateState({
      ...this.player.state,
      peaks: [],
      isAnalyzing: false,
      error: null,
    });
  }

  /**
   * Revokes any existing Object URLs to prevent memory leaks.
   */
  private revokeOldSource() {
    if (this._objectUrl) {
      URL.revokeObjectURL(this._objectUrl);
      this._objectUrl = null;
    }
  }

  /**
   * Loads media (URL or Blob) into the player.
   * 
   * If a string is passed, it's treated as a URL and used directly for playback.
   * If a Blob is passed, an Object URL is created for playback.
   * 
   * If `peaks` are not provided, it automatically triggers an analysis.
   * 
   * @param media The audio source (URL string or Blob/File object).
   * @param peaks Optional pre-generated peaks for the waveform.
   */
  public load(media: string | Blob, peaks?: number[]) {
    // Idempotency check: if media is the same, don't reload
    if (this._media === media) {
      if (peaks && (peaks.length !== this._state.peaks.length)) {
        this.updateState({ peaks });
      }
      return;
    }
    
    this.revokeOldSource();
    this._media = media;

    let sourceUrl: string;
    if (typeof media === 'string') {
      sourceUrl = media;
    } else {
      this._objectUrl = URL.createObjectURL(media);
      sourceUrl = this._objectUrl;
    }

    this.player.setSource(sourceUrl);
    
    const hasPeaks = peaks && peaks.length > 0;
    this.updateState({ 
      peaks: peaks || [], 
      isAnalyzing: false, 
      error: null 
    });

    // Automatic analysis if peaks are missing
    if (!hasPeaks) {
      this.analyze();
    }
  }

  /**
   * Analyzes the current media to generate waveform peaks.
   * @param samples The number of peaks to generate. Defaults to 512.
   */
  public async analyze(samples: number = 512) {
    if (!this._media) {
      this.updateState({ error: 'No media loaded to analyze' });
      return;
    }

    this.updateState({ isAnalyzing: true, error: null });
    try {
      const peaks = await this.analyzer.generatePeaks(this._media, samples);
      this.updateState({ peaks, isAnalyzing: false });
    } catch (e) {
      this.updateState({ 
        isAnalyzing: false, 
        error: e instanceof Error ? e.message : 'Analysis failed' 
      });
    }
  }

  /**
   * Toggles playback between playing and paused.
   */
  public async togglePlay() {
    return await this.player.togglePlay();
  }

  /**
   * Starts audio playback.
   */
  public async play() {
    return await this.player.play();
  }

  /**
   * Pauses audio playback.
   */
  public pause() {
    this.player.pause();
  }

  /**
   * Seeks to a specific position in the track.
   * @param percentage The seek position as a decimal (0 to 1).
   */
  public seek(percentage: number) {
    const { duration } = this._state;
    if (duration) {
      this.player.seek(percentage * duration);
    }
  }

  /**
   * Sets the playback volume.
   * @param volume The volume level (0 to 1).
   */
  public setVolume(volume: number) {
    this.player.setVolume(volume);
  }

  /**
   * Mutes or unmutes the audio.
   * @param muted Whether the audio should be muted.
   */
  public setMuted(muted: boolean) {
    this.player.setMuted(muted);
  }

  /**
   * Disposes of the controller, pausing playback and clearing all listeners and resources.
   */
  public dispose() {
    this._isDisposed = true;
    this.revokeOldSource();
    this.player.dispose();
    this.analyzer.dispose();
    this.listeners.clear();
  }
}
