import { apiFetch } from '@/lib/api/client';
import { ApiError } from '@/lib/api/errors';

/** Dashboard user role. */
export type Role = 'merchant_owner' | 'platform_admin';

/** The signed-in dashboard user (`GET /auth/me`). */
export interface Me {
  id: string;
  email: string;
  role: Role;
  merchant_id: string | null;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignupBody {
  business_name: string;
  email: string;
  password: string;
}

/** Returns the current user, or null when there is no valid session. */
export async function fetchMe(): Promise<Me | null> {
  try {
    return await apiFetch<Me>('/auth/me', { ignoreUnauthorized: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

/** Starts a session with email and password. */
export function login(body: LoginBody): Promise<Me> {
  return apiFetch<Me>('/auth/login', { method: 'POST', body, ignoreUnauthorized: true });
}

/** Creates a merchant and its owner login, and starts a session. */
export function signup(body: SignupBody): Promise<Me> {
  return apiFetch<Me>('/auth/signup', { method: 'POST', body });
}

/** Ends the current session. */
export function logout(): Promise<void> {
  return apiFetch<void>('/auth/logout', { method: 'POST', ignoreUnauthorized: true });
}
