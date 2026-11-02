'use client';

import { useMemo, useState } from 'react';
import type { PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Box, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { PublicProductItem } from '@/types/public-catalog.types';

interface Product3DShowcaseProps {
  product: PublicProductItem;
  enableGpu3D: boolean;
}

export function Product3DShowcase({ product, enableGpu3D }: Product3DShowcaseProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [activeImage, setActiveImage] = useState<number>(0);
  const images = useMemo(
    () => product.gallery?.length ? product.gallery : [product.image],
    [product.gallery, product.image]
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enableGpu3D || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({
      rotateX: (0.5 - y) * 8,
      rotateY: (x - 0.5) * 9,
      glareX: x * 100,
      glareY: y * 100,
    });
  }

  function resetTilt() {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  }

  function changeImage(direction: -1 | 1) {
    setActiveImage((current) => (current + direction + images.length) % images.length);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={{
        transform: enableGpu3D
          ? `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
          : 'none',
        transition: 'transform 220ms cubic-bezier(0.2, 0.75, 0.25, 1)',
      }}
      className="opt-showcase relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#0b1115] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:p-4"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, var(--glow-ambient), transparent 55%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between px-1 pb-3">
        <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.19em] text-white/60 sm:text-[10px]">
          <Box className="h-3.5 w-3.5 text-theme-accent" /> Featured equipment / {product.division}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] text-white/55">
          <Sparkles className="h-3 w-3 text-theme-accent" /> {enableGpu3D ? 'Pointer studio' : 'Touch explorer'}
        </span>
      </div>

      <div className="opt-showcase-image-wrap group relative aspect-[4/3] overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#111a20]">
        <img
          src={images[activeImage] || product.image}
          alt={product.title}
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/10" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
          {product.badge}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1.5">
            <button type="button" onClick={() => changeImage(-1)} aria-label="Previous product image" className="rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-md transition hover:bg-black/70">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => changeImage(1)} aria-label="Next product image" className="rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-md transition hover:bg-black/70">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-20 text-white">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">{product.sku}</p>
          <h2 className="mt-1 max-w-sm text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{product.title}</h2>
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-3 px-1 pb-1 pt-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">Featured pick</p>
          <p className="mt-0.5 text-lg font-semibold text-white">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
        <Link href={`/product/${product.slug}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-theme-accent px-4 text-xs font-semibold text-theme-accent-fg transition hover:brightness-110">
          Inspect product <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
