'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useActiveProducts, useShopSettings } from '@/lib/hooks';
import { CakeCategory, CakeProduct } from '@/types/cake';
import { getStartingPrice } from '@/lib/pricing';
import CakeCard from '@/components/CakeCard';
import CakeDetailModal from '@/components/CakeDetailModal';
import { GlassPill } from '@/components/glass/GlassPill';
import GlassInput from '@/components/glass/GlassInput';
import GlassSelect from '@/components/glass/GlassSelect';
import { CakeGridSkeleton, EmptyState } from '@/components/StateViews';

type FilterKey = 'all' | CakeCategory | 'eggless';
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fresh-cream', label: 'Fresh Cream' },
  { key: 'butter-cream', label: 'Butter Cream' },
  { key: 'designer', label: 'Designer' },
  { key: 'eggless', label: 'Eggless' },
];

export default function CakesClient() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as FilterKey) || 'all';

  const { products, loading } = useActiveProducts();
  const { settings } = useShopSettings();
  const [filter, setFilter] = useState<FilterKey>(initialCategory);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [selected, setSelected] = useState<CakeProduct | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];

    if (filter === 'eggless') {
      list = list.filter((p) => p.egglessAvailable);
    } else if (filter !== 'all') {
      list = list.filter((p) => p.category === filter);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.flavour.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.creamType.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => (getStartingPrice(a) ?? 0) - (getStartingPrice(b) ?? 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (getStartingPrice(b) ?? 0) - (getStartingPrice(a) ?? 0));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);
    }

    return list;
  }, [products, filter, query, sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="font-display text-3xl text-burgundy-dark sm:text-4xl">Our Cakes</h1>
      <p className="mt-1 text-sm text-ink/60">
        Browse fresh cream, butter cream and designer cakes — customise weight, shape and more.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <GlassInput
          placeholder="Search by name, flavour or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <GlassSelect value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="sm:max-w-[200px]">
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </GlassSelect>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <GlassPill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </GlassPill>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <CakeGridSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No cakes found" hint="Try another search or category." />
        ) : (
          filtered.map((p) => (
            <CakeCard key={p.id} product={p} currency={settings?.currency || '₹'} onSelect={setSelected} />
          ))
        )}
      </div>

      {settings && (
        <CakeDetailModal product={selected} settings={settings} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
