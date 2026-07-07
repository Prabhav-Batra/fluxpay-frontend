"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import { CheckCircle2, ShieldCheck, CreditCard, Lock } from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handlePayment = async () => {
    if (!sessionData || !sessionData.paymentSessionId) return;

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
            <p className="text-slate-400 text-sm">Powered by Cashfree Payments</p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-4 mb-8 border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-1">Customer Email</p>
            <p className="font-medium text-white">{customerEmail}</p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 group mt-auto"
          >
            <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Pay {new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amountTotal)}</span>
          </button>
          
          <div className="flex items-center justify-center mt-6 text-slate-500 text-xs space-x-1">
            <Lock className="w-3 h-3" />
            <span>Payments are secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
