import { z } from 'zod';

export const webhookEndpointSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Enter the URL that should receive events')
    .max(2048, 'URL is too long')
    .refine((v) => /^https?:\/\/[^\s/]+\S*$/.test(v), 'Enter a full URL starting with https://'),
});

export type WebhookEndpointValues = z.infer<typeof webhookEndpointSchema>;
