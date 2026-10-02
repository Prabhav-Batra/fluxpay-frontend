import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';
import { navigation, navigationMock, resetNavigation } from '@/test/navigation';
import { renderWithClient } from '@/test/render';

import { fetchMe } from '../api/authApi';
import { AuthGuard } from './AuthGuard';

vi.mock('next/navigation', () => navigationMock());
vi.mock('../api/authApi', () => ({ fetchMe: vi.fn() }));

describe('AuthGuard', () => {
  beforeEach(() => {
    resetNavigation('/dashboard/sales', 'status=paid');
    vi.mocked(fetchMe).mockReset();
  });

  it('should_render_children_when_role_matches', async () => {
    vi.mocked(fetchMe).mockResolvedValue({
      id: 'usr_1', email: 'a@b.co', role: 'merchant_owner', merchant_id: 'mer_1',
    });
    renderWithClient(<AuthGuard role="merchant_owner"><p>secret</p></AuthGuard>);
    expect(await screen.findByText('secret')).toBeInTheDocument();
  });

  it('should_redirect_to_login_with_next_when_signed_out', async () => {
    vi.mocked(fetchMe).mockResolvedValue(null);
    renderWithClient(<AuthGuard role="merchant_owner"><p>secret</p></AuthGuard>);
    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith(
        '/login?next=%2Fdashboard%2Fsales%3Fstatus%3Dpaid',
      ),
    );
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('should_send_admin_home_when_role_differs', async () => {
    vi.mocked(fetchMe).mockResolvedValue({
      id: 'usr_2', email: 'root@fluxpay.in', role: 'platform_admin', merchant_id: null,
    });
    renderWithClient(<AuthGuard role="merchant_owner"><p>secret</p></AuthGuard>);
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/admin'));
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('should_show_error_with_retry_when_me_fails', async () => {
    vi.mocked(fetchMe).mockRejectedValue(new ApiError(502, 'HTTP_502', 'Unexpected server response.'));
    renderWithClient(<AuthGuard role="merchant_owner"><p>secret</p></AuthGuard>);
    expect(await screen.findByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
