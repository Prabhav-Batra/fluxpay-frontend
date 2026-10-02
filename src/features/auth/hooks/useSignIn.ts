'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { safeNext } from '@/lib/safeNext';

import type { Me } from '../api/authApi';
import { homeFor, meKey } from './authKeys';

/**
 * Wraps a login or signup call: caches the returned user and redirects to `?next`
 * (when safe) or the role's home.
 */
export function useSignIn<TBody>(action: (body: TBody) => Promise<Me>) {
  const client = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();
  return useMutation({
    mutationFn: (body: TBody) => action(body),
    onSuccess: (me) => {
      client.setQueryData(meKey, me);
      router.replace(safeNext(params.get('next')) ?? homeFor(me.role));
    },
  });
}
