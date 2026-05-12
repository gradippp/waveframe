import React, { memo } from 'react';

/**
 * Props for the ArtworkOverlay component.
 */
interface ArtworkOverlayProps {
  /** The URL or Object URL of the artwork image */
  artworkUrl?: string;
  /** The title of the track (used for alt text) */
  title?: string;
  /** Whether the artwork is currently being processed or the audio is analyzing */
  isLoading?: boolean;
}

/**
 * A purely visual component for displaying track artwork.
 * 
 * It handles loading states with a blur effect and provides a consistent 
 * container for the track image.
 */
export const ArtworkOverlay: React.FC<ArtworkOverlayProps> = memo(({ 
  artworkUrl, 
  title, 
  isLoading
}) => {
  return (
    <div className="relative flex-shrink-0 w-full md:w-auto md:h-full aspect-square overflow-hidden rounded-[var(--wf-artwork-rounded,0.75rem)] shadow-lg group/artwork">
      <div className={`w-full h-full transition-all duration-700 ${isLoading ? 'blur-md scale-110' : ''}`}>
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
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

ArtworkOverlay.displayName = 'ArtworkOverlay';
