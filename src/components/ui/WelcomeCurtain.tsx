'use client';

import React, { useEffect, useState } from 'react';

const WELCOME_SESSION_KEY = 'opt_collective_welcome_seen_v1';

export function WelcomeScreen() {
  const [visible, setVisible] = useState<boolean>(false);
  const [fadingOut, setFadingOut] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Skip immediately if user prefers reduced motion
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reducedMotion) return;

    // 2. Only play once per browser session
    const alreadySeen = window.sessionStorage.getItem(WELCOME_SESSION_KEY);
    if (alreadySeen === 'true') return;

    setVisible(true);

    const fadeTimer = window.setTimeout(() => {
      setFadingOut(true);
    }, 1100);

    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(WELCOME_SESSION_KEY, 'true');
      setVisible(false);
    }, 1550);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  function handleSkipWelcome() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(WELCOME_SESSION_KEY, 'true');
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome to The O.P.T. Collective"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07090e] px-4 text-center transition-opacity duration-500 ${
        fadingOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle Ambient Illumination */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-theme-accent/15 blur-3xl" />

      {/* Calligraphic O-P-T Monogram Emblem */}
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-theme-accent/40 bg-theme-accent/10 text-theme-accent shadow-2xl">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
        >
          {/* Outer Calligraphic Ribbon 'O' */}
          <path
            d="M60 10C30.18 10 12 31.04 12 60C12 88.96 30.18 110 60 110C89.82 110 108 88.96 108 60C108 49.1 104.95 39.22 99.5 31.2H87.2C93.3 38.8 96.8 48.8 96.8 60C96.8 83.2 82.4 99.2 60 99.2C37.6 99.2 23.2 83.2 23.2 60C23.2 36.8 37.6 20.8 60 20.8C65.4 20.8 70.4 21.85 74.9 23.8L81.4 14.4C74.85 11.5 67.65 10 60 10Z"
            fill="currentColor"
          />
          {/* Shared Central Stem & Crossbar of 'T' */}
          <path
            d="M32 30L37.5 21.5H88.5L83 30H64.5V95.5L53.5 99V30H32Z"
            fill="#F8FAFC"
          />
          {/* Interlocked Bowl of 'P' */}
          <path
            d="M59 41H74.5C84.72 41 91.5 46.82 91.5 55.5C91.5 64.18 84.72 70 74.5 70H59V61.2H73.2C78.4 61.2 81.6 58.95 81.6 55.5C81.6 52.05 78.4 49.8 73.2 49.8H59V41Z"
            fill="currentColor"
          />
          <circle cx="44" cy="60" r="3.5" fill="currentColor" />
        </svg>
      </div>

      {/* Brand Identity & Tagline */}
      <p className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-theme-accent">
        THE O.P.T. COLLECTIVE
      </p>
      <h2 className="mt-1.5 text-lg font-extrabold tracking-tight text-white sm:text-xl">
        Optimal Performance Tools &amp; Curated Viral Essentials
      </h2>
      <p className="mt-1 font-mono text-[11px] text-slate-400">
        Direct Partner Hub Dispatch • Verified QR Checkout
      </p>

      {/* Progress Line */}
      <div className="mt-6 h-1 w-44 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-full origin-left animate-pulse bg-theme-accent" />
      </div>

      {/* Instant Skip Button for Accessibility */}
      <button
        type="button"
        onClick={handleSkipWelcome}
        className="mt-6 rounded-full border border-white/15 bg-white/5 px-4 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300 hover:border-theme-accent hover:text-white"
      >
        Enter Storefront →
      </button>
    </div>
  );
}

export default WelcomeScreen;