import { useMemo, useEffect, useRef } from 'react';
import { WaveframeController } from '../core/WaveframeController';
import { useWaveframeStore } from './useWaveframeStore';

/**
 * Configuration options for the `useWaveframe` hook.
 */
export interface UseWaveframeOptions {
  /** Optional pre-computed peaks to skip automatic analysis */
  peaks?: number[];
  /** Optional external controller instance for shared playback across components */
  controller?: WaveframeController;
  /** Whether to automatically start playback when media is loaded */
  autoPlay?: boolean;
}

/**
 * A headless hook that manages the lifecycle of a WaveframeController.
 * 
 * It returns a stable controller instance that can be passed to components
 * like <Waveform /> or used for custom playback logic.
 * 
 * @param media The audio source (URL string or Blob/File object).
 * @param options Additional configuration and an optional external controller.
 * 
 * @example
 * ```tsx
 * const { controller, state } = useWaveframe('https://example.com/audio.mp3');
 * 
 * return (
 *   <div>
 *     <Waveform controller={controller} />
 *     <button onClick={() => controller.togglePlay()}>
 *       {state.isPlaying ? 'Pause' : 'Play'}
 *     </button>
 *   </div>
 * );
 * ```
 */
export const useWaveframe = (
  media: string | Blob | undefined, 
  options: UseWaveframeOptions = {}
) => {
  const { peaks, controller: providedController, autoPlay } = options;
  const isMounted = useRef(false);

  // Initialize controller (only once)
  const internalController = useMemo(
    () => providedController || new WaveframeController(), 
    [providedController]
  );
  const controller = providedController || internalController;

  // Get reactive state
  const state = useWaveframeStore(controller);

  // Sync media with controller
  useEffect(() => {
    isMounted.current = true;
    
    if (media) {
      controller.load(media, peaks);
      if (autoPlay) {
        controller.play().catch(() => {
          // Auto-play might be blocked by browser policy, ignore
        });
      }
    }

    return () => {
      isMounted.current = false;
    };
  }, [controller, media, peaks, autoPlay]);

  // Handle disposal
  useEffect(() => {
    return () => {
      // Only dispose if we created it internally
      if (!providedController) {
        internalController.dispose();
      }
    };
  }, [internalController, providedController]);

  return {
    /** The stable WaveframeController instance */
    controller,
    /** The reactive engine state */
    state,
  };
};
