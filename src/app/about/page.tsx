'use client';

import { useShopSettings } from '@/lib/hooks';
import GlassCard from '@/components/glass/GlassCard';

export default function AboutPage() {
  const { settings } = useShopSettings();
  const name = settings?.businessName || 'M.R Cake Shop';

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8 text-center">
        <p className="mb-3 inline-block rounded-full border border-champagne/60 bg-white/50 px-4 py-1.5 text-xs font-medium text-burgundy-dark backdrop-blur-xl">
          Our Story
        </p>
        <h1 className="font-display text-3xl text-burgundy-dark sm:text-4xl">About {name}</h1>
      </div>

      <GlassCard className="space-y-5 p-7 sm:p-9">
        <p className="text-sm leading-relaxed text-ink/75">
          {name} bakes fresh cream, butter cream and designer cakes for the celebrations that
          matter most — birthdays, anniversaries, weddings and everyday moments worth marking
          with something sweet. Every cake is made to order, using fresh ingredients and finished
          by hand.
        </p>
        <p className="text-sm leading-relaxed text-ink/75">
          We&apos;re based in {settings?.address || 'Tiruppur, Tamil Nadu'}, and we keep things
          simple: browse the catalogue, choose your weight, shape and flavour, and send us your
          order request on WhatsApp. We&apos;ll confirm availability, final pricing and your
          pickup or delivery details directly with you.
        </p>
        <p className="text-sm leading-relaxed text-ink/75">
          For custom designs — theme cakes, photo cakes, or anything you have in mind — the{' '}
          <a href="/custom" className="font-medium text-burgundy hover:underline">
            Custom Cake
          </a>{' '}
          page lets you share your reference and requirements directly with our team.
        </p>

        <div className="grid grid-cols-1 gap-4 border-t border-white/60 pt-6 sm:grid-cols-3">
          <div className="text-center">
            <p className="font-display text-2xl text-burgundy">Fresh</p>
            <p className="mt-1 text-xs text-ink/60">Made to order, never stored</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl text-burgundy">Custom</p>
            <p className="mt-1 text-xs text-ink/60">Designed around your occasion</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl text-burgundy">Local</p>
            <p className="mt-1 text-xs text-ink/60">Baked and finished in Tiruppur</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
