'use client';

import { useEffect, useMemo, useState } from 'react';
import { CakeProduct, CakeShape, StepOption } from '@/types/cake';
import { ShopSettings } from '@/types/settings';
import {
  calculateCakePrice,
  formatPrice,
  getAvailableSteps,
  getAvailableWeights,
  isWeightOverMax,
} from '@/lib/pricing';
import { buildOrderMessage, buildOversizedQuoteMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { submitCatalogOrder } from '@/lib/orders';
import GlassModal from '@/components/glass/GlassModal';
import GlassButton from '@/components/glass/GlassButton';
import { GlassInput } from '@/components/glass/GlassInput';
import { GlassPill, GlassBadge } from '@/components/glass/GlassPill';

interface CakeDetailModalProps {
  product: CakeProduct | null;
  settings: ShopSettings;
  onClose: () => void;
}

const shapes: { value: CakeShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'heart', label: 'Heart' },
];

export default function CakeDetailModal({ product, settings, onClose }: CakeDetailModalProps) {
  const weights = useMemo(() => (product ? getAvailableWeights(product) : []), [product]);

  const [weightKg, setWeightKg] = useState<number>(0);
  const [shape, setShape] = useState<CakeShape>('round');
  const [eggType, setEggType] = useState<'egg' | 'eggless'>('egg');
  const [steps, setSteps] = useState<StepOption>(1);
  const [cakeMessage, setCakeMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product && weights.length > 0) {
      setWeightKg(weights[0]);
      setShape('round');
      setEggType('egg');
      setSteps(1);
      setCakeMessage('');
      setActiveImage(0);
    }
  }, [product, weights]);

  if (!product) return null;

  const oversized = weightKg > 0 && isWeightOverMax(product, weightKg);
  const availableSteps = getAvailableSteps(product, weightKg);
  const breakdown =
    weightKg > 0 && !oversized
      ? calculateCakePrice(product, { weightKg, shape, eggType, steps })
      : null;

  const handleWeightChange = (w: number) => {
    setWeightKg(w);
    const nextAvailable = getAvailableSteps(product, w);
    if (!nextAvailable.includes(steps)) setSteps(nextAvailable[0] ?? 1);
  };

  const handleOrder = async () => {
    if (!settings.whatsappOrderEnabled) return;
    setSubmitting(true);
    if (!oversized) {
      await submitCatalogOrder(product, { weightKg, shape, eggType, steps }, cakeMessage, customerName, customerMobile, settings);
    }
    setSubmitting(false);
    const message = oversized
      ? buildOversizedQuoteMessage(settings.businessName, weightKg)
      : buildOrderMessage(
          settings.businessName,
          product,
          { weightKg, shape, eggType, steps },
          cakeMessage,
          customerName,
          customerMobile,
          settings.currency
        );
    window.open(buildWhatsAppUrl(settings.whatsappNumber, message), '_blank');
  };

  const gallery = product.images.length > 0 ? product.images : [product.mainImage];

  return (
    <GlassModal open={!!product} onClose={onClose} maxWidthClassName="max-w-3xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl border border-white/50 bg-white/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {gallery.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={[
                    'h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                    i === activeImage ? 'border-burgundy' : 'border-transparent opacity-70',
                  ].join(' ')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.designer && <GlassBadge tone="champagne">★ Designer</GlassBadge>}
            {product.egglessAvailable && <GlassBadge tone="neutral">Eggless available</GlassBadge>}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-burgundy-dark">{product.name}</h2>
          <p className="text-sm text-ink/60">
            {product.creamType === 'fresh-cream' ? 'Fresh Cream' : 'Butter Cream'} · {product.flavour}
          </p>
          <p className="mt-2 text-sm text-ink/75">{product.description}</p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink/80">Weight</p>
              <div className="flex flex-wrap gap-2">
                {weights.map((w) => (
                  <GlassPill key={w} active={w === weightKg} onClick={() => handleWeightChange(w)}>
                    {w} kg
                  </GlassPill>
                ))}
              </div>
            </div>

            {!oversized && (
              <>
                <div>
                  <p className="mb-1.5 text-sm font-medium text-ink/80">Shape</p>
                  <div className="flex flex-wrap gap-2">
                    {shapes.map((s) => (
                      <GlassPill key={s.value} active={shape === s.value} onClick={() => setShape(s.value)}>
                        {s.label}
                      </GlassPill>
                    ))}
                  </div>
                </div>

                {product.egglessAvailable && (
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-ink/80">Egg Type</p>
                    <div className="flex gap-2">
                      <GlassPill active={eggType === 'egg'} onClick={() => setEggType('egg')}>
                        Egg
                      </GlassPill>
                      <GlassPill active={eggType === 'eggless'} onClick={() => setEggType('eggless')}>
                        Eggless
                      </GlassPill>
                    </div>
                  </div>
                )}

                <div>
                  <p className="mb-1.5 text-sm font-medium text-ink/80">Steps</p>
                  <div className="flex gap-2">
                    {([1, 2, 3] as StepOption[]).map((s) => {
                      const enabled = availableSteps.includes(s);
                      return (
                        <GlassPill
                          key={s}
                          active={steps === s}
                          disabled={!enabled}
                          onClick={() => enabled && setSteps(s)}
                          className={!enabled ? 'opacity-35' : ''}
                        >
                          {s} Step
                        </GlassPill>
                      );
                    })}
                  </div>
                </div>

                <GlassInput
                  label="Cake Message (optional)"
                  placeholder="Happy Birthday Amma ❤️"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  maxLength={60}
                />

                <div className="grid grid-cols-2 gap-3">
                  <GlassInput
                    label="Your Name"
                    placeholder="Optional"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <GlassInput
                    label="Mobile"
                    placeholder="Optional"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {oversized ? (
            <div className="mt-5 rounded-2xl border border-champagne/60 bg-champagne/15 p-4">
              <p className="font-display text-base text-burgundy-dark">Need a larger cake?</p>
              <p className="mt-1 text-sm text-ink/70">
                For cakes above {product.maximumStandardWeight} kg, please contact us for a custom quote.
              </p>
              <GlassButton variant="whatsapp" className="mt-3 w-full" onClick={handleOrder} disabled={submitting}>
                {submitting ? 'Placing…' : 'Request Quote on WhatsApp'}
              </GlassButton>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/60 bg-white/50 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink/60">Estimated Price</span>
                <span className="font-body text-2xl font-extrabold tabular-nums text-burgundy">
                  {breakdown ? formatPrice(breakdown.total, settings.currency) : '—'}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/50">
                Final price and availability will be confirmed by {settings.businessName}.
              </p>
              <GlassButton
                variant="whatsapp"
                className="mt-4 w-full"
                onClick={handleOrder}
                disabled={!settings.whatsappOrderEnabled || submitting}
              >
                {submitting ? 'Placing…' : 'Order via WhatsApp'}
              </GlassButton>
              <p className="mt-2 text-center text-[11px] leading-snug text-ink/45">
                This is an order request. Your order will be confirmed by {settings.businessName} through WhatsApp.
                {!settings.deliveryEnabled && ' Pickup only — delivery coming soon.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </GlassModal>
  );
}
