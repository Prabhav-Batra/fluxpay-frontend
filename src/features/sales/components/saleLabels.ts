import type { SaleStatus } from '../api/salesApi';

export const SALE_STATUS_LABEL: Record<SaleStatus, string> = {
  paid: 'Paid',
  partially_refunded: 'Partially refunded',
  refunded: 'Refunded',
};

const METHOD_LABEL: Record<string, string> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Netbanking',
  wallet: 'Wallet',
  emi: 'EMI',
};

/** Human label for a Razorpay payment method code. */
export function paymentMethodLabel(method: string | null): string {
  if (!method) return '—';
  return METHOD_LABEL[method] ?? method;
}
