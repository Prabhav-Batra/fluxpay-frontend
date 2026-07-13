"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PayProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/proxy/products/${productId}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          throw new Error("Product not found");
        }
      } catch (err: any) {
        console.error(err);
        setError("This product link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    try {
      const origin = window.location.origin;
      const urlParams = new URLSearchParams(window.location.search);
      const merchantReference = urlParams.get("ref") || urlParams.get("clientReferenceId");
      const returnUrl = urlParams.get("return_url");

      const successRedirect = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}${returnUrl ? `&return_url=${encodeURIComponent(returnUrl)}` : ""}`;

      const res = await fetch(`/api/proxy/checkout/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: product.id,
          customerEmail: email,
          successUrl: successRedirect,
          cancelUrl: window.location.href,
          ...(merchantReference && { merchantReference })
        })
      });

      if (!res.ok) throw new Error("Failed to create checkout session");
      const data = await res.json();
      
      if (data.success && data.data && data.data.sessionId) {
        router.push(`/checkout/${data.data.sessionId}`);
      } else {
        throw new Error("Invalid session response");
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <span className="text-3xl font-bold text-white">{product.name.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
          <p className="text-3xl font-extrabold text-white">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency }).format(product.price)}
          </p>
        </div>

        {product.benefits && product.benefits.length > 0 && (
          <div className="space-y-3 mb-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
            {product.benefits.map((benefit: string, i: number) => (
              <div key={i} className="flex items-start text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                <span className="text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Enter your email to continue</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 group"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Continue to Payment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
