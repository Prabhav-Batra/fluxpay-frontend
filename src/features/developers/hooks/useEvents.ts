'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { modeKey } from '@/lib/api/queryKeys';
import { useCursorList } from '@/lib/hooks/useCursorList';
import { useMode } from '@/lib/mode/useMode';

import { getEvent, listEvents, resendEvent } from '../api/developersApi';

export function useEvents() {
  const { mode } = useMode();
  return useCursorList(modeKey('events', mode), (cursor) => listEvents(mode, cursor));
}

export function useEvent(id: string | null) {
  const { mode } = useMode();
  return useQuery({
    queryKey: modeKey('events', mode, 'detail', id),
    queryFn: () => getEvent(mode, id!),
    enabled: id !== null,
  });
}

export function useResendEvent() {
  const { mode } = useMode();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resendEvent(mode, id),
    onSuccess: () => client.invalidateQueries({ queryKey: ['events'] }),
  });
}
