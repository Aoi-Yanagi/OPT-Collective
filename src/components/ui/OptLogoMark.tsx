'use client';

import React from 'react';

export interface OptLogoMarkProps {
  size?: number;
  className?: string;
  withFrame?: boolean;
}

/**
 * Calligraphic-Geometric Merged O-P-T Monogram Insignia.
 * Uses flat `currentColor` vector geometry so any theme hue shift retains razor-sharp contrast.
 */
export function OptLogoMark({
  size = 36,
  className = '',
  withFrame = true,
}: OptLogoMarkProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex shrink-0 items-center justify-center ${
        withFrame
          ? 'rounded-xl border border-theme-accent/40 bg-theme-accent/10 text-theme-accent shadow-sm'
          : 'text-theme-accent'
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[78%] w-[78%]"
      >
        {/* Outer Calligraphic Oval 'O' with Stencil Negative-Space Cutouts */}
        <path
          d="M60 10C30.18 10 12 31.04 12 60C12 88.96 30.18 110 60 110C89.82 110 108 88.96 108 60C108 49.1 104.95 39.22 99.5 31.2H87.2C93.3 38.8 96.8 48.8 96.8 60C96.8 83.2 82.4 99.2 60 99.2C37.6 99.2 23.2 83.2 23.2 60C23.2 36.8 37.6 20.8 60 20.8C65.4 20.8 70.4 21.85 74.9 23.8L81.4 14.4C74.85 11.5 67.65 10 60 10Z"
          fill="currentColor"
        />

        {/* Sweeping Chiseled Top Crossbar of 'T' */}
        <path
          d="M32 30L37.5 21.5H88.5L83 30H64.5V95.5L53.5 99V30H32Z"
          fill="currentColor"
        />

        {/* Interlocked Calligraphic Bowl of 'P' Fused to Central Spine */}
        <path
          d="M59 41H74.5C84.72 41 91.5 46.82 91.5 55.5C91.5 64.18 84.72 70 74.5 70H59V61.2H73.2C78.4 61.2 81.6 58.95 81.6 55.5C81.6 52.05 78.4 49.8 73.2 49.8H59V41Z"
          fill="currentColor"
        />

        {/* Calligraphic Terminal Flourish Node */}
        <circle cx="44" cy="60" r="3.5" fill="currentColor" />
      </svg>
    </div>
  );
}

export default OptLogoMark;