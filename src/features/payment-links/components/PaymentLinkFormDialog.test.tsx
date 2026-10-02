import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithClient } from '@/test/render';

import { createPaymentLink } from '../api/paymentLinksApi';
import { PaymentLinkFormDialog } from './PaymentLinkFormDialog';

vi.mock('../api/paymentLinksApi', () => ({ createPaymentLink: vi.fn() }));

const products = [{ id: 'prod_1', name: 'Coin pack', amount: 49_900, active: true }];

describe('PaymentLinkFormDialog', () => {
  beforeEach(() => vi.mocked(createPaymentLink).mockReset());

  it('should_require_product_when_submitting', async () => {
    renderWithClient(<PaymentLinkFormDialog open onOpenChange={vi.fn()} products={products} />);
    await userEvent.click(screen.getByRole('button', { name: /create link/i }));
    expect(await screen.findByText(/choose a product/i)).toBeInTheDocument();
    expect(createPaymentLink).not.toHaveBeenCalled();
  });

  it('should_reject_invalid_redirect_url', async () => {
    renderWithClient(
      <PaymentLinkFormDialog open onOpenChange={vi.fn()} products={products} defaultProductId="prod_1" />,
    );
    await userEvent.type(screen.getByLabelText(/success url/i), 'not a url');
    await userEvent.click(screen.getByRole('button', { name: /create link/i }));
    expect(await screen.findByText(/enter a full url/i)).toBeInTheDocument();
  });

  it('should_create_link_with_optional_urls_omitted', async () => {
    const onOpenChange = vi.fn();
    vi.mocked(createPaymentLink).mockResolvedValue({} as never);
    renderWithClient(
      <PaymentLinkFormDialog open onOpenChange={onOpenChange} products={products} defaultProductId="prod_1" />,
    );
    await userEvent.click(screen.getByRole('button', { name: /create link/i }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(createPaymentLink).toHaveBeenCalledWith('test', { product_id: 'prod_1' });
  });
});
