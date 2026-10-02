'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { ErrorState } from '@/components/ErrorState';
import { FullPageSpinner } from '@/components/FullPageSpinner';
import { setUnauthorizedHandler } from '@/lib/api/client';

import type { Role } from '../api/authApi';
import { homeFor, meKey } from '../hooks/authKeys';
import { useMe } from '../hooks/useMe';

interface AuthGuardProps {
  role: Role;
  children: ReactNode;
}

/**
 * Renders children only for a signed-in user with `role`. Signed-out users go to
 * `/login?next=…`; other roles go to their own home. Any later 401 does the same.
 */
export function AuthGuard({ role, children }: AuthGuardProps) {
  const me = useMe();
  const client = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const loginUrl = `/login?next=${encodeURIComponent(pathname + (search ? `?${search}` : ''))}`;

  useEffect(() => {
    setUnauthorizedHandler(() => {
      client.setQueryData(meKey, null);
    });
    return () => setUnauthorizedHandler(null);
  }, [client]);

  const user = me.data;
  useEffect(() => {
    if (me.isPending || me.isError) return;
    if (!user) router.replace(loginUrl);
    else if (user.role !== role) router.replace(homeFor(user.role));
  }, [me.isPending, me.isError, user, role, router, loginUrl]);

  if (me.isError) return <div className="p-6"><ErrorState error={me.error} onRetry={() => me.refetch()} /></div>;
  if (!user || user.role !== role) return <FullPageSpinner />;
  return <>{children}</>;
}
