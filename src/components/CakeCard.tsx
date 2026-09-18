'use client';

import { CakeProduct } from '@/types/cake';
import { getStartingPrice, formatPrice } from '@/lib/pricing';
import GlassCard from '@/components/glass/GlassCard';
import { GlassBadge } from '@/components/glass/GlassPill';

interface CakeCardProps {
  product: CakeProduct;
  currency: string;
  onSelect: (product: CakeProduct) => void;
}

export default function CakeCard({ product, currency, onSelect }: CakeCardProps) {
  const startingPrice = getStartingPrice(product);

  return (
    <GlassCard
      padded={false}
      hoverLift
      className="group cursor-pointer overflow-hidden"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.designer && <GlassBadge tone="champagne">★ Designer</GlassBadge>}
          {product.featured && <GlassBadge tone="burgundy">Featured</GlassBadge>}
        </div>
        {product.egglessAvailable && (
          <div className="absolute bottom-3 right-3">
            <GlassBadge tone="neutral">Eggless available</GlassBadge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg leading-tight text-burgundy-dark">{product.name}</h3>
        <p className="mt-0.5 text-sm text-ink/60">
          {product.creamType === 'fresh-cream' ? 'Fresh Cream' : 'Butter Cream'}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-ink/70">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-base text-burgundy">
            {startingPrice !== null ? `From ${formatPrice(startingPrice, currency)}` : 'Price on request'}
          </span>
          <span className="rounded-full border border-champagne/70 px-3 py-1 text-xs font-medium text-burgundy-dark transition-colors group-hover:bg-champagne/20">
            View Cake
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
