import { useMemo } from 'react';
import { resamplePeaks } from '../utils';

export const useResampledPeaks = (peaks: number[], targetCount: number) => {
  return useMemo(() => resamplePeaks(peaks, targetCount), [peaks, targetCount]);
};
