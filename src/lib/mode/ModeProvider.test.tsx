import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ModeProvider } from './ModeProvider';
import { useMode } from './useMode';

function Probe() {
  const { mode, setMode } = useMode();
  return (
    <button type="button" onClick={() => setMode(mode === 'test' ? 'live' : 'test')}>
      {mode}
    </button>
  );
}

describe('ModeProvider', () => {
  it('should_default_to_test_when_nothing_stored', () => {
    render(<ModeProvider><Probe /></ModeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('test');
  });

  it('should_restore_stored_mode_when_mounted', () => {
    window.localStorage.setItem('fluxpay.mode', 'live');
    render(<ModeProvider><Probe /></ModeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('live');
  });

  it('should_persist_mode_when_changed', () => {
    render(<ModeProvider><Probe /></ModeProvider>);
    act(() => screen.getByRole('button').click());
    expect(screen.getByRole('button')).toHaveTextContent('live');
    expect(window.localStorage.getItem('fluxpay.mode')).toBe('live');
  });

  it('should_ignore_garbage_when_stored_value_invalid', () => {
    window.localStorage.setItem('fluxpay.mode', 'prod');
    render(<ModeProvider><Probe /></ModeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('test');
  });
});
