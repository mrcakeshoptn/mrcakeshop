'use client';

import { useRef, useState } from 'react';
import { useAllProducts } from '@/lib/hooks';
import { useProductRepository } from '@/lib/repositories/productRepository';
import { CakeProduct, blankCakeProduct } from '@/types/cake';
import { getStartingPrice, formatPrice } from '@/lib/pricing';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassModal from '@/components/glass/GlassModal';
import ProductForm from './ProductForm';

export default function AdminProductsPage() {
  const repo = useProductRepository();
  const { products, loading, refresh } = useAllProducts();
  const [editing, setEditing] = useState<CakeProduct | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (product: CakeProduct) => {
    setBusy(true);
    await repo.save(product);
    setBusy(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await repo.remove(id);
    setConfirmDeleteId(null);
    refresh();
  };

  const handleDuplicate = async (id: string) => {
    await repo.duplicate(id);
    refresh();
  };

  const toggle = async (product: CakeProduct, field: 'active' | 'featured') => {
    await repo.save({ ...product, [field]: !product[field] });
    refresh();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mr-cake-shop-catalogue-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    setImportError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!Array.isArray(data)) throw new Error('not an array');
        setBusy(true);
        await repo.replaceAll(data as CakeProduct[]);
        setBusy(false);
        refresh();
      } catch {
        setBusy(false);
        setImportError(
          'That file doesn\u2019t look like a valid catalogue export. Please choose a JSON file exported from this dashboard.'
        );
      }
    };
    reader.onerror = () => setImportError('That file could not be read.');
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <GlassButton size="sm" onClick={() => setEditing(blankCakeProduct())}>
            + Add Cake
          </GlassButton>
          <GlassButton size="sm" variant="secondary" onClick={handleExport}>
            Export Catalogue
          </GlassButton>
          <GlassButton size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Import Catalogue
          </GlassButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
          />
        </div>
        {busy && <span className="text-xs text-ink/50">Saving…</span>}
      </div>
      {importError && <p className="mb-3 text-sm text-red-600">{importError}</p>}
      <p className="mb-4 max-w-2xl text-xs text-ink/50">
        Import replaces the entire live catalogue for every visitor — export a backup first if
        you're not sure.
      </p>

      <GlassCard padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-white/60 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Cake</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Cream</th>
              <th className="px-4 py-3">From Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40">
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40">
                  No cakes yet. Click &ldquo;Add Cake&rdquo; to create your first product.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const price = getStartingPrice(p);
                return (
                  <tr key={p.id} className="border-b border-white/40 last:border-0">
                    <td className="px-4 py-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/60">
                        {p.mainImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.mainImage} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{p.name}</p>
                      <div className="flex gap-1.5">
                        {p.featured && <span className="text-xs text-champagne">★ Featured</span>}
                        {p.fastMoving && <span className="text-xs text-burgundy/70">⚡ Fast-moving</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-ink/70">{p.category}</td>
                    <td className="px-4 py-3 text-ink/70">
                      {p.creamType === 'fresh-cream' ? 'Fresh Cream' : 'Butter Cream'}
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {price !== null ? formatPrice(price) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggle(p, 'active')}
                        className={[
                          'rounded-full px-3 py-1 text-xs font-medium',
                          p.active ? 'bg-green-100 text-green-700' : 'bg-ink/10 text-ink/50',
                        ].join(' ')}
                      >
                        {p.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <button onClick={() => setEditing(p)} className="text-burgundy hover:underline">
                          Edit
                        </button>
                        <button onClick={() => handleDuplicate(p.id)} className="text-burgundy hover:underline">
                          Duplicate
                        </button>
                        <button onClick={() => toggle(p, 'featured')} className="text-burgundy hover:underline">
                          {p.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button onClick={() => setConfirmDeleteId(p.id)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </GlassCard>

      <GlassModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Cake' : 'Add Cake'}
        maxWidthClassName="max-w-3xl"
      >
        {editing && <ProductForm product={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </GlassModal>

      <GlassModal open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Delete this cake?">
        <p className="text-sm text-ink/70">
          This removes it from the live catalogue for every visitor, permanently. This can&apos;t be
          undone unless you have an exported backup.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <GlassButton variant="ghost" onClick={() => setConfirmDeleteId(null)}>
            Cancel
          </GlassButton>
          <GlassButton
            variant="primary"
            className="!bg-red-600 !border-red-600 hover:!bg-red-700"
            onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
          >
            Delete Cake
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  );
}
