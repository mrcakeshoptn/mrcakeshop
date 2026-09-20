'use client';

import { ReactNode, useEffect } from 'react';

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidthClassName?: string;
}

export default function GlassModal({
  open,
  onClose,
  children,
  title,
  maxWidthClassName = 'max-w-2xl',
}: GlassModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-burgundy-dark/40 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={[
          'animate-scale-in max-h-[92vh] w-full overflow-y-auto rounded-t-4xl border border-white/50 bg-white/85 p-6 shadow-glass-lg backdrop-blur-2xl sm:rounded-4xl sm:p-8',
          maxWidthClassName,
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-burgundy-dark">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-ink/60 transition hover:bg-black/5 hover:text-ink"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
