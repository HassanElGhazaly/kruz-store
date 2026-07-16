'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { BookImages, BookFace } from './Book3DMockup';

type ZoomModalProps = {
  images: BookImages;
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

function ModalBookFace({
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

export default function ZoomModal({ images, title, isOpen, onClose }: ZoomModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotateY, setRotateY] = useState(-22);
  const [rotateX, setRotateX] = useState(-8);
  const [autoRotate, setAutoRotate] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startRX: number; startRY: number } | null>(null);

  useEffect(() => {
    if (!autoRotate) return;
    let raf: number;
    const animate = () => {
      setRotateY((prev) => (prev + 0.5) % 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, z + 0.2));
      if (e.key === '-') setZoom((z) => Math.max(0.5, z - 0.2));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (autoRotate) setAutoRotate(false);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startRX: rotateX, startRY: rotateY };
  }, [autoRotate, rotateX, rotateY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setRotateY(dragRef.current.startRY + dx * 0.5);
    setRotateX(Math.max(-45, Math.min(45, dragRef.current.startRX - dy * 0.3)));
  }, []);

  const handleMouseUp = useCallback(() => { dragRef.current = null; }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (autoRotate) setAutoRotate(false);
    if (e.touches.length > 0) {
      dragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, startRX: rotateX, startRY: rotateY };
    }
  }, [autoRotate, rotateX, rotateY]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragRef.current || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - dragRef.current.startX;
    const dy = e.touches[0].clientY - dragRef.current.startY;
    setRotateY(dragRef.current.startRY + dx * 0.5);
    setRotateX(Math.max(-45, Math.min(45, dragRef.current.startRX - dy * 0.3)));
  }, []);

  const handleTouchEnd = useCallback(() => { dragRef.current = null; }, []);

  const setView = (face: BookFace) => {
    setAutoRotate(false);
    if (face === 'front') { setRotateY(0); setRotateX(0); }
    if (face === 'spine') { setRotateY(-90); setRotateX(0); }
    if (face === 'back') { setRotateY(180); setRotateX(0); }
  };

  if (!isOpen) return null;

  const bookW = 280;
  const bookH = 400;
  const spineW = 42;

  const coverGradient = 'linear-gradient(145deg, #14141d 0%, #1c1c28 40%, #0c0c11 100%)';
  const backGradient = 'linear-gradient(225deg, #14141d 0%, #1c1c28 40%, #0c0c11 100%)';
  const spineGradient = 'linear-gradient(180deg, #1c1c28 0%, #14141d 50%, #0c0c11 100%)';

  const frontFallback = (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(201,162,39,0.3) 0%, transparent 50%)' }}
      />
      <div className="relative z-10">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full border-2 border-gold-500/40 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <p className="font-serif text-xl font-bold text-gold-gradient leading-tight mb-2">{title}</p>
        <p className="text-xs text-ink-300 tracking-widest uppercase">eBook Collection</p>
      </div>
    </div>
  );

  const backFallback = (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(201,162,39,0.2) 0%, transparent 50%)' }}
      />
      <p className="relative z-10 font-serif text-base text-gold-500/60 italic">Three timeless classics.<br />One transformative bundle.</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink-950/95 backdrop-blur-md animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gold-500/10">
        <div>
          <h3 className="font-serif text-lg sm:text-xl text-gold-200">{title}</h3>
          <p className="text-xs text-ink-300 mt-0.5">Interactive 3D Inspector</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector"
          className="flex items-center justify-center w-10 h-10 rounded-full glass border border-gold-500/20 text-ink-200 hover:text-gold-200 hover:border-gold-400/50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* 3D viewport */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1800px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute pointer-events-none" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%)' }} />

        <div
          className="relative preserve-3d"
          style={{
            width: bookW,
            height: bookH,
            transform: `scale(${zoom}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transition: autoRotate ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Front cover */}
          <div className="absolute inset-0 backface-hidden overflow-hidden rounded-r-md rounded-l-sm" style={{ transform: `translateZ(${spineW / 2}px)`, boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}>
            <ModalBookFace src={images.cover} alt="Front cover" gradient={coverGradient} fallbackContent={frontFallback} className="inset-0" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-2 border border-gold-500/30 rounded-r-md rounded-l-sm pointer-events-none" />
          </div>

          {/* Back cover */}
          <div className="absolute inset-0 backface-hidden overflow-hidden rounded-l-md rounded-r-sm" style={{ transform: `rotateY(180deg) translateZ(${spineW / 2}px)` }}>
            <ModalBookFace src={images.back} alt="Back cover" gradient={backGradient} fallbackContent={backFallback} className="inset-0" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-2 border border-gold-500/20 rounded-l-md rounded-r-sm pointer-events-none" />
          </div>

          {/* Spine */}
          <div className="absolute backface-hidden overflow-hidden" style={{ width: spineW, height: bookH, left: 0, top: 0, transform: `rotateY(-90deg) translateZ(${spineW / 2}px)`, transformOrigin: 'left center', boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.4)' }}>
            <ModalBookFace src={images.spine} alt="Spine" gradient={spineGradient} className="inset-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center p-1">
              <span className="text-gold-300 font-serif text-xs font-semibold tracking-widest whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{title}</span>
            </div>
          </div>

          {/* Pages */}
          <div className="absolute backface-hidden" style={{ width: bookW, height: spineW, left: 0, top: 0, transform: `rotateX(90deg) translateZ(${spineW / 2}px)`, transformOrigin: 'top center', backgroundImage: 'repeating-linear-gradient(90deg, #e8e6df 0px, #d4d2ca 1px, #e8e6df 3px)' }} />
          <div className="absolute backface-hidden" style={{ width: bookW, height: spineW, left: 0, bottom: 0, transform: `rotateX(-90deg) translateZ(${spineW / 2}px)`, transformOrigin: 'bottom center', backgroundImage: 'repeating-linear-gradient(90deg, #e8e6df 0px, #d4d2ca 1px, #e8e6df 3px)' }} />
          <div className="absolute backface-hidden" style={{ width: spineW, height: bookH, right: 0, top: 0, transform: `rotateY(90deg) translateZ(${spineW / 2}px)`, transformOrigin: 'right center', backgroundImage: 'repeating-linear-gradient(0deg, #e8e6df 0px, #d4d2ca 1px, #e8e6df 3px)' }} />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-ink-400 text-xs sm:text-sm pointer-events-none">Click & drag to rotate</div>
      </div>

      {/* Controls panel */}
      <div className="border-t border-gold-500/10 px-4 sm:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-xs text-ink-300 hidden sm:inline mr-2">View:</span>
            {(['front', 'spine', 'back'] as BookFace[]).map((face) => (
              <button key={face} onClick={() => setView(face)} className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg glass border border-gold-500/20 text-ink-100 hover:text-gold-200 hover:border-gold-400/50 hover:bg-gold-500/10 transition-all capitalize">{face}</button>
            ))}
            <button onClick={() => setAutoRotate(!autoRotate)} className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border transition-all flex items-center gap-1.5 ${autoRotate ? 'bg-gold-500/20 border-gold-400/50 text-gold-200' : 'glass border-gold-500/20 text-ink-100 hover:text-gold-200 hover:border-gold-400/50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={autoRotate ? 'animate-spin-slow' : ''}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
              Auto
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="flex-shrink-0 w-9 h-9 rounded-lg glass border border-gold-500/20 text-gold-200 hover:border-gold-400/50 hover:bg-gold-500/10 transition-all flex items-center justify-center" aria-label="Zoom out">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1"><span className="text-xs text-ink-300">Zoom</span><span className="text-xs text-gold-300 font-mono">{zoom.toFixed(1)}x</span></div>
                <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="gold-slider w-full" aria-label="Zoom level" />
              </div>
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="flex-shrink-0 w-9 h-9 rounded-lg glass border border-gold-500/20 text-gold-200 hover:border-gold-400/50 hover:bg-gold-500/10 transition-all flex items-center justify-center" aria-label="Zoom in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg glass border border-gold-500/20 text-gold-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1"><span className="text-xs text-ink-300">Rotate Y</span><span className="text-xs text-gold-300 font-mono">{Math.round(rotateY)}°</span></div>
                <input type="range" min="-180" max="360" step="1" value={rotateY} onChange={(e) => { setAutoRotate(false); setRotateY(parseFloat(e.target.value)); }} className="gold-slider w-full" aria-label="Rotate Y axis" />
              </div>
              <button onClick={() => { setRotateY(-22); setRotateX(-8); setZoom(1); setAutoRotate(false); }} className="flex-shrink-0 px-3 h-9 rounded-lg glass border border-gold-500/20 text-ink-200 hover:text-gold-200 hover:border-gold-400/50 transition-all text-xs whitespace-nowrap">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
