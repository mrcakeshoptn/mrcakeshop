'use client';

import { useShopSettings } from '@/lib/hooks';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';

export default function ContactPage() {
  const { settings } = useShopSettings();
  const name = settings?.businessName || 'M R Cake Shop';

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-burgundy-dark sm:text-4xl">Get in Touch</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
          Questions about a cake, an existing order, or delivery? Reach us any of these ways.
        </p>
      </div>

      <GlassCard className="space-y-5 p-7 sm:p-9">
        <ContactRow label="WhatsApp" value={settings?.whatsappNumber || 'WHATSAPP_NUMBER_HERE'}>
          <GlassButton
            variant="whatsapp"
            size="sm"
            onClick={() =>
              settings &&
              window.open(
                buildWhatsAppUrl(settings.whatsappNumber, `Hello ${name}, I have a question.`),
                '_blank'
              )
            }
          >
            Message Us
          </GlassButton>
        </ContactRow>

        <ContactRow label="Phone" value={settings?.phone || 'PHONE_NUMBER_HERE'} />

        <ContactRow label="Address" value={settings?.address || 'Tiruppur, Tamil Nadu, India'}>
          {settings?.googleMapsUrl && (
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-burgundy hover:underline"
            >
              View on Map
            </a>
          )}
        </ContactRow>

        <p className="border-t border-white/60 pt-5 text-xs text-ink/50">
          For fastest responses on orders and availability, WhatsApp is the quickest way to reach
          us — messages sent here are answered by {name} directly, not automatically.
        </p>
      </GlassCard>
    </div>
  );
}

function ContactRow({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/50 pb-5 last:border-0 last:pb-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-champagne">{label}</p>
        <p className="mt-0.5 text-sm text-ink/80">{value}</p>
      </div>
      {children}
    </div>
  );
}
