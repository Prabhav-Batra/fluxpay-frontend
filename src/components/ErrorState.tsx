import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api/errors';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

/** Inline error panel for a failed query, with the trace ID for support and a retry. */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : 'Something went wrong.';
  const traceId = error instanceof ApiError ? error.traceId : null;
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border p-6">
      <p className="font-medium">Could not load this data</p>
      <p className="text-muted-foreground text-sm">{message}</p>
      {traceId && <p className="text-muted-foreground font-mono text-xs">Trace ID: {traceId}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
