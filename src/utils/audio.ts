/**
 * Advanced Audio Utilities using Web Audio API
 */
import { PeakAnalyzer } from '../core/PeakAnalyzer';

/**
 * Loads audio from a URL, decodes it, and generates a specific number of peaks (samples).
 * 
 * This is a high-level utility function that internally manages a `PeakAnalyzer` instance.
 * 
 * @param audioUrl The URL of the audio file to analyze.
 * @param samples The number of peaks (bars) to generate. Defaults to 512.
 * @returns A promise resolving to an array of normalized peak values (0 to 1).
 * 
 * @example
 * ```typescript
 * const peaks = await generatePeaks('https://example.com/audio.mp3', 256);
 * ```
 */
export const generatePeaks = async (audioUrl: string, samples: number = 512): Promise<number[]> => {
  const analyzer = new PeakAnalyzer();
  try {
    return await analyzer.generatePeaks(audioUrl, samples);
  } finally {
    analyzer.dispose();
  }
};

/**
 * Loads audio into memory as a Blob and returns a temporary Object URL.
 * 
 * Useful for ensuring audio data is fully loaded locally before starting 
 * playback or analysis, which can help with CORS issues or slow networks.
 * 
 * @param url The URL of the remote audio file.
 * @returns A promise resolving to a temporary `blob:` URL.
 */
export const loadAudioToMemory = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Cleanup function to prevent memory leaks from Object URLs.
 * 
 * Call this when a `blob:` URL is no longer needed (e.g., when the component unmounts).
 * 
 * @param url The Object URL to revoke.
 */
export const revokeAudioMemory = (url: string) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
