'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { DataTable } from '@/components/DataTable';
import { ErrorState } from '@/components/ErrorState';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/dates';

import type { WebhookEvent } from '../api/developersApi';
import { useEvents } from '../hooks/useEvents';
import { EventDetailSheet } from './EventDetailSheet';

/** Event log for the current mode; each row opens its deliveries. */
export function EventsPanel() {
  const events = useEvents();
  const [selected, setSelected] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<WebhookEvent, unknown>[]>(
    () => [
      {
        header: 'Type',
        cell: ({ row }) => (
          <Button
            variant="link"
            className="h-auto p-0 font-mono text-xs"
            onClick={() => setSelected(row.original.id)}
          >
            {row.original.type}
          </Button>
        ),
      },
      {
        header: 'Event ID',
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
      },
      { header: 'Created', cell: ({ row }) => formatDateTime(row.original.created_at) },
    ],
    [],
  );

  return (
    <section className="grid gap-4">
      <p className="text-muted-foreground text-sm">
        Every event FluxPay sent (or tried to send) to your endpoints.
      </p>
      {events.error ? (
        <ErrorState error={events.error} onRetry={events.refetch} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={events.items}
            getRowId={(e) => e.id}
            isLoading={events.isLoading}
            emptyMessage="No events yet."
          />
          <LoadMoreButton hasMore={events.hasMore} isLoading={events.isLoadingMore} onLoadMore={events.loadMore} />
        </>
      )}
      <EventDetailSheet eventId={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
