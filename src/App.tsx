import React, { useState, CSSProperties } from 'react';
import { WaveframePlayer } from './components/WaveframePlayer';

// Generate some dense dummy peaks (1024 points)
const dummyPeaks = Array.from({ length: 1024 }, () => Math.random() * 0.8 + 0.1);

const LIGHT_THEME = {
  '--wf-bg': '#ffffff',
  '--wf-primary': '#3b82f6',
  '--wf-text': '#111827',
  '--wf-border': '#f3f4f6',
};

const DARK_THEME = {
  '--wf-bg': '#111827',
  '--wf-primary': '#3b82f6',
  '--wf-text': '#f9fafb',
  '--wf-border': '#1f2937',
};

function App() {
  const [trackInfo, setTrackInfo] = useState({
    title: 'Electronic Sunset',
    artist: 'Digital Nomad',
    artworkUrl: 'https://picsum.photos/seed/waveframe/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  });

  const [theme, setTheme] = useState<Record<string, string>>(LIGHT_THEME);
  const [resolution, setResolution] = useState<number | 'auto'>('auto');
  const [barWidth, setBarWidth] = useState(2);
  const [barGap, setBarGap] = useState(1);
  const [scale, setScale] = useState(1);

  const handleTrackChange = (key: string, value: string) => {
    setTrackInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (key: string, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTheme = (type: 'light' | 'dark') => {
    setTheme(type === 'light' ? LIGHT_THEME : DARK_THEME);
  };

  const themeEntries = [
    { key: '--wf-bg', label: 'Background' },
    { key: '--wf-primary', label: 'Primary (Accent)' },
    { key: '--wf-text', label: 'Text Color' },
    { key: '--wf-border', label: 'Border Color' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row h-screen overflow-hidden bg-white">
      {/* Main Content Area - Now stable and neutral */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-black absolute top-8 left-8 tracking-tight text-gray-900">
          WAVEFRAME{' '}
          <span className="text-xs font-mono ml-2 tracking-widest uppercase text-blue-500">
            Playground
          </span>
        </h1>

        <div className="flex items-center justify-center w-full">
          <div className="transition-all duration-300" style={{ width: `${80 * scale}%` }}>
            <WaveframePlayer
              audioUrl={trackInfo.audioUrl}
              peaks={dummyPeaks}
              artworkUrl={trackInfo.artworkUrl}
              title={trackInfo.title}
              artist={trackInfo.artist}
              resolution={resolution}
              barWidth={barWidth}
              barGap={barGap}
              height={80 * scale}
              // The theme colors now ONLY affect the component
              waveColor={theme['--wf-bg'] === '#ffffff' ? '#e5e7eb' : '#374151'}
              progressColor={theme['--wf-primary']}
              style={{
                '--wf-bg-color': theme['--wf-bg'],
                '--wf-border-color': theme['--wf-border'],
                '--wf-title-color': theme['--wf-text'],
                '--wf-artist-color': theme['--wf-text'],
                '--wf-time-color': theme['--wf-text'],
                '--wf-play-btn-bg': theme['--wf-primary'],
                '--wf-placeholder-from': theme['--wf-primary'],
                '--wf-placeholder-to': theme['--wf-bg'],
              } as CSSProperties}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Side Panel - Stable appearance */}
      <div className="w-full lg:w-96 border-l h-full overflow-y-auto p-6 shadow-2xl flex flex-col gap-8 bg-white border-gray-200">
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
            Scale
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Component Scale: {Math.round(scale * 100)}%
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
            Theme Presets
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => toggleTheme('light')}
              className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-700 transition-all hover:bg-gray-50 active:bg-gray-100"
              style={{
                backgroundColor: theme['--wf-bg'] === '#ffffff' ? '#f3f4f6' : 'transparent',
              }}
            >
              Light
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-700 transition-all hover:bg-gray-50 active:bg-gray-100"
              style={{
                backgroundColor: theme['--wf-bg'] !== '#ffffff' ? '#f3f4f6' : 'transparent',
              }}
            >
              Dark
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">
            Waveform Config
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Resolution
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value === 'auto' ? 'auto' : Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all text-xs text-gray-800"
              >
                <option value="auto">Auto (Fit to Width)</option>
                <option value="64">64 (Lo-fi)</option>
                <option value="128">128</option>
                <option value="256">256</option>
                <option value="512">512</option>
                <option value="1024">1024 (HD)</option>
              </select>
            </label>
            
            {resolution === 'auto' && (
              <>
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Bar Width: {barWidth}px
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={barWidth}
                    onChange={(e) => setBarWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </label>
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Bar Gap: {barGap}px
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={barGap}
                    onChange={(e) => setBarGap(Number(e.target.value))}
                    className="w-full"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">
            Track Information
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { id: 'title', label: 'Track Title' },
              { id: 'artist', label: 'Artist Name' },
              { id: 'artworkUrl', label: 'Artwork URL' },
            ].map((field) => (
              <label
                key={field.id}
                className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500"
              >
                {field.label}
                <input
                  type="text"
                  value={(trackInfo as any)[field.id]}
                  onChange={(e) => handleTrackChange(field.id, e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all text-xs text-gray-800"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">
            Custom Styles
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {themeEntries.map(({ key, label }) => {
              const value = theme[key];
              
              return (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleThemeChange(key, e.target.value)}
                        className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleThemeChange(key, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[10px] font-bold text-gray-700 transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-100">
          <p className="text-[10px] font-medium leading-relaxed text-gray-400">
            Waveframe Player v0.1.0
            <br />
            Built with React + Tailwind v4
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
