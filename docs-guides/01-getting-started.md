# Getting Started

Waveframe is a high-performance audio player component for React, designed with a modular, object-oriented engine. It provides beautiful SoundCloud-style waveforms and built-in audio analysis.

## Installation

Install Waveframe using your preferred package manager:

```bash
pnpm add waveframe
# or
npm install waveframe
```

> **Note**: Waveframe requires **React 19+**.

## Basic Usage

The simplest way to use Waveframe is to provide a `media` URL. If you don't provide pre-computed peaks, Waveframe will automatically analyze the audio and generate a waveform for you.

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

## Optimizing Performance with Pre-computed Peaks

While auto-analysis is convenient, it can be computationally expensive on the client-side. For the best user experience, you should pre-compute peaks on your server and pass them directly to the component.

```tsx
// Pre-computed peaks (normalized array of numbers between 0 and 1)
const myPeaks = [0.12, 0.45, 0.9, 0.32, ...];

<WaveframePlayer
  media="https://example.com/audio.mp3"
  peaks={myPeaks}
/>
```

When `peaks` are provided, Waveframe skips the analysis step entirely and renders the waveform instantly.
