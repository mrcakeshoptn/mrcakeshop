'use client';

import { useState } from 'react';
import { CakeCategory, CakeProduct, CreamType, StepOption } from '@/types/cake';
import { compressImage } from '@/lib/storage';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput, { GlassTextarea } from '@/components/glass/GlassInput';
import GlassSelect from '@/components/glass/GlassSelect';

interface ProductFormProps {
  product: CakeProduct;
  onSave: (product: CakeProduct) => void;
  onCancel: () => void;
}

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-white/60 pt-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-champagne">
        {number} · {title}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<CakeProduct>(product);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof CakeProduct>(key: K, value: CakeProduct[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addWeightRow = () => {
    const last = form.weights[form.weights.length - 1];
    const nextWeight = last ? Math.round((last.weightKg + 0.5) * 10) / 10 : 1;
    setForm((f) => ({
      ...f,
      weights: [...f.weights, { weightKg: nextWeight, price: 0, active: true }],
      shapeCharges: [...f.shapeCharges, { weightKg: nextWeight, round: 0, square: 0, heart: 0 }],
      egglessCharges: [...f.egglessCharges, { weightKg: nextWeight, charge: 0 }],
    }));
  };

  const removeWeightRow = (weightKg: number) => {
    setForm((f) => ({
      ...f,
      weights: f.weights.filter((w) => w.weightKg !== weightKg),
      shapeCharges: f.shapeCharges.filter((s) => s.weightKg !== weightKg),
      egglessCharges: f.egglessCharges.filter((e) => e.weightKg !== weightKg),
    }));
  };

  const handleImageUpload = async (files: FileList | null, asMain: boolean) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const compressed = await Promise.all(Array.from(files).map(compressImage));
      setForm((f) => ({
        ...f,
        images: [...f.images, ...compressed],
        mainImage: asMain || !f.mainImage ? compressed[0] : f.mainImage,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Please enter a cake name.');
    if (!form.mainImage) return setError('Please upload at least one image.');
    const activeWeights = form.weights.filter((w) => w.active);
    if (activeWeights.length === 0) return setError('Please add at least one active weight.');
    if (activeWeights.some((w) => !w.price || w.price <= 0)) {
      return setError('Every active weight needs a price greater than zero.');
    }
    setError(null);
    onSave(form);
  };

  return (
    <div className="space-y-5">
      <FormSection number="01" title="Basic Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GlassInput
            label="Cake Name"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <GlassInput
            label="Flavour"
            value={form.flavour}
            onChange={(e) => set('flavour', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GlassSelect
            label="Category"
            value={form.category}
            onChange={(e) => set('category', e.target.value as CakeCategory)}
          >
            <option value="fresh-cream">Fresh Cream</option>
            <option value="butter-cream">Butter Cream</option>
            <option value="designer">Designer</option>
          </GlassSelect>
          <GlassSelect
            label="Cream Type"
            value={form.creamType}
            onChange={(e) => set('creamType', e.target.value as CreamType)}
          >
            <option value="fresh-cream">Fresh Cream</option>
            <option value="butter-cream">Butter Cream</option>
          </GlassSelect>
        </div>
        <GlassTextarea
          label="Description"
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FormSection>

      <FormSection number="02" title="Images">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          onChange={(e) => handleImageUpload(e.target.files, form.images.length === 0)}
          className="block w-full rounded-2xl border border-white/60 bg-white/60 p-3 text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-burgundy file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
        />
        {uploading && <p className="text-xs text-ink/50">Optimising image…</p>}
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {form.images.map((img) => (
              <div key={img.slice(0, 40)} className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-white/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => set('mainImage', img)}
                    className={`text-[10px] font-medium ${img === form.mainImage ? 'text-champagne' : 'text-white'}`}
                  >
                    {img === form.mainImage ? '★ Main' : 'Set Main'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        images: f.images.filter((i) => i !== img),
                        mainImage: f.mainImage === img ? f.images.filter((i) => i !== img)[0] || '' : f.mainImage,
                      }))
                    }
                    className="text-[10px] font-medium text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-ink/45">
          For the demo version, images are stored in this browser. For production, connect the
          dashboard to cloud storage.
        </p>
      </FormSection>

      <FormSection number="03" title="Pricing">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-ink/80">Weight Pricing</span>
            <button type="button" onClick={addWeightRow} className="text-xs font-medium text-burgundy hover:underline">
              + Add Weight
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/60 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-3 py-2">Weight (kg)</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Active</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {form.weights.map((w, i) => (
                  <tr key={w.weightKg} className="border-b border-white/40 last:border-0">
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step={0.5}
                        min={0.5}
                        value={w.weightKg}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setForm((f) => {
                            const weights = [...f.weights];
                            weights[i] = { ...weights[i], weightKg: val };
                            return { ...f, weights };
                          });
                        }}
                        className="w-20 rounded-lg border border-white/60 bg-white/70 px-2 py-1"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={w.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setForm((f) => {
                            const weights = [...f.weights];
                            weights[i] = { ...weights[i], price: val };
                            return { ...f, weights };
                          });
                        }}
                        className="w-24 rounded-lg border border-white/60 bg-white/70 px-2 py-1"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={w.active}
                        onChange={(e) => {
                          setForm((f) => {
                            const weights = [...f.weights];
                            weights[i] = { ...weights[i], active: e.target.checked };
                            return { ...f, weights };
                          });
                        }}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => removeWeightRow(w.weightKg)} className="text-ink/40 hover:text-red-600">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Shape Charges (added over base price)</span>
          <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/60 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-3 py-2">Weight</th>
                  <th className="px-3 py-2">Round</th>
                  <th className="px-3 py-2">Square</th>
                  <th className="px-3 py-2">Heart</th>
                </tr>
              </thead>
              <tbody>
                {form.shapeCharges.map((row, i) => (
                  <tr key={row.weightKg} className="border-b border-white/40 last:border-0">
                    <td className="px-3 py-2 text-ink/70">{row.weightKg} kg</td>
                    {(['round', 'square', 'heart'] as const).map((shapeKey) => (
                      <td key={shapeKey} className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          value={row[shapeKey]}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setForm((f) => {
                              const shapeCharges = [...f.shapeCharges];
                              shapeCharges[i] = { ...shapeCharges[i], [shapeKey]: val };
                              return { ...f, shapeCharges };
                            });
                          }}
                          className="w-20 rounded-lg border border-white/60 bg-white/70 px-2 py-1"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Eggless Charges</span>
          <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/60 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-3 py-2">Weight</th>
                  <th className="px-3 py-2">Additional Charge</th>
                </tr>
              </thead>
              <tbody>
                {form.egglessCharges.map((row, i) => (
                  <tr key={row.weightKg} className="border-b border-white/40 last:border-0">
                    <td className="px-3 py-2 text-ink/70">{row.weightKg} kg</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={row.charge}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setForm((f) => {
                            const egglessCharges = [...f.egglessCharges];
                            egglessCharges[i] = { ...egglessCharges[i], charge: val };
                            return { ...f, egglessCharges };
                          });
                        }}
                        className="w-24 rounded-lg border border-white/60 bg-white/70 px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FormSection>

      <FormSection number="04" title="Options & Rules">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <GlassInput
            label="Min Weight for 2 Step (kg)"
            type="number"
            step={0.5}
            value={form.minimumWeightFor2Step}
            onChange={(e) => set('minimumWeightFor2Step', parseFloat(e.target.value) || 0)}
          />
          <GlassInput
            label="Min Weight for 3 Step (kg)"
            type="number"
            step={0.5}
            value={form.minimumWeightFor3Step}
            onChange={(e) => set('minimumWeightFor3Step', parseFloat(e.target.value) || 0)}
          />
          <GlassInput
            label="Maximum Online Weight (kg)"
            type="number"
            step={0.5}
            value={form.maximumStandardWeight}
            onChange={(e) => set('maximumStandardWeight', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Available Step Options</span>
          <div className="flex gap-4">
            {([1, 2, 3] as StepOption[]).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={form.stepOptions.includes(s)}
                  onChange={(e) => {
                    const stepOptions = e.target.checked
                      ? [...form.stepOptions, s].sort()
                      : form.stepOptions.filter((x) => x !== s);
                    set('stepOptions', stepOptions);
                  }}
                />
                {s} Step
              </label>
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection number="05" title="Availability">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(
            [
              ['featured', 'Featured'],
              ['active', 'Active'],
              ['designer', 'Designer Cake'],
              ['customAvailable', 'Custom Available'],
              ['egglessAvailable', 'Eggless Available'],
            ] as [keyof CakeProduct, string][]
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-sm text-ink/75">
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => set(key, e.target.checked as CakeProduct[typeof key])}
              />
              {label}
            </label>
          ))}
        </div>
      </FormSection>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <GlassButton variant="ghost" onClick={onCancel} type="button">
          Cancel
        </GlassButton>
        <GlassButton onClick={handleSubmit} type="button">
          Save Cake
        </GlassButton>
      </div>
    </div>
  );
}
