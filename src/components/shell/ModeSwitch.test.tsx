import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ModeProvider } from '@/lib/mode/ModeProvider';

import { ModeSwitch } from './ModeSwitch';
import { TestModeBanner } from './TestModeBanner';

function Harness() {
  return (
    <ModeProvider>
      <TestModeBanner />
      <ModeSwitch />
    </ModeProvider>
  );
}

describe('ModeSwitch', () => {
  it('should_show_test_banner_by_default', () => {
    render(<Harness />);
    expect(screen.getByText(/you are in test mode/i)).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /live mode/i })).not.toBeChecked();
  });

  it('should_hide_banner_and_check_switch_when_switched_to_live', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('switch', { name: /live mode/i }));
    expect(screen.getByRole('switch', { name: /live mode/i })).toBeChecked();
    expect(screen.queryByText(/you are in test mode/i)).not.toBeInTheDocument();
  });
});
