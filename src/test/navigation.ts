import { vi } from 'vitest';

/** Shared next/navigation mock state; reset per test via `resetNavigation`. */
export const navigation = {
  replace: vi.fn(),
  push: vi.fn(),
  pathname: '/dashboard',
  search: new URLSearchParams(),
};

export function resetNavigation(pathname = '/dashboard', search = '') {
  navigation.replace.mockReset();
  navigation.push.mockReset();
  navigation.pathname = pathname;
  navigation.search = new URLSearchParams(search);
}

/** Factory for `vi.mock('next/navigation', () => navigationMock())`. */
export function navigationMock() {
  return {
    useRouter: () => ({ replace: navigation.replace, push: navigation.push, refresh: vi.fn() }),
    usePathname: () => navigation.pathname,
    useSearchParams: () => navigation.search,
  };
}
