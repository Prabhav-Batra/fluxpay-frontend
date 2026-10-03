import { z } from 'zod';
import { rupeesToPaise } from '@/lib/money';

export const updateMerchantSchema = z.object({
  platform_fee_percent: z.coerce.number().min(0).max(100, 'Must be between 0 and 100'),
  status: z.enum(['active', 'suspended']).optional(),
});
export type UpdateMerchantInput = z.infer<typeof updateMerchantSchema>;

export const recordPayoutSchema = z.object({
  mode: z.enum(['test', 'live']),
  amount_rupees: z.string().min(1, 'Amount is required'),
  reference: z.string().min(1, 'Reference is required').max(100),
  paid_at: z.string().optional(),
}).refine(
  (data) => {
    const paise = rupeesToPaise(data.amount_rupees);
    return paise !== null && paise >= 100; // at least 1 rupee
  },
  { message: 'Invalid amount', path: ['amount_rupees'] }
);
export type RecordPayoutInput = z.infer<typeof recordPayoutSchema>;
