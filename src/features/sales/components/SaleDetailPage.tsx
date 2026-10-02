'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductOptions } from '@/lib/hooks/useProductOptions';

import { useSale } from '../hooks/useSales';
import { SaleDetailView } from './SaleDetailView';

/** Sale detail screen for `/dashboard/sales/[id]`. */
export function SaleDetailPage({ id }: { id: string }) {
  const sale = useSale(id);
  const products = useProductOptions();
  const productName = products.data?.find((p) => p.id === sale.data?.product_id)?.name;

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
        <Link href="/dashboard/sales">
          <ArrowLeft /> Sales
        </Link>
      </Button>
      <PageHeader title="Sale details" />
      {sale.error && <ErrorState error={sale.error} onRetry={() => sale.refetch()} />}
      {sale.isPending && <Skeleton className="h-64 w-full" />}
      {sale.data && <SaleDetailView sale={sale.data} productName={productName} />}
    </>
  );
}
