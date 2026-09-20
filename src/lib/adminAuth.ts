// ---------------------------------------------------------------------------
// V1 DEMO AUTH ONLY.
// Replace with real server-side authentication before production
// (NextAuth/Auth.js, Supabase Auth, Firebase Auth, or a custom API) — see
// README.md "V1 Limitations". This check runs entirely in the browser, the
// "password" ships inside the static bundle, and anyone can bypass it via
// devtools. It exists only so the admin dashboard prototype isn't wide open
// by default, not to protect real business data.
// ---------------------------------------------------------------------------

import { readJSON, removeKey, writeJSON } from '@/lib/storage';

const SESSION_KEY = 'mr_cake_admin';

// Change this before sharing the demo link with anyone, or better: set
// NEXT_PUBLIC_ADMIN_DEMO_PASSWORD at build time so it isn't in source control.
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DEMO_PASSWORD || 'mrcake-demo';

export function attemptLogin(password: string): boolean {
  const ok = password === DEMO_PASSWORD;
  if (ok) writeJSON(SESSION_KEY, { loggedIn: true, at: new Date().toISOString() });
  return ok;
}

export function isLoggedIn(): boolean {
  return readJSON<{ loggedIn: boolean }>(SESSION_KEY, { loggedIn: false }).loggedIn;
}

export function logout(): void {
  removeKey(SESSION_KEY);
}
