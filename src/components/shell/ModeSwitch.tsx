'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMode } from '@/lib/mode/useMode';

/** Header toggle between test and live data. */
export function ModeSwitch() {
  const { mode, setMode } = useMode();
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="mode-switch"
        checked={mode === 'live'}
        onCheckedChange={(checked) => setMode(checked ? 'live' : 'test')}
        aria-label="Live mode"
      />
      <Label htmlFor="mode-switch" className="text-sm">
        {mode === 'live' ? 'Live' : 'Test'}
      </Label>
    </div>
  );
}
