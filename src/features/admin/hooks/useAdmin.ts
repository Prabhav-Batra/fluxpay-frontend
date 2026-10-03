import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCursorList } from '@/lib/hooks/useCursorList';
import { listAdminMerchants, getAdminMerchant, updateAdminMerchant, recordAdminPayout, listAdminPayouts, type UpdateAdminMerchantBody, type RecordPayoutBody } from '../api/adminApi';
import type { Mode } from '@/lib/api/types';
import { toast } from 'sonner';

export const adminKeys = {
  all: ['admin'] as const,
  merchants: () => [...adminKeys.all, 'merchants'] as const,
  merchantDetail: (id: string) => [...adminKeys.all, 'merchant', id] as const,
  payouts: (id: string, mode: Mode) => [...adminKeys.all, 'merchant', id, 'payouts', mode] as const,
};

export function useAdminMerchants() {
  return useCursorList(adminKeys.merchants(), listAdminMerchants);
}

export function useAdminMerchantDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.merchantDetail(id),
    queryFn: () => getAdminMerchant(id),
  });
}

export function useAdminUpdateMerchant(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateAdminMerchantBody) => updateAdminMerchant(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.merchantDetail(id) });
      toast.success('Merchant updated');
    },
    onError: () => toast.error('Failed to update merchant'),
  });
}

export function useAdminRecordPayout(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RecordPayoutBody) => recordAdminPayout(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.payouts(id, variables.mode) });
      queryClient.invalidateQueries({ queryKey: adminKeys.merchantDetail(id) });
      toast.success('Payout recorded');
    },
    onError: () => toast.error('Failed to record payout'),
  });
}

export function useAdminPayouts(id: string, mode: Mode) {
  return useCursorList(adminKeys.payouts(id, mode), (cursor) => listAdminPayouts(id, mode, cursor));
}
