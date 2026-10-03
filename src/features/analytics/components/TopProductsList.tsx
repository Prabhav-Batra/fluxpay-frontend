'use client';

import { useAnalyticsTopProducts } from '../hooks/useAnalytics';
import { useProducts } from '@/features/products/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPaise } from '@/lib/money';

interface TopProductsListProps {
  range: { from: string; to: string };
}

export function TopProductsList({ range }: TopProductsListProps) {
  const { data, isLoading, error } = useAnalyticsTopProducts(range);
  const { items: productsData, isLoading: productsLoading } = useProducts('all');

  if (error) {
    return <div className="text-destructive text-sm p-6 border rounded-xl">Failed to load top products.</div>;
  }

  const products = productsData ?? [];
  const getProductName = (id: string) => products.find((p) => p.id === id)?.name ?? id;

  return (
    <div className="rounded-xl border bg-card p-6 shadow flex flex-col gap-4">
      <h3 className="font-semibold leading-none tracking-tight">Top Products</h3>
      
      {isLoading || productsLoading || !data ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data.data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No sales in this period.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {data.data.map((item) => (
            <div key={item.product_id} className="flex items-center justify-between">
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm font-medium truncate">{getProductName(item.product_id)}</span>
                <span className="text-xs text-muted-foreground">{item.units} sales</span>
              </div>
              <div className="font-medium text-sm">{formatPaise(item.revenue)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
