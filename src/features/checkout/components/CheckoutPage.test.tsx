/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithClient } from '@/test/render';
import { CheckoutPage } from './CheckoutPage';
import { useCheckoutSession, useStartPayment } from '../hooks/useCheckout';
import type { PublicCheckoutSession, PaymentInstructions } from '../api/checkoutApi';

vi.mock('../hooks/useCheckout', () => ({
  useCheckoutSession: vi.fn(),
  useStartPayment: vi.fn(),
}));

const mockSession: PublicCheckoutSession = {
  id: 'cs_123',
  mode: 'test',
  status: 'active',
  amount: 50000,
  currency: 'INR',
  product: {
    name: 'Pro Subscription',
    description: 'Lifetime access',
    imageUrl: 'https://example.com/pro.png',
  },
  merchant: {
    name: 'Acme Corp',
    logoUrl: 'https://example.com/logo.png',
    brandColor: '#ff0000',
  },
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
  expiresAt: '2026-10-02T00:00:00Z',
};

const mockInstructions: PaymentInstructions = {
  gateway: 'razorpay',
  keyId: 'rzp_test_123',
  orderId: 'order_123',
  amount: 50000,
  currency: 'INR',
  merchantName: 'Acme Corp',
  productName: 'Pro Subscription',
};

describe('CheckoutPage', () => {
  const mutateAsync = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useStartPayment).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never);

    // Mock Razorpay on window
    const mockRazorpay = function(this: any, options: any) {
      this.on = vi.fn();
      this.open = vi.fn(() => {
        // Simulate immediate success
        options.handler();
      });
    } as any;
    (window as any).Razorpay = mockRazorpay;

    // We can't easily intercept the real loadScript dom injection, so we mock loadScript?
    // Since loadScript is internal to CheckoutPage, we can just intercept document.createElement
    // and immediately fire onload.
    vi.spyOn(document.head, 'appendChild').mockImplementation((el: any) => {
      if (el.tagName === 'SCRIPT') {
        setTimeout(() => {
          if (el.onload) el.onload();
        }, 0);
      }
      return el;
    });
  });

  it('renders loading state', () => {
    vi.mocked(useCheckoutSession).mockReturnValue({ isLoading: true } as never);
    renderWithClient(<CheckoutPage id="cs_123" />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument(); // FullPageSpinner
  });

  it('renders error state on 404', () => {
    vi.mocked(useCheckoutSession).mockReturnValue({ error: new Error('Not found') } as never);
    renderWithClient(<CheckoutPage id="cs_123" />);
    expect(screen.getByText('Checkout Unavailable')).toBeInTheDocument();
  });

  it('renders active checkout session details', () => {
    vi.mocked(useCheckoutSession).mockReturnValue({ data: mockSession } as never);
    renderWithClient(<CheckoutPage id="cs_123" />);
    
    expect(screen.getByText('Pro Subscription')).toBeInTheDocument();
    expect(screen.getByText('Lifetime access')).toBeInTheDocument();
    expect(screen.getByText('₹500.00')).toBeInTheDocument(); // 50000 paise
    expect(screen.getByRole('button', { name: 'Pay Now' })).toBeInTheDocument();
  });

  it('renders already paid state', () => {
    vi.mocked(useCheckoutSession).mockReturnValue({ 
      data: { ...mockSession, status: 'completed' } 
    } as never);
    renderWithClient(<CheckoutPage id="cs_123" />);
    
    expect(screen.getByText('Already Paid')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pay Now' })).not.toBeInTheDocument();
  });

  it('renders expired state', () => {
    vi.mocked(useCheckoutSession).mockReturnValue({ 
      data: { ...mockSession, status: 'expired' } 
    } as never);
    renderWithClient(<CheckoutPage id="cs_123" />);
    
    expect(screen.getByText('Session Expired')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pay Now' })).not.toBeInTheDocument();
  });

  it('handles successful payment flow', async () => {
    vi.mocked(useCheckoutSession).mockReturnValue({ data: mockSession } as never);
    mutateAsync.mockResolvedValueOnce(mockInstructions);

    // Mock window.location.href setter
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { href: '' } as any;

    renderWithClient(<CheckoutPage id="cs_123" />);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Pay Now' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith('cs_123');
    });

    await waitFor(() => {
      expect(window.location.href).toBe('https://example.com/success');
    });

    // Restore window.location
    window.location = originalLocation;
  });
});
