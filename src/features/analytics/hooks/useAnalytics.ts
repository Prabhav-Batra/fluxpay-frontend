import { useQuery } from '@tanstack/react-query';
import { useMode } from '@/lib/mode/useMode';
import { fetchSummary, fetchTimeseries, fetchTopProducts } from '../api/analyticsApi';
import { analyticsKeys } from './analyticsKeys';

export function useAnalyticsSummary(params: { from?: string; to?: string }) {
  const { mode } = useMode();
  return useQuery({
    queryKey: analyticsKeys.summary({ ...params, mode }),
    queryFn: () => fetchSummary(params),
  });
}

export function useAnalyticsTimeseries(params: { from?: string; to?: string }) {
  const { mode } = useMode();
  return useQuery({
    queryKey: analyticsKeys.timeseries({ ...params, mode }),
    queryFn: () => fetchTimeseries(params),
  });
}

export function useAnalyticsTopProducts(params: { from?: string; to?: string }) {
  const { mode } = useMode();
  return useQuery({
    queryKey: analyticsKeys.topProducts({ ...params, mode }),
    queryFn: () => fetchTopProducts(params),
  });
}
