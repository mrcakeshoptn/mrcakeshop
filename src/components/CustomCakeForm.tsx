'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { CustomCakeRequest } from '@/types/cake';
import { ShopSettings } from '@/types/settings';
import { buildCustomCakeMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { useCustomerRepository } from '@/lib/repositories/customerRepository';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput, { GlassTextarea } from '@/components/glass/GlassInput';
import GlassSelect from '@/components/glass/GlassSelect';

const blank: CustomCakeRequest = {
  customerName: '',
  mobile: '',
  requiredDate: '',
  approxWeight: '',
  cakeType: '',
  creamType: '',
  shape: '',
  eggType: '',
  steps: '',
  cakeMessage: '',
  specialInstructions: '',
  hasReferenceImage: false,
};

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_MB = 8;

export default function CustomCakeForm({ settings }: { settings: ShopSettings }) {
  const customerRepo = useCustomerRepository();
  const [form, setForm] = useState<CustomCakeRequest>(blank);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof CustomCakeRequest, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) {
      setPreview(null);
      setForm((f) => ({ ...f, hasReferenceImage: false }));
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      setError('Please upload a JPG, PNG or WEBP image.');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`That image is too large. Please keep it under ${MAX_FILE_MB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setForm((f) => ({ ...f, hasReferenceImage: true }));
    };
    reader.onerror = () => setError('That image could not be loaded.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.mobile.trim()) {
      setError('Please enter your name and mobile number so we can reach you.');
      return;
    }
    customerRepo.upsertByMobile({
      name: form.customerName,
      mobile: form.mobile,
      source: 'custom-cake-request',
    });
    const message = buildCustomCakeMessage(settings.businessName, form);
    window.open(buildWhatsAppUrl(settings.whatsappNumber, message), '_blank');
  };

  return (
    <GlassCard className="mx-auto max-w-2xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GlassInput
            label="Customer Name"
            required
            value={form.customerName}
            onChange={(e) => update('customerName', e.target.value)}
          />
          <GlassInput
            label="Mobile Number"
            required
            type="tel"
            value={form.mobile}
            onChange={(e) => update('mobile', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GlassInput
            label="Required Date"
            type="date"
            value={form.requiredDate}
            onChange={(e) => update('requiredDate', e.target.value)}
          />
          <GlassInput
            label="Approximate Weight"
            placeholder="e.g. 3 kg"
            value={form.approxWeight}
            onChange={(e) => update('approxWeight', e.target.value)}
          />
        </div>

        <GlassInput
          label="Cake Type"
          placeholder="e.g. Chocolate truffle, theme cake…"
          value={form.cakeType}
          onChange={(e) => update('cakeType', e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <GlassSelect
            label="Cream Type"
            value={form.creamType}
            onChange={(e) => update('creamType', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Fresh Cream">Fresh Cream</option>
            <option value="Butter Cream">Butter Cream</option>
          </GlassSelect>
          <GlassSelect label="Shape" value={form.shape} onChange={(e) => update('shape', e.target.value)}>
            <option value="">Select</option>
            <option value="Round">Round</option>
            <option value="Square">Square</option>
            <option value="Heart">Heart</option>
          </GlassSelect>
          <GlassSelect
            label="Egg / Eggless"
            value={form.eggType}
            onChange={(e) => update('eggType', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Egg">Egg</option>
            <option value="Eggless">Eggless</option>
          </GlassSelect>
        </div>

        <GlassSelect label="Number of Steps" value={form.steps} onChange={(e) => update('steps', e.target.value)}>
          <option value="">Select</option>
          <option value="1 Step">1 Step</option>
          <option value="2 Step">2 Step</option>
          <option value="3 Step">3 Step</option>
        </GlassSelect>

        <GlassInput
          label="Cake Message"
          placeholder="Happy Birthday Amma ❤️"
          value={form.cakeMessage}
          onChange={(e) => update('cakeMessage', e.target.value)}
        />

        <GlassTextarea
          label="Special Instructions"
          rows={3}
          placeholder="Tell us about colours, theme, decorations…"
          value={form.specialInstructions}
          onChange={(e) => update('specialInstructions', e.target.value)}
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink/80">Upload Reference Design (optional)</p>
          <input
            type="file"
            accept={ACCEPTED.join(',')}
            onChange={handleFile}
            className="block w-full rounded-2xl border border-white/60 bg-white/60 p-3 text-sm text-ink/70 backdrop-blur-xl file:mr-3 file:rounded-full file:border-0 file:bg-burgundy file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
          />
          {preview && (
            <div className="mt-3 aspect-video w-full max-w-xs overflow-hidden rounded-2xl border border-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Reference design preview" className="h-full w-full object-cover" />
            </div>
          )}
          <p className="mt-2 text-xs text-ink/50">
            WhatsApp can&apos;t receive this image automatically — after you tap the button below,
            attach the image yourself inside the WhatsApp chat.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <GlassButton
          type="submit"
          variant="whatsapp"
          className="w-full"
          disabled={!settings.customCakeRequestEnabled}
        >
          Send Request on WhatsApp
        </GlassButton>
        <p className="text-center text-[11px] leading-snug text-ink/45">
          This is a quote request. {settings.businessName} will confirm design, pricing and
          availability with you over WhatsApp.
        </p>
      </form>
    </GlassCard>
  );
}
