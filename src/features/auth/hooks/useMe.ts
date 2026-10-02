'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchMe } from '../api/authApi';
import { meKey } from './authKeys';

/** The signed-in user; `data` is null when signed out. */
export function useMe() {
  return useQuery({ queryKey: meKey, queryFn: fetchMe, staleTime: 5 * 60_000 });
}
