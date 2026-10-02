import { describe, expect, it } from 'vitest';

import { loginRedirectFor } from './middleware';

describe('loginRedirectFor', () => {
  it('should_redirect_to_login_with_next_when_no_session', () => {
    expect(loginRedirectFor('/dashboard/sales', '?status=paid', false)).toBe(
      '/login?next=%2Fdashboard%2Fsales%3Fstatus%3Dpaid',
    );
  });

  it('should_allow_when_session_cookie_present', () => {
    expect(loginRedirectFor('/admin', '', true)).toBeNull();
  });
});
