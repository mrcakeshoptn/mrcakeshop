/** @type {import('next').NextConfig} */

// When deploying to https://<user>.github.io/<repo>/ (project page, not a custom
// domain), GitHub Pages serves the site from a sub-path. Set NEXT_PUBLIC_BASE_PATH
// in the deploy workflow (or here) to that sub-path, e.g. "/mr-cake-shop".
// Leave it empty if you're using a custom domain (public/CNAME) or a user/org page,
// since those are served from "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    // GitHub Pages has no image optimization server, so the built-in
    // Next.js Image loader (which needs one) is disabled.
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
