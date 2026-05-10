/**
 * A specialized class for decoding audio data and generating waveform peaks.
 * 
 * It leverages the Web Audio API (`AudioContext`) to process audio buffers 
 * and extract amplitude data for visualization.
 */
export class PeakAnalyzer {
  private audioCtx: AudioContext | null = null;

  /**
   * Initializes the analyzer. AudioContext creation is deferred to the first use 
   * to comply with browser autoplay and resource management policies.
   */
  constructor() {}

  /**
   * Lazily creates or returns the existing AudioContext.
   */
  private getContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  /**
   * Processes media (URL or Blob) and generates a set of normalized peaks.
   * 
   * @param media The URL string or Blob object to analyze.
   * @param samples The number of peaks (bars) to generate. Defaults to 512.
   * @returns A promise resolving to an array of normalized peak values (0 to 1).
   * 
   * @example
   * ```typescript
   * const analyzer = new PeakAnalyzer();
   * 
   * // Analyze from URL
   * const peaksFromUrl = await analyzer.generatePeaks('https://example.com/audio.mp3');
   * 
   * // Analyze from Blob
   * const peaksFromBlob = await analyzer.generatePeaks(myAudioBlob);
   * ```
   */
  public async generatePeaks(media: string | Blob, samples: number = 512): Promise<number[]> {
    try {
      let arrayBuffer: ArrayBuffer;

      if (typeof media === 'string') {
        const response = await fetch(media);
        if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);
        arrayBuffer = await response.arrayBuffer();
      } else {
        arrayBuffer = await media.arrayBuffer();
      }

      const audioCtx = this.getContext();
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
    } catch (error) {
      console.error('PeakAnalyzer Error:', error);
      throw error;
    }
  }

  /**
   * Closes the AudioContext and releases system audio resources.
   */
  public dispose() {
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
