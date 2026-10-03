'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/lib/dates';

import type { WebhookEndpoint } from '../api/developersApi';
import { useWebhookEndpointMutations, useWebhookEndpoints } from '../hooks/useWebhookEndpoints';
import { SecretRevealDialog, type RevealedSecret } from './SecretRevealDialog';
import { WebhookEndpointFormDialog } from './WebhookEndpointFormDialog';

type Pending = { kind: 'roll' | 'delete'; endpoint: WebhookEndpoint } | null;
type FormState = { open: boolean; endpoint?: WebhookEndpoint };

/** Webhook endpoints for the current mode with secrets, test pings and deletion. */
export function WebhookEndpointsPanel() {
  const endpoints = useWebhookEndpoints();
  const { create, update, rollSecret, remove, sendTest } = useWebhookEndpointMutations();
  const [formState, setFormState] = useState<FormState>({ open: false });
  const [pending, setPending] = useState<Pending>(null);
  const [revealed, setRevealed] = useState<RevealedSecret | null>(null);

  const revealSecret = (endpoint: WebhookEndpoint, title: string) => {
    if (!endpoint.secret) return;
    setRevealed({
      title,
      description: 'Use this signing secret to verify the FluxPay-Signature header.',
      secret: endpoint.secret,
    });
  };

  const submitForm = async (url: string) => {
    if (formState.endpoint) {
      await update.mutateAsync({ id: formState.endpoint.id, url });
      toast.success('Endpoint updated');
      return;
    }
    const created = await create.mutateAsync(url);
    create.reset();
    revealSecret(created, 'Endpoint added');
  };

  const onConfirm = () => {
    if (!pending) return;
    const { kind, endpoint } = pending;
    setPending(null);
    const onError = (error: Error) => toast.error(error.message);
    if (kind === 'delete') {
      remove.mutate(endpoint.id, { onSuccess: () => toast.success('Endpoint deleted'), onError });
    } else {
      rollSecret.mutate(endpoint.id, {
        onSuccess: (next) => {
          rollSecret.reset();
          revealSecret(next, 'Signing secret rolled');
        },
        onError,
      });
    }
  };

  const { mutate: mutateUpdate } = update;
  const { mutate: mutateTest } = sendTest;
  const columns = useMemo<ColumnDef<WebhookEndpoint, unknown>[]>(
    () => [
      {
        header: 'URL',
        cell: ({ row }) => <span className="font-mono text-xs break-all">{row.original.url}</span>,
      },
      {
        header: 'Enabled',
        cell: ({ row }) => (
          <Switch
            checked={row.original.enabled}
            aria-label={`Endpoint ${row.original.url} enabled`}
            onCheckedChange={(enabled) =>
              mutateUpdate(
                { id: row.original.id, enabled },
                { onError: (error) => toast.error(error.message) },
              )
            }
          />
        ),
      },
      { header: 'Created', cell: ({ row }) => formatDate(row.original.created_at) },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions for ${row.original.url}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() =>
                  mutateTest(row.original.id, {
                    onSuccess: () => toast.success('Test event queued'),
                    onError: (error) => toast.error(error.message),
                  })
                }
              >
                Send test event
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFormState({ open: true, endpoint: row.original })}>
                Edit URL
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPending({ kind: 'roll', endpoint: row.original })}>
                Roll signing secret
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setPending({ kind: 'delete', endpoint: row.original })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [mutateUpdate, mutateTest],
  );

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Up to 5 endpoints per mode receive checkout and refund events.
        </p>
        <Button onClick={() => setFormState({ open: true })}>
          <Plus /> Add endpoint
        </Button>
      </div>
      {endpoints.error ? (
        <ErrorState error={endpoints.error} onRetry={() => endpoints.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={endpoints.data?.data ?? []}
          getRowId={(e) => e.id}
          isLoading={endpoints.isPending}
          emptyMessage="No webhook endpoints yet."
        />
      )}
      <WebhookEndpointFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
        initialUrl={formState.endpoint?.url}
        onSubmit={submitForm}
      />
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending?.kind === 'roll' ? 'Roll signing secret?' : 'Delete endpoint?'}
        description={
          pending?.kind === 'roll'
            ? 'Events are signed with the new secret immediately. Update your server first.'
            : 'This endpoint will stop receiving events. Pending deliveries will fail.'
        }
        confirmLabel={pending?.kind === 'roll' ? 'Roll secret' : 'Delete'}
        destructive
        onConfirm={onConfirm}
      />
      <SecretRevealDialog revealed={revealed} onDone={() => setRevealed(null)} />
    </section>
  );
}
