'use client';

import Link from 'next/link';
import { useShopSettings } from '@/lib/hooks';
import { withBasePath } from '@/lib/basePath';

export default function Footer() {
  const { settings } = useShopSettings();

  return (
    <footer className="mx-auto max-w-6xl px-5 pb-8 pt-6">
      <div className="rounded-3xl border border-white/50 bg-white/40 p-6 text-center backdrop-blur-xl sm:text-left">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath('/logo-lockup.png')}
              alt={`${settings?.businessName || 'M.R Cake Shop'} — Baking Happiness Since Always`}
              className="mx-auto h-10 w-auto object-contain sm:mx-0"
            />
            <p className="mt-2 text-xs text-ink/50">{settings?.address || 'Tiruppur, Tamil Nadu, India'}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium sm:justify-start">
              {settings?.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy hover:underline"
                >
                  Get Directions
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy hover:underline"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink/60 sm:justify-end">
            <Link href="/about" className="hover:text-burgundy">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-burgundy">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-burgundy">
              Privacy Policy
            </Link>
          </nav>
        </div>
        <p className="mt-5 text-xs text-ink/40">
          © {new Date().getFullYear()} {settings?.businessName || 'M.R Cake Shop'}. Order requests
          are confirmed over WhatsApp.
        </p>
      </div>
    </footer>
  );
}
