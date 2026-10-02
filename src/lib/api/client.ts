import { ApiError } from './errors';
import type { ApiErrorBody, Mode } from './types';

const API_BASE = '/api/v1';
const CSRF_COOKIE = 'XSRF-TOKEN';
const CSRF_HEADER = 'X-XSRF-TOKEN';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

type QueryValue = string | number | boolean | null | undefined;

/** Options for {@link apiFetch}. */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  mode?: Mode;
  query?: Record<string, QueryValue>;
  /** Do not trigger the global 401 handler (login, `/auth/me`). */
  ignoreUnauthorized?: boolean;
}

let unauthorizedHandler: (() => void) | null = null;

/** Registers the callback run when any request gets a 401 (session expired). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

function readCookie(name: string): string | null {
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

async function fetchCsrfToken(): Promise<string> {
  const response = await send(`${API_BASE}/auth/csrf`, { credentials: 'same-origin' });
  const body = (await response.json()) as { token: string };
  return body.token;
}

async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Could not reach FluxPay. Check your connection.');
  }
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  const text = await response.text();
  try {
    const { error } = JSON.parse(text) as ApiErrorBody;
    if (error?.code) {
      return new ApiError(
        response.status,
        error.code,
        error.message,
        error.details ?? [],
        error.trace_id ?? null,
      );
    }
  } catch {
    // Not JSON (proxy or gateway page); fall through to a generic error.
  }
  return new ApiError(response.status, `HTTP_${response.status}`, 'Unexpected server response.');
}

/**
 * Calls the FluxPay backend through the same-origin `/api` proxy.
 * Adds the mode and CSRF headers, parses the error envelope into {@link ApiError},
 * and retries once with a fresh CSRF token when the server rejects it.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const mutating = !SAFE_METHODS.has(method);
  const url = buildUrl(path, options.query);

  const attempt = async (csrfToken: string | null): Promise<Response> => {
    const headers = new Headers({ Accept: 'application/json' });
    if (options.mode) headers.set('FluxPay-Mode', options.mode);
    if (options.body !== undefined) headers.set('Content-Type', 'application/json');
    if (csrfToken) headers.set(CSRF_HEADER, csrfToken);
    return send(url, {
      method,
      headers,
      credentials: 'same-origin',
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  };

  let token = mutating ? (readCookie(CSRF_COOKIE) ?? (await fetchCsrfToken())) : null;
  let response = await attempt(token);
  let error = response.ok ? null : await toApiError(response);

  if (error?.status === 403 && error.code === 'CSRF_TOKEN_INVALID' && mutating) {
    token = await fetchCsrfToken();
    response = await attempt(token);
    error = response.ok ? null : await toApiError(response);
  }

  if (error) {
    if (error.status === 401 && !options.ignoreUnauthorized) unauthorizedHandler?.();
    throw error;
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
