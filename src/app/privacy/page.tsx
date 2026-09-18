'use client';

import { useShopSettings } from '@/lib/hooks';
import GlassCard from '@/components/glass/GlassCard';

export default function PrivacyPage() {
  const { settings } = useShopSettings();
  const name = settings?.businessName || 'M R Cake Shop';

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-burgundy-dark sm:text-4xl">Privacy Policy</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink/60">
          How {name} handles the information you share with us.
        </p>
      </div>

      <GlassCard className="mb-6 border-champagne/50 bg-champagne/10 p-5 text-xs leading-relaxed text-ink/60">
        This is placeholder policy text for the V1 demo, written to describe how this specific
        website works. It is not legal advice. Please have a qualified professional review and
        adapt it — including for India&apos;s Digital Personal Data Protection Act and any other
        rules that apply to your business — before publishing it live.
      </GlassCard>

      <GlassCard className="space-y-6 p-7 sm:p-9">
        <Section title="Information We Collect">
          When you place an order or send a custom cake request, we ask for your name, mobile
          number, and — for custom requests — details about the cake you want (weight, flavour,
          message, and an optional reference image). We don&apos;t require an account, and we
          don&apos;t collect payment information on this site.
        </Section>

        <Section title="How Your Information Is Used">
          We use your name and mobile number to identify your order, confirm availability and
          pricing, and coordinate pickup or delivery — all done directly with you over WhatsApp.
          We do not sell or share your details with advertisers.
        </Section>

        <Section title="Where Your Information Is Stored">
          This website stores order and customer details in your own browser and in {name}
          &apos;s admin dashboard, kept locally rather than on an external server in this V1
          version. When you tap &ldquo;Order via WhatsApp&rdquo; or &ldquo;Send Request on
          WhatsApp,&rdquo; your message is sent through WhatsApp itself, which is operated by
          Meta and governed by{' '}
          <a
            href="https://www.whatsapp.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-burgundy hover:underline"
          >
            WhatsApp&apos;s own privacy policy
          </a>
          .
        </Section>

        <Section title="Cookies & Tracking">
          This site does not use advertising cookies or third-party trackers. It may store basic
          preferences (like your selected weight or shape while browsing) only in your own
          browser, to make the site work smoothly.
        </Section>

        <Section title="Your Choices">
          You can ask us at any time to tell you what information we hold about you, or to have
          it corrected or deleted, by reaching out through the{' '}
          <a href="/contact" className="font-medium text-burgundy hover:underline">
            Contact page
          </a>
          .
        </Section>

        <Section title="Changes to This Policy">
          If how we handle your information changes, we&apos;ll update this page. Please check
          back occasionally, especially before sharing new types of information with us.
        </Section>

        <p className="border-t border-white/60 pt-5 text-xs text-ink/45">
          Last updated: replace with your actual publish date before going live.
        </p>
      </GlassCard>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1.5 font-display text-lg text-burgundy-dark">{title}</h2>
      <p className="text-sm leading-relaxed text-ink/75">{children}</p>
    </div>
  );
}
