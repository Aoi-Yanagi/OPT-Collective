'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { OptLogoMark } from './OptLogoMark';

const SESSION_KEY = 'opt_collective_brand_intro_seen_v2';
const QUOTES = [
  'Good things have a way of finding their place.',
  'Make room for what moves you.',
  'A little delight belongs in every daily ritual.',
  'Objects chosen well. Days lived better.',
  'For the desk, the drive, and everything between.',
  'The best details make ordinary days feel considered.',
  'Find the useful. Keep the beautiful.',
  'A better routine begins with one good choice.',
  'Small upgrades. More thoughtful moments.',
  'Bring home something that feels like you.',
];
const SHUTTERS = Array.from({ length: 10 }, (_, index) => index);
const EASE = [0.16, 1, 0.3, 1] as const;

function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    // A blocked session store should not prevent entry to the storefront.
  }
}

export function WelcomeScreen() {
  const [visible, setVisible] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === 'true') return;
    } catch {
      // Continue with the intro when storage is unavailable.
    }

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduceMotion) {
      markIntroSeen();
      return;
    }

    const quoteIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[quoteIndex]);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => skipRef.current?.focus(), 80);
    const finishTimer = window.setTimeout(() => {
      markIntroSeen();
      setVisible(false);
    }, 3400);
    function handleIntroKeys(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        markIntroSeen();
        setVisible(false);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        skipRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleIntroKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.clearTimeout(finishTimer);
      document.removeEventListener('keydown', handleIntroKeys);
    };
  }, [visible]);

  function skip(): void {
    markIntroSeen();
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="opt-brand-intro"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to The O.P.T. Collective"
          className="opt-welcome fixed inset-0 z-[9999] flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-10 text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, delay: 0.82 } }}
        >
          <div className="pointer-events-none absolute inset-0 z-[1] opt-welcome-grain" />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[min(78vw,620px)] w-[min(78vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            initial={{ scale: 0.22, opacity: 0.6 }}
            animate={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 2.3, ease: EASE }}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[min(58vw,420px)] w-[min(58vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'var(--glow-ambient)', filter: 'blur(55px)' }}
            initial={{ scale: 0.45, opacity: 0 }}
            animate={{ scale: [0.45, 1.08, 0.98], opacity: [0, 0.72, 0.35] }}
            transition={{ duration: 2.5, ease: EASE }}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-2xl flex-col items-center"
            initial={{ opacity: 0, scale: 0.94, y: 16, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.08, y: -12, filter: 'blur(12px)' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <motion.div
              initial={{ scale: 0.35, rotate: -28, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
              className="relative mb-7 flex items-center justify-center"
            >
              <motion.div
                className="absolute inset-[-24px] rounded-[2.2rem] border border-theme-accent/25"
                initial={{ scale: 0.78, opacity: 0 }}
                animate={{ scale: 1.18, opacity: [0, 0.8, 0.28] }}
                transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
              />
              <div className="opt-welcome-mark-frame relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.32)] sm:h-32 sm:w-32">
                <OptLogoMark size={92} withFrame={false} className="text-theme-accent sm:hidden" />
                <OptLogoMark size={106} withFrame={false} className="hidden text-theme-accent sm:inline-flex" />
              </div>
            </motion.div>

            <motion.p
              className="font-mono text-[9px] font-semibold uppercase tracking-[0.34em] text-theme-accent sm:text-[10px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.55, ease: EASE }}
            >
              Objects for better everyday rituals
            </motion.p>

            <div className="mt-3 overflow-hidden pb-2">
              <motion.h1
                className="text-3xl font-semibold tracking-[-0.055em] text-white sm:text-5xl md:text-6xl"
                initial={{ y: '112%', opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.85, delay: 0.78, ease: EASE }}
              >
                THE O.P.T. COLLECTIVE
              </motion.h1>
            </div>

            <motion.div
              className="mt-4 flex min-h-12 max-w-xl items-center justify-center gap-2 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.24, ease: EASE }}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-theme-accent/80" />
              <p aria-live="polite" className="text-sm font-medium leading-6 text-white/75 sm:text-base">“{quote}”</p>
            </motion.div>

            <motion.div
              className="mt-9 h-px w-48 overflow-hidden bg-white/15 sm:w-56"
              initial={{ opacity: 0, scaleX: 0.25 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.45, ease: EASE }}
            >
              <motion.div
                className="h-full w-full origin-left bg-theme-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.35, delay: 1.58, ease: 'linear' }}
              />
            </motion.div>
            <motion.p
              className="mt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.65, duration: 0.5 }}
            >
              A considered edit · India
            </motion.p>
          </motion.div>

          <motion.button
            ref={skipRef}
            type="button"
            onClick={skip}
            className="absolute bottom-7 right-6 z-20 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/65 transition hover:border-theme-accent/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-theme-accent sm:bottom-9 sm:right-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            Enter the collection <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>

          <div className="pointer-events-none absolute inset-0 z-0 grid grid-cols-10" aria-hidden="true">
            {SHUTTERS.map((index) => (
              <motion.div
                key={index}
                className="h-full border-r border-white/[0.025]"
                style={{ background: 'var(--bg-canvas)' }}
                initial={{ y: 0 }}
                exit={{
                  y: index % 2 === 0 ? '-105%' : '105%',
                  transition: { duration: 0.78, ease: [0.85, 0, 0.15, 1], delay: index * 0.035 },
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomeScreen;
