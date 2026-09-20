'use client';

import { useMemo, useState } from 'react';
import { useAllProducts, useOrders, useShopSettings } from '@/lib/hooks';
import { useOrderRepository } from '@/lib/repositories/orderRepository';
import { Order, OrderStatus } from '@/types/order';
import { computeExpectedReadyTime, formatReadyTime } from '@/lib/readiness';
import { formatPrice } from '@/lib/pricing';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import { GlassPill } from '@/components/glass/GlassPill';

const statusFilters: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-ink/10 text-ink/50',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const { orders, loading, refresh } = useOrders();
  const { products } = useAllProducts();
  const { settings } = useShopSettings();
  const repo = useOrderRepository();
  const [filter, setFilter] = useState<'all' | OrderStatus>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);

  const productCategory = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.id, p.category));
    return map;
  }, [products]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const categoryFor = (order: Order) =>
    order.orderType === 'custom' ? 'custom' : productCategory.get(order.productId || '') || 'fresh-cream';

  const handleConfirm = async (order: Order) => {
    if (!settings) return;
    setBusyId(order.id);
    const { expectedReadyAt } = computeExpectedReadyTime(new Date(), categoryFor(order), settings.readinessRules);
    await repo.setStatus(order.id, 'confirmed', expectedReadyAt);
    setBusyId(null);
    refresh();
  };

  const handleStatus = async (order: Order, status: OrderStatus) => {
    setBusyId(order.id);
    await repo.setStatus(order.id, status);
    setBusyId(null);
    refresh();
  };

  return (
    <div>
      <p className="mb-4 max-w-2xl text-sm text-ink/60">
        Every order and custom cake request, from any device. Confirming one calculates an
        expected pickup-ready time using your rules in Settings → Order Readiness.
      </p>

      <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {statusFilters.map((f) => (
          <GlassPill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </GlassPill>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/40">Loading…</p>
      ) : filtered.length === 0 ? (
        <GlassCard className="py-10 text-center text-sm text-ink/40">No orders here yet.</GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <GlassCard key={order.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-ink/40">
                    {order.orderType === 'custom' ? 'Custom Request' : 'Catalogue Order'}
                  </span>
                </div>
                <p className="mt-1 font-medium text-ink">
                  {order.productName || 'Custom Cake'}
                  {order.weightKg ? ` — ${order.weightKg} kg` : ''}
                </p>
                <p className="text-sm text-ink/60">
                  {order.customerName || 'Unknown'} · {order.customerMobile || 'no number'}
                </p>
                {order.totalPrice !== null && (
                  <p className="text-sm text-burgundy">{formatPrice(order.totalPrice, settings?.currency)}</p>
                )}
                {order.expectedReadyAt && (
                  <p className="mt-1 text-xs text-ink/50">
                    Ready by <strong>{formatReadyTime(new Date(order.expectedReadyAt))}</strong>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {order.status === 'pending' && (
                  <GlassButton size="sm" disabled={busyId === order.id} onClick={() => handleConfirm(order)}>
                    Confirm
                  </GlassButton>
                )}
                {order.status === 'confirmed' && (
                  <GlassButton size="sm" disabled={busyId === order.id} onClick={() => handleStatus(order, 'ready')}>
                    Mark Ready
                  </GlassButton>
                )}
                {order.status === 'ready' && (
                  <GlassButton size="sm" disabled={busyId === order.id} onClick={() => handleStatus(order, 'completed')}>
                    Mark Picked Up
                  </GlassButton>
                )}
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <GlassButton
                    size="sm"
                    variant="ghost"
                    disabled={busyId === order.id}
                    onClick={() => handleStatus(order, 'cancelled')}
                  >
                    Cancel
                  </GlassButton>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
