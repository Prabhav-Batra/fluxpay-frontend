import { describe, expect, it } from 'vitest';

import { formatPaise, paiseToRupeesInput, rupeesToPaise } from './money';

describe('rupeesToPaise', () => {
  it.each([
    ['499', 49_900],
    ['499.5', 49_950],
    ['499.50', 49_950],
    ['1,299', 129_900],
    ['  10.05 ', 1_005],
    ['0.01', 1],
    ['500000', 50_000_000],
  ])('should_convert_%s_to_%i_paise', (input, expected) => {
    expect(rupeesToPaise(input)).toBe(expected);
  });

  it.each(['', ' ', '0.999', '-5', 'abc', '1.2.3', '1e3', '₹10', '.', '12.'])(
    'should_return_null_when_input_is_%s',
    (input) => {
      expect(rupeesToPaise(input)).toBeNull();
    },
  );

  it('should_avoid_float_drift_when_converting_cents', () => {
    expect(rupeesToPaise('1.15')).toBe(115);
    expect(rupeesToPaise('4.35')).toBe(435);
  });
});

describe('formatPaise', () => {
  it('should_format_inr_with_indian_grouping', () => {
    expect(formatPaise(12_345_678)).toBe('₹1,23,456.78');
    expect(formatPaise(0)).toBe('₹0.00');
  });

  it('should_keep_sign_when_negative', () => {
    expect(formatPaise(-5_000)).toBe('-₹50.00');
  });
});

describe('paiseToRupeesInput', () => {
  it('should_render_plain_decimal_for_inputs', () => {
    expect(paiseToRupeesInput(49_950)).toBe('499.50');
    expect(paiseToRupeesInput(100)).toBe('1.00');
  });
});
