'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormError } from '@/components/FormError';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api/errors';
import { applyApiErrors } from '@/lib/forms/applyApiErrors';

import { login } from '../api/authApi';
import { useSignIn } from '../hooks/useSignIn';
import { loginSchema, type LoginValues } from '../schemas/authSchemas';

/** Email and password login form. */
export function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const signIn = useSignIn(login);
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn.mutateAsync(values);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        form.setError('root', { message: 'Invalid email or password' });
      } else {
        applyApiErrors(error, form.setError, ['email', 'password']);
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...form.register('email')}
        />
      </FormField>
      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...form.register('password')}
        />
      </FormField>
      <Button type="submit" disabled={isSubmitting || signIn.isSuccess}>
        {isSubmitting ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  );
}
