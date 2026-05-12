/**
 * Formats seconds into a M:SS string
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

/**
 * Resamples an array of peaks to a target count using bucket-max or linear interpolation
 */
export const resamplePeaks = (peaks: number[], targetCount: number): number[] => {
  if (peaks.length === 0) return [];
  if (peaks.length === targetCount) return peaks;

  const resampled = new Array(targetCount);
  const ratio = peaks.length / targetCount;

  // Simple Nearest-Neighbor: Just pick the raw peak at the given interval
  // This preserves the exact jagged nature of the original audio without artificially smoothing or flattening it.
  for (let i = 0; i < targetCount; i++) {
    resampled[i] = peaks[Math.floor(i * ratio)];
  }
  
  return resampled;
};

/**
 * High-performance token-based syntax highlighter for React snippets
 */
export const highlightCode = (code: string): string[] => {
  return code.split('\n').map((line) => {
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

    return h;
  });
};

export * from './audio';
