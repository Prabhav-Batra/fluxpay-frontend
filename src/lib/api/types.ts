/** Test or live data partition, sent as the `FluxPay-Mode` header. */
export type Mode = 'test' | 'live';

/** Cursor-paginated list envelope returned by every list endpoint. */
export interface ListResponse<T> {
  data: T[];
  cursor: string | null;
  has_more: boolean;
}

/** Error envelope returned by the backend for every non-2xx response. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: { field: string | null; code: string; message: string }[];
    trace_id?: string | null;
  };
}
