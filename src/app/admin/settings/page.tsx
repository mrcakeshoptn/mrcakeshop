'use client';

import { useEffect, useState } from 'react';
import { useSettingsRepository } from '@/lib/repositories/settingsRepository';
import { ShopSettings } from '@/types/settings';
import { compressImage } from '@/lib/storage';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';
import GlassSelect from '@/components/glass/GlassSelect';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard>
      <h2 className="mb-4 font-display text-lg text-burgundy-dark">{title}</h2>
      <div className="space-y-4">{children}</div>
    </GlassCard>
  );
}

export default function AdminSettingsPage() {
  const repo = useSettingsRepository();
  const [form, setForm] = useState<ShopSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(repo.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!form) return null;

  const set = <K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  };

  const handleImage = async (key: 'heroImageDataUrl', file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      set(key, dataUrl);
    } catch {
      // ignore — invalid file type, nothing to update
    }
  };

  const handleSave = () => {
    repo.save(form);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <Section title="Business">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GlassInput label="Business Name" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} />
          <GlassInput label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <GlassInput
          label="WhatsApp Number (with country code, e.g. 91XXXXXXXXXX)"
          value={form.whatsappNumber}
          onChange={(e) => set('whatsappNumber', e.target.value)}
        />
        <GlassInput label="Address" value={form.address} onChange={(e) => set('address', e.target.value)} />
        <GlassInput
          label="Google Maps URL"
          placeholder="https://maps.google.com/…"
          value={form.googleMapsUrl}
          onChange={(e) => set('googleMapsUrl', e.target.value)}
        />
        <GlassInput
          label="Instagram URL"
          placeholder="https://instagram.com/yourshop"
          value={form.instagramUrl}
          onChange={(e) => set('instagramUrl', e.target.value)}
        />
      </Section>

      <Section title="Catalogue">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GlassInput label="Currency Symbol" value={form.currency} onChange={(e) => set('currency', e.target.value)} />
          <GlassInput
            label="Maximum Online Weight (kg)"
            type="number"
            value={form.maximumOnlineWeight}
            onChange={(e) => set('maximumOnlineWeight', parseFloat(e.target.value) || 0)}
          />
          <GlassInput
            label="Default Weight (kg)"
            type="number"
            value={form.defaultWeight}
            onChange={(e) => set('defaultWeight', parseFloat(e.target.value) || 0)}
          />
          <GlassSelect
            label="Default Shape"
            value={form.defaultShape}
            onChange={(e) => set('defaultShape', e.target.value as ShopSettings['defaultShape'])}
          >
            <option value="round">Round</option>
            <option value="square">Square</option>
            <option value="heart">Heart</option>
          </GlassSelect>
        </div>
      </Section>

      <Section title="Ordering">
        <label className="flex items-center gap-2 text-sm text-ink/75">
          <input
            type="checkbox"
            checked={form.whatsappOrderEnabled}
            onChange={(e) => set('whatsappOrderEnabled', e.target.checked)}
          />
          WhatsApp Order Enabled
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/75">
          <input
            type="checkbox"
            checked={form.customCakeRequestEnabled}
            onChange={(e) => set('customCakeRequestEnabled', e.target.checked)}
          />
          Custom Cake Request Enabled
        </label>
      </Section>

      <Section title="Branding">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink/80">Hero Image</span>
          <div className="flex items-center gap-3">
            {form.heroImageDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.heroImageDataUrl} alt="Hero" className="h-12 w-12 rounded-lg object-cover" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage('heroImageDataUrl', e.target.files?.[0])}
              className="text-sm text-ink/60 file:mr-3 file:rounded-full file:border-0 file:bg-burgundy file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ivory"
            />
          </div>
          <p className="mt-2 text-xs text-ink/45">
            The M.R Cake Shop logo itself is a fixed brand asset — see the README to update it.
          </p>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <GlassButton onClick={handleSave}>Save Settings</GlassButton>
        {saved && <span className="text-sm text-green-700">Settings saved.</span>}
      </div>
    </div>
  );
}
