'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';

import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/dates';
import { formatPaise } from '@/lib/money';

import type { Product } from '../api/productsApi';

interface ProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}

/** Products with price, status and row actions. */
export function ProductsTable({ products, isLoading, onEdit, onToggleActive }: ProductsTableProps) {
  const columns = useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        header: 'Product',
        cell: ({ row }) => (
          <div className="grid max-w-xs gap-0.5">
            <span className="font-medium">{row.original.name}</span>
            {row.original.description && (
              <span className="text-muted-foreground truncate text-xs">
                {row.original.description}
              </span>
            )}
            <span className="text-muted-foreground font-mono text-xs">{row.original.id}</span>
          </div>
        ),
      },
      { header: 'Price', cell: ({ row }) => formatPaise(row.original.amount) },
      {
        header: 'Status',
        cell: ({ row }) =>
          row.original.active ? (
            <Badge variant="secondary">Active</Badge>
          ) : (
            <Badge variant="outline">Archived</Badge>
          ),
      },
      { header: 'Created', cell: ({ row }) => formatDate(row.original.created_at) },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions for ${row.original.name}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(row.original)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onToggleActive(row.original)}>
                {row.original.active ? 'Archive' : 'Unarchive'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onToggleActive],
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      getRowId={(p) => p.id}
      isLoading={isLoading}
      emptyMessage="No products yet. Create one to start selling."
    />
  );
}
