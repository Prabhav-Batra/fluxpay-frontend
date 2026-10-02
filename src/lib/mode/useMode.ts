'use client';

import { useContext } from 'react';

import { ModeContext, type ModeContextValue } from './ModeContext';

/** Returns the current test/live mode; must be used inside {@link ModeProvider}. */
export function useMode(): ModeContextValue {
  const value = useContext(ModeContext);
  if (!value) throw new Error('useMode must be used inside ModeProvider');
  return value;
}
