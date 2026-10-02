'use client';

import { useState } from 'react';

import { ErrorState } from '@/components/ErrorState';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { PageHeader } from '@/components/PageHeader';
import { useProductOptions } from '@/lib/hooks/useProductOptions';

import type { SalesFilters } from '../api/salesApi';
import { useSales } from '../hooks/useSales';
import { SalesFiltersBar } from './SalesFiltersBar';
import { SalesTable } from './SalesTable';

const NO_FILTERS: SalesFilters = { status: 'all', productId: 'all', customerRef: '' };

/** Sales screen with filters and cursor pagination. */
export function SalesPage() {
  const [filters, setFilters] = useState<SalesFilters>(NO_FILTERS);
  const list = useSales(filters);
  const products = useProductOptions();

  return (
    <>
      <PageHeader title="Sales" description="Every completed purchase, newest first." />
      <SalesFiltersBar filters={filters} products={products.data ?? []} onChange={setFilters} />
      {list.error ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : (
        <>
          <SalesTable sales={list.items} products={products.data ?? []} isLoading={list.isLoading} />
          <LoadMoreButton hasMore={list.hasMore} isLoading={list.isLoadingMore} onLoadMore={list.loadMore} />
        </>
      )}
    </>
  );
}
