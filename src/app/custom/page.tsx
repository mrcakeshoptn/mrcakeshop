'use client';

import { useShopSettings } from '@/lib/hooks';
import CustomCakeForm from '@/components/CustomCakeForm';

export default function CustomCakePage() {
  const { settings } = useShopSettings();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-burgundy-dark sm:text-4xl">Request a Custom Cake</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
          Have a design in mind? Tell us your requirements and, optionally, share a reference image —
          we&apos;ll confirm the design and price with you on WhatsApp.
        </p>
      </div>
      {settings && <CustomCakeForm settings={settings} />}
    </div>
  );
}
