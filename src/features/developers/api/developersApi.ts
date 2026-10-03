import { apiFetch } from '@/lib/api/client';
import type { ListResponse, Mode } from '@/lib/api/types';

/** A secret API key (`key_…`). `secret` is present only right after create or roll. */
export interface ApiKey {
  id: string;
  display_prefix: string;
  mode: Mode;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  secret?: string;
}

/** A merchant webhook URL (`we_…`). `secret` is present only after create or roll. */
export interface WebhookEndpoint {
  id: string;
  mode: Mode;
  url: string;
  enabled: boolean;
  created_at: string;
  secret?: string;
}

export type EventType = 'checkout.completed' | 'checkout.expired' | 'sale.refunded' | 'webhook.test';

export interface WebhookEvent {
  id: string;
  type: EventType;
  mode: Mode;
  data: Record<string, unknown>;
  created_at: string;
}

export type DeliveryStatus = 'pending' | 'succeeded' | 'failed';

export interface Delivery {
  id: string;
  endpoint_id: string;
  status: DeliveryStatus;
  attempt_count: number;
  next_attempt_at: string | null;
  last_status_code: number | null;
  last_error: string | null;
  last_attempt_at: string | null;
  created_at: string;
}

export interface WebhookEventDetail extends WebhookEvent {
  deliveries: Delivery[];
}

export function listApiKeys(mode: Mode): Promise<{ data: ApiKey[] }> {
  return apiFetch('/dashboard/api_keys', { mode });
}

export function createApiKey(mode: Mode): Promise<ApiKey> {
  return apiFetch('/dashboard/api_keys', { method: 'POST', mode });
}

/** Revokes the key immediately and issues a replacement. */
export function rollApiKey(mode: Mode, id: string): Promise<ApiKey> {
  return apiFetch(`/dashboard/api_keys/${id}/roll`, { method: 'POST', mode });
}

export function revokeApiKey(mode: Mode, id: string): Promise<void> {
  return apiFetch(`/dashboard/api_keys/${id}`, { method: 'DELETE', mode });
}

export function listWebhookEndpoints(mode: Mode): Promise<{ data: WebhookEndpoint[] }> {
  return apiFetch('/dashboard/webhook_endpoints', { mode });
}

export function createWebhookEndpoint(mode: Mode, body: { url: string }): Promise<WebhookEndpoint> {
  return apiFetch('/dashboard/webhook_endpoints', { method: 'POST', mode, body });
}

export function updateWebhookEndpoint(
  mode: Mode,
  id: string,
  body: { url?: string; enabled?: boolean },
): Promise<WebhookEndpoint> {
  return apiFetch(`/dashboard/webhook_endpoints/${id}`, { method: 'PATCH', mode, body });
}

export function rollWebhookSecret(mode: Mode, id: string): Promise<WebhookEndpoint> {
  return apiFetch(`/dashboard/webhook_endpoints/${id}/roll_secret`, { method: 'POST', mode });
}

export function deleteWebhookEndpoint(mode: Mode, id: string): Promise<void> {
  return apiFetch(`/dashboard/webhook_endpoints/${id}`, { method: 'DELETE', mode });
}

/** Queues a `webhook.test` event to one endpoint. */
export function sendTestEvent(mode: Mode, id: string): Promise<WebhookEvent> {
  return apiFetch(`/dashboard/webhook_endpoints/${id}/test`, { method: 'POST', mode });
}

export function listEvents(mode: Mode, startingAfter?: string): Promise<ListResponse<WebhookEvent>> {
  return apiFetch('/dashboard/events', { mode, query: { starting_after: startingAfter, limit: 50 } });
}

export function getEvent(mode: Mode, id: string): Promise<WebhookEventDetail> {
  return apiFetch(`/dashboard/events/${id}`, { mode });
}

/** Creates new deliveries of an event for every enabled endpoint. */
export function resendEvent(mode: Mode, id: string): Promise<{ deliveries_created: number }> {
  return apiFetch(`/dashboard/events/${id}/resend`, { method: 'POST', mode });
}
