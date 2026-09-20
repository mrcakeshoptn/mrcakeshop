'use client';

import { useEffect, useState } from 'react';
import { useSettingsRepository } from '@/lib/repositories/settingsRepository';
import { ShopSettings, ReadinessRules } from '@/types/settings';
import { compressImage } from '@/lib/storage';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput, { GlassTextarea } from '@/components/glass/GlassInput';
import GlassSelect from '@/components/glass/GlassSelect';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard>
      <h2 className="mb-4 font-display text-lg text-burgundy-dark">{title}</h2>
      <div className="space-y-4">{children}</div>
    </GlassCard>
  );
}

function HourField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <GlassInput
      label={label}
      type="number"
      min={0}
      max={23}
      value={value}
      onChange={(e) => onChange(Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 0)))}
    />
  );
}

export default function AdminSettingsPage() {
  const repo = useSettingsRepository();
  const [form, setForm] = useState<ShopSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    repo.get().then(setForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!form) return <p className="text-sm text-ink/50">Loading…</p>;

  const set = <K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  };

  const setRule = <K extends keyof ReadinessRules>(key: K, value: ReadinessRules[K]) => {
    setForm((f) => (f ? { ...f, readinessRules: { ...f.readinessRules, [key]: value } } : f));
    setSaved(false);
  };

  const handleImage = async (file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      set('heroImageDataUrl', dataUrl);
    } catch {
      // ignore — invalid file type, nothing to update
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await repo.save(form);
    setSaving(false);
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
        <label className="flex items-center gap-2 text-sm text-ink/75">
          <input
            type="checkbox"
            checked={form.deliveryEnabled}
            onChange={(e) => set('deliveryEnabled', e.target.checked)}
          />
          Delivery Enabled
        </label>
        <p className="text-xs text-ink/45">
          Leave Delivery off to show &ldquo;Pickup only — delivery coming soon&rdquo; on the site.
          Turning it on doesn&apos;t add delivery logistics yet — it just changes that message.
        </p>
      </Section>

      <Section title="Order Readiness">
        <p className="text-xs text-ink/50">
          Controls the expected pickup-ready time shown to you when you confirm an order in{' '}
          <strong>Admin → Orders</strong>. All hours are 24-hour, in Tiruppur local time (IST).
        </p>

        <div>
          <p className="mb-2 text-sm font-medium text-ink/80">Closed hours (no confirmations)</p>
          <div className="grid grid-cols-2 gap-4">
            <HourField label="From hour" value={form.readinessRules.closedStartHour} onChange={(v) => setRule('closedStartHour', v)} />
            <HourField label="To hour" value={form.readinessRules.closedEndHour} onChange={(v) => setRule('closedEndHour', v)} />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink/80">Morning window</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <HourField label="Ends at hour" value={form.readinessRules.morningEndHour} onChange={(v) => setRule('morningEndHour', v)} />
            <GlassInput
              label="Normal cakes: ready in (hrs)"
              type="number"
              min={0}
              value={form.readinessRules.morningNormalHours}
              onChange={(e) => setRule('morningNormalHours', parseFloat(e.target.value) || 0)}
            />
            <GlassInput
              label="Designer/Custom/Eggless: ready in (hrs)"
              type="number"
              min={0}
              value={form.readinessRules.morningSpecialHours}
              onChange={(e) => setRule('morningSpecialHours', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink/80">Afternoon window</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <HourField label="Ends at hour" value={form.readinessRules.afternoonEndHour} onChange={(v) => setRule('afternoonEndHour', v)} />
            <GlassInput
              label="All cakes: ready in (hrs)"
              type="number"
              min={0}
              value={form.readinessRules.afternoonHours}
              onChange={(e) => setRule('afternoonHours', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink/80">Evening window (after the afternoon window ends)</p>
          <HourField
            label="Ready by this hour, next day"
            value={form.readinessRules.eveningReadyHour}
            onChange={(v) => setRule('eveningReadyHour', v)}
          />
        </div>
      </Section>

      <Section title="About Us Page">
        <GlassTextarea
          label="About Us content"
          rows={6}
          value={form.aboutContent}
          onChange={(e) => set('aboutContent', e.target.value)}
        />
      </Section>

      <Section title="Privacy Policy Page">
        <GlassTextarea
          label="Privacy Policy content"
          rows={8}
          value={form.privacyContent}
          onChange={(e) => set('privacyContent', e.target.value)}
        />
        <p className="text-xs text-ink/45">
          This is your own text, not legal advice — have it reviewed by a professional before
          relying on it.
        </p>
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
              onChange={(e) => handleImage(e.target.files?.[0])}
              className="text-sm text-ink/60 file:mr-3 file:rounded-full file:border-0 file:bg-burgundy file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ivory"
            />
          </div>
          <p className="mt-2 text-xs text-ink/45">
            The M.R Cake Shop logo itself is a fixed brand asset — see the README to update it.
          </p>
        </div>
      </Section>

      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-3 backdrop-blur-xl">
        <GlassButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </GlassButton>
        {saved && <span className="text-sm text-green-700">Settings saved — live for everyone now.</span>}
      </div>
    </div>
  );
}
