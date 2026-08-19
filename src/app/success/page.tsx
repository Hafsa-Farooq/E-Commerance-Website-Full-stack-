import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 font-satoshi py-16">
      <div className="max-w-md w-full bg-white border border-black/10 rounded-[28px] p-8 text-center shadow-sm flex flex-col items-center gap-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading & Description */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-black uppercase tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-sm text-black/60">
            Thank you for your purchase. Your payment was processed securely via Stripe and your order has been confirmed.
          </p>
        </div>

        {/* Session ID Box */}
        {sessionId && (
          <div className="w-full bg-[#F0F0F0] rounded-xl p-3 text-[11px] text-black/50 font-mono break-all">
            Session ID: {sessionId}
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3 w-full pt-2">
          <Link
            href="/"
            className="flex-1 bg-black text-white font-medium py-3.5 px-6 rounded-full hover:bg-black/80 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}