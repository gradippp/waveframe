# 🌊 Waveframe

A high-performance, professional React audio player featuring SoundCloud-style waveforms, built-in audio analysis, and deep customization.

[![NPM Version](https://img.shields.io/npm/v/waveframe?color=blue&style=flat-square)](https://www.npmjs.com/package/waveframe)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/github-gradippp%2Fwaveframe-black?style=flat-square&logo=github)](https://github.com/gradippp/waveframe)

## ✨ Features

- **🚀 Ultra-Efficient Rendering**: Uses a dual-layer CSS-clipped canvas engine. No 60fps re-draws during playback, saving CPU and battery.
- **📊 Auto-Analysis**: Don't have peak data? Just provide a URL. Waveframe uses the Web Audio API to analyze and generate waveforms on-the-fly.
- **🎨 Modern Theming**: Fully customizable with a single theme object. Supports deep navy dark modes and crisp light themes.
- **📏 Responsive & Fluid**: Proportional scaling ensures your waveform looks perfect on any screen size, from mobile to ultra-wide.
- **🛠️ Developer First**: Built with TypeScript, fully memoized, and includes a live [Configuration Playground](https://gradippp.github.io/waveframe).

## 📦 Installation

```bash
pnpm add waveframe
# or
npm install waveframe
```

> **Note**: Waveframe requires **React 19+**.

## 🚀 Quick Start

```tsx
import { WaveframePlayer } from 'waveframe';
import 'waveframe/style.css'; // Essential styles

const App = () => {
  return (
    <WaveframePlayer
      title="Electronic Sunset"
      artist="Digital Nomad"
      audioUrl="https://example.com/audio.mp3"
      artworkUrl="https://example.com/cover.jpg"
    />
  );
};
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `audioUrl` | `string` | **Required** | Direct link to your audio file. |
| `peaks` | `number[]` | `undefined` | Optional array of normalized peaks (0-1). Triggers **Auto-Analysis** if omitted. |
| `title` | `string` | `undefined` | Track title. |
| `artist` | `string` | `undefined` | Artist name. |
| `artworkUrl` | `string` | `undefined` | Cover art image URL. |
| `theme` | `WaveframeTheme` | `Light` | Object to customize colors (see below). |
| `resolution` | `number \| 'auto'`| `'auto'` | Target number of waveform bars. |
| `barWidth` | `number` | `2` | Width of waveform bars in pixels. |
| `barGap` | `number` | `1` | Space between bars in pixels. |
| `height` | `number` | `80` | Height of the waveform in pixels. |
| `autoAnalyze`| `boolean` | `true` | Automatically generate peaks if missing. |

### Theme Object

Customizing the player's palette is straightforward:

```tsx
theme={{
  bg: "#111827",      // Main card background
  primary: "#3b82f6", // Accent (progress & play button)
  text: "#f9fafb",    // Text color
  border: "#1f2937"   // Border and divider lines
}}
```

## 📄 License

MIT © [Agradip](mailto:me@agradip.fyi)
