import { Loader2 } from 'lucide-react';

/** Centered loading indicator for whole-page waits. */
export function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center" aria-busy="true">
      <Loader2 className="text-muted-foreground size-6 animate-spin" aria-label="Loading" />
    </div>
  );
}
