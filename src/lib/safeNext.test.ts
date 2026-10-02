import { describe, expect, it } from 'vitest';

import { safeNext } from './safeNext';

describe('safeNext', () => {
  it.each([
    ['/dashboard/sales?status=paid', '/dashboard/sales?status=paid'],
    ['/admin', '/admin'],
  ])('should_allow_relative_path_%s', (input, expected) => {
    expect(safeNext(input)).toBe(expected);
  });

  it.each([null, '', '//evil.com', 'https://evil.com', '/\\evil.com', 'javascript:alert(1)', 'dashboard'])(
    'should_reject_%s',
    (input) => {
      expect(safeNext(input)).toBeNull();
    },
  );
});
