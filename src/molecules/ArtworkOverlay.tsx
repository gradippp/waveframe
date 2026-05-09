import React, { memo } from 'react';

interface ArtworkOverlayProps {
  artworkUrl?: string;
  title?: string;
  isPlaying: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const ArtworkOverlay: React.FC<ArtworkOverlayProps> = memo(({ 
  artworkUrl, 
  title, 
  isPlaying, 
  onToggle 
}) => {
  return (
    <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-[var(--wf-artwork-rounded,0.75rem)] shadow-lg group/artwork">
      {artworkUrl ? (
        <img
          src={artworkUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/artwork:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[var(--wf-placeholder-from,#fb923c)] to-[var(--wf-placeholder-to,#ec4899)] flex items-center justify-center">
          <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
      )}

      <button
        className="absolute inset-0 bg-[var(--wf-overlay-color,rgba(0,0,0,0.3))] backdrop-blur-[var(--wf-overlay-blur,2px)] opacity-0 group-hover/artwork:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer border-none outline-none"
        onClick={onToggle}
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
  );
});

ArtworkOverlay.displayName = 'ArtworkOverlay';
