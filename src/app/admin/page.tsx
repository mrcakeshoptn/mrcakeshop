'use client';

import Link from 'next/link';
import { useAllProducts, useCustomers } from '@/lib/hooks';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';

export default function AdminDashboardPage() {
  const { products, loading } = useAllProducts();
  const { customers, loading: customersLoading } = useCustomers();

  const stats = [
    { label: 'Total Cakes', value: products.length, loading },
    { label: 'Active Cakes', value: products.filter((p) => p.active).length, loading },
    { label: 'Featured Cakes', value: products.filter((p) => p.featured).length, loading },
    { label: 'Customers', value: customers.length, loading: customersLoading },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="text-center">
            <p className="font-display text-3xl text-burgundy">{s.loading ? '—' : s.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink/50">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-6">
        <h2 className="font-display text-lg text-burgundy-dark">Quick Start</h2>
        <ol className="mt-3 space-y-2 text-sm text-ink/70">
          <li>1. Go to <strong>Products</strong> and add your real cakes, images and prices.</li>
          <li>2. Set your WhatsApp number and business details in <strong>Settings</strong>.</li>
          <li>3. Check <strong>Customers</strong> — anyone who orders or sends a custom request is saved there automatically.</li>
          <li>4. Export your catalogue and customer list as backups any time.</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/products">
            <GlassButton size="sm">Manage Products</GlassButton>
          </Link>
          <Link href="/admin/customers">
            <GlassButton size="sm" variant="secondary">
              View Customers
            </GlassButton>
          </Link>
          <Link href="/admin/settings">
            <GlassButton size="sm" variant="secondary">
              Go to Settings
            </GlassButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
