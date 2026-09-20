'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { attemptLogin, isLoggedIn } from '@/lib/adminAuth';
import { withBasePath } from '@/lib/basePath';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace('/admin');
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (attemptLogin(password)) {
      router.replace('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5">
      <GlassCard className="w-full max-w-sm p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath('/logo-icon.png')} alt="" className="mx-auto mb-4 h-14 w-14 object-contain" />
        <h1 className="text-center font-display text-2xl text-burgundy-dark">Admin Access</h1>
        <p className="mt-1 text-center text-sm text-ink/60">
          Enter the demo admin password to manage the catalogue.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <GlassInput
            label="Password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            error={error ? 'Incorrect password. Please try again.' : undefined}
          />
          <GlassButton type="submit" className="w-full">
            Log in
          </GlassButton>
        </form>
        <p className="mt-5 rounded-2xl border border-champagne/50 bg-champagne/10 p-3 text-xs leading-relaxed text-ink/60">
          This is a V1 demo login only, not production-secure authentication. The default password is{' '}
          <code className="rounded bg-white/70 px-1">mrcake-demo</code> unless changed via the{' '}
          <code className="rounded bg-white/70 px-1">NEXT_PUBLIC_ADMIN_DEMO_PASSWORD</code> build
          variable. See README for details.
        </p>
      </GlassCard>
    </div>
  );
}
