import React from 'react';
import { WaveframePlayer } from './components/WaveframePlayer';

// Generate some dummy peaks
const dummyPeaks = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-gray-900">Waveframe Playground</h1>

      <div className="w-full max-w-3xl">
        <WaveframePlayer
          audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          peaks={dummyPeaks}
          artworkUrl="https://picsum.photos/seed/waveframe/200/200"
          title="Electronic Sunset"
          artist="Digital Nomad"
          className="w-full"
        />
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>
          Edit <code>src/App.tsx</code> to test different props.
        </p>
      </div>
    </div>
  );
}

export default App;
