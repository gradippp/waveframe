import React, { useState, useCallback, useMemo } from 'react';
import { WaveframePlayer } from './components/WaveframePlayer';
import { SettingsPanel } from './organisms/SettingsPanel';
import { CodeBlock } from './atoms/CodeBlock';
import { usePersistentSettings } from './hooks/usePersistentSettings';
import { highlightCode } from './utils';
import { TrackInfo, WaveframeTheme, WaveformConfig } from './types';
import { WaveframeEngine } from './core/WaveframeEngine';
import { useWaveframeStore } from './hooks/useWaveframeStore';

const LIGHT_THEME = { bg: '#ffffff', primary: '#3b82f6', text: '#111827', border: '#f3f4f6' };
const DARK_THEME = { bg: '#111827', primary: '#3b82f6', text: '#f9fafb', border: '#1f2937' };

function App() {
  const defaultTrackInfo: TrackInfo = {
    title: 'Electronic Sunset',
    artist: 'Digital Nomad',
    artwork: 'https://picsum.photos/seed/waveframe/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  };

  const defaultWaveformConfig = {
    resolution: 'auto' as const,
    barWidth: 2,
    barGap: 1,
    height: 100,
  };

  const [trackInfo, setTrackInfo] = usePersistentSettings('track_info', defaultTrackInfo);
  const [theme, setTheme] = usePersistentSettings('theme', LIGHT_THEME);
  const [waveformConfig, setWaveformConfig] = usePersistentSettings('waveform_config', defaultWaveformConfig);
  const [scale, setScale] = usePersistentSettings('scale', 1);

  // Advanced: Manually managing the engine for uploaded files
  const engine = useMemo(() => new WaveframeEngine(), []);
  const { isPlaying, volume, muted, isAnalyzing, peaks } = useWaveframeStore(engine);

  // The media to provide to the player
  const media = trackInfo.audioUrl || '';

  const handleClearPeaks = useCallback(() => {
    engine.load(media, []);
  }, [engine, media]);

  const handleAnalyze = useCallback(async () => {
    engine.analyze(512);
  }, [engine]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrackInfo({
        ...trackInfo,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Local File',
        audioUrl: '' // Clear URL since we use the file
      });
      engine.load(file);
    }
  }, [engine, trackInfo, setTrackInfo]);

  const handleArtworkUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrackInfo({
        ...trackInfo,
        artwork: file
      });
    }
  }, [trackInfo, setTrackInfo]);

  const handleReset = useCallback(() => {
    setTrackInfo(defaultTrackInfo);
    setTheme(LIGHT_THEME);
    setWaveformConfig(defaultWaveformConfig);
    setScale(1);
    engine.load(defaultTrackInfo.audioUrl, []);
  }, [engine, setTrackInfo, setTheme, setWaveformConfig, setScale, defaultTrackInfo, defaultWaveformConfig]);

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const code = document.getElementById('generated-code-text')?.innerText || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const generatedCode = useMemo(() => {
    const peaksArrayStr = peaks.length > 0
      ? `const peaks = [${peaks.slice(0, 8).map((p: number) => p.toFixed(2)).join(', ')}, ...];`
      : '// Omit peaks to enable internal auto-analysis';

    const mediaProp = trackInfo.audioUrl 
      ? `media="${trackInfo.audioUrl}"` 
      : `media={myAudioBlob}`;

    const artworkProp = typeof trackInfo.artwork === 'string'
      ? `artwork="${trackInfo.artwork}"`
      : `artwork={myArtworkBlob}`;

    return `${peaksArrayStr}

<WaveframePlayer
  ${mediaProp}
  ${artworkProp}
  ${peaks.length > 0 ? 'peaks={peaks}' : ''}
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
/>`;
  }, [trackInfo, theme, waveformConfig, scale, peaks]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row h-screen overflow-hidden bg-white font-sans">
      <div className="flex-1 p-8 flex flex-col items-center justify-start relative overflow-y-auto bg-gray-50/50">
        <div className="absolute top-0 left-0 right-0 h-16 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-500/30 transition-transform hover:scale-105 cursor-default">W</div>
            <div className="flex flex-col -gap-1">
              <span className="text-xs font-black tracking-tighter uppercase text-gray-900">Waveframe</span>
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-blue-500/80">Playground</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="./docs/index.html" 
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all active:scale-95"
            >
              API Reference
            </a>
            <div className="w-px h-4 bg-gray-200/60"></div>
            <a 
              href="https://github.com/gradippp/waveframe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gray-900 transition-all hover:scale-110 active:scale-90"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="w-full max-w-5xl flex flex-col items-center gap-12 mt-32 pb-24 px-4">
          <div className="flex items-center justify-center w-full">
            <div className="transition-all duration-500 ease-out" style={{ width: `${80 * scale}%`, maxWidth: '100%' }}>
              <WaveframePlayer
                {...trackInfo}
                {...waveformConfig}
                media={media}
                height={waveformConfig.height * scale}
                theme={theme}
                className="w-full"
                engine={engine}
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
        engineState={{ isPlaying, volume, muted, isAnalyzing }}
        onAnalyze={handleAnalyze}
        onClearPeaks={handleClearPeaks}
        onFileUpload={handleFileUpload}
        onArtworkUpload={handleArtworkUpload}
        onReset={handleReset}
        onTogglePlay={() => engine.togglePlay()}
        onSetVolume={(v) => engine.setVolume(v)}
        onSetMuted={(m) => engine.setMuted(m)}
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
