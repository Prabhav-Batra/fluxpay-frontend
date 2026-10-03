export const analyticsKeys = {
  all: ['analytics'] as const,
  summary: (params: { from?: string; to?: string; mode: string }) => 
    [...analyticsKeys.all, 'summary', params] as const,
  timeseries: (params: { from?: string; to?: string; mode: string }) => 
    [...analyticsKeys.all, 'timeseries', params] as const,
  topProducts: (params: { from?: string; to?: string; mode: string }) => 
    [...analyticsKeys.all, 'topProducts', params] as const,
};
