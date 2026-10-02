'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Mode } from '@/lib/api/types';

import { ModeContext } from './ModeContext';

const STORAGE_KEY = 'fluxpay.mode';

function readStoredMode(): Mode {
  if (typeof window === 'undefined') return 'test';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'live' ? 'live' : 'test';
}

/** Holds the dashboard's test/live mode and remembers it in localStorage. */
export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('test');

  useEffect(() => {
    setModeState(readStoredMode());
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}
