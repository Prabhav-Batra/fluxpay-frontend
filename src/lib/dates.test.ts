import { describe, expect, it } from 'vitest';

import { addDays, formatDate, formatDateTime, isoDay } from './dates';

describe('dates', () => {
  it('should_format_iso_day_in_local_time', () => {
    expect(isoDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('should_add_days_across_month_end', () => {
    expect(isoDay(addDays(new Date(2026, 0, 31), 1))).toBe('2026-02-01');
  });

  it('should_return_dash_when_value_missing', () => {
    expect(formatDateTime(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });

  it('should_format_instant_readably', () => {
    expect(formatDate('2026-10-02T10:00:00Z')).toMatch(/2026/);
  });
});
