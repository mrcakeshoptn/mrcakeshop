'use client';

import { useShopSettings } from '@/lib/hooks';
import GlassCard from '@/components/glass/GlassCard';

const FALLBACK = `When you place an order or send a custom cake request, we ask for your name and mobile number, and — for custom requests — details about the cake you want. We use this only to confirm your order, coordinate pickup, and contact you about that specific request. We do not sell or share your details with advertisers.

Your order and contact details are stored securely and are only visible to our staff. If you'd like us to tell you what information we hold about you, or to have it corrected or deleted, reach out through the Contact page.

This site does not use advertising cookies or third-party trackers.`;

export default function PrivacyPage() {
  const { settings } = useShopSettings();
  const name = settings?.businessName || 'M.R Cake Shop';
  const content = settings?.privacyContent?.trim() || FALLBACK;
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-burgundy-dark sm:text-4xl">Privacy Policy</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink/60">
          How {name} handles the information you share with us.
        </p>
      </div>

      <GlassCard className="mb-6 border-champagne/50 bg-champagne/10 p-5 text-xs leading-relaxed text-ink/60">
        This is {name}&apos;s own policy text, not legal advice. Have it reviewed by a qualified
        professional — including for India&apos;s Digital Personal Data Protection Act and any
        other rules that apply — before relying on it.
      </GlassCard>

      <GlassCard className="space-y-5 p-7 sm:p-9">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink/75">
            {p}
          </p>
        ))}
        <p className="border-t border-white/60 pt-5 text-xs text-ink/45">
          When you place an order, your message is sent through WhatsApp itself, governed by{' '}
          <a
            href="https://www.whatsapp.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-burgundy hover:underline"
          >
            WhatsApp&apos;s own privacy policy
          </a>
          .
        </p>
      </GlassCard>
    </div>
  );
}
