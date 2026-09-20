import { ButtonHTMLAttributes, forwardRef } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<NonNullable<GlassButtonProps['variant']>, string> = {
  primary: 'bg-burgundy text-ivory hover:bg-burgundy-dark shadow-glass border border-burgundy',
  secondary:
    'bg-white/60 text-burgundy-dark border border-champagne/60 hover:bg-white/80 backdrop-blur-xl',
  ghost: 'bg-transparent text-burgundy-dark hover:bg-white/40 border border-transparent',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1fbd5a] shadow-glass border border-[#1fbd5a]',
};

const sizeClasses: Record<NonNullable<GlassButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
GlassButton.displayName = 'GlassButton';

export default GlassButton;
