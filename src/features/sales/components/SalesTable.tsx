'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo } from 'react';

import { DataTable } from '@/components/DataTable';
import type { ProductOption } from '@/lib/api/productOptions';
import { formatDateTime } from '@/lib/dates';
import { formatPaise } from '@/lib/money';

import type { Sale } from '../api/salesApi';
import { SaleStatusBadge } from './SaleStatusBadge';

interface SalesTableProps {
  sales: Sale[];
  products: ProductOption[];
  isLoading?: boolean;
}

/** Sales with amount, status, product and customer reference; rows link to detail. */
export function SalesTable({ sales, products, isLoading }: SalesTableProps) {
  const columns = useMemo<ColumnDef<Sale, unknown>[]>(() => {
    const names = new Map(products.map((p) => [p.id, p.name]));
    return [
      {
        header: 'Amount',
        cell: ({ row }) => (
          <Link
            href={`/dashboard/sales/${row.original.id}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            {formatPaise(row.original.amount)}
          </Link>
        ),
      },
      { header: 'Status', cell: ({ row }) => <SaleStatusBadge status={row.original.status} /> },
      {
        header: 'Product',
        cell: ({ row }) => names.get(row.original.product_id) ?? row.original.product_id,
      },
      { header: 'Customer ref', cell: ({ row }) => row.original.customer_ref ?? '—' },
      { header: 'Date', cell: ({ row }) => formatDateTime(row.original.created_at) },
    ];
  }, [products]);

  return (
    <DataTable
      columns={columns}
      data={sales}
      getRowId={(s) => s.id}
      isLoading={isLoading}
      emptyMessage="No sales match these filters."
    />
  );
}
