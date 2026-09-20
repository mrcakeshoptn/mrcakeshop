/**
 * Prefixes a root-relative asset path with the site's base path.
 *
 * Next.js's static export does NOT automatically rewrite plain <img src="/x.png">
 * strings to account for `basePath` in next.config.mjs — that automatic rewriting
 * only happens for next/image and next/link. Any hand-written path to a file in
 * /public must go through this helper instead, or it will 404 once the site is
 * deployed under a sub-path (e.g. GitHub Pages project pages like
 * https://<user>.github.io/<repo>/).
 *
 * Usage: <img src={withBasePath('/logo-icon.png')} />
 */
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path.startsWith('/')) return `${basePath}/${path}`;
  return `${basePath}${path}`;
}
