'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/adminAuth';
import { useAdminSession } from '@/lib/hooks';
import { normalizePathname } from '@/lib/normalizePathname';
import GlassButton from '@/components/glass/GlassButton';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname();
  const pathname = normalizePathname(rawPathname);
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const { session, checked } = useAdminSession();

  useEffect(() => {
    if (isLoginPage) return;
    if (checked && !session) {
      router.replace('/admin/login');
    }
  }, [isLoginPage, checked, session, router]);

  if (isLoginPage) return <>{children}</>;

  if (!checked || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink/50">Checking access…</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-champagne">Admin</p>
          <h1 className="font-display text-2xl text-burgundy-dark">Catalogue Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex gap-2 overflow-x-auto no-scrollbar rounded-full border border-white/50 bg-white/50 p-1.5 backdrop-blur-xl">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  pathname === item.href ? 'bg-burgundy text-ivory' : 'text-burgundy-dark hover:bg-white/70',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={async () => {
              await logout();
              router.replace('/admin/login');
            }}
          >
            Log out
          </GlassButton>
        </div>
      </div>
      {children}
    </div>
  );
}
