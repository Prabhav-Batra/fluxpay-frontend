'use client';

import { useMode } from '@/lib/mode/useMode';

/** Thin warning strip shown while the dashboard shows test data. */
export function TestModeBanner() {
  const { mode } = useMode();
  if (mode !== 'test') return null;
  return (
    <div className="bg-amber-100 px-4 py-1.5 text-center text-xs font-medium text-amber-900">
      You are in test mode — payments and data here are not real.
    </div>
  );
}
