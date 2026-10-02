'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/dates';
import { formatPaise } from '@/lib/money';
import { cn } from '@/lib/utils';

import type { LedgerEntry, LedgerEntryType } from '../api/balanceApi';

const TYPE_LABEL: Record<LedgerEntryType, string> = {
  sale_gross: 'Sale',
  platform_fee: 'Platform fee',
  gateway_fee: 'Gateway fee',
  refund: 'Refund',
  payout: 'Payout',
};

const columns: ColumnDef<LedgerEntry, unknown>[] = [
  {
    header: 'Type',
    cell: ({ row }) => <Badge variant="outline">{TYPE_LABEL[row.original.type]}</Badge>,
  },
  {
    header: 'Amount',
    cell: ({ row }) => (
      <span className={cn('tabular-nums', row.original.amount < 0 && 'text-muted-foreground')}>
        {formatPaise(row.original.amount)}
      </span>
    ),
  },
  {
    header: 'Linked sale',
    cell: ({ row }) =>
      row.original.sale_id ? (
        <Link
          href={`/dashboard/sales/${row.original.sale_id}`}
          className="font-mono text-xs underline underline-offset-4"
        >
          {row.original.sale_id}
        </Link>
      ) : (
        '—'
      ),
  },
  { header: 'Date', cell: ({ row }) => formatDateTime(row.original.created_at) },
];

interface LedgerTableProps {
  entries: LedgerEntry[];
  isLoading?: boolean;
}

/** Signed ledger movements, newest first. */
export function LedgerTable({ entries, isLoading }: LedgerTableProps) {
  return (
    <DataTable
      columns={columns}
      data={entries}
      getRowId={(e) => e.id}
      isLoading={isLoading}
      emptyMessage="No ledger entries yet."
    />
  );
}
