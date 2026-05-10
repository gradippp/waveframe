import { useMemo, useEffect } from 'react';
import { WaveframeEngine, EngineState } from '../core/WaveframeEngine';
import { useWaveframeStore } from './useWaveframeStore';

/**
 * Configuration options for the `useWaveframe` hook.
 */
export interface UseWaveframeOptions {
  /** Optional pre-computed peaks to skip automatic analysis */
  peaks?: number[];
  /** Optional external engine instance for shared playback across components */
  engine?: WaveframeEngine;
}

/**
 * A headless hook that provides full control over the Waveframe engine.
 * 
 * It manages the engine's lifecycle, loads the provided media, and returns 
 * the current state along with playback controls.
 * 
 * @param media The audio source (URL string or Blob/File object).
 * @param options Additional configuration and an optional external engine.
 * 
 * @example
 * ```tsx
 * const { state, togglePlay, seek } = useWaveframe('https://example.com/audio.mp3');
 * 
 * return (
 *   <div>
 *     <button onClick={togglePlay}>{state.isPlaying ? 'Pause' : 'Play'}</button>
 *     <div onClick={(e) => seek(0.5)}>Seek to Middle</div>
 *   </div>
 * );
 * ```
 */
export const useWaveframe = (media: string | Blob | undefined, options: UseWaveframeOptions = {}) => {
  const { peaks, engine: providedEngine } = options;

  // Initialize engine (only once)
  const internalEngine = useMemo(() => providedEngine || new WaveframeEngine(), [providedEngine]);
  const engine = providedEngine || internalEngine;

  // Subscribe to engine state
  const state = useWaveframeStore(engine);

  // Sync media with engine
  useEffect(() => {
    if (media) {
      engine.load(media, peaks);
    }
  }, [engine, media, peaks]);

  // Handle disposal
  useEffect(() => {
    return () => {
      // Only dispose if we created it internally
      if (!providedEngine) {
        internalEngine.dispose();
      }
    };
  }, [internalEngine, providedEngine]);

  return {
    /** The current reactive state of the engine */
    state,
    /** The raw WaveframeEngine instance for advanced usage */
    engine,
    /** Toggles playback between playing and paused */
    togglePlay: () => engine.togglePlay(),
    /** Starts audio playback */
    play: () => engine.play(),
    /** Pauses audio playback */
    pause: () => engine.pause(),
    /** Seeks to a specific percentage (0-1) */
    seek: (percentage: number) => engine.seek(percentage),
    /** Sets the playback volume (0-1) */
    setVolume: (v: number) => engine.setVolume(v),
    /** Mutes or unmutes the audio */
    setMuted: (m: boolean) => engine.setMuted(m),
    /** Manually triggers a re-analysis of the current media */
    analyze: (samples?: number) => engine.analyze(samples),
  };
};
