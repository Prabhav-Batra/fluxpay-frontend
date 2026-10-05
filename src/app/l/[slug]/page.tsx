import { redirect } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: 'Secure Checkout | Fluxpay',
};

export default async function PaymentLinkRedirect({ params }: PageProps) {
  const { slug } = await params;
  
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  
  try {
    const res = await fetch(`${backendUrl}/api/v1/public/payment_links/${slug}/checkout_sessions`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Link Unavailable</h1>
            <p className="text-muted-foreground mt-2">
              This payment link is invalid or has been deactivated.
            </p>
          </div>
        </div>
      );
    }

    const data = await res.json();
    
    // The backend returns { id: "cs_...", url: "..." }
    // We redirect the user directly to the local checkout page for that session
    redirect(`/pay/${data.id}`);
  } catch (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Service Unavailable</h1>
          <p className="text-muted-foreground mt-2">
            We couldn't connect to the secure checkout service. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
