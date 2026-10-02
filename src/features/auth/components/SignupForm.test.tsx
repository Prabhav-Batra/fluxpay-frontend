import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';
import { navigation, navigationMock, resetNavigation } from '@/test/navigation';
import { renderWithClient } from '@/test/render';

import { signup } from '../api/authApi';
import { SignupForm } from './SignupForm';

vi.mock('next/navigation', () => navigationMock());
vi.mock('../api/authApi', () => ({ signup: vi.fn() }));

async function fill(password = 'long-enough-pw') {
  await userEvent.type(screen.getByLabelText(/business name/i), 'Jextter');
  await userEvent.type(screen.getByLabelText(/email/i), 'owner@jextter.in');
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole('button', { name: /create account/i }));
}

describe('SignupForm', () => {
  beforeEach(() => {
    resetNavigation('/signup');
    vi.mocked(signup).mockReset();
  });

  it('should_reject_short_password_when_under_10_chars', async () => {
    renderWithClient(<SignupForm />);
    await fill('short');
    expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
    expect(signup).not.toHaveBeenCalled();
  });

  it('should_reject_password_when_over_72_bytes', async () => {
    renderWithClient(<SignupForm />);
    await fill('ä'.repeat(37));
    expect(await screen.findByText(/too long/i)).toBeInTheDocument();
  });

  it('should_create_account_and_open_dashboard_when_valid', async () => {
    vi.mocked(signup).mockResolvedValue({
      id: 'usr_1', email: 'owner@jextter.in', role: 'merchant_owner', merchant_id: 'mer_1',
    });
    renderWithClient(<SignupForm />);
    await fill();
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/dashboard'));
    expect(signup).toHaveBeenCalledWith({
      business_name: 'Jextter', email: 'owner@jextter.in', password: 'long-enough-pw',
    });
  });

  it('should_map_server_field_errors_when_422', async () => {
    vi.mocked(signup).mockRejectedValue(
      new ApiError(422, 'VALIDATION_FAILED', 'Invalid', [
        { field: 'business_name', code: 'INVALID', message: 'is reserved' },
      ]),
    );
    renderWithClient(<SignupForm />);
    await fill();
    expect(await screen.findByText('is reserved')).toBeInTheDocument();
  });

  it('should_flag_email_when_already_taken', async () => {
    vi.mocked(signup).mockRejectedValue(
      new ApiError(409, 'EMAIL_TAKEN', 'An account with this email already exists'),
    );
    renderWithClient(<SignupForm />);
    await fill();
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
  });
});
