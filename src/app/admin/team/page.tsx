'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import GlassCard from '@/components/glass/GlassCard';

interface AdminProfile {
  user_id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  created_at: string;
}

export default function AdminTeamPage() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('admin_profiles')
      .select('*')
      .order('created_at')
      .then(({ data, error }) => {
        if (!error && data) setProfiles(data as AdminProfile[]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-ink/60">
        Everyone who can log into this dashboard. Each person needs their own login — never share
        one password between staff.
      </p>

      <GlassCard className="mb-6 border-champagne/50 bg-champagne/10 text-sm text-ink/70">
        <p className="font-medium text-burgundy-dark">To add a new staff member:</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Open your Supabase project dashboard → Authentication → Users → Add User.</li>
          <li>Enter their email and a temporary password, and share it with them securely.</li>
          <li>
            They&apos;ll appear in the list below automatically the first time they log in here —
            new accounts start as <strong>staff</strong>.
          </li>
        </ol>
      </GlassCard>

      <GlassCard padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="border-b border-white/60 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink/40">
                  Loading…
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr key={p.user_id} className="border-b border-white/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{p.name || '—'}</td>
                  <td className="px-4 py-3 text-ink/70">{p.email}</td>
                  <td className="px-4 py-3 capitalize text-ink/70">{p.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
