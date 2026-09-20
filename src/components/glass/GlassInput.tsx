import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className = '', label, error, id, ...rest }, ref) => {
    return (
      <label className="block w-full">
        {label && <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>}
        <input
          ref={ref}
          id={id}
          className={[
            'w-full rounded-2xl border bg-white/60 px-4 py-3 text-ink placeholder:text-ink/40 backdrop-blur-xl transition-colors',
            'focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-burgundy/40',
            error ? 'border-red-400' : 'border-white/60',
            className,
          ].join(' ')}
          {...rest}
        />
        {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
      </label>
    );
  }
);
GlassInput.displayName = 'GlassInput';

interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className = '', label, error, id, ...rest }, ref) => {
    return (
      <label className="block w-full">
        {label && <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>}
        <textarea
          ref={ref}
          id={id}
          className={[
            'w-full rounded-2xl border bg-white/60 px-4 py-3 text-ink placeholder:text-ink/40 backdrop-blur-xl transition-colors',
            'focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-burgundy/40',
            error ? 'border-red-400' : 'border-white/60',
            className,
          ].join(' ')}
          {...rest}
        />
        {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
      </label>
    );
  }
);
GlassTextarea.displayName = 'GlassTextarea';

export default GlassInput;
