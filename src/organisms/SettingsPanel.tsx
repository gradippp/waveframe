import React, { memo } from 'react';
import { WaveframeTheme, TrackInfo, WaveformConfig } from '../types';

interface SettingsPanelProps {
  theme: WaveframeTheme;
  trackInfo: TrackInfo;
  config: WaveformConfig;
  scale: number;
  engineState: {
    isPlaying: boolean;
    volume: number;
    muted: boolean;
    isAnalyzing: boolean;
  };
  onAnalyze: () => void;
  onThemeChange: (theme: Partial<WaveframeTheme>) => void;
  onTrackChange: (track: Partial<TrackInfo>) => void;
  onConfigChange: (config: Partial<WaveformConfig>) => void;
  onScaleChange: (scale: number) => void;
  onTogglePreset: (type: 'light' | 'dark') => void;
  onClearPeaks: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onArtworkUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onTogglePlay: () => void;
  onSetVolume: (v: number) => void;
  onSetMuted: (m: boolean) => void;
}

const LIGHT_THEME = { bg: '#ffffff', primary: '#3b82f6', text: '#111827', border: '#f3f4f6' };
const DARK_THEME = { bg: '#111827', primary: '#3b82f6', text: '#f9fafb', border: '#1f2937' };

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(({
  theme,
  trackInfo,
  config,
  scale,
  engineState,
  onAnalyze,
  onThemeChange,
  onTrackChange,
  onConfigChange,
  onScaleChange,
  onTogglePreset,
  onClearPeaks,
  onFileUpload,
  onArtworkUpload,
  onReset,
  onTogglePlay,
  onSetVolume,
  onSetMuted,
}) => {
  const { isPlaying, volume, muted, isAnalyzing } = engineState;

  return (
    <div className="w-full lg:w-96 border-l h-full overflow-y-auto p-6 shadow-2xl flex flex-col gap-8 bg-white border-gray-200 transition-colors duration-300">
      
      {/* SECTION 1: Audio Source & Analysis */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Audio Source</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Upload Local Audio
            <input 
              type="file" 
              accept="audio/*" 
              onChange={onFileUpload}
              className="px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
            />
          </label>
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[8px] font-black uppercase tracking-tighter text-gray-300">OR</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>
          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase text-gray-500">
            Track URL
            <input
              type="text"
              value={trackInfo.audioUrl}
              onChange={(e) => onTrackChange({ audioUrl: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="https://..."
            />
          </label>

          <div className="flex gap-2 mt-2">
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                isAnalyzing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Generate Peaks'}
            </button>
            <button
              onClick={onClearPeaks}
              className="flex-1 py-2 rounded-lg text-xs font-bold bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all shadow-sm"
            >
              Clear Peaks
            </button>
          </div>
          <p className="text-[9px] text-gray-400 leading-relaxed text-center">
            Generate peaks for accurate waveforms, or clear them to test auto-analysis.
          </p>
        </div>
      </div>

      {/* SECTION 2: Playback Controls */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Playback</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={onTogglePlay}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                isPlaying ? 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100' : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
              }`}
            >
              {isPlaying ? 'Pause Track' : 'Play Track'}
            </button>
            <button 
              onClick={() => onSetMuted(!muted)}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all shadow-sm ${
                muted ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>
          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Volume: {Math.round(volume * 100)}%
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={(e) => onSetVolume(Number(e.target.value))} 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </label>
        </div>
      </div>

      {/* SECTION 3: Track Details */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Track Details</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Upload Artwork
            <input 
              type="file" 
              accept="image/*" 
              onChange={onArtworkUpload}
              className="px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
            />
          </label>
          {[
            { key: 'title', label: 'Title' },
            { key: 'artist', label: 'Artist' },
          ].map((f) => (
            <label key={f.key} className="flex flex-col gap-1 text-[10px] font-bold uppercase text-gray-500">
              {f.label}
              <input
                type="text"
                value={(trackInfo as any)[f.key]}
                onChange={(e) => onTrackChange({ [f.key]: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </label>
          ))}
          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase text-gray-500">
            Artwork URL (Fallback)
            <input
              type="text"
              value={typeof trackInfo.artwork === 'string' ? trackInfo.artwork : ''}
              onChange={(e) => onTrackChange({ artwork: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="https://..."
            />
          </label>
        </div>
      </div>

      {/* SECTION 4: Waveform & Layout */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Waveform & Layout</h2>
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Component Scale: {Math.round(scale * 100)}%
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              value={scale}
              onChange={(e) => onScaleChange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </label>

          <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Resolution
            <select
              value={config.resolution}
              onChange={(e) => onConfigChange({ resolution: e.target.value === 'auto' ? 'auto' : Number(e.target.value) })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="auto">Auto (Fit to Width)</option>
              {[64, 128, 256, 512, 1024].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          {config.resolution === 'auto' && (
            <>
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Bar Width: {config.barWidth}px
                <input type="range" min="1" max="10" step="0.5" value={config.barWidth} onChange={(e) => onConfigChange({ barWidth: Number(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </label>
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Bar Gap: {config.barGap}px
                <input type="range" min="0" max="10" step="0.5" value={config.barGap} onChange={(e) => onConfigChange({ barGap: Number(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </label>
            </>
          )}
        </div>
      </div>

      {/* SECTION 5: Theme & Colors */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Theme & Colors</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onTogglePreset('light')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
              theme.bg === '#ffffff' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Light Mode
          </button>
          <button
            onClick={() => onTogglePreset('dark')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
              theme.bg !== '#ffffff' ? 'bg-gray-800 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Dark Mode
          </button>
        </div>

        <div className="grid gap-4">
          {([
            { key: 'bg', label: 'Background' },
            { key: 'primary', label: 'Primary' },
            { key: 'text', label: 'Text' },
            { key: 'border', label: 'Border' },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3 group">
              <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-gray-600 transition-colors flex-1">{label}</span>
              <input 
                type="text" 
                value={theme[key]} 
                onChange={(e) => onThemeChange({ [key]: e.target.value })} 
                className="w-20 px-2 py-1 border border-gray-100 rounded text-center font-mono text-[10px] bg-gray-50 text-gray-600 uppercase focus:bg-white focus:border-blue-200 outline-none transition-all" 
              />
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm hover:ring-2 hover:ring-blue-500/20 transition-all">
                <input 
                  type="color" 
                  value={theme[key]} 
                  onChange={(e) => onThemeChange({ [key]: e.target.value })} 
                  className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <button 
          onClick={onReset}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-[0.98]"
        >
          Reset Playground
        </button>
        <div className="pt-4 border-t border-gray-100 text-[10px] font-medium text-gray-400 text-center">
          Waveframe Player v0.1.3<br />Built with React + Tailwind v4
        </div>
      </div>
    </div>
  );
});

SettingsPanel.displayName = 'SettingsPanel';
