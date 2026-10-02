/** One field-level problem from a 422 response. */
export interface ApiErrorDetail {
  field: string | null;
  code: string;
  message: string;
}

/** Error thrown by the API client for any non-2xx response. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: ApiErrorDetail[] = [],
    readonly traceId: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
