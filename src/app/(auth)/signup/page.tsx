import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/features/auth/components/SignupForm';

export const metadata: Metadata = { title: 'Sign up' };

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start selling with hosted checkout in test mode.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Suspense>
          <SignupForm />
        </Suspense>
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
