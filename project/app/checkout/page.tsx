'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProductBySlug, type Product } from '@/lib/supabase';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product') || 'master-strategist-collection';
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProductBySlug(productSlug).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !product) return;

    setSubmitting(true);
    setError(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ product_slug: productSlug, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to initiate payment');
        setSubmitting(false);
        return;
      }

      if (data.payment_url) {
        // Redirect to Cryptomus payment page
        window.location.href = data.payment_url;
      } else {
        // Cryptomus not configured — show order info
        setPaymentUrl(null);
        setError('Payment gateway is being configured. Your order has been created — please check back shortly.');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  const discount = product?.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-ink-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-gold-300 transition-colors mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to store
        </a>

        <div className="p-8 sm:p-10 rounded-2xl glass border border-gold-500/20 gold-glow">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-100 mb-2">Secure Checkout</h1>
          <p className="text-sm text-ink-300 mb-8">Pay with cryptocurrency · Instant delivery</p>

          {/* Product summary */}
          {product && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-ink-800/50 border border-gold-500/10 mb-8">
              <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 border border-gold-500/20">
                {product.cover_image_url && (
                  <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base text-gold-200 truncate">{product.title}</h3>
                <p className="text-xs text-ink-400">{product.books?.length || 3} eBooks included</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-serif font-bold text-gold-200">${product.price.toFixed(0)}</span>
                {product.compare_at_price && (
                  <span className="block text-xs text-ink-400 line-through">${product.compare_at_price.toFixed(0)}</span>
                )}
              </div>
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-ink-800/50 border border-gold-500/15 text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-400/50 focus:bg-ink-800/80 transition-all"
              />
              <p className="text-xs text-ink-400 mt-2">Your download link will be sent to this email after payment.</p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Payment method info */}
            <div className="p-4 rounded-xl bg-ink-800/30 border border-gold-500/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-950"><circle cx="12" cy="12" r="10"/><path d="M9.5 8.5h5a2 2 0 0 1 0 5h-5a2 2 0 0 0 0 5h5"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-100">Cryptocurrency Payment</p>
                  <p className="text-xs text-ink-400">Powered by Cryptomus</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'TRX'].map((coin) => (
                  <span key={coin} className="px-2.5 py-1 rounded-md bg-gold-500/5 border border-gold-500/10 text-xs text-ink-200">{coin}</span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 font-semibold text-base hover:from-gold-500 hover:to-gold-400 transition-all shadow-xl shadow-gold-500/20 hover:shadow-gold-400/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                <>
                  Pay ${product?.price.toFixed(0) || '29'} with Crypto
                </>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-ink-400">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Secure Payment
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="20 6 9 17 4 12"/></svg>
              Instant Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="20 6 9 17 4 12"/></svg>
              30-Day Refund
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-ink-950"><div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
