import React, { useState, useCallback, useMemo } from 'react';
import { WaveframePlayer } from './components/WaveframePlayer';
import { SettingsPanel } from './organisms/SettingsPanel';
import { CodeBlock } from './atoms/CodeBlock';
import { usePersistentSettings } from './hooks/usePersistentSettings';
import { highlightCode } from './utils';
import { TrackInfo, WaveframeTheme, WaveformConfig } from './types';

const dummyPeaks = Array.from({ length: 1024 }, () => Math.random() * 0.8 + 0.1);
const LIGHT_THEME = { bg: '#ffffff', primary: '#3b82f6', text: '#111827', border: '#f3f4f6' };
const DARK_THEME = { bg: '#111827', primary: '#3b82f6', text: '#f9fafb', border: '#1f2937' };

function App() {
  const [trackInfo, setTrackInfo] = usePersistentSettings('track_info', {
    title: 'Electronic Sunset',
    artist: 'Digital Nomad',
    artworkUrl: 'https://picsum.photos/seed/waveframe/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  });

  const [theme, setTheme] = usePersistentSettings('theme', LIGHT_THEME);
  const [waveformConfig, setWaveformConfig] = usePersistentSettings('waveform_config', {
    resolution: 'auto',
    barWidth: 2,
    barGap: 1,
    height: 100,
  });
  const [scale, setScale] = usePersistentSettings('scale', 1);

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const code = document.getElementById('generated-code-text')?.innerText || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const generatedCode = useMemo(() => `const peaks = [${dummyPeaks.slice(0, 8).map(p => p.toFixed(2)).join(', ')}, ...];

<WaveframePlayer
  audioUrl="${trackInfo.audioUrl}"
  peaks={peaks}
  artworkUrl="${trackInfo.artworkUrl}"
  title="${trackInfo.title}"
  artist="${trackInfo.artist}"
  resolution=${typeof waveformConfig.resolution === 'string' ? `"${waveformConfig.resolution}"` : waveformConfig.resolution}
  barWidth={${waveformConfig.barWidth}}
  barGap={${waveformConfig.barGap}}
  height={${Math.round(waveformConfig.height * scale)}}
  theme={{
    "bg": "${theme.bg}",
    "primary": "${theme.primary}",
    "text": "${theme.text}",
    "border": "${theme.border}"
  }}
/>`, [trackInfo, theme, waveformConfig, scale]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row h-screen overflow-hidden bg-white font-sans">
      <div className="flex-1 p-8 flex flex-col items-center justify-start relative overflow-y-auto bg-gray-50/50">
        <div className="w-full max-w-5xl flex flex-col items-center gap-12 mt-16 pb-20">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Waveframe</h1>
            <p className="text-xs text-blue-500 font-mono tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Configuration Playground</p>
          </div>

          <div className="flex items-center justify-center w-full">
            <div className="transition-all duration-500 ease-out" style={{ width: `${80 * scale}%`, maxWidth: '100%' }}>
              <WaveframePlayer
                {...trackInfo}
                {...waveformConfig}
                height={waveformConfig.height * scale}
                theme={theme}
                className="w-full"
                peaks={dummyPeaks}
              />
            </div>
          </div>

          <div className="w-full max-w-4xl mt-4">
            <CodeBlock 
              code={generatedCode} 
              highlightFn={highlightCode} 
              onCopy={handleCopy} 
              copied={copied} 
            />
            <div id="generated-code-text" className="hidden">{generatedCode}</div>
          </div>
        </div>
      </div>

      <SettingsPanel
        theme={theme}
        trackInfo={trackInfo}
        config={waveformConfig}
        scale={scale}
        onThemeChange={(t) => setTheme({ ...theme, ...t })}
        onTrackChange={(t) => setTrackInfo({ ...trackInfo, ...t })}
        onConfigChange={(c) => setWaveformConfig({ ...waveformConfig, ...c })}
        onScaleChange={setScale}
        onTogglePreset={(type) => setTheme(type === 'light' ? LIGHT_THEME : DARK_THEME)}
      />
    </div>
  );
}

export default App;
