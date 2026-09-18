import { ButtonHTMLAttributes } from 'react';

interface GlassPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function GlassPill({ active = false, className = '', children, ...rest }: GlassPillProps) {
  return (
    <button
      className={[
        'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95',
        active
          ? 'border-burgundy bg-burgundy text-ivory shadow-glass'
          : 'border-white/60 bg-white/50 text-burgundy-dark backdrop-blur-xl hover:bg-white/75',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}

interface GlassBadgeProps {
  children: React.ReactNode;
  tone?: 'burgundy' | 'champagne' | 'neutral';
}

export function GlassBadge({ children, tone = 'burgundy' }: GlassBadgeProps) {
  const toneClasses = {
    burgundy: 'bg-burgundy/90 text-ivory',
    champagne: 'bg-champagne text-burgundy-dark',
    neutral: 'bg-white/80 text-ink',
  } as const;

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-md',
        toneClasses[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
