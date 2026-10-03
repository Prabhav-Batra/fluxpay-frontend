'use client';

import { useSales } from '@/features/sales/hooks/useSales';
import { useProducts } from '@/features/products/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPaise } from '@/lib/money';
import { formatDateTime } from '@/lib/dates';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function RecentSalesList() {
  const { items, isLoading, error } = useSales({ status: 'all', productId: 'all', customerRef: '' });
  const { items: productsData } = useProducts('all');

  if (error) {
    return <div className="text-destructive text-sm p-6 border rounded-xl">Failed to load recent sales.</div>;
  }

  const products = productsData ?? [];
  const getProductName = (id: string) => products.find((p) => p.id === id)?.name ?? id;

  const sales = items?.slice(0, 5) ?? [];

  return (
    <div className="rounded-xl border bg-card shadow flex flex-col gap-4 overflow-hidden">
      <div className="p-6 pb-0 flex items-center justify-between">
        <h3 className="font-semibold leading-none tracking-tight">Recent Sales</h3>
        <Link href="/dashboard/sales" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      
      {isLoading ? (
        <div className="p-6 pt-2">
          <Skeleton className="h-48 w-full" />
        </div>
      ) : sales.length === 0 ? (
        <p className="text-sm text-muted-foreground p-6 pt-2">No recent sales.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer Ref</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{formatPaise(sale.amount)}</TableCell>
                <TableCell>{getProductName(sale.product_id)}</TableCell>
                <TableCell className="text-muted-foreground">{sale.customer_ref}</TableCell>
                <TableCell>
                  <Badge variant={sale.status === 'paid' ? 'default' : 'secondary'}>
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatDateTime(sale.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
