'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormError } from '@/components/FormError';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api/errors';
import { applyApiErrors } from '@/lib/forms/applyApiErrors';

import { signup } from '../api/authApi';
import { useSignIn } from '../hooks/useSignIn';
import { signupSchema, type SignupValues } from '../schemas/authSchemas';

const FIELDS = ['business_name', 'email', 'password'] as const;

/** Merchant signup form: creates the merchant and its owner login. */
export function SignupForm() {
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { business_name: '', email: '', password: '' },
  });
  const signIn = useSignIn(signup);
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn.mutateAsync(values);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'EMAIL_TAKEN') {
        form.setError('email', { message: error.message });
      } else {
        applyApiErrors(error, form.setError, FIELDS);
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />
      <FormField id="business_name" label="Business name" error={errors.business_name?.message}>
        <Input
          id="business_name"
          autoComplete="organization"
          aria-invalid={!!errors.business_name}
          {...form.register('business_name')}
        />
      </FormField>
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...form.register('email')}
        />
      </FormField>
      <FormField
        id="password"
        label="Password"
        hint="At least 10 characters"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...form.register('password')}
        />
      </FormField>
      <Button type="submit" disabled={isSubmitting || signIn.isSuccess}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
