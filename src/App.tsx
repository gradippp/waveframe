import React, { useState, CSSProperties, useEffect, useMemo, useCallback } from 'react';
import { WaveframePlayer } from './components/WaveframePlayer';

// Generate some dense dummy peaks (1024 points)
const dummyPeaks = Array.from({ length: 1024 }, () => Math.random() * 0.8 + 0.1);

const LIGHT_THEME = {
  bg: '#ffffff',
  primary: '#3b82f6',
  text: '#111827',
  border: '#f3f4f6',
};

const DARK_THEME = {
  bg: '#111827',
  primary: '#3b82f6',
  text: '#f9fafb',
  border: '#1f2937',
};

const STORAGE_KEY = 'waveframe_playground_settings';

const THEME_ENTRIES = [
  { key: 'bg', label: 'Background' },
  { key: 'primary', label: 'Primary (Accent)' },
  { key: 'text', label: 'Text Color' },
  { key: 'border', label: 'Border Color' },
];

function App() {
  // Load initial state from localStorage
  const getInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Basic schema validation to prevent crashes from old data
      if (parsed && typeof parsed === 'object' && parsed.theme && 'bg' in parsed.theme) {
        return parsed;
      }
      return null;
    } catch (e) {
      console.error('Failed to load settings', e);
      return null;
    }
  };

  const initialState = useMemo(() => getInitialState(), []);

  const [trackInfo, setTrackInfo] = useState(initialState?.trackInfo || {
    title: 'Electronic Sunset',
    artist: 'Digital Nomad',
    artworkUrl: 'https://picsum.photos/seed/waveframe/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  });

  const [theme, setTheme] = useState(initialState?.theme || LIGHT_THEME);
  const [resolution, setResolution] = useState<number | 'auto'>(initialState?.resolution || 'auto');
  const [barWidth, setBarWidth] = useState(initialState?.barWidth || 2);
  const [barGap, setBarGap] = useState(initialState?.barGap || 1);
  const [scale, setScale] = useState(initialState?.scale || 1);

  // Debounced save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const settings = {
        trackInfo,
        theme,
        resolution,
        barWidth,
        barGap,
        scale,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, 500);

    return () => clearTimeout(timer);
  }, [trackInfo, theme, resolution, barWidth, barGap, scale]);

  const handleTrackChange = useCallback((key: string, value: string) => {
    setTrackInfo((prev: any) => ({ ...prev, [key]: value }));
  }, []);

  const handleThemeChange = useCallback((key: string, value: string) => {
    setTheme((prev: any) => ({ ...prev, [key]: value }));
  }, []);

  const toggleTheme = useCallback((type: 'light' | 'dark') => {
    setTheme(type === 'light' ? LIGHT_THEME : DARK_THEME);
  }, []);

  const generatedCode = useMemo(() => `<WaveframePlayer
  audioUrl="${trackInfo.audioUrl}"
  peaks={peaks}
  artworkUrl="${trackInfo.artworkUrl}"
  title="${trackInfo.title}"
  artist="${trackInfo.artist}"
  resolution=${typeof resolution === 'string' ? `"${resolution}"` : resolution}
  barWidth={${barWidth}}
  barGap={${barGap}}
  height={${Math.round(80 * scale)}}
  theme={{
    "bg": "${theme.bg}",
    "primary": "${theme.primary}",
    "text": "${theme.text}",
    "border": "${theme.border}"
  }}
/>`, [trackInfo, theme, resolution, barWidth, barGap, scale]);

  const [copied, setCopying] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  }, [generatedCode]);

  // Robust syntax highlighter for the generated snippet
  const highlightCode = (code: string) => {
    return code.split('\n').map((line, i) => {
      // 1. Escape basic HTML
      let h = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // 2. Identify and tokenize segments to avoid nested replacement issues
      const tokens: { [key: string]: string } = {};
      let counter = 0;
      const addToken = (val: string, cls: string) => {
        const id = `__TOKEN_${counter++}__`;
        tokens[id] = `<span class="${cls}">${val}</span>`;
        return id;
      };

      // Strings
      h = h.replace(/("(?:[^"\\]|\\.)*")/g, (m) => addToken(m, 'text-[#ce9178]'));
      // Numbers
      h = h.replace(/\b(\d+(\.\d+)?)\b/g, (m) => addToken(m, 'text-[#b5cea8]'));
      // Component Name
      h = h.replace(/\b(WaveframePlayer)\b/g, (m) => addToken(m, 'text-[#4ec9b0]'));
      // Props (anything followed by =)
      h = h.replace(/\b([a-z][a-zA-Z0-9]+)(?==)/g, (m) => addToken(m, 'text-[#9cdcfe]'));

      // 3. Style remaining symbols
      h = h.replace(/(&lt;|&gt;|\{|\}|\/|:|,)/g, '<span class="text-gray-500">$1</span>');

      // 4. In-place token resolution
      Object.entries(tokens).forEach(([id, html]) => {
        h = h.replace(id, html);
      });

      return (
        <div key={i} className="whitespace-pre">
          <span className="mr-4 text-gray-700 select-none inline-block w-4 text-right">{(i + 1)}</span>
          <span dangerouslySetInnerHTML={{ __html: h }} />
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row h-screen overflow-hidden bg-white font-sans">
      {/* Main Content Area - Now stable and neutral */}
      <div className="flex-1 p-8 flex flex-col items-center justify-start relative overflow-y-auto bg-gray-50/50">
        <div className="w-full max-w-5xl flex flex-col items-center gap-12 mt-16 pb-20">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
              Waveframe
            </h1>
            <p className="text-xs text-blue-500 font-mono tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
              Configuration Playground
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <div 
              className="transition-all duration-500 ease-out" 
              style={{ width: `${80 * scale}%`, maxWidth: '100%' }}
            >
              <WaveframePlayer
                audioUrl={trackInfo.audioUrl}
                peaks={dummyPeaks}
                artworkUrl={trackInfo.artworkUrl}
                title={trackInfo.title}
                artist={trackInfo.artist}
                resolution={resolution}
                barWidth={barWidth}
                barGap={barGap}
                height={100 * scale}
                theme={theme}
                className="w-full"
              />
            </div>
          </div>

          {/* Isolated Code Export Section */}
          <div className="w-full max-w-4xl mt-4">
            <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-[#333]">
              <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-[#333]">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  React Code Export
                </h2>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1 rounded transition-all duration-300 text-[10px] font-bold uppercase tracking-widest ${
                    copied 
                    ? 'text-green-400' 
                    : 'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy Snippet'}
                </button>
              </div>
              <div className="p-6 overflow-x-auto custom-scrollbar bg-[#1e1e1e]">
                <pre style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }} className="text-[13px] leading-relaxed">
                  <code>{highlightCode(generatedCode)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel - Now stable and neutral */}
      <div className="w-full lg:w-96 border-l h-full overflow-y-auto p-6 shadow-2xl flex flex-col gap-8 bg-white border-gray-200 transition-colors duration-300">
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
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all hover:bg-gray-50 ${
                theme.bg === '#ffffff' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-transparent border-gray-200 text-gray-600'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all hover:bg-gray-50 ${
                theme.bg !== '#ffffff' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-transparent border-gray-200 text-gray-600'
              }`}
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
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all text-xs text-gray-800 bg-white"
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
                    className="w-full accent-blue-500"
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
                    className="w-full accent-blue-500"
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
              { id: 'audioUrl', label: 'Track URL (Stream)' },
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
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all text-xs text-gray-800 bg-white"
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
            {THEME_ENTRIES.map(({ key, label }) => {
              const value = (theme as any)[key];
              
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
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[10px] font-bold text-gray-700 transition-all bg-white"
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
