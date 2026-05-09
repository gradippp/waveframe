# Waveframe

A customizable React audio player component with SoundCloud-style waveforms.

## Features

- **SoundCloud-style Waveform**: Supports pre-calculated peak points for instant rendering.
- **Customizable UI**: Styled with Tailwind CSS, easy to theme and adapt.
- **Artwork Support**: Display track artwork prominently.
- **High Performance**: Built with Vite and TypeScript.

## Installation

```bash
pnpm add waveframe
```

## Usage

```tsx
import { WaveframePlayer } from 'waveframe';

const peaks = [0.1, 0.5, 0.8, 0.3, ...]; // 100-200 points recommended

function App() {
  return (
    <WaveframePlayer
      audioUrl="path/to/audio.mp3"
      peaks={peaks}
      artworkUrl="path/to/artwork.jpg"
      title="Track Title"
      artist="Artist Name"
    />
  );
}
```

## License

MIT
