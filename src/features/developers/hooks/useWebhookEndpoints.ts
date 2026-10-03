'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { modeKey } from '@/lib/api/queryKeys';
import { useMode } from '@/lib/mode/useMode';

import {
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  listWebhookEndpoints,
  rollWebhookSecret,
  sendTestEvent,
  updateWebhookEndpoint,
} from '../api/developersApi';

export function useWebhookEndpoints() {
  const { mode } = useMode();
  return useQuery({
    queryKey: modeKey('webhook-endpoints', mode),
    queryFn: () => listWebhookEndpoints(mode),
  });
}

/** Endpoint mutations; secrets go to the caller's `onSuccess`, never the cache. */
export function useWebhookEndpointMutations() {
  const { mode } = useMode();
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: ['webhook-endpoints'] });
  return {
    create: useMutation({
      mutationFn: (url: string) => createWebhookEndpoint(mode, { url }),
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: ({ id, ...body }: { id: string; url?: string; enabled?: boolean }) =>
        updateWebhookEndpoint(mode, id, body),
      onSuccess: refresh,
    }),
    rollSecret: useMutation({ mutationFn: (id: string) => rollWebhookSecret(mode, id) }),
    remove: useMutation({ mutationFn: (id: string) => deleteWebhookEndpoint(mode, id), onSuccess: refresh }),
    sendTest: useMutation({
      mutationFn: (id: string) => sendTestEvent(mode, id),
      onSuccess: () => client.invalidateQueries({ queryKey: ['events'] }),
    }),
  };
}
