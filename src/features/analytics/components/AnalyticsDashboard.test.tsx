import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithClient } from '@/test/render';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { useAnalyticsSummary, useAnalyticsTimeseries, useAnalyticsTopProducts } from '../hooks/useAnalytics';
import { useSales } from '@/features/sales/hooks/useSales';
import { useProducts } from '@/features/products/hooks/useProducts';
import { isoDay } from '@/lib/dates';

vi.mock('../hooks/useAnalytics', () => ({
  useAnalyticsSummary: vi.fn(),
  useAnalyticsTimeseries: vi.fn(),
  useAnalyticsTopProducts: vi.fn(),
}));

vi.mock('@/features/sales/hooks/useSales', () => ({
  useSales: vi.fn(),
}));

vi.mock('@/features/products/hooks/useProducts', () => ({
  useProducts: vi.fn(),
}));

const mockSummary = {
  from: '2023-01-01',
  to: '2023-01-07',
  currency: 'INR',
  gross_sales: 100000,
  refunds: 10000,
  platform_fees: 5000,
  gateway_fees: 2000,
  net: 83000,
  sales_count: 50,
};

describe('AnalyticsDashboard', () => {
  beforeEach(() => {
    vi.mocked(useAnalyticsSummary).mockReturnValue({ data: mockSummary } as never);
    vi.mocked(useAnalyticsTimeseries).mockReturnValue({ data: { data: [] } } as never);
    vi.mocked(useAnalyticsTopProducts).mockReturnValue({ data: { data: [] } } as never);
    vi.mocked(useSales).mockReturnValue({ data: { pages: [{ data: [] }] } } as never);
    vi.mocked(useProducts).mockReturnValue({ data: { pages: [{ data: [] }] } } as never);
    
    // Mock date to a fixed point for consistent testing if needed, though we can just check the DOM
  });

  it('renders KPI cards with summary data', () => {
    renderWithClient(<AnalyticsDashboard />);
    
    expect(screen.getByText('₹1,000.00')).toBeInTheDocument(); // 100000 paise
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('range presets produce the right from/to', async () => {
    renderWithClient(<AnalyticsDashboard />);
    
    const trigger = screen.getByRole('button', { name: /7d \(/i });
    await userEvent.click(trigger);
    
    const todayBtn = screen.getByRole('button', { name: 'Today' });
    await userEvent.click(todayBtn);
    
    const todayIso = isoDay(new Date());
    await waitFor(() => {
      expect(useAnalyticsSummary).toHaveBeenCalledWith({ from: todayIso, to: todayIso });
    });
  });

  it('inverted custom range is rejected', async () => {
    renderWithClient(<AnalyticsDashboard />);
    
    const trigger = screen.getByRole('button', { name: /7d \(/i });
    await userEvent.click(trigger);
    
    const fromInput = screen.getByLabelText('From');
    const toInput = screen.getByLabelText('To');
    
    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, '2023-01-10');
    
    await userEvent.clear(toInput);
    await userEvent.type(toInput, '2023-01-05');
    
    const applyBtn = screen.getByRole('button', { name: 'Apply' });
    await userEvent.click(applyBtn);
    
    expect(screen.getByText('Start date must be before or equal to end date')).toBeInTheDocument();
  });
});
