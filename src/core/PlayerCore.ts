/**
 * Represents the low-level playback state of the audio element.
 */
export type PlayerState = {
  /** Whether the audio is currently playing */
  isPlaying: boolean;
  /** Whether the audio is stalled (waiting for data) */
  isStalled: boolean;
  /** The current playback time in seconds */
  currentTime: number;
  /** The total duration of the track in seconds */
  duration: number;
  /** The current volume level (0 to 1) */
  volume: number;
  /** Whether the audio is currently muted */
  muted: boolean;
  /** Any error reported by the audio element */
  error: string | null;
};

/**
 * A callback function that receives the latest PlayerState.
 */
export type PlayerListener = (state: PlayerState) => void;

/**
 * The internal core class responsible for managing the HTMLAudioElement.
 * 
 * It handles raw playback logic, volume control, and synchronizes the 
 * internal `PlayerState` with DOM events from the underlying `Audio` instance.
 */
export class PlayerCore {
  private audio: HTMLAudioElement;
  private listeners: Set<PlayerListener> = new Set();
  private _state: PlayerState;

  /**
   * Initializes a new PlayerCore instance and sets up event listeners on a new Audio object.
   */
  constructor() {
    this.audio = new Audio();
    this._state = {
      isPlaying: false,
      isStalled: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      muted: false,
      error: null,
    };

    this.initListeners();
  }

  /**
   * Subscribes to various HTMLMediaElement events to keep the internal state in sync.
   */
  private initListeners() {
    this.audio.addEventListener('play', () => this.updateState({ isPlaying: true, error: null }));
    this.audio.addEventListener('pause', () => this.updateState({ isPlaying: false }));
    this.audio.addEventListener('waiting', () => this.updateState({ isStalled: true }));
    this.audio.addEventListener('playing', () => this.updateState({ isStalled: false }));
    this.audio.addEventListener('canplay', () => this.updateState({ isStalled: false }));
    this.audio.addEventListener('timeupdate', () => this.updateState({ currentTime: this.audio.currentTime }));
    this.audio.addEventListener('durationchange', () => this.updateState({ duration: this.audio.duration }));
    this.audio.addEventListener('volumechange', () => this.updateState({ 
      volume: this.audio.volume, 
      muted: this.audio.muted 
    }));
    this.audio.addEventListener('ended', () => this.updateState({ isPlaying: false }));
    this.audio.addEventListener('error', () => {
      const error = this.audio.error;
      let message = 'Unknown audio error';
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED: message = 'Playback aborted'; break;
          case error.MEDIA_ERR_NETWORK: message = 'Network error'; break;
          case error.MEDIA_ERR_DECODE: message = 'Audio decoding failed'; break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED: message = 'Audio format not supported'; break;
        }
      }
      this.updateState({ isPlaying: false, error: message });
    });
  }

  /**
   * Updates the internal state and notifies subscribers.
   */
  private updateState(patch: Partial<PlayerState>) {
    this._state = { ...this._state, ...patch };
    this.notify();
  }

  /**
   * Triggers all registered listener callbacks.
   */
  private notify() {
    this.listeners.forEach(l => l(this._state));
  }

  /**
   * Registers a listener for state updates.
   * @param listener The callback function.
   * @returns An unsubscribe function.
   */
  public subscribe(listener: PlayerListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Returns the current playback state.
   */
  public get state() {
    return this._state;
  }

  /**
   * Updates the source URL of the underlying audio element.
   * @param url The audio source URL.
   */
  public setSource(url: string) {
    this.audio.src = url;
    this.audio.load();
    this.updateState({ error: null, currentTime: 0, duration: 0 });
  }

  /**
   * Starts playback. Returns a promise that resolves when playback begins.
   */
  public async play() {
    try {
      await this.audio.play();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Playback failed';
      this.updateState({ isPlaying: false, error: message });
      throw e;
    }
  }

  /**
   * Pauses playback.
   */
  public pause() {
    this.audio.pause();
  }

  /**
   * Toggles between play and pause states.
   */
  public async togglePlay() {
    if (this._state.isPlaying) {
      this.pause();
    } else {
      try {
        await this.play();
      } catch {
        // Error handled in play()
      }
    }
  }

  /**
   * Seeks to a specific time.
   * @param time Time in seconds.
   */
  public seek(time: number) {
    this.audio.currentTime = time;
  }

  /**
   * Sets the volume level.
   * @param volume Level from 0 to 1.
   */
  public setVolume(volume: number) {
    this.audio.volume = volume;
  }

  /**
   * Mutes or unmutes the audio element.
   * @param muted Mute status.
   */
  public setMuted(muted: boolean) {
    this.audio.muted = muted;
  }

  /**
   * Cleans up the audio element and removes all listeners.
   */
  public dispose() {
    this.pause();
    this.audio.src = '';
    this.listeners.clear();
  }
}
