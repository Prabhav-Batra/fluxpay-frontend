import { z } from 'zod';

import { paiseToRupeesInput, rupeesToPaise } from '@/lib/money';

import type { CreateProductBody, Product, UpdateProductBody } from '../api/productsApi';

const MIN_PAISE = 100;
const MAX_PAISE = 50_000_000;
const METADATA_KEY = /^[A-Za-z0-9_.-]{1,40}$/;

const metadataRows = z
  .array(z.object({ key: z.string().trim(), value: z.string().max(500, 'Max 500 characters') }))
  .max(20, 'At most 20 entries')
  .superRefine((rows, ctx) => {
    const seen = new Set<string>();
    rows.forEach((row, index) => {
      if (!METADATA_KEY.test(row.key)) {
        ctx.addIssue({ code: 'custom', path: [index, 'key'], message: 'Use 1–40 letters, digits, _ - or .' });
      } else if (seen.has(row.key)) {
        ctx.addIssue({ code: 'custom', path: [index, 'key'], message: 'Duplicate key' });
      }
      seen.add(row.key);
    });
  });

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Enter a name').max(120, 'Use at most 120 characters'),
  description: z.string().trim().max(1000, 'Use at most 1000 characters'),
  image_url: z
    .string()
    .trim()
    .max(500, 'Use at most 500 characters')
    .refine((v) => v === '' || /^https:\/\/\S+$/.test(v), 'Use an https:// image URL'),
  price: z.string().superRefine((value, ctx) => {
    const paise = rupeesToPaise(value);
    if (paise === null) ctx.addIssue({ code: 'custom', message: 'Enter a price like 499 or 499.50' });
    else if (paise < MIN_PAISE) ctx.addIssue({ code: 'custom', message: 'Minimum price is ₹1.00' });
    else if (paise > MAX_PAISE) ctx.addIssue({ code: 'custom', message: 'Maximum price is ₹5,00,000.00' });
  }),
  metadata: metadataRows,
});

export type ProductValues = z.infer<typeof productSchema>;

export const emptyProductValues: ProductValues = {
  name: '',
  description: '',
  image_url: '',
  price: '',
  metadata: [],
};

function toMetadata(rows: ProductValues['metadata']): Record<string, string> {
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

/** Form values for editing an existing product. */
export function valuesFromProduct(product: Product): ProductValues {
  return {
    name: product.name,
    description: product.description ?? '',
    image_url: product.image_url ?? '',
    price: paiseToRupeesInput(product.amount),
    metadata: Object.entries(product.metadata).map(([key, value]) => ({ key, value })),
  };
}

/** POST body from validated values; empty optional fields are left out. */
export function toCreateBody(values: ProductValues): CreateProductBody {
  const body: CreateProductBody = { name: values.name, amount: rupeesToPaise(values.price)! };
  if (values.description) body.description = values.description;
  if (values.image_url) body.image_url = values.image_url;
  if (values.metadata.length > 0) body.metadata = toMetadata(values.metadata);
  return body;
}

/** PATCH body with only the fields that differ from `product`. */
export function productChanges(product: Product, values: ProductValues): UpdateProductBody {
  const changes: UpdateProductBody = {};
  const amount = rupeesToPaise(values.price)!;
  if (values.name !== product.name) changes.name = values.name;
  if (values.description !== (product.description ?? '')) changes.description = values.description;
  if (values.image_url !== (product.image_url ?? '')) changes.image_url = values.image_url;
  if (amount !== product.amount) changes.amount = amount;
  const metadata = toMetadata(values.metadata);
  if (JSON.stringify(metadata) !== JSON.stringify(product.metadata)) changes.metadata = metadata;
  return changes;
}
