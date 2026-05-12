import React, { useRef, useEffect, memo, useMemo } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { WaveframeController } from '../core/WaveframeController';
import { useWaveframeStore } from '../hooks/useWaveframeStore';
import { resamplePeaks } from '../utils';

interface WaveformProps {
  /** The WaveframeController instance managing audio state */
  controller: WaveframeController;
  /** Optional pre-computed peaks. If omitted, peaks from the controller are used. */
  peaks?: number[];
  /** Color of the background waveform bars */
  waveColor?: string;
  /** Color of the progress (played) waveform bars */
  progressColor?: string;
  /** Total height of the waveform in pixels */
  height?: number;
  /** 
   * Resolution of the waveform. 
   * 'auto' matches the container width (1 bar per pixel).
   * A number sets a fixed number of bars.
   */
  resolution?: number | 'auto';
  /** Width of each bar in pixels (if resolution is 'auto') */
  barWidth?: number;
  /** Gap between bars in pixels (if resolution is 'auto') */
  barGap?: number;
  /** Overall amplitude multiplier (default 1.0) */
  amplitude?: number;
  /** Non-linear power scale to increase detail (e.g. 0.7-0.9 reduces 'sausage' look). Default 1.0 (linear). */
  powerScale?: number;
}

/**
 * A "smart" waveform component that visualizes audio progress and allows seeking.
 * 
 * It subscribes directly to the provided WaveframeController for high-frequency
 * progress updates, ensuring the parent component remains immune to re-renders.
 */
export const Waveform: React.FC<WaveformProps> = memo(({
  controller,
  peaks: providedPeaks,
  waveColor = '#e5e7eb',
  progressColor = '#3b82f6',
  height = 80,
  resolution = 'auto',
  barWidth = 2,
  barGap = 1,
  amplitude = 1.0,
  powerScale = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useResizeObserver(containerRef);

  // Subscribe only to needed state slices
  const currentTime = useWaveframeStore(controller, s => s.currentTime);
  const duration = useWaveframeStore(controller, s => s.duration);
  const enginePeaks = useWaveframeStore(controller, s => s.peaks);

  // Determine which peaks to use and resample them
  const peaks = useMemo(() => {
    const rawPeaks = providedPeaks || enginePeaks;
    if (rawPeaks.length === 0) return [];
    
    const targetCount = resolution === 'auto' 
      ? Math.floor(containerWidth / (barWidth + barGap))
      : resolution;
      
    let resampled = resamplePeaks(rawPeaks, Math.max(1, targetCount));

    // Apply power scaling and amplitude
    if (powerScale !== 1.0 || amplitude !== 1.0) {
      resampled = resampled.map(p => Math.pow(p, powerScale) * amplitude);
    }

    return resampled;
  }, [providedPeaks, enginePeaks, containerWidth, resolution, barWidth, barGap, amplitude, powerScale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const progressCanvas = progressCanvasRef.current;
    if (!canvas || !progressCanvas) return;

    const ctx = canvas.getContext('2d');
    const pCtx = progressCanvas.getContext('2d');
    if (!ctx || !pCtx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const targetWidth = rect.width * dpr;
    const targetHeight = rect.height * dpr;

    [canvas, progressCanvas].forEach(c => {
      if (c.width !== targetWidth || c.height !== targetHeight) {
        c.width = targetWidth;
        c.height = targetHeight;
      }
    });

    const draw = () => {
      if (peaks.length === 0) return;
      const { width, height } = canvas;
      
      ctx.clearRect(0, 0, width, height);
      pCtx.clearRect(0, 0, width, height);

      const barCount = peaks.length;
      const actualBarTotalWidth = width / barCount;
      const actualBarWidth = typeof resolution === 'number' 
        ? actualBarTotalWidth * 0.7 
        : barWidth * dpr;
      const actualBarGap = typeof resolution === 'number'
        ? actualBarTotalWidth * 0.3
        : barGap * dpr;

      ctx.lineCap = 'round';
      ctx.lineWidth = actualBarWidth;
      pCtx.lineCap = 'round';
      pCtx.lineWidth = actualBarWidth;

      const centerY = height / 2;

      peaks.forEach((peak, index) => {
        if (peak <= 0) return;
        
        const x = index * (actualBarWidth + actualBarGap) + actualBarWidth / 2;
        const barHeight = Math.max(actualBarWidth, peak * height * 0.8);
        
        // Center the bar vertically
        const yStart = centerY - barHeight / 2;
        const yEnd = centerY + barHeight / 2;

        ctx.beginPath();
        ctx.strokeStyle = waveColor;
        ctx.moveTo(x, yStart);
        ctx.lineTo(x, yEnd);
        ctx.stroke();

        pCtx.beginPath();
        pCtx.strokeStyle = progressColor;
        pCtx.moveTo(x, yStart);
        pCtx.lineTo(x, yEnd);
        pCtx.stroke();
      });
    };

    draw();
  }, [peaks, waveColor, progressColor, resolution, barWidth, barGap, height]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && duration) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      controller.seek(percentage);
    }
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full cursor-pointer overflow-hidden" 
      style={{ 
        height: `${height}px`,
        // Using CSS variables for easier theming if needed externally
        '--wf-wave-color': waveColor,
        '--wf-progress-color': progressColor,
      } as React.CSSProperties}
      onClick={handleSeek}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div 
        className="absolute inset-0 h-full overflow-hidden transition-[width] duration-100 ease-linear pointer-events-none"
        style={{ width: `${progressPercent}%` }}
      >
        <canvas ref={progressCanvasRef} className="absolute h-full" style={{ width: `${containerWidth}px` }} />
      </div>
    </div>
  );
});

Waveform.displayName = 'Waveform';
