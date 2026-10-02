import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiFetch, setUnauthorizedHandler } from './client';
import { ApiError } from './errors';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const errorBody = (code: string, message = 'boom') => ({
  error: { code, message, details: [], trace_id: 't-1' },
});

describe('apiFetch', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    setUnauthorizedHandler(null);
  });

  it('should_prefix_path_and_send_mode_header_when_mode_given', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { ok: true }));
    await apiFetch('/dashboard/products', { mode: 'live', query: { limit: 10, active: undefined } });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/v1/dashboard/products?limit=10');
    expect(new Headers(init?.headers).get('FluxPay-Mode')).toBe('live');
    expect(init?.credentials).toBe('same-origin');
  });

  it('should_send_xsrf_header_from_cookie_when_mutating', async () => {
    document.cookie = 'XSRF-TOKEN=abc';
    fetchMock.mockResolvedValueOnce(json(201, { id: 'prod_1' }));
    await apiFetch('/dashboard/products', { method: 'POST', body: { name: 'x' } });
    const [, init] = fetchMock.mock.calls[0]!;
    const headers = new Headers(init?.headers);
    expect(headers.get('X-XSRF-TOKEN')).toBe('abc');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(init?.body).toBe('{"name":"x"}');
  });

  it('should_fetch_csrf_token_first_when_cookie_missing', async () => {
    fetchMock
      .mockResolvedValueOnce(json(200, { token: 'fresh', header_name: 'X-XSRF-TOKEN' }))
      .mockResolvedValueOnce(json(200, {}));
    await apiFetch('/auth/login', { method: 'POST', body: {} });
    expect(fetchMock.mock.calls[0]![0]).toBe('/api/v1/auth/csrf');
    expect(new Headers(fetchMock.mock.calls[1]![1]?.headers).get('X-XSRF-TOKEN')).toBe('fresh');
  });

  it('should_refresh_token_and_retry_once_when_csrf_rejected', async () => {
    document.cookie = 'XSRF-TOKEN=stale';
    fetchMock
      .mockResolvedValueOnce(json(403, errorBody('CSRF_TOKEN_INVALID')))
      .mockResolvedValueOnce(json(200, { token: 'fresh', header_name: 'X-XSRF-TOKEN' }))
      .mockResolvedValueOnce(json(200, { ok: 1 }));
    await expect(apiFetch('/auth/logout', { method: 'POST' })).resolves.toEqual({ ok: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(new Headers(fetchMock.mock.calls[2]![1]?.headers).get('X-XSRF-TOKEN')).toBe('fresh');
  });

  it('should_not_retry_twice_when_csrf_rejected_again', async () => {
    document.cookie = 'XSRF-TOKEN=stale';
    fetchMock
      .mockResolvedValueOnce(json(403, errorBody('CSRF_TOKEN_INVALID')))
      .mockResolvedValueOnce(json(200, { token: 'fresh', header_name: 'X-XSRF-TOKEN' }))
      .mockResolvedValueOnce(json(403, errorBody('CSRF_TOKEN_INVALID')));
    await expect(apiFetch('/x', { method: 'POST' })).rejects.toMatchObject({ status: 403 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('should_throw_api_error_with_envelope_fields_when_not_ok', async () => {
    fetchMock.mockResolvedValueOnce(
      json(422, {
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid',
          details: [{ field: 'name', code: 'NotBlank', message: 'must not be blank' }],
          trace_id: 'tr-9',
        },
      }),
    );
    const error = await apiFetch('/x').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      code: 'VALIDATION_FAILED',
      message: 'Invalid',
      traceId: 'tr-9',
      details: [{ field: 'name', code: 'NotBlank', message: 'must not be blank' }],
    });
  });

  it('should_throw_generic_api_error_when_body_not_json', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>bad gateway</html>', { status: 502 }));
    await expect(apiFetch('/x')).rejects.toMatchObject({ status: 502, code: 'HTTP_502' });
  });

  it('should_throw_network_error_when_fetch_rejects', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(apiFetch('/x')).rejects.toMatchObject({ status: 0, code: 'NETWORK_ERROR' });
  });

  it('should_return_undefined_when_no_content', async () => {
    document.cookie = 'XSRF-TOKEN=abc';
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(apiFetch('/x', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('should_call_unauthorized_handler_when_401', async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    fetchMock.mockResolvedValueOnce(json(401, errorBody('UNAUTHENTICATED')));
    await expect(apiFetch('/dashboard/sales')).rejects.toMatchObject({ status: 401 });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('should_skip_unauthorized_handler_when_ignored', async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    fetchMock.mockResolvedValueOnce(json(401, errorBody('INVALID_CREDENTIALS')));
    await expect(apiFetch('/auth/me', { ignoreUnauthorized: true })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(handler).not.toHaveBeenCalled();
  });
});
