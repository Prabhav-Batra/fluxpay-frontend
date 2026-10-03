import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithClient } from '@/test/render';

import { createApiKey, listApiKeys, revokeApiKey, type ApiKey } from '../api/developersApi';
import { ApiKeysPanel } from './ApiKeysPanel';

vi.mock('../api/developersApi', () => ({
  listApiKeys: vi.fn(),
  createApiKey: vi.fn(),
  rollApiKey: vi.fn(),
  revokeApiKey: vi.fn(),
}));

const key: ApiKey = {
  id: 'key_1', display_prefix: 'sk_test_ab12', mode: 'test',
  created_at: '2026-10-01T00:00:00Z', last_used_at: null, revoked_at: null,
};

describe('ApiKeysPanel', () => {
  beforeEach(() => {
    vi.mocked(listApiKeys).mockResolvedValue({ data: [key] });
    vi.mocked(createApiKey).mockReset();
    vi.mocked(revokeApiKey).mockReset();
  });

  it('should_show_secret_once_and_forget_it_when_dialog_closed', async () => {
    vi.mocked(createApiKey).mockResolvedValue({ ...key, id: 'key_2', secret: 'sk_test_SECRET123' });
    renderWithClient(<ApiKeysPanel />);
    await userEvent.click(await screen.findByRole('button', { name: /create key/i }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('sk_test_SECRET123')).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: /i've saved it/i }));
    await waitFor(() => expect(screen.queryByText('sk_test_SECRET123')).not.toBeInTheDocument());
  });

  it('should_ask_confirmation_before_revoking', async () => {
    vi.mocked(revokeApiKey).mockResolvedValue(undefined);
    renderWithClient(<ApiKeysPanel />);
    await userEvent.click(await screen.findByRole('button', { name: /revoke sk_test_ab12/i }));
    expect(revokeApiKey).not.toHaveBeenCalled();
    const confirm = await screen.findByRole('alertdialog');
    await userEvent.click(within(confirm).getByRole('button', { name: /revoke key/i }));
    await waitFor(() => expect(revokeApiKey).toHaveBeenCalledWith('test', 'key_1'));
  });

  it('should_hide_actions_for_revoked_keys', async () => {
    vi.mocked(listApiKeys).mockResolvedValue({ data: [{ ...key, revoked_at: '2026-10-02T00:00:00Z' }] });
    renderWithClient(<ApiKeysPanel />);
    expect(await screen.findByText('Revoked')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /revoke sk_test_ab12/i })).not.toBeInTheDocument();
  });
});
