import { describe, expect, it } from 'vitest';

import type { Product } from '../api/productsApi';
import { productChanges, productSchema, toCreateBody, valuesFromProduct } from './productSchema';

const base = {
  name: 'Coin pack',
  description: '',
  image_url: '',
  price: '499',
  metadata: [] as { key: string; value: string }[],
};

const product: Product = {
  id: 'prod_1',
  mode: 'test',
  name: 'Coin pack',
  description: 'Gold',
  image_url: 'https://cdn.x/a.png',
  amount: 49_900,
  currency: 'INR',
  type: 'one_time',
  metadata: { coins: '100' },
  active: true,
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
};

const issues = (values: unknown) =>
  productSchema.safeParse(values).error?.issues.map((i) => `${i.path.join('.')}:${i.message}`) ?? [];

describe('productSchema', () => {
  it('should_accept_valid_values', () => {
    expect(issues(base)).toEqual([]);
  });

  it.each([
    ['0.5', 'Minimum price is ₹1.00'],
    ['500000.01', 'Maximum price is ₹5,00,000.00'],
    ['abc', 'Enter a price like 499 or 499.50'],
    ['0.999', 'Enter a price like 499 or 499.50'],
  ])('should_reject_price_%s', (price, message) => {
    expect(issues({ ...base, price })).toEqual([`price:${message}`]);
  });

  it('should_reject_non_https_image', () => {
    expect(issues({ ...base, image_url: 'http://x.co/a.png' })).toEqual([
      'image_url:Use an https:// image URL',
    ]);
  });

  it('should_reject_bad_or_duplicate_metadata_keys', () => {
    const result = issues({
      ...base,
      metadata: [
        { key: 'coins', value: '1' },
        { key: 'coins', value: '2' },
        { key: 'has space', value: '3' },
      ],
    });
    expect(result).toContain('metadata.1.key:Duplicate key');
    expect(result).toContain('metadata.2.key:Use 1–40 letters, digits, _ - or .');
  });
});

describe('toCreateBody', () => {
  it('should_convert_price_to_paise_and_drop_empty_optionals', () => {
    expect(
      toCreateBody(productSchema.parse({ ...base, price: '1,299.5', metadata: [{ key: 'coins', value: '100' }] })),
    ).toEqual({ name: 'Coin pack', amount: 129_950, metadata: { coins: '100' } });
  });
});

describe('productChanges', () => {
  it('should_return_only_changed_fields', () => {
    const values = { ...valuesFromProduct(product), price: '599' };
    expect(productChanges(product, productSchema.parse(values))).toEqual({ amount: 59_900 });
  });

  it('should_send_empty_string_when_clearing_optional_text', () => {
    const values = { ...valuesFromProduct(product), description: '', image_url: '' };
    expect(productChanges(product, productSchema.parse(values))).toEqual({
      description: '',
      image_url: '',
    });
  });

  it('should_send_full_metadata_when_any_entry_changes', () => {
    const values = { ...valuesFromProduct(product), metadata: [] };
    expect(productChanges(product, productSchema.parse(values))).toEqual({ metadata: {} });
  });
});
