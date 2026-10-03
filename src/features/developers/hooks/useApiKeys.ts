'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { modeKey } from '@/lib/api/queryKeys';
import { useMode } from '@/lib/mode/useMode';

import { createApiKey, listApiKeys, revokeApiKey, rollApiKey } from '../api/developersApi';

export function useApiKeys() {
  const { mode } = useMode();
  return useQuery({ queryKey: modeKey('api-keys', mode), queryFn: () => listApiKeys(mode) });
}

/**
 * Create, roll and revoke mutations. Created/rolled secrets are handed to the caller's
 * `onSuccess` and never stored in the query cache.
 */
export function useApiKeyMutations() {
  const { mode } = useMode();
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: ['api-keys'] });
  return {
    create: useMutation({ mutationFn: () => createApiKey(mode), onSuccess: refresh }),
    roll: useMutation({ mutationFn: (id: string) => rollApiKey(mode, id), onSuccess: refresh }),
    revoke: useMutation({ mutationFn: (id: string) => revokeApiKey(mode, id), onSuccess: refresh }),
  };
}
