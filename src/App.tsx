import React, { useState, useCallback, useMemo } from 'react';
import { WaveframePlayer } from './components/WaveframePlayer';
import { SettingsPanel } from './organisms/SettingsPanel';
import { CodeBlock } from './atoms/CodeBlock';
import { usePersistentSettings } from './hooks/usePersistentSettings';
import { highlightCode, generatePeaks } from './utils';
import { TrackInfo, WaveframeTheme, WaveformConfig } from './types';

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
  const [peaks, setPeaks] = usePersistentSettings('peaks', undefined);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleClearPeaks = useCallback(() => {
    setPeaks(undefined);
  }, [setPeaks]);

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const newPeaks = await generatePeaks(trackInfo.audioUrl, 512);
      setPeaks(newPeaks);
    } catch (e) {
      console.error('Analysis failed', e);
      alert('Failed to analyze audio. Ensure the URL is direct and supports CORS.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [trackInfo.audioUrl, setPeaks]);

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const code = document.getElementById('generated-code-text')?.innerText || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const generatedCode = useMemo(() => {
    const peaksArrayStr = peaks 
      ? `const peaks = [${peaks.slice(0, 8).map((p: number) => p.toFixed(2)).join(', ')}, ...];`
      : '// Omit peaks to enable internal auto-analysis';

    return `${peaksArrayStr}

<WaveframePlayer
  audioUrl="${trackInfo.audioUrl}"
  ${peaks ? 'peaks={peaks}' : '// autoAnalyze={true}'}
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
/>`;
  }, [trackInfo, theme, waveformConfig, scale, peaks]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row h-screen overflow-hidden bg-white font-sans">
      <div className="flex-1 p-8 flex flex-col items-center justify-start relative overflow-y-auto bg-gray-50/50">
        {/* GitHub Badge - Instantly Visible */}
        <div className="absolute top-8 right-8">
          <a 
            href="https://github.com/gradippp/waveframe" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </a>
        </div>

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
                peaks={peaks}
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
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyze}
        onClearPeaks={handleClearPeaks}
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
