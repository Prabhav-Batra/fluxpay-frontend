import { apiFetch } from '@/lib/api/client';
import type { ListResponse, Mode } from '@/lib/api/types';

/** A reusable no-code checkout link (`plink_…`) for one product. */
export interface PaymentLink {
  id: string;
  mode: Mode;
  product_id: string;
  slug: string;
  url: string;
  success_url: string | null;
  cancel_url: string | null;
  active: boolean;
  created_at: string;
}

/** Minimal product data the payment-link screens need. */
export interface ProductOption {
  id: string;
  name: string;
  amount: number;
  active: boolean;
}

export interface CreatePaymentLinkBody {
  product_id: string;
  success_url?: string;
  cancel_url?: string;
}

export function listPaymentLinks(
  mode: Mode,
  startingAfter?: string,
): Promise<ListResponse<PaymentLink>> {
  return apiFetch('/dashboard/payment_links', {
    mode,
    query: { starting_after: startingAfter, limit: 50 },
  });
}

/** First 100 products (any status) for naming links and picking a product. */
export async function listProductOptions(mode: Mode): Promise<ProductOption[]> {
  const page = await apiFetch<ListResponse<ProductOption>>('/dashboard/products', {
    mode,
    query: { limit: 100 },
  });
  return page.data.map(({ id, name, amount, active }) => ({ id, name, amount, active }));
}

export function createPaymentLink(mode: Mode, body: CreatePaymentLinkBody): Promise<PaymentLink> {
  return apiFetch('/dashboard/payment_links', { method: 'POST', mode, body });
}

export function setPaymentLinkActive(mode: Mode, id: string, active: boolean): Promise<PaymentLink> {
  return apiFetch(`/dashboard/payment_links/${id}`, { method: 'PATCH', mode, body: { active } });
}
