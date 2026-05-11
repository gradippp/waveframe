import React, { useRef, useEffect, memo } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';

interface WaveformProps {
  peaks: number[];
  currentTime: number;
  duration: number;
  waveColor: string;
  progressColor: string;
  height: number;
  onSeek: (percentage: number) => void;
  resolution?: number | 'auto';
  barWidth?: number;
  barGap?: number;
}

export const Waveform: React.FC<WaveformProps> = memo(({
  peaks,
  currentTime,
  duration,
  waveColor,
  progressColor,
  height,
  onSeek,
  resolution = 'auto',
  barWidth = 2,
  barGap = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useResizeObserver(containerRef);

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

      peaks.forEach((peak, index) => {
        if (peak <= 0) return;
        
        const x = index * (actualBarWidth + actualBarGap) + actualBarWidth / 2;
        const barHeight = peak * height * 0.8;
        const yStart = (height - barHeight) / 2;
        const yEnd = yStart + barHeight;

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
      onSeek(percentage);
    }
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full cursor-pointer overflow-hidden" 
      style={{ height: `${height}px` }}
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
