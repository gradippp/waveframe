import React, { memo, useMemo } from 'react';
import { WaveframeTheme } from '../types';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useResampledPeaks } from '../hooks/useResampledPeaks';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { ArtworkOverlay } from '../molecules/ArtworkOverlay';
import { Waveform } from '../organisms/Waveform';
import { formatTime } from '../utils';

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
  style?: React.CSSProperties;
  resolution?: number | 'auto';
  barWidth?: number;
  barGap?: number;
  theme?: WaveframeTheme;
}

export const WaveframePlayer: React.FC<WaveframePlayerProps> = memo(({
  audioUrl,
  peaks,
  artworkUrl,
  title,
  artist,
  waveColor: propWaveColor,
  progressColor: propProgressColor,
  height = 80,
  className = '',
  style: propStyle,
  resolution = 'auto',
  barWidth = 2,
  barGap = 1,
  theme,
}) => {
  const { isPlaying, currentTime, duration, togglePlay, seek, audioProps } = useAudioPlayer(audioUrl);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useResizeObserver(containerRef);

  const targetCount = useMemo(() => {
    if (typeof resolution === 'number') return resolution;
    if (containerWidth > 0) {
      return Math.max(1, Math.floor(containerWidth / (barWidth + barGap)));
    }
    return peaks.length || 1;
  }, [resolution, containerWidth, barWidth, barGap, peaks.length]);

  const resampledPeaks = useResampledPeaks(peaks, targetCount);

  const waveColor = useMemo(() => {
    if (propWaveColor) return propWaveColor;
    if (theme) return theme.bg === '#ffffff' ? '#e5e7eb' : '#374151';
    return '#e5e7eb';
  }, [propWaveColor, theme]);

  const progressColor = propProgressColor || theme?.primary || '#3b82f6';

  const mergedStyle = useMemo(() => {
    const baseStyle = {
      '--wf-bg-color': theme?.bg || 'white',
      '--wf-border-color': theme?.border || '#f3f4f6',
      '--wf-title-color': theme?.text || '#111827',
      '--wf-artist-color': theme?.text || '#6b7280',
      '--wf-time-color': theme?.text || '#9ca3af',
      '--wf-play-btn-bg': theme?.primary || '#3b82f6',
      '--wf-placeholder-from': theme?.primary || '#fb923c',
      '--wf-placeholder-to': theme?.bg || '#ec4899',
    };
    return { ...baseStyle, ...propStyle } as React.CSSProperties;
  }, [theme, propStyle]);

  return (
    <div
      className={`group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-[var(--wf-bg-color,white)] border border-[var(--wf-border-color,#f3f4f6)] rounded-[var(--wf-rounded,1rem)] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
      style={mergedStyle}
    >
      <ArtworkOverlay 
        artworkUrl={artworkUrl} 
        title={title} 
        isPlaying={isPlaying} 
        onToggle={togglePlay} 
      />

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

        <div ref={containerRef}>
          <Waveform 
            peaks={resampledPeaks}
            currentTime={currentTime}
            duration={duration}
            waveColor={waveColor}
            progressColor={progressColor}
            height={height}
            onSeek={seek}
            resolution={resolution}
            barWidth={barWidth}
            barGap={barGap}
          />
        </div>
      </div>

      <audio {...audioProps} />
    </div>
  );
});

WaveframePlayer.displayName = 'WaveframePlayer';
