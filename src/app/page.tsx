'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useActiveProducts, useShopSettings } from '@/lib/hooks';
import { CakeProduct } from '@/types/cake';
import CakeCard from '@/components/CakeCard';
import CakeDetailModal from '@/components/CakeDetailModal';
import GlassButton from '@/components/glass/GlassButton';
import GlassCard from '@/components/glass/GlassCard';
import { CakeGridSkeleton, EmptyState } from '@/components/StateViews';

function Section({
  title,
  href,
  products,
  currency,
  onSelect,
  loading,
}: {
  title: string;
  href: string;
  products: CakeProduct[];
  currency: string;
  onSelect: (p: CakeProduct) => void;
  loading: boolean;
}) {
  if (!loading && products.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-2xl text-burgundy-dark sm:text-3xl">{title}</h2>
        <Link href={href} className="text-sm font-medium text-burgundy hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <CakeGridSkeleton count={4} />
        ) : (
          products.slice(0, 4).map((p) => (
            <CakeCard key={p.id} product={p} currency={currency} onSelect={onSelect} />
          ))
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { products, loading } = useActiveProducts();
  const { settings } = useShopSettings();
  const [selected, setSelected] = useState<CakeProduct | null>(null);

  const featured = products.filter((p) => p.featured);
  const freshCream = products.filter((p) => p.category === 'fresh-cream');
  const butterCream = products.filter((p) => p.category === 'butter-cream');
  const designer = products.filter((p) => p.category === 'designer');

  return (
    <div>
      <section className="relative mx-auto max-w-6xl px-5 pt-10 sm:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="animate-fade-up">
            <p className="mb-3 inline-block rounded-full border border-champagne/60 bg-white/50 px-4 py-1.5 text-xs font-medium text-burgundy-dark backdrop-blur-xl">
              {settings?.address || 'Tiruppur, Tamil Nadu'}
            </p>
            <h1 className="font-display text-4xl leading-[1.1] text-burgundy-dark sm:text-5xl lg:text-6xl">
              Beautiful Cakes,
              <br />
              Made for Your Moments.
            </h1>
            <p className="mt-4 max-w-md text-base text-ink/70">
              Freshly crafted cakes for birthdays, celebrations and every special occasion — browse
              the catalogue and order in a few taps.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/cakes">
                <GlassButton size="lg">Explore Cakes</GlassButton>
              </Link>
              <Link href="/custom">
                <GlassButton size="lg" variant="secondary">
                  Custom Cake
                </GlassButton>
              </Link>
            </div>
          </div>
          <GlassCard padded={false} className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                settings?.heroImageDataUrl ||
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80'
              }
              alt="A freshly decorated celebration cake"
              className="aspect-[4/5] w-full object-cover sm:aspect-square"
            />
          </GlassCard>
        </div>
      </section>

      <Section
        title="Featured Cakes"
        href="/cakes"
        products={featured}
        currency={settings?.currency || '₹'}
        onSelect={setSelected}
        loading={loading}
      />
      <Section
        title="Fresh Cream Cakes"
        href="/cakes?category=fresh-cream"
        products={freshCream}
        currency={settings?.currency || '₹'}
        onSelect={setSelected}
        loading={loading}
      />
      <Section
        title="Butter Cream Cakes"
        href="/cakes?category=butter-cream"
        products={butterCream}
        currency={settings?.currency || '₹'}
        onSelect={setSelected}
        loading={loading}
      />
      <Section
        title="Designer Cakes"
        href="/cakes?category=designer"
        products={designer}
        currency={settings?.currency || '₹'}
        onSelect={setSelected}
        loading={loading}
      />

      {!loading && products.length === 0 && (
        <div className="mx-auto max-w-6xl px-5 py-10">
          <EmptyState title="No cakes found" hint="Try another search or category." />
        </div>
      )}

      <section className="mx-auto max-w-6xl px-5 py-12">
        <GlassCard className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-2xl text-burgundy-dark">Have a design in mind?</h3>
            <p className="mt-1 text-sm text-ink/70">
              Upload your reference and send us your requirements.
            </p>
          </div>
          <Link href="/custom">
            <GlassButton size="md">Request Custom Cake</GlassButton>
          </Link>
        </GlassCard>
      </section>

      {settings && (
        <CakeDetailModal product={selected} settings={settings} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
