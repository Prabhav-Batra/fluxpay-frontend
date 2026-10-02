import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';
import { navigation, navigationMock, resetNavigation } from '@/test/navigation';
import { renderWithClient } from '@/test/render';

import { login, type Me } from '../api/authApi';
import { LoginForm } from './LoginForm';

vi.mock('next/navigation', () => navigationMock());
vi.mock('../api/authApi', () => ({ login: vi.fn() }));

const merchant: Me = { id: 'usr_1', email: 'a@b.co', role: 'merchant_owner', merchant_id: 'mer_1' };

describe('LoginForm', () => {
  beforeEach(() => {
    resetNavigation('/login');
    vi.mocked(login).mockReset();
  });

  it('should_show_errors_when_fields_empty', async () => {
    renderWithClient(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your password/i)).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('should_submit_credentials_and_go_to_next_when_valid', async () => {
    navigation.search = new URLSearchParams('next=/dashboard/sales');
    vi.mocked(login).mockResolvedValue(merchant);
    renderWithClient(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), ' a@b.co ');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret-pass');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/dashboard/sales'));
    expect(login).toHaveBeenCalledWith({ email: 'a@b.co', password: 'secret-pass' });
  });

  it('should_send_admin_to_admin_home_when_no_next', async () => {
    vi.mocked(login).mockResolvedValue({ ...merchant, role: 'platform_admin', merchant_id: null });
    renderWithClient(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.co');
    await userEvent.type(screen.getByLabelText(/password/i), 'x');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/admin'));
  });

  it('should_show_invalid_credentials_when_server_returns_401', async () => {
    vi.mocked(login).mockRejectedValue(new ApiError(401, 'INVALID_CREDENTIALS', 'Bad'));
    renderWithClient(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.co');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
