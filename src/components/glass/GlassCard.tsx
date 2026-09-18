import { HTMLAttributes, forwardRef } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hoverLift?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = '', padded = true, hoverLift = false, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-3xl border border-white/50 bg-white/55 shadow-glass backdrop-blur-xl',
          padded ? 'p-5' : '',
          hoverLift ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-glass-lg' : '',
          className,
        ].join(' ')}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

export default GlassCard;
