'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const token = searchParams.get('token');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Poll for order status — webhook may take a moment to confirm
    const poll = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (data) {
        setOrder(data);
        if (data.status === 'paid') {
          // Fetch download link via edge function
          if (token) {
            try {
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
              const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
              const response = await fetch(`${supabaseUrl}/functions/v1/get-download-link`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({ token }),
              });
              const dlData = await response.json();
              if (response.ok && dlData.url) {
                setDownloadUrl(dlData.url);
              }
            } catch (err) {
              // Download link function may not be deployed yet
            }
          }
          setLoading(false);
          return;
        }
        if (data.status === 'failed') {
          setLoading(false);
          return;
        }
      }

      setPollCount((c) => {
        if (c < 30) {
          setTimeout(poll, 2000);
        } else {
          setLoading(false);
        }
        return c + 1;
      });
    };

    poll();
  }, [orderId, token]);

  if (!orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ink-950 px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-ink-100 mb-4">No order specified</h1>
          <a href="/" className="text-gold-300 hover:text-gold-200 transition-colors">Return to store</a>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-ink-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {loading ? (
          <div className="p-8 sm:p-12 rounded-2xl glass border border-gold-500/20 text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-gold-500/20 border-t-gold-400 rounded-full animate-spin" />
            <h1 className="font-serif text-2xl text-ink-100 mb-2">Confirming Payment...</h1>
            <p className="text-sm text-ink-300">Waiting for blockchain confirmation. This usually takes 1-5 minutes.</p>
          </div>
        ) : order?.status === 'paid' ? (
          <div className="p-8 sm:p-12 rounded-2xl glass border border-gold-500/20 gold-glow">
            {/* Success icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center animate-pulse-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-ink-950"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            <h1 className="font-serif text-3xl font-bold text-ink-100 text-center mb-2">Payment Confirmed!</h1>
            <p className="text-sm text-ink-300 text-center mb-8">Your Master Strategist Collection is ready for download.</p>

            {/* Download section */}
            <div className="p-6 rounded-xl bg-ink-800/50 border border-gold-500/15 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gold-500/15 border border-gold-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-100">The Master Strategist Collection</p>
                  <p className="text-xs text-ink-400">PDF · ePub · Kindle · 24-hour access link</p>
                </div>
              </div>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  className="block w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 font-semibold text-center hover:from-gold-500 hover:to-gold-400 transition-all shadow-lg shadow-gold-500/20"
                >
                  Download Now
                </a>
              ) : (
                <p className="text-sm text-ink-300 text-center">
                  Your download link has been sent to your email. Check your inbox for the secure link.
                </p>
              )}
            </div>

            {/* Order details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink-300">
                <span>Order ID</span>
                <span className="font-mono text-ink-200">{order.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Amount Paid</span>
                <span className="text-gold-300">${order.amount} {order.currency}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Status</span>
                <span className="text-green-400">Confirmed</span>
              </div>
            </div>

            <a href="/" className="block text-center mt-8 text-sm text-gold-300 hover:text-gold-200 transition-colors">
              Return to store
            </a>
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-2xl glass border border-gold-500/20 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h1 className="font-serif text-2xl text-ink-100 mb-2">Payment Not Confirmed</h1>
            <p className="text-sm text-ink-300 mb-6">We couldn&apos;t confirm your payment. If you believe this is an error, please contact support with your order ID.</p>
            <p className="text-xs text-ink-400 mb-6">Order ID: {orderId.slice(0, 8)}...</p>
            <a href="/" className="text-gold-300 hover:text-gold-200 transition-colors text-sm">Return to store</a>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-ink-950"><div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
