import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';
import { renderWithClient } from '@/test/render';

import {
  createWebhookEndpoint,
  listWebhookEndpoints,
  sendTestEvent,
  type WebhookEndpoint,
} from '../api/developersApi';
import { WebhookEndpointsPanel } from './WebhookEndpointsPanel';

vi.mock('../api/developersApi', () => ({
  listWebhookEndpoints: vi.fn(),
  createWebhookEndpoint: vi.fn(),
  updateWebhookEndpoint: vi.fn(),
  rollWebhookSecret: vi.fn(),
  deleteWebhookEndpoint: vi.fn(),
  sendTestEvent: vi.fn(),
}));

const endpoint: WebhookEndpoint = {
  id: 'we_1', mode: 'test', url: 'https://jextter.in/hooks', enabled: true,
  created_at: '2026-10-01T00:00:00Z',
};

describe('WebhookEndpointsPanel', () => {
  beforeEach(() => {
    vi.mocked(listWebhookEndpoints).mockResolvedValue({ data: [endpoint] });
    vi.mocked(createWebhookEndpoint).mockReset();
    vi.mocked(sendTestEvent).mockReset();
  });

  it('should_show_signing_secret_once_after_create', async () => {
    vi.mocked(createWebhookEndpoint).mockResolvedValue({ ...endpoint, id: 'we_2', secret: 'whsec_abc' });
    renderWithClient(<WebhookEndpointsPanel />);
    await userEvent.click(await screen.findByRole('button', { name: /add endpoint/i }));
    await userEvent.type(screen.getByLabelText(/endpoint url/i), 'https://jextter.in/new');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(await screen.findByText('whsec_abc')).toBeInTheDocument();
    expect(createWebhookEndpoint).toHaveBeenCalledWith('test', { url: 'https://jextter.in/new' });
    await userEvent.click(screen.getByRole('button', { name: /i've saved it/i }));
    await waitFor(() => expect(screen.queryByText('whsec_abc')).not.toBeInTheDocument());
  });

  it('should_show_server_url_error_on_field', async () => {
    vi.mocked(createWebhookEndpoint).mockRejectedValue(
      new ApiError(422, 'INVALID_WEBHOOK_URL', 'Invalid', [
        { field: 'url', code: 'PRIVATE_ADDRESS', message: 'URL must not point to a private address' },
      ]),
    );
    renderWithClient(<WebhookEndpointsPanel />);
    await userEvent.click(await screen.findByRole('button', { name: /add endpoint/i }));
    await userEvent.type(screen.getByLabelText(/endpoint url/i), 'https://10.0.0.1/x');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(await screen.findByText(/private address/i)).toBeInTheDocument();
  });

  it('should_show_limit_message_when_limit_reached', async () => {
    vi.mocked(createWebhookEndpoint).mockRejectedValue(
      new ApiError(422, 'ENDPOINT_LIMIT_REACHED', 'At most 5 webhook endpoints per mode'),
    );
    renderWithClient(<WebhookEndpointsPanel />);
    await userEvent.click(await screen.findByRole('button', { name: /add endpoint/i }));
    await userEvent.type(screen.getByLabelText(/endpoint url/i), 'https://jextter.in/6');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    const dialog = screen.getByRole('dialog');
    expect(await within(dialog).findByText(/at most 5 webhook endpoints/i)).toBeInTheDocument();
  });

  it('should_send_test_event_when_requested', async () => {
    vi.mocked(sendTestEvent).mockResolvedValue({} as never);
    renderWithClient(<WebhookEndpointsPanel />);
    await userEvent.click(await screen.findByRole('button', { name: /actions for https:\/\/jextter.in\/hooks/i }));
    await userEvent.click(await screen.findByRole('menuitem', { name: /send test event/i }));
    await waitFor(() => expect(sendTestEvent).toHaveBeenCalledWith('test', 'we_1'));
  });
});
