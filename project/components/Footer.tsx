export const dynamic = 'force-dynamic';
export default function Footer() {
  return (
    <footer className="relative border-t border-gold-500/10 bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
                <span className="font-serif text-ink-950 font-bold text-lg">M</span>
              </div>
              <span className="font-serif text-lg text-gold-200 font-semibold">Master Strategist</span>
            </div>
            <p className="text-sm text-ink-300 leading-relaxed max-w-xs">
              Timeless wisdom for the modern leader. Master power, strategy, and stoic resilience.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gold-200 mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#collection" className="text-sm text-ink-300 hover:text-gold-300 transition-colors">The Collection</a></li>
              <li><a href="#features" className="text-sm text-ink-300 hover:text-gold-300 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-ink-300 hover:text-gold-300 transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-sm text-ink-300 hover:text-gold-300 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-sm font-semibold text-gold-200 mb-4">Secure Payment</h4>
            <p className="text-sm text-ink-300 mb-3">Pay with cryptocurrency via Cryptomus. Secure, fast, and private.</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-md glass border border-gold-500/20 text-xs text-ink-200">BTC</span>
              <span className="px-3 py-1.5 rounded-md glass border border-gold-500/20 text-xs text-ink-200">ETH</span>
              <span className="px-3 py-1.5 rounded-md glass border border-gold-500/20 text-xs text-ink-200">USDT</span>
              <span className="px-3 py-1.5 rounded-md glass border border-gold-500/20 text-xs text-ink-200">+more</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-400">© {new Date().getFullYear()} The Master Strategist Collection. All rights reserved.</p>
          <p className="text-xs text-ink-400">Instant digital delivery · 100% satisfaction guarantee</p>
        </div>
      </div>
    </footer>
  );
}
