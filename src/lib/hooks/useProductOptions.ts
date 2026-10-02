'use client';

import { useQuery } from '@tanstack/react-query';

import { listProductOptions } from '@/lib/api/productOptions';
import { modeKey } from '@/lib/api/queryKeys';
import { useMode } from '@/lib/mode/useMode';

/** Products in the current mode for name lookups and pickers. */
export function useProductOptions() {
  const { mode } = useMode();
  return useQuery({
    queryKey: modeKey('products', mode, 'options'),
    queryFn: () => listProductOptions(mode),
  });
}
