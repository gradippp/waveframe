import React, { memo, useMemo, useRef, useState, useEffect } from 'react';
import { WaveframeTheme } from '../types';
import { WaveframeEngine } from '../core/WaveframeEngine';
import { useWaveframe } from '../hooks/useWaveframe';
import { useResampledPeaks } from '../hooks/useResampledPeaks';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { ArtworkOverlay } from '../molecules/ArtworkOverlay';
import { Waveform } from '../organisms/Waveform';
import { formatTime } from '../utils';

/**
 * Props for the WaveframePlayer component
 */
export interface WaveframePlayerProps {
  /**
   * The audio source to play. Can be a URL string or a Blob/File object.
   */
  media?: string | Blob;
  /**
   * Optional pre-generated peaks for the waveform (0-1 range).
   * If omitted or empty, the player will automatically analyze the media.
   */
  peaks?: number[];
  /**
   * The artwork source to display. Can be a URL string or a Blob/File object.
   */
  artwork?: string | Blob;
  /**
   * The title of the track
   */
  title?: string;
  /**
   * The artist of the track
   */
  artist?: string;
  /**
   * The base color of the waveform bars
   * @default "#e5e7eb" (light) or "#374151" (dark)
   */
  waveColor?: string;
  /**
   * The color of the played progress part of the waveform
   * @default theme.primary or "#3b82f6"
   */
  progressColor?: string;
  /**
   * The height of the waveform in pixels
   * @default 80
   */
  height?: number;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Inline styles for the container
   */
  style?: React.CSSProperties;
  /**
   * The number of bars to render. Use 'auto' to fit the container width.
   * @default "auto"
   */
  resolution?: number | 'auto';
  /**
   * The width of each bar in pixels (if resolution is 'auto')
   * @default 2
   */
  barWidth?: number;
  /**
   * The gap between bars in pixels (if resolution is 'auto')
   * @default 1
   */
  barGap?: number;
  /**
   * Custom theme configuration
   */
  theme?: WaveframeTheme;
  /**
   * Optional WaveframeEngine instance for external control.
   * If provided, the player will sync with this engine instead of creating its own.
   */
  engine?: WaveframeEngine;
}

/**
 * The standard "all-in-one" Waveframe player component.
 * 
 * This component features a SoundCloud-inspired layout with a prominent 
 * play/pause button positioned next to the track metadata.
 */
export const WaveframePlayer: React.FC<WaveframePlayerProps> = memo(({
  media,
  peaks: propPeaks,
  artwork,
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
  engine: providedEngine,
}) => {
  // Use the headless hook for state and controls
  const { state, togglePlay, seek } = useWaveframe(media, {
    peaks: propPeaks,
    engine: providedEngine,
  });

  const { isPlaying, currentTime, duration, peaks, isAnalyzing } = state;

  // Handle Artwork Blob -> Object URL
  const [resolvedArtworkUrl, setResolvedArtworkUrl] = useState<string | undefined>(
    typeof artwork === 'string' ? artwork : undefined
  );

  useEffect(() => {
    if (artwork instanceof Blob) {
      const url = URL.createObjectURL(artwork);
      setResolvedArtworkUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setResolvedArtworkUrl(artwork);
    }
  }, [artwork]);

  const containerRef = useRef<HTMLDivElement>(null);
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
      className={`group relative flex flex-col md:flex-row items-stretch gap-6 p-6 bg-[var(--wf-bg-color,white)] border border-[var(--wf-border-color,#f3f4f6)] rounded-[var(--wf-rounded,1rem)] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
      style={mergedStyle}
    >
      <ArtworkOverlay 
        artworkUrl={resolvedArtworkUrl} 
        title={title} 
        isLoading={isAnalyzing}
      />

      <div className="flex-1 w-full flex flex-col min-w-0">
        <div className="flex items-center gap-4 mb-6">
          {/* SoundCloud-style circular play button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--wf-play-btn-bg,#3b82f6)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 cursor-pointer border-none outline-none group/play"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 md:w-7 md:h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between gap-4">
              {artist && (
                <p className="text-[10px] md:text-xs font-bold uppercase text-[var(--wf-artist-color,#6b7280)] opacity-60 tracking-[0.1em] line-clamp-1">
                  {artist}
                </p>
              )}
              <div className="text-[10px] font-mono text-[var(--wf-time-color,#9ca3af)] tabular-nums flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            {title && (
              <h3 className="text-lg md:text-xl font-black text-[var(--wf-title-color,#111827)] tracking-tight line-clamp-1 mt-0.5 leading-tight">
                {title}
              </h3>
            )}
          </div>
        </div>

        <div className="mt-auto" ref={containerRef}>
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
    </div>
  );
});

WaveframePlayer.displayName = 'WaveframePlayer';
