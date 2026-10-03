import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithClient } from '@/test/render';

import { getEvent, resendEvent } from '../api/developersApi';
import { EventDetailSheet } from './EventDetailSheet';

vi.mock('../api/developersApi', () => ({ getEvent: vi.fn(), resendEvent: vi.fn() }));

describe('EventDetailSheet', () => {
  beforeEach(() => {
    vi.mocked(getEvent).mockResolvedValue({
      id: 'evt_1', type: 'checkout.completed', mode: 'test',
      data: { sale_id: 'sale_1' }, created_at: '2026-10-01T10:00:00Z',
      deliveries: [
        {
          id: 'whd_1', endpoint_id: 'we_1', status: 'failed', attempt_count: 8,
          next_attempt_at: null, last_status_code: 500, last_error: 'Internal Server Error',
          last_attempt_at: '2026-10-02T10:00:00Z', created_at: '2026-10-01T10:00:00Z',
        },
      ],
    });
    vi.mocked(resendEvent).mockResolvedValue({ deliveries_created: 1 });
  });

  it('should_show_payload_and_deliveries', async () => {
    renderWithClient(<EventDetailSheet eventId="evt_1" onClose={vi.fn()} />);
    expect(await screen.findByText(/"sale_id": "sale_1"/)).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
  });

  it('should_resend_event_when_clicked', async () => {
    renderWithClient(<EventDetailSheet eventId="evt_1" onClose={vi.fn()} />);
    await userEvent.click(await screen.findByRole('button', { name: /resend/i }));
    await waitFor(() => expect(resendEvent).toHaveBeenCalledWith('test', 'evt_1'));
  });
});
