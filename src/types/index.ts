export interface WaveframeTheme {
  bg: string;
  primary: string;
  text: string;
  border: string;
}

export interface TrackInfo {
  title: string;
  artist: string;
  artworkUrl: string;
  audioUrl: string;
}

export type Resolution = number | 'auto';

export interface WaveformConfig {
  resolution: Resolution;
  barWidth: number;
  barGap: number;
  height: number;
}
