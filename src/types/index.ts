/**
 * Defines the core color palette for the Waveframe component.
 * 
 * @example
 * ```tsx
 * const darkTheme: WaveframeTheme = {
 *   bg: '#111827',
 *   primary: '#ec4899',
 *   text: '#f9fafb',
 *   border: '#1f2937'
 * };
 * ```
 */
export interface WaveframeTheme {
  /** The main background color of the player */
  bg: string;
  /** The primary accent color (used for play button and progress) */
  primary: string;
  /** The color of the text elements (title, artist, time) */
  text: string;
  /** The color of borders and dividers */
  border: string;
}

/**
 * Metadata associated with an audio track.
 * 
 * @example
 * ```tsx
 * const track: TrackInfo = {
 *   title: 'Electronic Sunset',
 *   artist: 'Digital Nomad',
 *   artwork: 'https://example.com/art.jpg', // or a Blob object
 *   audioUrl: 'https://example.com/audio.mp3'
 * };
 * ```
 */
export interface TrackInfo {
  /** The title of the track */
  title: string;
  /** The artist of the track */
  artist: string;
  /** The artwork source (URL string or Blob/File object) */
  artwork: string | Blob;
  /** The URL to the actual audio file */
  audioUrl: string;
}

/**
 * Defines the resolution of the waveform. 
 * - `number`: A fixed number of bars to render.
 * - `'auto'`: Compute the number of bars dynamically based on the container width.
 */
export type Resolution = number | 'auto';

/**
 * Configuration options for how the waveform is rendered visually.
 * 
 * @example
 * ```tsx
 * const config: WaveformConfig = {
 *   resolution: 'auto',
 *   barWidth: 2,
 *   barGap: 1,
 *   height: 100
 * };
 * ```
 */
export interface WaveformConfig {
  /** The number of bars to render, or 'auto' to compute based on container width */
  resolution: Resolution;
  /** The width of each individual bar in pixels */
  barWidth: number;
  /** The spacing between each bar in pixels */
  barGap: number;
  /** The total height of the waveform in pixels */
  height: number;
}
