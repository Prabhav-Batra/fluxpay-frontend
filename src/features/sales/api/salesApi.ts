import { apiFetch } from '@/lib/api/client';
import type { ListResponse, Mode } from '@/lib/api/types';

export type SaleStatus = 'paid' | 'partially_refunded' | 'refunded';

/** A completed purchase (`sale_…`). */
export interface Sale {
  id: string;
  mode: Mode;
  product_id: string;
  checkout_session_id: string;
  customer_ref: string | null;
  amount: number;
  refunded_amount: number;
  currency: string;
  status: SaleStatus;
  metadata: Record<string, string>;
  created_at: string;
}

/** A sale with its captured gateway payment. */
export interface SaleDetail extends Sale {
  payment: {
    gateway_payment_id: string;
    method: string | null;
    gateway_fee: number;
    status: 'captured' | 'amount_mismatch' | 'duplicate';
  };
}

/** Sales list filters as held by the screen; "all" means no filter. */
export interface SalesFilters {
  status: SaleStatus | 'all';
  productId: string;
  customerRef: string;
}

/** Converts screen filters to `/dashboard/sales` query params. */
export function salesQuery(filters: SalesFilters, startingAfter?: string) {
  const ref = filters.customerRef.trim();
  return {
    status: filters.status === 'all' ? undefined : filters.status,
    product_id: filters.productId === 'all' ? undefined : filters.productId,
    customer_ref: ref === '' ? undefined : ref,
    starting_after: startingAfter,
    limit: 50,
  };
}

export function listSales(
  mode: Mode,
  filters: SalesFilters,
  startingAfter?: string,
): Promise<ListResponse<Sale>> {
  return apiFetch('/dashboard/sales', { mode, query: salesQuery(filters, startingAfter) });
}

export function getSale(mode: Mode, id: string): Promise<SaleDetail> {
  return apiFetch(`/dashboard/sales/${id}`, { mode });
}
