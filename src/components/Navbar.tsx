'use client';

import Link from 'next/link';
import { useShopSettings } from '@/lib/hooks';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { withBasePath } from '@/lib/basePath';
import GlassButton from '@/components/glass/GlassButton';

const links = [
  { href: '/', label: 'Home' },
  { href: '/cakes?category=fresh-cream', label: 'Fresh Cream' },
  { href: '/cakes?category=butter-cream', label: 'Butter Cream' },
  { href: '/cakes?category=designer', label: 'Designer' },
  { href: '/custom', label: 'Custom Cakes' },
];

export default function Navbar() {
  const { settings } = useShopSettings();
  const businessName = settings?.businessName || 'M.R Cake Shop';

  return (
    <>
      {/* Desktop nav */}
      <header className="sticky top-0 z-40 hidden w-full px-6 pt-4 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/50 bg-white/60 px-6 py-3 shadow-glass backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath('/logo-icon.png')} alt="" className="h-9 w-9 object-contain" />
            <span className="font-display text-xl tracking-wide text-burgundy-dark">
              {businessName}
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink/70 transition-colors hover:text-burgundy"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <GlassButton
            variant="whatsapp"
            size="sm"
            onClick={() =>
              window.open(
                buildWhatsAppUrl(settings?.whatsappNumber || 'WHATSAPP_NUMBER_HERE', `Hello ${businessName}, I have a question about your cakes.`),
                '_blank'
              )
            }
          >
            WhatsApp
          </GlassButton>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath('/logo-icon.png')} alt="" className="h-8 w-8 object-contain" />
            <span className="font-display text-base tracking-wide text-burgundy-dark">
              {businessName}
            </span>
          </Link>
          <button
            aria-label="Message us on WhatsApp"
            onClick={() =>
              window.open(
                buildWhatsAppUrl(settings?.whatsappNumber || 'WHATSAPP_NUMBER_HERE', `Hello ${businessName}, I have a question about your cakes.`),
                '_blank'
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glass"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.61 1.4 5.12L2 22l5.13-1.48a9.83 9.83 0 0 0 4.91 1.31h.01c5.46 0 9.9-4.44 9.9-9.9C21.95 6.45 17.5 2 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.05.88.88-2.97-.2-.31a8.19 8.19 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.19-8.38 8.19Z" />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
