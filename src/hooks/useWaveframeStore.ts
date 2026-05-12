import { useSyncExternalStore } from 'react';
import { WaveframeController, EngineState } from '../core/WaveframeController';

/**
 * A React hook that synchronizes a WaveframeController's state with a React component.
 * 
 * It supports an optional selector function to subscribe to specific parts of the state,
 * preventing unnecessary re-renders when unrelated state changes.
 * 
 * @param controller The WaveframeController instance to subscribe to.
 * @param selector An optional function to select a specific slice of the state.
 * @returns The selected state or the full EngineState if no selector is provided.
 * 
 * @example
 * ```tsx
 * // Subscribe only to isPlaying
 * const isPlaying = useWaveframeStore(controller, state => state.isPlaying);
 * 
 * // Subscribe to the full state
 * const state = useWaveframeStore(controller);
 * ```
 */
export function useWaveframeStore<T = EngineState>(
  controller: WaveframeController,
  selector?: (state: EngineState) => T
): T {
  return useSyncExternalStore(
    (callback) => controller.subscribe(callback),
    () => {
      const state = controller.getSnapshot();
      return selector ? selector(state) : (state as unknown as T);
    }
  );
}
