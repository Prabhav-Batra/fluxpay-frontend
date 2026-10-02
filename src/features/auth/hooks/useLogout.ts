'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logout } from '../api/authApi';

/** Ends the session, drops all cached data and returns to the login page. */
export function useLogout() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      client.clear();
      router.replace('/login');
    },
  });
}
