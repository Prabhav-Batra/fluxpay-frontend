"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center">
        
        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
          <CheckCircle2 className="w-10 h-10 text-indigo-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Processing Complete</h1>
        <p className="text-slate-400 mb-8">
          You can safely close this window. Your payment status will be updated in your app automatically.
        </p>

        {orderId && (
          <div className="bg-slate-900/50 rounded-2xl p-4 mb-8 border border-slate-700/50 text-sm">
            <p className="text-slate-500 mb-1">Order ID</p>
            <p className="font-mono text-slate-300 break-all">{orderId}</p>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2"
        >
          <span>Return Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
