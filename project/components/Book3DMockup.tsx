'use client';

import { useRef, useState, useCallback } from 'react';

export type BookFace = 'front' | 'spine' | 'back';

export type BookImages = {
  cover: string;
  spine: string;
  back: string;
};

type Book3DMockupProps = {
  images: BookImages;
  title: string;
  onZoomClick: () => void;
  className?: string;
};

// Fallback cover shown when /book-cover.png is not yet uploaded
function FallbackCover({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
      style={{
        background: 'linear-gradient(145deg, #14141d 0%, #1c1c28 40%, #0c0c11 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(201,162,39,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(160,120,38,0.2) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold-500/40 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <p className="font-serif text-lg font-bold text-gold-gradient leading-tight mb-1">{title}</p>
        {subtitle && <p className="text-[10px] text-ink-300 tracking-widest uppercase">{subtitle}</p>}
        <div className="mt-4 flex items-center justify-center gap-1">
          <span className="w-8 h-px bg-gold-500/40" />
          <span className="text-gold-500/60 text-xs">✦</span>
          <span className="w-8 h-px bg-gold-500/40" />
        </div>
      </div>
    </div>
  );
}

// Reusable book face that tries an image and falls back to gradient
function BookFace({
  src,
  alt,
  gradient,
  fallbackContent,
  className,
  style,
}: {
  src: string;
  alt: string;
  gradient: string;
  fallbackContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`absolute ${className || ''}`} style={style}>
      <div className="absolute inset-0 book-texture" />
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          draggable={false}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }}>
          {fallbackContent}
        </div>
      )}
    </div>
  );
}

export default function Book3DMockup({ images, title, onZoomClick, className = '' }: Book3DMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: -8, ry: -22 });
  const [isHovering, setIsHovering] = useState(false);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);
    const maxTilt = 20;
    const ry = -22 + dx * maxTilt;
    const rx = -8 - dy * 12;
    setTilt({ rx: Math.max(-25, Math.min(10, rx)), ry: Math.max(-42, Math.min(2, ry)) });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  }, [handlePointerMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handlePointerMove]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ rx: -8, ry: -22 });
  }, []);

  const bookW = 240;
  const bookH = 340;
  const spineW = 36;

  const coverGradient = 'linear-gradient(145deg, #14141d 0%, #1c1c28 40%, #0c0c11 100%)';
  const backGradient = 'linear-gradient(225deg, #14141d 0%, #1c1c28 40%, #0c0c11 100%)';
  const spineGradient = 'linear-gradient(180deg, #1c1c28 0%, #14141d 50%, #0c0c11 100%)';

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ perspective: '1400px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={handleMouseLeave}
    >
      {/* Ambient glow behind book */}
      <div
        className="absolute inset-0 blur-3xl opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(201,162,39,0.3) 0%, transparent 60%)',
          transform: 'scale(1.5)',
        }}
      />

      {/* The 3D book */}
      <div
        className="relative preserve-3d book-tilt mx-auto"
        style={{
          width: bookW,
          height: bookH,
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front cover */}
        <div
          className="absolute inset-0 backface-hidden overflow-hidden rounded-r-md rounded-l-sm shadow-2xl"
          style={{
            transform: `translateZ(${spineW / 2}px)`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,162,39,0.2)',
          }}
        >
          <BookFace
            src={images.cover}
            alt={`${title} cover`}
            gradient={coverGradient}
            fallbackContent={<FallbackCover title={title} subtitle="eBook Collection" />}
            className="inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-1.5 border border-gold-500/30 rounded-r-md rounded-l-sm pointer-events-none" />
        </div>

        {/* Back cover */}
        <div
          className="absolute inset-0 backface-hidden overflow-hidden rounded-l-md rounded-r-sm"
          style={{
            transform: `rotateY(180deg) translateZ(${spineW / 2}px)`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <BookFace
            src={images.back}
            alt={`${title} back`}
            gradient={backGradient}
            fallbackContent={
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(201,162,39,0.2) 0%, transparent 50%)' }}
                />
                <p className="relative z-10 font-serif text-sm text-gold-500/60 italic">Three timeless classics.<br />One transformative bundle.</p>
              </div>
            }
            className="inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/50 pointer-events-none" />
          <div className="absolute inset-1.5 border border-gold-500/20 rounded-l-md rounded-r-sm pointer-events-none" />
        </div>

        {/* Spine */}
        <div
          className="absolute backface-hidden overflow-hidden"
          style={{
            width: spineW,
            height: bookH,
            left: 0,
            top: 0,
            transform: `rotateY(-90deg) translateZ(${spineW / 2}px)`,
            transformOrigin: 'left center',
            boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.4)',
          }}
        >
          <BookFace
            src={images.spine}
            alt={`${title} spine`}
            gradient={spineGradient}
            className="inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center p-1">
            <span
              className="text-gold-300 font-serif text-[10px] font-semibold tracking-widest whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Pages — top edge */}
        <div
          className="absolute backface-hidden"
          style={{
            width: bookW,
            height: spineW,
            left: 0,
            top: 0,
            transform: `rotateX(90deg) translateZ(${spineW / 2}px)`,
            transformOrigin: 'top center',
            backgroundImage: 'repeating-linear-gradient(90deg, #e8e6df 0px, #d4d2ca 1px, #e8e6df 3px)',
          }}
        />
        {/* Pages — bottom edge */}
        <div
          className="absolute backface-hidden"
          style={{
            width: bookW,
            height: spineW,
            left: 0,
            bottom: 0,
            transform: `rotateX(-90deg) translateZ(${spineW / 2}px)`,
            transformOrigin: 'bottom center',
            backgroundImage: 'repeating-linear-gradient(90deg, #e8e6df 0px, #d4d2ca 1px, #e8e6df 3px)',
          }}
        />
        {/* Pages — right edge */}
        <div
          className="absolute backface-hidden"
          style={{
            width: spineW,
            height: bookH,
            right: 0,
            top: 0,
            transform: `rotateY(90deg) translateZ(${spineW / 2}px)`,
            transformOrigin: 'right center',
            backgroundImage: 'repeating-linear-gradient(0deg, #e8e6df 0px, #d4d2ca 1px, #e8e6df 3px)',
          }}
        />
      </div>

      {/* Zoom/Inspect button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onZoomClick();
        }}
        aria-label="Zoom and inspect"
        className={`absolute top-2 right-2 z-20 flex items-center justify-center w-10 h-10 rounded-full glass border border-gold-500/30 text-gold-300 hover:text-gold-100 hover:border-gold-400/60 hover:bg-gold-500/10 transition-all duration-300 group ${isHovering ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      {/* Floating particles */}
      <div className="absolute -top-4 -left-4 w-2 h-2 rounded-full bg-gold-400/30 animate-float pointer-events-none" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 -right-6 w-1.5 h-1.5 rounded-full bg-gold-300/20 animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-2 left-1/4 w-1 h-1 rounded-full bg-gold-500/30 animate-float pointer-events-none" style={{ animationDelay: '4s' }} />
    </div>
  );
}
