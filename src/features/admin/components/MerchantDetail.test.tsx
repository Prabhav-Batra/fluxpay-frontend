import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { renderWithClient } from '@/test/render';
import { MerchantDetail } from './MerchantDetail';
import { useAdminMerchantDetail, useAdminUpdateMerchant, useAdminRecordPayout, useAdminPayouts } from '../hooks/useAdmin';

vi.mock('../hooks/useAdmin', () => ({
  useAdminMerchantDetail: vi.fn(),
  useAdminUpdateMerchant: vi.fn(),
  useAdminRecordPayout: vi.fn(),
  useAdminPayouts: vi.fn(),
}));

const mockDetail = {
  merchant: {
    id: 'merch_1',
    business_name: 'Test',
    slug: 'test',
    logo_url: null,
    brand_color: null,
    platform_fee_bps: 200,
    status: 'active',
    created_at: '2023-01-01',
  },
  balances: {
    test: { available: 50000, gross: 50000, platform_fees: 0, gateway_fees: 0, refunds: 0, payouts: 0 },
    live: { available: 100000, gross: 100000, platform_fees: 0, gateway_fees: 0, refunds: 0, payouts: 0 },
  }
};

describe('MerchantDetail', () => {
  beforeEach(() => {
    vi.mocked(useAdminMerchantDetail).mockReturnValue({ data: mockDetail } as never);
    vi.mocked(useAdminUpdateMerchant).mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
    vi.mocked(useAdminRecordPayout).mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
    vi.mocked(useAdminPayouts).mockReturnValue({ items: [] } as never);
  });

  it('validates fee bounds', async () => {
    const mutate = vi.fn();
    vi.mocked(useAdminUpdateMerchant).mockReturnValue({ mutate, isPending: false } as never);

    renderWithClient(<MerchantDetail id="merch_1" />);
    
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '-1'); // negative
    
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mutate).not.toHaveBeenCalled();
    
    await userEvent.clear(input);
    await userEvent.type(input, '150'); // 15000 bps > 10000
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mutate).not.toHaveBeenCalled();
    
    await userEvent.clear(input);
    await userEvent.type(input, '5.5'); // 550 bps
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mutate).toHaveBeenCalledWith({ platform_fee_bps: 550 });
  });

  it('suspend needs confirmation', async () => {
    const mutate = vi.fn();
    vi.mocked(useAdminUpdateMerchant).mockReturnValue({ mutate, isPending: false } as never);

    renderWithClient(<MerchantDetail id="merch_1" />);
    
    await userEvent.click(screen.getByRole('button', { name: 'Suspend' }));
    
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    
    await userEvent.click(within(dialog).getByRole('button', { name: 'Suspend' }));
    expect(mutate).toHaveBeenCalledWith({ status: 'suspended' });
  });

  it('payout amount validates bounds and converts to paise', async () => {
    const mutate = vi.fn();
    vi.mocked(useAdminRecordPayout).mockReturnValue({ mutate, isPending: false } as never);

    renderWithClient(<MerchantDetail id="merch_1" />);
    
    const amountInput = screen.getByLabelText(/Amount/);
    const refInput = screen.getByLabelText(/Reference/);
    
    // Live available is 100000 paise (₹1000)
    await userEvent.type(amountInput, '1500'); // > ₹1000
    await userEvent.type(refInput, 'REF123');
    
    await userEvent.click(screen.getByRole('button', { name: 'Record Payout' }));
    
    expect(await screen.findByText(/Cannot exceed available balance/)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
    
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '500.5'); // ₹500.50
    await userEvent.click(screen.getByRole('button', { name: 'Record Payout' }));
    
    expect(mutate).toHaveBeenCalledWith(
      { mode: 'live', amount: 50050, reference: 'REF123' },
      expect.anything()
    );
  });
});
