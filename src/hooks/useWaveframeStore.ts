import { useSyncExternalStore } from 'react';
import { WaveframeEngine, EngineState } from '../core/WaveframeEngine';

/**
 * A React hook that synchronizes a WaveframeEngine's state with a React component.
 * 
 * It uses `useSyncExternalStore` for high-performance updates, ensuring that 
 * the component only re-renders when the engine's state snapshot actually changes.
 * 
 * @param engine The WaveframeEngine instance to subscribe to.
 * @returns The current EngineState (isPlaying, currentTime, peaks, etc.).
 * 
 * @example
 * ```tsx
 * const MyPlayer = ({ engine }: { engine: WaveframeEngine }) => {
 *   const { isPlaying, currentTime, duration } = useWaveframeStore(engine);
 * 
 *   return (
 *     <div>
 *       <button onClick={() => engine.togglePlay()}>
 *         {isPlaying ? 'Pause' : 'Play'}
 *       </button>
 *       <p>{currentTime.toFixed(2)} / {duration.toFixed(2)}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const useWaveframeStore = (engine: WaveframeEngine): EngineState => {
  return useSyncExternalStore(
    (callback) => engine.subscribe(callback),
    () => engine.getSnapshot()
  );
};
