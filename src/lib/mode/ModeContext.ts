import { createContext } from 'react';

import type { Mode } from '@/lib/api/types';

/** Value shared by {@link ModeProvider}. */
export interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const ModeContext = createContext<ModeContextValue | null>(null);
