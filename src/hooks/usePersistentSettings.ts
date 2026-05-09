import { useState, useEffect } from 'react';

export const usePersistentSettings = (key: string, defaultValue: any) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, 500);
    return () => clearTimeout(timer);
  }, [key, state]);

  return [state, setState];
};
