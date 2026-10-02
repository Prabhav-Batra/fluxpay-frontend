'use client';

import { useQuery } from '@tanstack/react-query';

import { modeKey } from '@/lib/api/queryKeys';
import { useCursorList } from '@/lib/hooks/useCursorList';
import { useMode } from '@/lib/mode/useMode';

import { getSale, listSales, type SalesFilters } from '../api/salesApi';

/** Paginated sales matching `filters` in the current mode. */
export function useSales(filters: SalesFilters) {
  const { mode } = useMode();
  return useCursorList(modeKey('sales', mode, filters), (cursor) =>
    listSales(mode, filters, cursor),
  );
}

/** One sale with its payment. */
export function useSale(id: string) {
  const { mode } = useMode();
  return useQuery({ queryKey: modeKey('sales', mode, 'detail', id), queryFn: () => getSale(mode, id) });
}
