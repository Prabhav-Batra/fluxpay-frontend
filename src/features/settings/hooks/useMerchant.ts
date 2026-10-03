import { useQuery } from '@tanstack/react-query';
import { fetchMerchant } from '../api/settingsApi';
import { merchantKey } from './settingsKeys';

export function useMerchant() {
  return useQuery({
    queryKey: merchantKey,
    queryFn: fetchMerchant,
  });
}
