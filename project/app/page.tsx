'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Book3DMockup from '@/components/Book3DMockup';
import ZoomModal from '@/components/ZoomModal';
import { fetchProductBySlug, type Product } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => {
    fetchProductBySlug('master-strategist-collection').then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, []);

  // Use local public assets with graceful fallback to CSS gradients
  const bookImages = { cover: '/book-cover.png', spine: '/book-cover.png', back: '/book-cover.png' };

  const faqs = [
    { q: 'What formats are included?', a: 'The bundle includes PDF, ePub, and Kindle (MOBI) formats — compatible with every device, phone, tablet, e-reader, or computer.' },
    { q: 'How do I receive my eBooks?', a: 'After payment confirmation via cryptocurrency, you\'ll instantly receive a secure download link via email and on-screen. No waiting, no shipping.' },
    { q: 'What cryptocurrencies do you accept?', a: 'We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT), and many more through our Cryptomus payment gateway.' },
    { q: 'Is there a money-back guarantee?', a: 'Yes. If you\'re not satisfied within 30 days, contact us for a full refund — no questions asked.' },
    { q: 'Do I get future updates?', a: 'Absolutely. Your purchase includes lifetime access with free updates whenever we improve the formatting, add bonus content, or release new editions.' },
  ];

  const discount = product?.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  return (
    <main className="relative min-h-screen bg-ink-950 overflow-x-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gold-700/5 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {product && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-gold-500/30 mb-6">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-xs text-gold-200 font-medium tracking-wide">Limited Time — {discount}% OFF</span>
              </div>
            )}

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-ink-100">The </span>
              <span className="text-gold-gradient">Master Strategist</span>
              <span className="text-ink-100"> Collection</span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-200 mb-3 font-serif italic">
              {product?.tagline || 'Three timeless classics. One transformative bundle.'}
            </p>

            <p className="text-base text-ink-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Master the art of power, strategy, and stoic resilience. Machiavelli, Sun Tzu, and Marcus Aurelius — meticulously curated for the modern leader.
            </p>

            {/* Price */}
            {product && (
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <span className="text-4xl font-serif font-bold text-gold-200">${product.price.toFixed(0)}</span>
                <span className="text-xl text-ink-400 line-through">${product.compare_at_price?.toFixed(0)}</span>
                <span className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-sm text-gold-300 font-semibold">Save {discount}%</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={`/checkout?product=${product?.slug || 'master-strategist-collection'}`}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 font-semibold text-base hover:from-gold-500 hover:to-gold-400 transition-all shadow-xl shadow-gold-500/20 hover:shadow-gold-400/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Instant Access
              </a>
              <button
                onClick={() => setZoomOpen(true)}
                className="px-8 py-4 rounded-xl glass border border-gold-500/20 text-ink-100 font-medium text-base hover:text-gold-200 hover:border-gold-400/50 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                Inspect in 3D
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 text-xs text-ink-400">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="20 6 9 17 4 12"/></svg>
                Instant Download
              </span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="20 6 9 17 4 12"/></svg>
                Lifetime Access
              </span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="20 6 9 17 4 12"/></svg>
                Crypto Payment
              </span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="20 6 9 17 4 12"/></svg>
                30-Day Guarantee
              </span>
            </div>
          </div>

          {/* Right: 3D Book */}
          <div className="flex justify-center items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {loading ? (
              <div className="w-[240px] h-[340px] rounded-lg glass animate-pulse" />
            ) : (
              <Book3DMockup
                images={bookImages}
                title="The Master Strategist Collection"
                onZoomClick={() => setZoomOpen(true)}
              />
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-ink-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-gold-400 font-medium tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-100 mb-4">
              Secure Payment. Instant Delivery.
            </h2>
            <p className="text-ink-300 max-w-2xl mx-auto">
              From checkout to download in three simple steps. Your payment is secured by blockchain cryptography — no banks, no middlemen, no delays.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl glass border border-gold-500/10 hover:border-gold-500/25 transition-all duration-500 group">
              <div className="absolute -top-4 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-serif text-ink-950 font-bold text-lg shadow-lg shadow-gold-500/20">
                1
              </div>
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-200 mb-2">Enter Your Email</h3>
              <p className="text-sm text-ink-300 leading-relaxed">
                Provide your email address so we can send your secure download link. No account needed — just one field.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl glass border border-gold-500/10 hover:border-gold-500/25 transition-all duration-500 group">
              <div className="absolute -top-4 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-serif text-ink-950 font-bold text-lg shadow-lg shadow-gold-500/20">
                2
              </div>
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.5 8.5h5a2 2 0 0 1 0 5h-5a2 2 0 0 0 0 5h5" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-200 mb-2">Pay with Crypto</h3>
              <p className="text-sm text-ink-300 leading-relaxed">
                Choose from Bitcoin, Ethereum, USDT, and more. Payments are secured by the Cryptomus gateway with blockchain-level encryption.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'TRX'].map((coin) => (
                  <span key={coin} className="px-2 py-0.5 rounded-md bg-gold-500/5 border border-gold-500/10 text-[10px] text-ink-200">{coin}</span>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl glass border border-gold-500/10 hover:border-gold-500/25 transition-all duration-500 group">
              <div className="absolute -top-4 left-8 w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-serif text-ink-950 font-bold text-lg shadow-lg shadow-gold-500/20">
                3
              </div>
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-200 mb-2">Instant Download</h3>
              <p className="text-sm text-ink-300 leading-relaxed">
                The moment your payment is confirmed on the blockchain, you receive a secure signed download link — instantly on screen and via email.
              </p>
            </div>
          </div>

          {/* Security badge row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 text-sm text-ink-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              100% Secure Payment
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Instant Delivery
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Blockchain Verified
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400"><polyline points="20 6 9 17 4 12"/></svg>
              30-Day Money Back
            </div>
          </div>
        </div>
      </section>

      {/* The Collection Section */}
      <section id="collection" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-gold-400 font-medium tracking-widest uppercase mb-3">The Collection</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-100 mb-4">
              Three Books That Shaped History
            </h2>
            <p className="text-ink-300 max-w-2xl mx-auto">
              Each masterpiece has guided leaders, conquerors, and thinkers for centuries. Together, they form the ultimate strategic library.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {product?.books?.map((book, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl glass border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 hover:gold-glow"
              >
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center font-serif text-gold-300 font-bold">
                  {i + 1}
                </div>
                <div className="mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-600/20 to-gold-800/20 border border-gold-500/20 flex items-center justify-center mb-4 group-hover:from-gold-500/30 group-hover:to-gold-700/30 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gold-200 mb-1">{book.title}</h3>
                  <p className="text-sm text-ink-400">by {book.author}</p>
                </div>
                <p className="text-sm text-ink-300 leading-relaxed">{book.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-ink-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-gold-400 font-medium tracking-widest uppercase mb-3">Why Choose Us</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-100">
              A Premium Reading Experience
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product?.features?.map((feature, i) => {
              const icons = [
                <svg key="i" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                <svg key="i" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                <svg key="i" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
                <svg key="i" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                <svg key="i" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
                <svg key="i" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.39 0 4.68.94 6.36 2.64L21 8"/><path d="M21 3v5h-5"/></svg>,
              ];
              return (
                <div key={i} className="p-6 rounded-xl glass border border-gold-500/10 hover:border-gold-500/25 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-4 group-hover:bg-gold-500/15 group-hover:scale-110 transition-all">
                    {icons[i % icons.length]}
                  </div>
                  <p className="text-sm text-ink-200 leading-relaxed">{feature}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-400 font-medium tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-100 mb-4">
              Invest in Your Strategic Mind
            </h2>
            <p className="text-ink-300">One-time payment. Lifetime access. Instant delivery.</p>
          </div>

          <div className="relative p-8 sm:p-12 rounded-3xl glass border border-gold-500/20 gold-glow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 text-sm font-semibold">
              Best Value
            </div>

            <div className="text-center">
              <h3 className="font-serif text-2xl text-gold-200 mb-2">{product?.title || 'The Master Strategist Collection'}</h3>
              <p className="text-sm text-ink-400 mb-6">{product?.books?.length || 3} eBooks + Bonus Study Guides</p>

              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-5xl font-serif font-bold text-gold-200">${product?.price?.toFixed(0) || '29'}</span>
                <div className="text-left">
                  <span className="block text-lg text-ink-400 line-through">${product?.compare_at_price?.toFixed(0) || '79'}</span>
                  <span className="block text-sm text-gold-400 font-semibold">{discount}% OFF</span>
                </div>
              </div>

              <p className="text-xs text-ink-400 mb-8">One-time payment · No subscription</p>

              <a
                href={`/checkout?product=${product?.slug || 'master-strategist-collection'}`}
                className="block w-full px-8 py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 font-semibold text-base hover:from-gold-500 hover:to-gold-400 transition-all shadow-xl shadow-gold-500/20 hover:shadow-gold-400/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Buy Now with Crypto
              </a>

              <div className="mt-8 space-y-3 text-left">
                {product?.features?.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400 flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-sm text-ink-200">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-ink-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gold-400 font-medium tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl glass border border-gold-500/10 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gold-500/5 transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-ink-100">{faq.q}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-gold-400 flex-shrink-0 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-ink-300 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-100 mb-6">
            Begin Your Journey to <span className="text-gold-gradient">Mastery</span>
          </h2>
          <p className="text-ink-300 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who have transformed their strategic thinking with these timeless classics.
          </p>
          <a
            href={`/checkout?product=${product?.slug || 'master-strategist-collection'}`}
            className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 font-semibold text-base hover:from-gold-500 hover:to-gold-400 transition-all shadow-xl shadow-gold-500/20 hover:shadow-gold-400/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get the Collection Now
          </a>
        </div>
      </section>

      <Footer />

      {/* Zoom Modal */}
      {product && (
        <ZoomModal
          images={bookImages}
          title="The Master Strategist Collection"
          isOpen={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </main>
  );
}
