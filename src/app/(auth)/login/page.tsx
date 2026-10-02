import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Welcome back to your FluxPay dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-muted-foreground text-center text-sm">
          New to FluxPay?{' '}
          <Link href="/signup" className="text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
