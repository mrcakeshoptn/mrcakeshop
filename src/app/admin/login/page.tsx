'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/adminAuth';
import { useAdminSession } from '@/lib/hooks';
import { withBasePath } from '@/lib/basePath';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassInput from '@/components/glass/GlassInput';

export default function AdminLoginPage() {
  const router = useRouter();
  const { session, checked } = useAdminSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (checked && session) router.replace('/admin');
  }, [checked, session, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: loginError } = await login(email, password);
    setSubmitting(false);
    if (loginError) {
      setError(loginError);
    } else {
      router.replace('/admin');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5">
      <GlassCard className="w-full max-w-sm p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath('/logo-icon.png')} alt="" className="mx-auto mb-4 h-14 w-14 object-contain" />
        <h1 className="text-center font-display text-2xl text-burgundy-dark">Admin Access</h1>
        <p className="mt-1 text-center text-sm text-ink/60">Log in with your staff email and password.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <GlassInput
            label="Email"
            type="email"
            autoFocus
            autoComplete="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          <GlassInput
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            error={error || undefined}
          />
          <GlassButton type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </GlassButton>
        </form>
        <p className="mt-5 rounded-2xl border border-champagne/50 bg-champagne/10 p-3 text-xs leading-relaxed text-ink/60">
          Don&apos;t have a login yet? Staff accounts are created in the Supabase Dashboard
          (Authentication → Users) by the shop owner, or from Admin → Team once you&apos;re signed in.
        </p>
      </GlassCard>
    </div>
  );
}
