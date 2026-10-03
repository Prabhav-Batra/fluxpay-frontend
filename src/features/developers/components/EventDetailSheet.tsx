'use client';

import { RotateCw } from 'lucide-react';
import { toast } from 'sonner';

import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/dates';

import { useEvent, useResendEvent } from '../hooks/useEvents';
import { DeliveryStatusBadge } from './DeliveryStatusBadge';

interface EventDetailSheetProps {
  eventId: string | null;
  onClose: () => void;
}

/** Slide-over with an event's payload, its deliveries and a Resend action. */
export function EventDetailSheet({ eventId, onClose }: EventDetailSheetProps) {
  const event = useEvent(eventId);
  const resend = useResendEvent();

  const onResend = () => {
    if (!eventId) return;
    resend.mutate(eventId, {
      onSuccess: ({ deliveries_created }) => {
        toast.success(
          deliveries_created === 0
            ? 'No enabled endpoints to deliver to'
            : `Queued ${deliveries_created} new deliver${deliveries_created === 1 ? 'y' : 'ies'}`,
        );
        void event.refetch();
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <Sheet open={eventId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{event.data?.type ?? 'Event'}</SheetTitle>
          <SheetDescription className="font-mono text-xs">{eventId}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 px-4 pb-6">
          {event.error && <ErrorState error={event.error} onRetry={() => event.refetch()} />}
          {event.isPending && <Skeleton className="h-48 w-full" />}
          {event.data && (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm">{formatDateTime(event.data.created_at)}</p>
                <Button variant="outline" size="sm" onClick={onResend} disabled={resend.isPending}>
                  <RotateCw /> Resend
                </Button>
              </div>
              <pre className="bg-muted max-h-72 overflow-auto rounded-md p-3 text-xs">
                {JSON.stringify(event.data.data, null, 2)}
              </pre>
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold">Deliveries</h3>
                {event.data.deliveries.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No deliveries.</p>
                ) : (
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Attempts</TableHead>
                          <TableHead>Last code</TableHead>
                          <TableHead>Last error</TableHead>
                          <TableHead>Next attempt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {event.data.deliveries.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell>
                              <DeliveryStatusBadge status={d.status} />
                            </TableCell>
                            <TableCell>{d.attempt_count}</TableCell>
                            <TableCell>{d.last_status_code ?? '—'}</TableCell>
                            <TableCell className="max-w-40 truncate" title={d.last_error ?? undefined}>
                              {d.last_error ?? '—'}
                            </TableCell>
                            <TableCell>
                              {d.status === 'pending' ? formatDateTime(d.next_attempt_at) : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
