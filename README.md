# Waveframe

Waveframe is a soundcloud-embed inspired web audio player for React. It handles audio playback and waveform visualization with a modular engine.

## Features

- Canvas-based waveform rendering.
- Automatic peak analysis for URLs and Blobs.
- Customizable colors via a theme object or CSS variables.
- A hook-based API for building custom layouts.
- Support for local audio and artwork file uploads.
- Responsive scaling to fit different container sizes.

## Installation

```bash
pnpm add waveframe
```

Note: Waveframe requires React 19 or newer.

## Quick Start

The simplest way to use Waveframe is to provide an audio source via the `media` prop.

```tsx
import { WaveframePlayer } from 'waveframe';
import 'waveframe/style.css';

const App = () => {
  return (
    <WaveframePlayer
      title="Electronic Sunset"
      artist="Digital Nomad"
      media="https://example.com/audio.mp3"
      artwork="https://example.com/cover.jpg"
    />
  );
};
```

## Component Reference

### Primary Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `media` | `string \| Blob` | Audio source (URL or local File/Blob). |
| `peaks` | `number[]` | Optional pre-computed peaks to skip analysis. |
| `artwork`| `string \| Blob` | Artwork image source (URL or local File/Blob). |
| `title` | `string` | Track title. |
| `artist` | `string` | Artist name. |
| `theme` | `WaveframeTheme` | Object for color customization. |

## Architecture

Waveframe separates playback logic from the UI to allow for custom implementations.

- **useWaveframe**: A hook for managing the `WaveframeController` lifecycle.
- **WaveframeController**: The core logic class (vanilla JS).
- **useWaveframeStore**: A selector-based hook for reactive state subscriptions.
- **Waveform**: A "smart" component for rendering peaks with internal reactivity.

For technical guides on building custom layouts or handling file workflows, refer to the full documentation.

## Documentation and Playground

### Interactive Playground
`pnpm run dev`

### API Reference
`pnpm run docs`

## License

MIT
