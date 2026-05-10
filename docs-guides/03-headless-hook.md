# Headless Hook Usage

For maximum flexibility, Waveframe provides a **Headless Hook** architecture. This allows you to decouple the player logic from the UI, letting you build completely custom layouts using our engine.

## The `useWaveframe` Hook

The `useWaveframe` hook manages the entire player lifecycle, including engine instantiation, media loading, and state synchronization.

```tsx
import { useWaveframe, Waveform } from 'waveframe';

const CustomPlayer = ({ media }: { media: string | Blob }) => {
  const { 
    state, 
    togglePlay, 
    seek, 
    setVolume 
  } = useWaveframe(media);

  // Access reactive state
  const { isPlaying, currentTime, duration, peaks, isAnalyzing } = state;

  return (
    <div className="my-custom-layout">
      {/* 1. Custom Play Button */}
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* 2. Custom Time Display */}
      <span>{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</span>

      {/* 3. Composition with Waveform component */}
      <Waveform 
        peaks={peaks} 
        currentTime={currentTime} 
        duration={duration} 
        onSeek={seek}
        height={60}
        waveColor="#e5e7eb"
        progressColor="#3b82f6"
      />

      {/* 4. Loading indicator for auto-analysis */}
      {isAnalyzing && <div>Analyzing waveform...</div>}
    </div>
  );
};
```

## Benefits of Headless Hooks

- **Zero UI Constraints**: Build mini-players, full-screen players, or complex multi-track dashboards.
- **Stateless UI**: Use Waveframe's exported stateless components (like `Waveform` or `ArtworkOverlay`) or use your own entirely.
- **Shared Logic**: Easily wrap the hook to share playback state across multiple components in your app.
