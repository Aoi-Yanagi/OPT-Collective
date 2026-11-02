'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface OptDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  eyebrow?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const DIALOG_EASE = [0.22, 1, 0.36, 1] as const;

const WIDTHS: Record<NonNullable<OptDialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Dialogs are portalled to document.body so sticky headers, transforms and
 * other stacking contexts cannot paint above the Theme Studio overlay.
 */
export function OptDialog({
  open,
  onClose,
  title,
  description,
  eyebrow,
  size = 'md',
  children,
  footer,
}: OptDialogProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!mounted || !open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [mounted, open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onCloseRef.current();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className={`opt-dialog-panel relative my-auto max-h-[calc(100dvh-1.5rem)] w-full ${WIDTHS[size]} overflow-hidden rounded-[1.6rem] border border-theme-border shadow-[0_36px_120px_rgba(0,0,0,0.55)] sm:max-h-[calc(100dvh-3rem)]`}
            initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 16, scale: 0.985, filter: 'blur(6px)' }}
            transition={{ duration: 0.34, ease: DIALOG_EASE }}
          >
            <div className="relative border-b border-theme-border px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <div className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-theme-accent/10 blur-3xl" />
              <button
                ref={closeRef}
                type="button"
                onClick={() => onCloseRef.current()}
                aria-label="Close dialog"
                className="absolute right-4 top-4 z-10 rounded-full border border-theme-border bg-theme-surface/80 p-2 text-theme-muted transition hover:border-theme-accent hover:text-theme-text sm:right-6 sm:top-6"
              >
                <X className="h-4 w-4" />
              </button>
              {eyebrow && <p className="relative mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-theme-accent">{eyebrow}</p>}
              <h2 id={titleId} className="relative max-w-[calc(100%-2.5rem)] text-xl font-semibold tracking-tight text-theme-text sm:text-2xl">{title}</h2>
              {description && <p id={descriptionId} className="relative mt-2 max-w-xl text-xs leading-6 text-theme-muted sm:text-sm">{description}</p>}
            </div>
            <div className="max-h-[min(62dvh,560px)] overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">{children}</div>
            {footer && <div className="border-t border-theme-border px-5 py-4 sm:px-7">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default OptDialog;
