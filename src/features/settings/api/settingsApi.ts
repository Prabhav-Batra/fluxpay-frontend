import { apiFetch } from '@/lib/api/client';

export interface Merchant {
  id: string;
  business_name: string;
  slug: string;
  logo_url: string | null;
  brand_color: string | null;
  platform_fee_bps: number;
  status: 'active' | 'suspended';
  created_at: string;
}

export interface UpdateMerchantPayload {
  business_name?: string;
  logo_url?: string;
  brand_color?: string;
}

export function fetchMerchant(): Promise<Merchant> {
  return apiFetch<Merchant>('/dashboard/merchant');
}

export function updateMerchant(payload: UpdateMerchantPayload): Promise<Merchant> {
  return apiFetch<Merchant>('/dashboard/merchant', {
    method: 'PATCH',
    body: payload,
  });
}
