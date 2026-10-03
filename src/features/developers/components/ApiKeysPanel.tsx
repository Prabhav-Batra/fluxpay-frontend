'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { ErrorState } from '@/components/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/dates';
import { useMode } from '@/lib/mode/useMode';

import type { ApiKey } from '../api/developersApi';
import { useApiKeyMutations, useApiKeys } from '../hooks/useApiKeys';
import { SecretRevealDialog, type RevealedSecret } from './SecretRevealDialog';

type PendingAction = { kind: 'roll' | 'revoke'; key: ApiKey } | null;

/** API keys for the current mode: create, roll and revoke. */
export function ApiKeysPanel() {
  const { mode } = useMode();
  const keys = useApiKeys();
  const { create, roll, revoke } = useApiKeyMutations();
  const [revealed, setRevealed] = useState<RevealedSecret | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);

  const reveal = (key: ApiKey, title: string) => {
    if (!key.secret) return;
    setRevealed({
      title,
      description: `Use this ${mode} secret key from your server only.`,
      secret: key.secret,
    });
  };

  const onCreate = () =>
    create.mutate(undefined, {
      onSuccess: (key) => {
        reveal(key, 'API key created');
        create.reset();
      },
      onError: (error) => toast.error(error.message),
    });

  const onConfirm = () => {
    if (!pending) return;
    const { kind, key } = pending;
    setPending(null);
    if (kind === 'revoke') {
      revoke.mutate(key.id, {
        onSuccess: () => toast.success('Key revoked'),
        onError: (error) => toast.error(error.message),
      });
    } else {
      roll.mutate(key.id, {
        onSuccess: (next) => {
          reveal(next, 'API key rolled');
          roll.reset();
        },
        onError: (error) => toast.error(error.message),
      });
    }
  };

  const columns = useMemo<ColumnDef<ApiKey, unknown>[]>(
    () => [
      {
        header: 'Key',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.display_prefix}…</span>
        ),
      },
      {
        header: 'Status',
        cell: ({ row }) =>
          row.original.revoked_at ? (
            <Badge variant="outline">Revoked</Badge>
          ) : (
            <Badge variant="secondary">Active</Badge>
          ),
      },
      { header: 'Created', cell: ({ row }) => formatDateTime(row.original.created_at) },
      { header: 'Last used', cell: ({ row }) => formatDateTime(row.original.last_used_at) },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) =>
          row.original.revoked_at ? null : (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPending({ kind: 'roll', key: row.original })}
                aria-label={`Roll ${row.original.display_prefix}`}
              >
                Roll
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPending({ kind: 'revoke', key: row.original })}
                aria-label={`Revoke ${row.original.display_prefix}`}
              >
                Revoke
              </Button>
            </div>
          ),
      },
    ],
    [],
  );

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Secret keys authenticate your server&apos;s calls to the FluxPay API in {mode} mode.
        </p>
        <Button onClick={onCreate} disabled={create.isPending}>
          <Plus /> Create key
        </Button>
      </div>
      {keys.error ? (
        <ErrorState error={keys.error} onRetry={() => keys.refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={keys.data?.data ?? []}
          getRowId={(k) => k.id}
          isLoading={keys.isPending}
          emptyMessage="No API keys yet."
        />
      )}
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending?.kind === 'roll' ? 'Roll this key?' : 'Revoke this key?'}
        description={
          pending?.kind === 'roll'
            ? 'The current key stops working immediately and a new one is issued.'
            : 'Requests using this key will be rejected immediately. This cannot be undone.'
        }
        confirmLabel={pending?.kind === 'roll' ? 'Roll key' : 'Revoke key'}
        destructive
        onConfirm={onConfirm}
      />
      <SecretRevealDialog revealed={revealed} onDone={() => setRevealed(null)} />
    </section>
  );
}
