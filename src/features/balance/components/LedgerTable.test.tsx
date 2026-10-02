import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LedgerTable } from './LedgerTable';

describe('LedgerTable', () => {
  it('should_label_types_and_show_signed_amounts', () => {
    render(
      <LedgerTable
        entries={[
          { id: 'le_1', mode: 'test', type: 'sale_gross', amount: 49_900, currency: 'INR', sale_id: 'sale_1', created_at: '2026-10-01T10:00:00Z' },
          { id: 'le_2', mode: 'test', type: 'platform_fee', amount: -2_495, currency: 'INR', sale_id: 'sale_1', created_at: '2026-10-01T10:00:00Z' },
        ]}
      />,
    );
    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText('Platform fee')).toBeInTheDocument();
    expect(screen.getByText('-₹24.95')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'sale_1' })[0]).toHaveAttribute('href', '/dashboard/sales/sale_1');
  });
});
