import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-muted/40 flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center text-xl font-semibold tracking-tight">FluxPay</p>
        {children}
      </div>
    </main>
  );
}
