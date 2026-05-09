import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = (url: string) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync duration if metadata is already loaded (cached audio)
  useEffect(() => {
    if (audioRef.current && audioRef.current.readyState >= 1) {
      setDuration(audioRef.current.duration);
    }
  }, [url]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const seek = useCallback((percentage: number) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percentage * duration;
    }
  }, [duration]);

  const audioProps = {
    ref: audioRef,
    src: url,
    onTimeUpdate: handleTimeUpdate,
    onLoadedMetadata: handleLoadedMetadata,
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onEnded: () => setIsPlaying(false),
  };

  return {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    audioProps,
  };
};
