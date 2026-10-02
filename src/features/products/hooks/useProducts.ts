'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { modeKey } from '@/lib/api/queryKeys';
import { useCursorList } from '@/lib/hooks/useCursorList';
import { useMode } from '@/lib/mode/useMode';

import {
  createProduct,
  listProducts,
  updateProduct,
  type CreateProductBody,
  type UpdateProductBody,
} from '../api/productsApi';

/** Status filter for the products list. */
export type ProductFilter = 'active' | 'archived' | 'all';

const ACTIVE_PARAM: Record<ProductFilter, boolean | undefined> = {
  active: true,
  archived: false,
  all: undefined,
};

/** Paginated products in the current mode. */
export function useProducts(filter: ProductFilter) {
  const { mode } = useMode();
  return useCursorList(modeKey('products', mode, filter), (startingAfter) =>
    listProducts(mode, { active: ACTIVE_PARAM[filter], startingAfter }),
  );
}

/** Creates a product and refreshes product lists. */
export function useCreateProduct() {
  const { mode } = useMode();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductBody) => createProduct(mode, body),
    onSuccess: () => client.invalidateQueries({ queryKey: ['products'] }),
  });
}

/** Updates a product (fields or active flag) and refreshes product lists. */
export function useUpdateProduct() {
  const { mode } = useMode();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateProductBody }) =>
      updateProduct(mode, id, body),
    onSuccess: () => client.invalidateQueries({ queryKey: ['products'] }),
  });
}
