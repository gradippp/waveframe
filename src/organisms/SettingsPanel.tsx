import React, { memo } from 'react';
import { WaveframeTheme, TrackInfo, WaveformConfig } from '../types';

interface SettingsPanelProps {
  theme: WaveframeTheme;
  trackInfo: TrackInfo;
  config: WaveformConfig;
  scale: number;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onThemeChange: (theme: Partial<WaveframeTheme>) => void;
  onTrackChange: (track: Partial<TrackInfo>) => void;
  onConfigChange: (config: Partial<WaveformConfig>) => void;
  onScaleChange: (scale: number) => void;
  onTogglePreset: (type: 'light' | 'dark') => void;
  onClearPeaks: () => void;
}

const LIGHT_THEME = { bg: '#ffffff', primary: '#3b82f6', text: '#111827', border: '#f3f4f6' };
const DARK_THEME = { bg: '#111827', primary: '#3b82f6', text: '#f9fafb', border: '#1f2937' };

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(({
  theme,
  trackInfo,
  config,
  scale,
  isAnalyzing,
  onAnalyze,
  onThemeChange,
  onTrackChange,
  onConfigChange,
  onScaleChange,
  onTogglePreset,
  onClearPeaks,
}) => {
  return (
    <div className="w-full lg:w-96 border-l h-full overflow-y-auto p-6 shadow-2xl flex flex-col gap-8 bg-white border-gray-200 transition-colors duration-300">
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Scale</h2>
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
          Component Scale: {Math.round(scale * 100)}%
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.01"
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Presets</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onTogglePreset('light')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
              theme.bg === '#ffffff' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-transparent border-gray-200 text-gray-600'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => onTogglePreset('dark')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
              theme.bg !== '#ffffff' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-transparent border-gray-200 text-gray-600'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Waveform</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Resolution
            <select
              value={config.resolution}
              onChange={(e) => onConfigChange({ resolution: e.target.value === 'auto' ? 'auto' : Number(e.target.value) })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
            >
              <option value="auto">Auto (Fit to Width)</option>
              {[64, 128, 256, 512, 1024].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          {config.resolution === 'auto' && (
            <>
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Bar Width: {config.barWidth}px
                <input type="range" min="1" max="10" step="0.5" value={config.barWidth} onChange={(e) => onConfigChange({ barWidth: Number(e.target.value) })} className="w-full accent-blue-500" />
              </label>
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Bar Gap: {config.barGap}px
                <input type="range" min="0" max="10" step="0.5" value={config.barGap} onChange={(e) => onConfigChange({ barGap: Number(e.target.value) })} className="w-full accent-blue-500" />
              </label>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Peaks</h2>
          <button
            onClick={onClearPeaks}
            className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-all underline decoration-dotted"
          >
            Clear (Use Auto)
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">
          Omit manual peaks to test the internal "plug-and-play" auto-analysis.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Track</h2>
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
              isAnalyzing ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { key: 'title', label: 'Title' },
            { key: 'artist', label: 'Artist' },
            { key: 'artworkUrl', label: 'Artwork URL' },
            { key: 'audioUrl', label: 'Track URL' },
          ].map((f) => (
            <label key={f.key} className="flex flex-col gap-1 text-[10px] font-bold uppercase text-gray-500">
              {f.label}
              <input
                type="text"
                value={(trackInfo as any)[f.key]}
                onChange={(e) => onTrackChange({ [f.key]: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Colors</h2>
        <div className="grid gap-3">
          {([
            { key: 'bg', label: 'Background' },
            { key: 'primary', label: 'Primary' },
            { key: 'text', label: 'Text' },
            { key: 'border', label: 'Border' },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase text-gray-500">{label}</span>
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                  <input type="color" value={theme[key]} onChange={(e) => onThemeChange({ [key]: e.target.value })} className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer" />
                </div>
                <input type="text" value={theme[key]} onChange={(e) => onThemeChange({ [key]: e.target.value })} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg font-mono text-[10px] bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-4">
        <a 
          href="https://github.com/gradippp/waveframe" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold transition-all hover:bg-black w-fit"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          View on GitHub
        </a>
        <div className="text-[10px] font-medium text-gray-400">
          Waveframe Player v0.1.0<br />Built with React + Tailwind v4
        </div>
      </div>
    </div>
  );
});

SettingsPanel.displayName = 'SettingsPanel';
