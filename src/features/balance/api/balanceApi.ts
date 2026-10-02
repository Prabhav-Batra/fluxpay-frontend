import { apiFetch } from '@/lib/api/client';
import type { ListResponse, Mode } from '@/lib/api/types';

/** Merchant balance totals in paise. */
export interface Balance {
  gross_sales: number;
  platform_fees: number;
  gateway_fees: number;
  refunds: number;
  payouts: number;
  available: number;
  currency: string;
}

export type LedgerEntryType = 'sale_gross' | 'platform_fee' | 'gateway_fee' | 'refund' | 'payout';

/** One signed ledger movement (`le_…`); debits are negative. */
export interface LedgerEntry {
  id: string;
  mode: Mode;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  sale_id: string | null;
  created_at: string;
}

export function getBalance(mode: Mode): Promise<Balance> {
  return apiFetch('/dashboard/balance', { mode });
}

export function listLedgerEntries(
  mode: Mode,
  startingAfter?: string,
): Promise<ListResponse<LedgerEntry>> {
  return apiFetch('/dashboard/ledger_entries', {
    mode,
    query: { starting_after: startingAfter, limit: 50 },
  });
}
