'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { modeKey } from '@/lib/api/queryKeys';
import { useCursorList } from '@/lib/hooks/useCursorList';
import { useMode } from '@/lib/mode/useMode';

import {
  createPaymentLink,
  listPaymentLinks,
  setPaymentLinkActive,
  type CreatePaymentLinkBody,
} from '../api/paymentLinksApi';

export function usePaymentLinks() {
  const { mode } = useMode();
  return useCursorList(modeKey('payment-links', mode), (cursor) => listPaymentLinks(mode, cursor));
}

export function useCreatePaymentLink() {
  const { mode } = useMode();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePaymentLinkBody) => createPaymentLink(mode, body),
    onSuccess: () => client.invalidateQueries({ queryKey: ['payment-links'] }),
  });
}

export function useSetPaymentLinkActive() {
  const { mode } = useMode();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      setPaymentLinkActive(mode, id, active),
    onSuccess: () => client.invalidateQueries({ queryKey: ['payment-links'] }),
  });
}
