/**
 * Advanced Audio Utilities using Web Audio API
 */

/**
 * Loads audio from a URL, decodes it, and generates a specific number of peaks (samples)
 */
export const generatePeaks = async (audioUrl: string, samples: number = 512): Promise<number[]> => {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  
  const channelData = audioBuffer.getChannelData(0); // Use left channel
  const blockSize = Math.floor(channelData.length / samples);
  const peaks = [];

  for (let i = 0; i < samples; i++) {
    let max = 0;
    const start = i * blockSize;
    const end = start + blockSize;
    
    for (let j = start; j < end; j++) {
      const val = Math.abs(channelData[j]);
      if (val > max) max = val;
    }
    peaks.push(max);
  }
  
  // Normalize peaks to 0-1 range
  const maxPeak = Math.max(...peaks);
  return peaks.map(p => p / (maxPeak || 1));
};

/**
 * Loads audio into memory as a Blob and returns a temporary Object URL
 */
export const loadAudioToMemory = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Cleanup function to prevent memory leaks from Object URLs
 */
export const revokeAudioMemory = (url: string) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
