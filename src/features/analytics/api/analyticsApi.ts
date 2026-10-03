import { apiFetch } from '@/lib/api/client';

export interface AnalyticsSummary {
  from: string;
  to: string;
  currency: string;
  gross_sales: number;
  refunds: number;
  platform_fees: number;
  gateway_fees: number;
  net: number;
  sales_count: number;
}

export interface DayResponse {
  date: string;
  revenue: number;
  sales_count: number;
}

export interface TimeseriesResponse {
  from: string;
  to: string;
  currency: string;
  data: DayResponse[];
}

export interface ProductResponse {
  product_id: string;
  units: number;
  revenue: number;
}

export interface TopProductsResponse {
  currency: string;
  data: ProductResponse[];
}

interface AnalyticsParams {
  from?: string;
  to?: string;
}

export function fetchSummary(params?: AnalyticsParams): Promise<AnalyticsSummary> {
  return apiFetch<AnalyticsSummary>('/dashboard/analytics/summary', { query: params as Record<string, string> });
}

export function fetchTimeseries(params?: AnalyticsParams): Promise<TimeseriesResponse> {
  return apiFetch<TimeseriesResponse>('/dashboard/analytics/timeseries', { query: params as Record<string, string> });
}

export function fetchTopProducts(params?: AnalyticsParams & { limit?: string }): Promise<TopProductsResponse> {
  return apiFetch<TopProductsResponse>('/dashboard/analytics/top_products', { query: params as Record<string, string> });
}
