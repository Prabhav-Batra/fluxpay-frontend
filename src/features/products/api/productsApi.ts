import { apiFetch } from '@/lib/api/client';
import type { ListResponse, Mode } from '@/lib/api/types';

/** A one-time product a merchant sells (`prod_…`). */
export interface Product {
  id: string;
  mode: Mode;
  name: string;
  description: string | null;
  image_url: string | null;
  amount: number;
  currency: string;
  type: 'one_time';
  metadata: Record<string, string>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductBody {
  name: string;
  amount: number;
  description?: string;
  image_url?: string;
  metadata?: Record<string, string>;
}

/** PATCH body; empty strings clear description and image. */
export type UpdateProductBody = Partial<{
  name: string;
  description: string;
  image_url: string;
  amount: number;
  metadata: Record<string, string>;
  active: boolean;
}>;

/** Lists products; `active` filters by status when set. */
export function listProducts(
  mode: Mode,
  params: { active?: boolean; startingAfter?: string },
): Promise<ListResponse<Product>> {
  return apiFetch('/dashboard/products', {
    mode,
    query: { active: params.active, starting_after: params.startingAfter, limit: 50 },
  });
}

export function createProduct(mode: Mode, body: CreateProductBody): Promise<Product> {
  return apiFetch('/dashboard/products', { method: 'POST', mode, body });
}

export function updateProduct(mode: Mode, id: string, body: UpdateProductBody): Promise<Product> {
  return apiFetch(`/dashboard/products/${id}`, { method: 'PATCH', mode, body });
}
