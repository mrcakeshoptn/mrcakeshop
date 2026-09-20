import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

/**
 * Real authentication via Supabase Auth — replaces the old single shared
 * demo password. Admin accounts (email + password) are created either in the
 * Supabase Dashboard (Authentication → Users) or from Admin → Team once at
 * least one owner account exists. Sessions are managed by supabase-js itself
 * (stored in localStorage, auto-refreshed), so these are thin wrappers.
 */

export async function login(email: string, password: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message || null };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
