import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithClient } from '@/test/render';
import { SettingsForm } from './SettingsForm';
import { useUpdateMerchant } from '../hooks/useUpdateMerchant';

vi.mock('../hooks/useUpdateMerchant', () => ({
  useUpdateMerchant: vi.fn(),
}));

const mockMerchant = {
  id: 'merch_123',
  business_name: 'Test Business',
  slug: 'test-business',
  logo_url: 'https://example.com/logo.png',
  brand_color: '#FF0000',
  platform_fee_bps: 200,
  status: 'active' as const,
  created_at: '2023-01-01T00:00:00Z',
};

describe('SettingsForm', () => {
  it('validates hex colors', async () => {
    const mutateAsync = vi.fn();
    vi.mocked(useUpdateMerchant).mockReturnValue({ mutateAsync } as never);

    renderWithClient(<SettingsForm merchant={mockMerchant} />);


    const colorInput = screen.getByLabelText(/Brand colour/i);
    await userEvent.clear(colorInput);
    await userEvent.type(colorInput, 'invalid-hex');

    // Trigger validation
    const submitButton = screen.getByRole('button', { name: /Save changes/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/must be a hex colour like #FF3366/i)).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('allows empty logo and clears the field', async () => {
    const mutateAsync = vi.fn();
    vi.mocked(useUpdateMerchant).mockReturnValue({ mutateAsync } as never);

    renderWithClient(<SettingsForm merchant={mockMerchant} />);

    const logoInput = screen.getByLabelText(/Logo URL/i);
    await userEvent.clear(logoInput);

    const submitButton = screen.getByRole('button', { name: /Save changes/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ logo_url: '' });
    });
  });

  it('only sends changed fields', async () => {
    const mutateAsync = vi.fn();
    vi.mocked(useUpdateMerchant).mockReturnValue({ mutateAsync } as never);

    renderWithClient(<SettingsForm merchant={mockMerchant} />);

    const nameInput = screen.getByLabelText(/Business name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Business Name');

    const submitButton = screen.getByRole('button', { name: /Save changes/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ business_name: 'New Business Name' });
    });
  });
});
