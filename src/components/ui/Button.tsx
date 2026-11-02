'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface OptButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: OptButtonProps) {
  const variants: Record<NonNullable<OptButtonProps['variant']>, string> = {
    primary: 'bg-theme-accent text-theme-accent-fg font-bold shadow-lg shadow-black/20 hover:opacity-95',
    glass: 'opt-glass text-theme-text hover:border-theme-accent/50',
    outline: 'border border-theme-border bg-transparent text-theme-text hover:border-theme-accent',
    danger: 'border border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20',
  };

  const sizes: Record<NonNullable<OptButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3.5 text-sm sm:text-base',
  };

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      className="inline-block"
    >
      <button
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 rounded-opt-btn font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-theme-accent/40 disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  );
}