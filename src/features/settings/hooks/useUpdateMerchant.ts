import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateMerchant } from '../api/settingsApi';
import { merchantKey } from './settingsKeys';

export function useUpdateMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMerchant,
    onSuccess: (updatedMerchant) => {
      queryClient.setQueryData(merchantKey, updatedMerchant);
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });
}
