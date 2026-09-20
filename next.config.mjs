/** @type {import('next').NextConfig} */

// This site is deployed as a GitHub Pages *project* page at
// https://mrcakeshoptn.github.io/mrcakeshop/, so it's served from the "/mrcakeshop"
// sub-path, not "/". That sub-path is baked in below as the default.
//
// If you ever move to a custom domain (public/CNAME) or a user/org page
// (username.github.io with no repo suffix), those serve from "/" instead — set
// NEXT_PUBLIC_BASE_PATH="" (empty) in the deploy workflow to override this default.
// If you rename the GitHub repo, update the default below to match.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/mrcakeshop';

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
