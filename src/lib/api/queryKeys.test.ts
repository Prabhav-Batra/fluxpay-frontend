import { describe, expect, it } from 'vitest';

import { modeKey } from './queryKeys';

describe('modeKey', () => {
  it('should_put_mode_second_so_mode_switch_changes_every_key', () => {
    expect(modeKey('products', 'live', { active: true })).toEqual(['products', 'live', { active: true }]);
    expect(modeKey('sales', 'test')).toEqual(['sales', 'test']);
  });
});
