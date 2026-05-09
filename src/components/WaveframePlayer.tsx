import React, { useRef, useState, useEffect } from 'react';

export interface WaveframePlayerProps {
  audioUrl: string;
  peaks: number[];
  artworkUrl?: string;
  title?: string;
  artist?: string;
  waveColor?: string;
  progressColor?: string;
  height?: number;
  className?: string;
}

export const WaveframePlayer: React.FC<WaveframePlayerProps> = ({
  audioUrl,
  peaks,
  artworkUrl,
  title,
  artist,
  waveColor = 'var(--wf-wave-color, #e5e7eb)',
  progressColor = 'var(--wf-progress-color, #f97316)',
  height = 80,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current && audioRef.current && duration) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      audioRef.current.currentTime = percentage * duration;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barCount = peaks.length;
      const gapRatio = 0.3; // 30% gap between bars
      const barWidth = (width / barCount) * (1 - gapRatio);
      const gapWidth = (width / barCount) * gapRatio;

      const progressX = (currentTime / duration) * width || 0;

      ctx.lineCap = 'round';
      ctx.lineWidth = barWidth;

      peaks.forEach((peak, index) => {
        const x = index * (barWidth + gapWidth) + barWidth / 2;
        const barHeight = peak * height * 0.8; // Use 80% of height for padding
        const yStart = (height - barHeight) / 2;
        const yEnd = yStart + barHeight;

        ctx.beginPath();
        ctx.strokeStyle = x < progressX ? progressColor : waveColor;
        ctx.moveTo(x, yStart);
        ctx.lineTo(x, yEnd);
        ctx.stroke();
      });
    };

    draw();
  }, [peaks, currentTime, duration, waveColor, progressColor]);

  return (
    <div
      className={`group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-[var(--wf-bg-color,white)] border border-[var(--wf-border-color,#f3f4f6)] rounded-[var(--wf-rounded,1rem)] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Artwork with Overlay Play Button */}
      <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-[var(--wf-artwork-rounded,0.75rem)] shadow-lg group/artwork">
        {artworkUrl ? (
          <img
            src={artworkUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/artwork:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--wf-placeholder-from,#fb923c)] to-[var(--wf-placeholder-to,#ec4899)] flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white opacity-50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}

        {/* transclucent overlay */}
        <button
          className="absolute inset-0 bg-[var(--wf-overlay-color,rgba(0,0,0,0.3))] backdrop-blur-[var(--wf-overlay-blur,2px)] opacity-0 group-hover/artwork:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer border-none outline-none"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-[var(--wf-play-btn-bg,#f97316)] rounded-full text-[var(--wf-play-btn-color,white)] shadow-lg transform scale-90 group-hover/artwork:scale-100 transition-transform duration-300">
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full flex flex-col justify-between py-1">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            {title && (
              <h3 className="text-xl md:text-2xl font-black text-[var(--wf-title-color,#111827)] tracking-tight line-clamp-1">
                {title}
              </h3>
            )}
            <div className="text-xs font-mono text-[var(--wf-time-color,#9ca3af)] tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          {artist && (
            <p className="text-sm md:text-base font-medium text-[var(--wf-artist-color,#6b7280)] line-clamp-1 tracking-wide">
              {artist}
            </p>
          )}
        </div>

        {/* Waveform Container */}
        <div className="relative w-full h-20 md:h-24 cursor-pointer" onClick={handleSeek}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
