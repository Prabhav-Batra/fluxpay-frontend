import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SaleDetail } from '../api/salesApi';
import { SaleDetailView } from './SaleDetailView';

const sale: SaleDetail = {
  id: 'sale_1',
  mode: 'test',
  product_id: 'prod_1',
  checkout_session_id: 'cs_1',
  customer_ref: 'player_42',
  amount: 49_900,
  refunded_amount: 10_000,
  currency: 'INR',
  status: 'partially_refunded',
  metadata: { coins: '100' },
  created_at: '2026-10-01T10:00:00Z',
  payment: { gateway_payment_id: 'pay_RZP1', method: 'upi', gateway_fee: 1_178, status: 'captured' },
};

describe('SaleDetailView', () => {
  it('should_render_amounts_status_and_payment', () => {
    render(<SaleDetailView sale={sale} productName="Coin pack" />);
    expect(screen.getByText('₹499.00')).toBeInTheDocument();
    expect(screen.getByText('₹100.00')).toBeInTheDocument();
    expect(screen.getByText('Partially refunded')).toBeInTheDocument();
    expect(screen.getByText('player_42')).toBeInTheDocument();
    expect(screen.getByText('pay_RZP1')).toBeInTheDocument();
    expect(screen.getByText('UPI')).toBeInTheDocument();
    expect(screen.getByText('₹11.78')).toBeInTheDocument();
    expect(screen.getByText('Coin pack')).toBeInTheDocument();
    expect(screen.getByText('coins')).toBeInTheDocument();
  });
});
