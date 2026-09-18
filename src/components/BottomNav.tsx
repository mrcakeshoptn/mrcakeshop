'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useShopSettings } from '@/lib/hooks';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const items = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/cakes', label: 'Cakes', icon: CakeIcon },
  { href: '/cakes?category=designer', label: 'Designer', icon: SparkleIcon },
  { href: '/custom', label: 'Custom', icon: PencilIcon },
];

export default function BottomNav() {
  const { settings } = useShopSettings();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.includes('category=designer')) return pathname === '/cakes' && category === 'designer';
    if (href === '/cakes') return pathname === '/cakes' && !category;
    return pathname === href;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/50 bg-white/70 pb-[env(safe-area-inset-bottom)] shadow-glass-lg backdrop-blur-xl md:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-stretch">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors',
              isActive(href) ? 'text-burgundy' : 'text-ink/50',
            ].join(' ')}
          >
            <Icon active={isActive(href)} />
            {label}
          </Link>
        ))}
        <button
          onClick={() =>
            window.open(
              buildWhatsAppUrl(
                settings?.whatsappNumber || 'WHATSAPP_NUMBER_HERE',
                `Hello ${settings?.businessName || 'M R Cake Shop'}, I have a question about your cakes.`
              ),
              '_blank'
            )
          }
          className="flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium text-[#25D366]"
        >
          <WhatsAppIcon />
          WhatsApp
        </button>
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CakeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M4 13h16v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 13c0-2 2-3 2-5M12 13c0-2-2-3-2-5M20 13c0-2-2-3-2-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v2" strokeLinecap="round" />
    </svg>
  );
}
function SparkleIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" strokeLinecap="round" />
    </svg>
  );
}
function PencilIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="m15 4 5 5L8 21H3v-5L15 4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.61 1.4 5.12L2 22l5.13-1.48a9.83 9.83 0 0 0 4.91 1.31h.01c5.46 0 9.9-4.44 9.9-9.9C21.95 6.45 17.5 2 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.05.88.88-2.97-.2-.31a8.19 8.19 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.19-8.38 8.19Z" />
    </svg>
  );
}
