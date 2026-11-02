'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

interface StoryStage {
  step: string;
  title: string;
  metric: string;
  description: string;
}

const ERGONOMIC_STAGES: StoryStage[] = [
  {
    step: '01 // CERVICAL ALIGNMENT',
    title: '6-Axis Eye-Level Elevation',
    metric: '-42% Neck Strain',
    description: 'Raises your laptop screen 15cm to match natural eye level during 8-hour study and coding marathons.',
  },
  {
    step: '02 // THERMAL DISSIPATION',
    title: 'Open-Mesh CNC Aluminum',
    metric: '-8°C Core Temp',
    description: 'Anodized 6061 alloy acts as a passive heatsink, preventing thermal throttling without noisy fans.',
  },
  {
    step: '03 // DUAL-HABITAT UTILITY',
    title: 'Desk to Car Cabin Crossover',
    metric: '55D High-Density',
    description: 'Orthopedic memory foam and stealth organizers engineered for both your study chair and daily drive.',
  },
];

export function ScrollStorySection({ enableGsap }: { enableGsap: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enableGsap || typeof window === 'undefined' || !sectionRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.opt-story-card',
        { opacity: 0.25, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [enableGsap]);

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-theme-accent">
            LAYER 2 // SCROLL STORYTELLING
          </span>
          <h2 className="mt-1 text-2xl font-bold text-theme-text">
            Engineered for 10-Hour Indian Work & Commute Cycles
          </h2>
        </div>
        <span className="font-mono text-xs text-theme-muted">
          {enableGsap ? 'GSAP ScrollTrigger Active (Desktop)' : 'Native High-FPS Scroll (Mobile)'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ERGONOMIC_STAGES.map((item) => (
          <div key={item.step} className="opt-story-card opt-glass p-6">
            <div className="flex items-center justify-between font-mono text-xs text-theme-muted">
              <span>{item.step}</span>
              <span className="rounded-full bg-theme-accent/15 px-2.5 py-0.5 font-semibold text-theme-accent">
                {item.metric}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-theme-text">{item.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-theme-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}