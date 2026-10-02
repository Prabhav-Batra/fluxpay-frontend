import { describe, expect, it } from 'vitest';

import { salesQuery } from './salesApi';

describe('salesQuery', () => {
  it('should_map_filters_to_api_params_and_drop_blanks', () => {
    expect(
      salesQuery({ status: 'refunded', productId: 'prod_1', customerRef: '  user_42 ' }, 'sale_9'),
    ).toEqual({
      status: 'refunded',
      product_id: 'prod_1',
      customer_ref: 'user_42',
      starting_after: 'sale_9',
      limit: 50,
    });
  });

  it('should_omit_all_filter_values', () => {
    expect(salesQuery({ status: 'all', productId: 'all', customerRef: '' })).toEqual({
      status: undefined,
      product_id: undefined,
      customer_ref: undefined,
      starting_after: undefined,
      limit: 50,
    });
  });
});
