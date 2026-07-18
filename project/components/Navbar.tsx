'use client';

import { useState, useEffect } from 'react';
export const dynamic = 'force-dynamic';
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-ink-950/80 backdrop-blur-xl border-b border-gold-500/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            {logoError ? (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-shadow">
                <span className="font-serif text-ink-950 font-bold text-lg">M</span>
              </div>
            ) : (
              <img
                src="/logo.png"
                alt="Master Strategist"
                className="w-9 h-9 rounded-lg object-cover shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-shadow"
                onError={() => setLogoError(true)}
              />
            )}
            <span className="font-serif text-lg sm:text-xl text-gold-200 font-semibold tracking-wide">Master Strategist</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#collection" className="text-sm text-ink-200 hover:text-gold-300 transition-colors">Collection</a>
            <a href="#features" className="text-sm text-ink-200 hover:text-gold-300 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-ink-200 hover:text-gold-300 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-ink-200 hover:text-gold-300 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-ink-200 hover:text-gold-300 transition-colors">FAQ</a>
            <a href="#pricing" className="px-5 py-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 text-sm font-semibold hover:from-gold-500 hover:to-gold-400 transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-400/40">
              Get the Bundle
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-ink-100"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-3 glass rounded-xl p-4">
              <a href="#collection" onClick={() => setMobileOpen(false)} className="text-sm text-ink-200 hover:text-gold-300 transition-colors py-2">Collection</a>
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm text-ink-200 hover:text-gold-300 transition-colors py-2">Features</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm text-ink-200 hover:text-gold-300 transition-colors py-2">How It Works</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-sm text-ink-200 hover:text-gold-300 transition-colors py-2">Pricing</a>
              <a href="#faq" onClick={() => setMobileOpen(false)} className="text-sm text-ink-200 hover:text-gold-300 transition-colors py-2">FAQ</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 text-sm font-semibold text-center">Get the Bundle</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
