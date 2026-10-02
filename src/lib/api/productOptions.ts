import { apiFetch } from './client';
import type { ListResponse, Mode } from './types';

/** Minimal product data other screens need to name or pick products. */
export interface ProductOption {
  id: string;
  name: string;
  amount: number;
  active: boolean;
}

/** First 100 products (any status) in a mode. */
export async function listProductOptions(mode: Mode): Promise<ProductOption[]> {
  const page = await apiFetch<ListResponse<ProductOption>>('/dashboard/products', {
    mode,
    query: { limit: 100 },
  });
  return page.data.map(({ id, name, amount, active }) => ({ id, name, amount, active }));
}
