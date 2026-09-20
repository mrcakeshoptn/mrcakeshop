import { SelectHTMLAttributes, forwardRef } from 'react';

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ className = '', label, id, children, ...rest }, ref) => {
    return (
      <label className="block w-full">
        {label && <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>}
        <select
          ref={ref}
          id={id}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236B1F32' viewBox='0 0 16 16'><path d='M8 11L3 6h10z'/></svg>\")",
            backgroundPosition: 'right 1rem center',
            backgroundRepeat: 'no-repeat',
          }}
          className={[
            'w-full appearance-none rounded-2xl border border-white/60 bg-white/60 px-4 py-3 pr-10 text-ink backdrop-blur-xl transition-colors',
            'focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-burgundy/40',
            className,
          ].join(' ')}
          {...rest}
        >
          {children}
        </select>
      </label>
    );
  }
);
GlassSelect.displayName = 'GlassSelect';

export default GlassSelect;
