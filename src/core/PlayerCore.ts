/**
 * Represents the low-level playback state of the audio element.
 */
export type PlayerState = {
  /** Whether the audio is currently playing */
  isPlaying: boolean;
  /** The current playback time in seconds */
  currentTime: number;
  /** The total duration of the track in seconds */
  duration: number;
  /** The current volume level (0 to 1) */
  volume: number;
  /** Whether the audio is currently muted */
  muted: boolean;
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
      currentTime: 0,
      duration: 0,
      volume: 1,
      muted: false,
    };

    this.initListeners();
  }

  /**
   * Subscribes to various HTMLMediaElement events to keep the internal state in sync.
   */
  private initListeners() {
    this.audio.addEventListener('play', () => this.updateState({ isPlaying: true }));
    this.audio.addEventListener('pause', () => this.updateState({ isPlaying: false }));
    this.audio.addEventListener('timeupdate', () => this.updateState({ currentTime: this.audio.currentTime }));
    this.audio.addEventListener('durationchange', () => this.updateState({ duration: this.audio.duration }));
    this.audio.addEventListener('volumechange', () => this.updateState({ 
      volume: this.audio.volume, 
      muted: this.audio.muted 
    }));
    this.audio.addEventListener('ended', () => this.updateState({ isPlaying: false }));
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
  }

  /**
   * Starts playback. Returns a promise that resolves when playback begins.
   */
  public play() {
    return this.audio.play();
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
  public togglePlay() {
    if (this._state.isPlaying) {
      this.pause();
    } else {
      this.play();
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
