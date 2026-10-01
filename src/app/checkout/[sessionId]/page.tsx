"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import { CheckCircle2, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { loadRazorpayScript, safeRedirectUrl } from "@/lib/payments/razorpay";

interface CheckoutSession {
  sessionId: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  status: "open" | "complete";
  orderId: string;
  gateway: "RAZORPAY" | "CASHFREE" | string;
  paymentSessionId?: string | null;
  razorpayOrderId?: string | null;
  razorpayKeyId?: string | null;
  amountSubunits: number;
  successUrl?: string | null;
  product: {
    name: string;
    description?: string | null;
    productType: string;
    benefits?: string[] | null;
  };
}

export default function CheckoutPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [sessionData, setSessionData] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        // Fetch session from NEXT proxy which maps to backend
        const res = await fetch(`/api/proxy/checkout/sessions/${sessionId}`);
        if (!res.ok) {
          throw new Error("Failed to load checkout session");
        }
        const data = await res.json();
        if (data.success && data.data) {
          setSessionData(data.data);
        } else {
          throw new Error("Invalid session data");
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const goToSuccess = (successUrl?: string | null, orderId?: string) => {
    const target = safeRedirectUrl(successUrl);
    if (!target) {
      window.location.href = "/checkout/success";
      return;
    }
    const url = new URL(target);
    if (orderId) url.searchParams.set("order_id", orderId);
    window.location.href = url.toString();
  };

  const handleRazorpayPayment = async (session: CheckoutSession) => {
    setIsPaying(true);
    setPaymentError("");

    try {
      await loadRazorpayScript();
    } catch {
      setPaymentError("Could not load the payment window. Check your connection and try again.");
      setIsPaying(false);
      return;
    }
    if (!window.Razorpay) {
      setPaymentError("Could not load the payment window. Please try again.");
      setIsPaying(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: session.razorpayKeyId!,
      amount: session.amountSubunits,
      currency: session.currency,
      order_id: session.razorpayOrderId!,
      name: session.product.name,
      description: session.product.description || undefined,
      prefill: { email: session.customerEmail },
      theme: { color: "#4F46E5" },
      handler: async (response) => {
        // Never trust the browser: the backend checks the signature before marking the order paid
        try {
          const res = await fetch("/api/proxy/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const data = await res.json().catch(() => null);
          if (!res.ok || !data?.success) {
            throw new Error(data?.message || "Payment verification failed");
          }
          goToSuccess(session.successUrl, session.orderId);
        } catch (err) {
          console.error("Razorpay verify error", err);
          setPaymentError(
            `We couldn't confirm your payment. If money was deducted it will be reconciled automatically. Reference: ${response.razorpay_payment_id}`
          );
          setIsPaying(false);
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentError("Payment was cancelled. You can try again.");
          setIsPaying(false);
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      // The modal stays open so the customer can retry with another method
      setPaymentError(response.error.description || "Payment failed. Please try again.");
    });

    rzp.open();
  };

  const handlePayment = async () => {
    if (!sessionData || isPaying) return;

    if (sessionData.gateway === "RAZORPAY") {
      if (!sessionData.razorpayOrderId || !sessionData.razorpayKeyId) {
        setPaymentError("This checkout session is missing payment details. Please start again.");
        return;
      }
      return handleRazorpayPayment(sessionData);
    }

    if (!sessionData.paymentSessionId) return;

    try {
      const cashfree = await load({
        mode: "sandbox", // TODO: Make environment driven
      });

      const checkoutOptions = {
        paymentSessionId: sessionData.paymentSessionId,
        redirectTarget: "_self", // Redirect in same tab
      };

      cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error("Cashfree init error", err);
      alert("Failed to initialize payment gateway.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Checkout Error</h2>
          <p>{error || "Session not found."}</p>
        </div>
      </div>
    );
  }

  const { product, amountTotal, currency, customerEmail } = sessionData;
  const alreadyPaid = sessionData.status === "complete";
  const gatewayName = sessionData.gateway === "RAZORPAY" ? "Razorpay" : "Cashfree Payments";

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column - Product Details */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Order Summary</h1>
            <p className="text-slate-400">Review your purchase details</p>
          </div>

          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-slate-700/50">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-2xl font-bold text-white">{product.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{product.name}</h3>
              <p className="text-indigo-400">{product.productType.replace("_", " ")}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {product.benefits && product.benefits.map((benefit: string, i: number) => (
              <div key={i} className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex justify-between items-center pt-6 border-t border-slate-700/50">
              <span className="text-lg text-slate-400">Total to pay</span>
              <span className="text-3xl font-bold text-white">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amountTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Checkout Action */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl flex flex-col h-full">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Secure Checkout</h2>
            <p className="text-slate-400 text-sm">Powered by {gatewayName}</p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-4 mb-8 border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-1">Customer Email</p>
            <p className="font-medium text-white">{customerEmail}</p>
          </div>

          {paymentError && (
            <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl mb-4">
              {paymentError}
            </div>
          )}

          {alreadyPaid ? (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 mt-auto">
              <CheckCircle2 className="w-5 h-5" />
              <span>This order has been paid</span>
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 group mt-auto"
            >
              <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>
                {isPaying
                  ? "Processing..."
                  : `Pay ${new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amountTotal)}`}
              </span>
            </button>
          )}

          <div className="flex items-center justify-center mt-6 text-slate-500 text-xs space-x-1">
            <Lock className="w-3 h-3" />
            <span>Payments are secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
