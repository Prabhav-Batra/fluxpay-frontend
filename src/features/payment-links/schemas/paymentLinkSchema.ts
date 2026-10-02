import { z } from 'zod';

import type { CreatePaymentLinkBody } from '../api/paymentLinksApi';

const optionalUrl = z
  .string()
  .trim()
  .max(2048, 'URL is too long')
  .refine((v) => v === '' || /^https?:\/\/[^\s/]+\S*$/.test(v), 'Enter a full URL starting with https://');

export const paymentLinkSchema = z.object({
  product_id: z.string().min(1, 'Choose a product'),
  success_url: optionalUrl,
  cancel_url: optionalUrl,
});

export type PaymentLinkValues = z.infer<typeof paymentLinkSchema>;

/** POST body; blank redirect URLs are left out. */
export function toPaymentLinkBody(values: PaymentLinkValues): CreatePaymentLinkBody {
  const body: CreatePaymentLinkBody = { product_id: values.product_id };
  if (values.success_url) body.success_url = values.success_url;
  if (values.cancel_url) body.cancel_url = values.cancel_url;
  return body;
}
