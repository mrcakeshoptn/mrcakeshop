/**
 * Strips a trailing slash from a pathname for comparison purposes.
 *
 * next.config.mjs sets `trailingSlash: true` (required for this static export to
 * work cleanly on GitHub Pages), which means the router's usePathname() reports
 * paths like "/admin/login/" rather than "/admin/login". Any code that compares
 * a pathname against a literal route string must go through this first, or the
 * comparison silently never matches.
 */
export function normalizePathname(pathname: string | null): string {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}
