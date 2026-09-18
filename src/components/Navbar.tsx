'use client';

import Link from 'next/link';
import { useShopSettings } from '@/lib/hooks';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
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

  return (
    <header className="sticky top-0 z-40 hidden w-full px-6 pt-4 md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/50 bg-white/60 px-6 py-3 shadow-glass backdrop-blur-xl">
        <Link href="/" className="font-display text-xl tracking-wide text-burgundy-dark">
          {settings?.businessName || 'M R Cake Shop'}
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
              buildWhatsAppUrl(settings?.whatsappNumber || 'WHATSAPP_NUMBER_HERE', `Hello ${settings?.businessName || 'M R Cake Shop'}, I have a question about your cakes.`),
              '_blank'
            )
          }
        >
          WhatsApp
        </GlassButton>
      </div>
    </header>
  );
}
