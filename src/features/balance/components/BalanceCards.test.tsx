import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BalanceCards } from './BalanceCards';

describe('BalanceCards', () => {
  it('should_format_every_figure_in_rupees', () => {
    render(
      <BalanceCards
        balance={{
          gross_sales: 1_000_000,
          platform_fees: 50_000,
          gateway_fees: 23_600,
          refunds: 10_000,
          payouts: 500_000,
          available: 416_400,
          currency: 'INR',
        }}
      />,
    );
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('₹4,164.00')).toBeInTheDocument();
    expect(screen.getByText('₹10,000.00')).toBeInTheDocument();
    expect(screen.getByText('₹236.00')).toBeInTheDocument();
  });
});
