import type { Role } from '../api/authApi';

/** Query key for the signed-in user. */
export const meKey = ['auth', 'me'] as const;

/** Home route for a role. */
export function homeFor(role: Role): string {
  return role === 'platform_admin' ? '/admin' : '/dashboard';
}
