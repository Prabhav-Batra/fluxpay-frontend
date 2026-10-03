import { apiFetch } from '@/lib/api/client';
import type { ListResponse } from '@/lib/api/types';
import type { Merchant } from '@/features/settings/api/settingsApi';
import type { Mode } from '@/lib/api/types';

export interface AdminMerchantDetail {
  merchant: Merchant;
  balances: {
    test: BalanceResponse;
    live: BalanceResponse;
  };
}

export interface BalanceResponse {
  available: number;
  gross: number;
  platform_fees: number;
  gateway_fees: number;
  refunds: number;
  payouts: number;
}

export interface Payout {
  id: string;
  mode: Mode;
  amount: number;
  currency: string;
  reference: string;
  paid_at: string;
  recorded_by: string;
  created_at: string;
}

export interface UpdateAdminMerchantBody {
  platform_fee_bps?: number;
  status?: 'active' | 'suspended';
}

export interface RecordPayoutBody {
  mode: Mode;
  amount: number;
  reference: string;
  paid_at?: string;
}

export function listAdminMerchants(cursor?: string): Promise<ListResponse<Merchant>> {
  return apiFetch('/admin/merchants', { query: cursor ? { starting_after: cursor } : {} });
}

export function getAdminMerchant(id: string): Promise<AdminMerchantDetail> {
  return apiFetch(`/admin/merchants/${id}`);
}

export function updateAdminMerchant(id: string, body: UpdateAdminMerchantBody): Promise<Merchant> {
  return apiFetch(`/admin/merchants/${id}`, { method: 'PATCH', body });
}

export function recordAdminPayout(id: string, body: RecordPayoutBody): Promise<Payout> {
  return apiFetch(`/admin/merchants/${id}/payouts`, { method: 'POST', body });
}

export function listAdminPayouts(id: string, mode: Mode, cursor?: string): Promise<ListResponse<Payout>> {
  return apiFetch(`/admin/merchants/${id}/payouts`, { query: { mode, ...(cursor ? { starting_after: cursor } : {}) } });
}
