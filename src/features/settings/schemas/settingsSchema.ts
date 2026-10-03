import { z } from 'zod';

export const updateSettingsSchema = z.object({
  business_name: z.string().min(1, 'must not be blank').max(100, 'must be at most 100 characters'),
  logo_url: z
    .string()
    .max(500, 'must be at most 500 characters')
    .refine((val) => val === '' || /^https:\/\/\S+$/.test(val), {
      message: 'must be an https URL',
    })
    .optional(),
  brand_color: z
    .string()
    .regex(/^$|^#[0-9A-Fa-f]{6}$/, 'must be a hex colour like #FF3366')
    .optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
