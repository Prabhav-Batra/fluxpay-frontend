'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import { CopyButton } from '@/components/CopyButton';
import { DataTable } from '@/components/DataTable';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/lib/dates';

import type { PaymentLink, ProductOption } from '../api/paymentLinksApi';

interface PaymentLinksTableProps {
  links: PaymentLink[];
  products: ProductOption[];
  isLoading?: boolean;
  onToggleActive: (link: PaymentLink) => void;
}

/** Payment links with product name, copyable URL and an active switch. */
export function PaymentLinksTable({ links, products, isLoading, onToggleActive }: PaymentLinksTableProps) {
  const columns = useMemo<ColumnDef<PaymentLink, unknown>[]>(() => {
    const names = new Map(products.map((p) => [p.id, p.name]));
    return [
      {
        header: 'Product',
        cell: ({ row }) => names.get(row.original.product_id) ?? row.original.product_id,
      },
      {
        header: 'URL',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <a
              href={row.original.url}
              target="_blank"
              rel="noreferrer"
              className="max-w-64 truncate font-mono text-xs underline underline-offset-4"
            >
              {row.original.url}
            </a>
            <CopyButton value={row.original.url} label="Copy link URL" />
          </div>
        ),
      },
      {
        header: 'Active',
        cell: ({ row }) => (
          <Switch
            checked={row.original.active}
            onCheckedChange={() => onToggleActive(row.original)}
            aria-label={`Link ${row.original.slug} active`}
          />
        ),
      },
      { header: 'Created', cell: ({ row }) => formatDate(row.original.created_at) },
    ];
  }, [products, onToggleActive]);

  return (
    <DataTable
      columns={columns}
      data={links}
      getRowId={(l) => l.id}
      isLoading={isLoading}
      emptyMessage="No payment links yet."
    />
  );
}
