import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Product } from '../api/productsApi';
import { ProductsTable } from './ProductsTable';

const product: Product = {
  id: 'prod_1', mode: 'test', name: 'Coin pack', description: 'Gold coins', image_url: null,
  amount: 129_900, currency: 'INR', type: 'one_time', metadata: {}, active: false,
  created_at: '2026-10-01T00:00:00Z', updated_at: '2026-10-01T00:00:00Z',
};

describe('ProductsTable', () => {
  it('should_render_formatted_row', () => {
    render(<ProductsTable products={[product]} onEdit={vi.fn()} onToggleActive={vi.fn()} />);
    expect(screen.getByText('Coin pack')).toBeInTheDocument();
    expect(screen.getByText('₹1,299.00')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('should_render_empty_state_when_no_products', () => {
    render(<ProductsTable products={[]} onEdit={vi.fn()} onToggleActive={vi.fn()} />);
    expect(screen.getByText(/no products yet/i)).toBeInTheDocument();
  });
});
