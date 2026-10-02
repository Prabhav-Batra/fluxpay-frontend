import { z } from 'zod';

const MAX_PASSWORD_BYTES = 72;

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

export const signupSchema = z.object({
  business_name: z
    .string()
    .trim()
    .min(1, 'Enter your business name')
    .max(100, 'Use at most 100 characters'),
  email: z.string().trim().email('Enter a valid email').max(254, 'Email is too long'),
  password: z
    .string()
    .min(10, 'Use at least 10 characters')
    .refine((value) => new TextEncoder().encode(value).length <= MAX_PASSWORD_BYTES, {
      message: 'Password is too long (max 72 bytes)',
    }),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
