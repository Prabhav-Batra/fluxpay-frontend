import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';
import { renderWithClient } from '@/test/render';

import { createProduct, updateProduct, type Product } from '../api/productsApi';
import { ProductFormDialog } from './ProductFormDialog';

vi.mock('../api/productsApi', () => ({ createProduct: vi.fn(), updateProduct: vi.fn() }));

const product: Product = {
  id: 'prod_1', mode: 'test', name: 'Coin pack', description: null, image_url: null,
  amount: 49_900, currency: 'INR', type: 'one_time', metadata: {}, active: true,
  created_at: '2026-10-01T00:00:00Z', updated_at: '2026-10-01T00:00:00Z',
};

describe('ProductFormDialog', () => {
  beforeEach(() => {
    vi.mocked(createProduct).mockReset();
    vi.mocked(updateProduct).mockReset();
  });

  it('should_create_product_with_paise_amount_and_close', async () => {
    const onOpenChange = vi.fn();
    vi.mocked(createProduct).mockResolvedValue(product);
    renderWithClient(<ProductFormDialog open onOpenChange={onOpenChange} />);
    await userEvent.type(screen.getByLabelText(/^name/i), 'Coin pack');
    await userEvent.type(screen.getByLabelText(/price/i), '499.50');
    await userEvent.click(screen.getByRole('button', { name: /create product/i }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(createProduct).toHaveBeenCalledWith('test', { name: 'Coin pack', amount: 49_950 });
  });

  it('should_show_price_error_and_not_submit_when_below_minimum', async () => {
    renderWithClient(<ProductFormDialog open onOpenChange={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/^name/i), 'Tiny');
    await userEvent.type(screen.getByLabelText(/price/i), '0.50');
    await userEvent.click(screen.getByRole('button', { name: /create product/i }));
    expect(await screen.findByText('Minimum price is ₹1.00')).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it('should_patch_only_changed_fields_when_editing', async () => {
    vi.mocked(updateProduct).mockResolvedValue(product);
    renderWithClient(<ProductFormDialog open onOpenChange={vi.fn()} product={product} />);
    const name = screen.getByLabelText(/^name/i);
    await userEvent.clear(name);
    await userEvent.type(name, 'Mega pack');
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    await waitFor(() =>
      expect(updateProduct).toHaveBeenCalledWith('test', 'prod_1', { name: 'Mega pack' }),
    );
  });

  it('should_show_server_field_error_when_rejected', async () => {
    vi.mocked(createProduct).mockRejectedValue(
      new ApiError(422, 'VALIDATION_FAILED', 'Invalid', [
        { field: 'name', code: 'INVALID', message: 'name is taken' },
      ]),
    );
    renderWithClient(<ProductFormDialog open onOpenChange={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/^name/i), 'Dup');
    await userEvent.type(screen.getByLabelText(/price/i), '10');
    await userEvent.click(screen.getByRole('button', { name: /create product/i }));
    expect(await screen.findByText('name is taken')).toBeInTheDocument();
  });
});
