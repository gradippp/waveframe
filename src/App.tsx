import React from 'react';
import { WaveframePlayer } from './components/WaveframePlayer';

// Generate some dummy peaks
const dummyPeaks = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-gray-900">Waveframe Playground</h1>

      <div className="w-full max-w-3xl flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Default Theme</h2>
          <WaveframePlayer
            audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            peaks={dummyPeaks}
            artworkUrl="https://picsum.photos/seed/waveframe/400/400"
            title="Electronic Sunset"
            artist="Digital Nomad"
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Dark "Neon" Theme (Customized via CSS Variables)</h2>
          <WaveframePlayer
            audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            peaks={dummyPeaks}
            artworkUrl="https://picsum.photos/seed/neon/400/400"
            title="Midnight Cyber"
            artist="Neon Pulse"
            className="w-full custom-dark-theme"
          />
          <style>{`
            .custom-dark-theme {
              --wf-bg-color: #0f172a;
              --wf-border-color: #1e293b;
              --wf-title-color: #f8fafc;
              --wf-artist-color: #94a3b8;
              --wf-time-color: #64748b;
              --wf-wave-color: #334155;
              --wf-progress-color: #22d3ee;
              --wf-play-btn-bg: #22d3ee;
              --wf-play-btn-color: #0f172a;
              --wf-rounded: 0.5rem;
              --wf-artwork-rounded: 0.25rem;
            }
          `}</style>
        </div>
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
