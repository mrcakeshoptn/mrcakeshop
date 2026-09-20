# M.R Cake Shop — V1 Catalogue Website

A mobile-first cake catalogue and order-request website for **M.R Cake Shop** (Tiruppur, Tamil
Nadu), built with a premium glassmorphism UI. Customers browse cakes, customise weight/shape/egg
type/steps, and send an order request straight to WhatsApp. A built-in admin dashboard manages the
entire catalogue — no code required.

This is a **catalogue + order-request site**, not a payment or delivery system. See
[V1 Limitations](#v1-limitations) below.

---

## Tech Stack

- Next.js 14 (App Router) + TypeScript, configured for **static export** (`output: 'export'`)
- Tailwind CSS with a custom glassmorphism token system
- No backend required for V1 — data lives in the browser's `localStorage`, behind a
  `ProductRepository` / `SettingsRepository` abstraction (see [Architecture](#architecture))

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the customer site and `http://localhost:3000/admin` for the
admin dashboard.

**Note on fonts:** the first build needs internet access once, to fetch Playfair Display and
Inter from Google Fonts (Next.js then self-hosts them — no runtime calls to Google after that).

## Production Build

```bash
npm run build
```

This produces a fully static site in `./out` — no Node.js server needed to host it.

## GitHub Deployment

A ready-made GitHub Actions workflow is included at `.github/workflows/deploy.yml`. To use it:

1. Push this repository to GitHub.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main` (or run the workflow manually) — it builds and deploys automatically.

**Project pages vs. custom domain:** this repo is currently live at
`https://mrcakeshoptn.github.io/mrcakeshop/` — a GitHub Pages *project* page, served from the
`/mrcakeshop` sub-path. `next.config.mjs` and the workflow are both set up for exactly that today.

**Important:** `public/CNAME` is also already set to `mrcakeshop.in` (see below). Once that custom
domain's DNS is live and GitHub Pages switches over to serving from it, the site moves to the
domain's *root* — at that point `/mrcakeshop` would be wrong and must be removed. When that
happens: change `NEXT_PUBLIC_BASE_PATH: '/mrcakeshop'` to `NEXT_PUBLIC_BASE_PATH: ''` in
`.github/workflows/deploy.yml`, and change the default in `next.config.mjs` to `''` too — then
redeploy. Leaving the sub-path set after switching to the custom domain will break the logo, the
favicon, and internal navigation, in the same way they were broken before this fix.

## Custom Domain — mrcakeshop.in

`public/CNAME` is already set to:

```
mrcakeshop.in
```

At your domain registrar (wherever `mrcakeshop.in` is registered — GoDaddy, BigRock, Hostinger,
Namecheap, etc.), add these DNS records:

**A records** (apex domain, `mrcakeshop.in`) — point all four to GitHub's IPs:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
Some registrars want the host/name field set to `@` for these; others infer it automatically for
the root domain.

**CNAME record** (for `www.mrcakeshop.in`, optional but recommended):
```
www → <your-github-username>.github.io
```

Then, in the GitHub repository → **Settings → Pages → Custom domain**, enter `mrcakeshop.in` and
save. GitHub Pages issues an HTTPS certificate automatically once DNS resolves — this can take up
to a
few hours. If GitHub's own DNS requirements have changed since this was written, their
[Pages documentation](https://docs.github.com/pages) is the final authority.

## Admin Dashboard

Visit `/admin`. The default demo password is:

```
mrcake-demo
```

Change it by setting the `NEXT_PUBLIC_ADMIN_DEMO_PASSWORD` environment variable at build time
(there's a commented slot for it as a GitHub secret in the deploy workflow) — **never commit a
real password to source control.**

From the dashboard you can:
- Add, edit, duplicate, activate/deactivate, and feature cakes
- Set weight-based pricing, shape charges, eggless charges, and step rules per cake — by default,
  2-step is available from 1.5 kg and 3-step from 3 kg, editable per cake in its pricing form
- Upload and manage product images (auto-compressed for browser storage)
- Configure business details, WhatsApp number, Google Maps link, Instagram link, currency, and
  hero image
- View and manage your **customer list** — anyone who places an order or sends a custom cake
  request is saved here automatically (name + mobile), and you can add, edit, or export them too
- **Export** your catalogue as a JSON backup, **import** it back, or **reset to demo data**

## Brand Assets

The M.R Cake Shop logo is baked into the site as static files, not generated from Admin Settings:

```
public/logo-icon.png     — chef-hat icon, used in the header and admin login (120×120)
public/logo-lockup.png   — full logo + "Baking Happiness Since Always" tagline, used in the footer
src/app/icon.png         — favicon (Next.js picks this up automatically; 180×180)
```

To update the brand later, replace these three files with new exports at the same names and
dimensions — no code changes needed. The Admin Settings "Logo" upload field is separate: it's a
placeholder for a future per-tenant logo system and isn't wired into the header/footer in this V1.

**Typography:** headings use Baloo 2 (bold and rounded, echoing the logo's chunky lettering) and
the tagline uses Dancing Script (matching the logo's cursive strokes) — both replace the more
formal serif originally used in early drafts. Prices are set in Inter with tabular numerals
rather than the display font, since the display font's digits and rupee symbol didn't read
clearly at small sizes.

## Customer-Facing Pages

Beyond the catalogue, the site includes:
- **About** (`/about`) — business story, pulled in part from your Settings
- **Contact** (`/contact`) — phone, WhatsApp, and address, live from Settings
- **Privacy Policy** (`/privacy`) — placeholder policy text; **have a legal professional review
  and adapt it** (including for India's Digital Personal Data Protection Act) before publishing

All three are linked from the footer on every page.

## Architecture

Three repository interfaces isolate the UI from the storage mechanism:

```
ProductRepository   — src/lib/repositories/productRepository.ts
SettingsRepository  — src/lib/repositories/settingsRepository.ts
CustomerRepository  — src/lib/repositories/customerRepository.ts
```

V1 implements all three against `localStorage`. To move to a real backend later
(PostgreSQL + Prisma + object storage + real authentication), write new implementations of these
same interfaces — no page or component needs to change.

Pricing logic lives in one place, `src/lib/pricing.ts`, and every screen (catalogue card, detail
modal, admin preview, WhatsApp message) calls through it — so pricing never drifts between
screens.

## Exact Values You Need to Replace Before Going Live

| What | Where | Placeholder |
|---|---|---|
| WhatsApp number | Admin → Settings → Business | `WHATSAPP_NUMBER_HERE` |
| Business phone | Admin → Settings → Business | `PHONE_NUMBER_HERE` |
| Google Maps link | Admin → Settings → Business | not set |
| Instagram link | Admin → Settings → Business | not set |
| Custom domain | `public/CNAME` | already set to `mrcakeshop.in` — just add the DNS records above |
| Hero image | Admin → Settings → Branding | Unsplash demo photo |
| Real cake photos | Admin → Products → each cake | Unsplash demo photography |
| Real cake prices | Admin → Products → each cake's pricing tables | demo prices |
| Admin password | `NEXT_PUBLIC_ADMIN_DEMO_PASSWORD` build variable | `mrcake-demo` |

## V1 Limitations

This version intentionally does **not** include:

- No real backend or database (catalogue, settings, and customer records all live in the
  visitor's or admin's own browser via `localStorage` — each browser/device has its own copy
  until you export/import)
- **Customer records are per-device, not shared.** This is the most important limitation to
  understand: when a real customer places an order or sends a custom cake request from their own
  phone on the live site, their name and mobile number save into *their own* browser's storage —
  not into the shop owner's `/admin/customers` list. The admin's customer list only fills up with
  records created on the admin's own device (orders placed there, or customers added manually).
  Genuinely centralizing every customer who orders — across every visitor's device — requires a
  real backend and database, which is exactly the kind of upgrade the repository pattern below is
  designed to make possible without a frontend rewrite. Until then, the practical way to keep a
  real customer list is to add customers manually in Admin → Customers after confirming each order
  on WhatsApp.
- No production-grade authentication for `/admin` (see the code comments in `src/lib/adminAuth.ts`)
- No online payment
- No inventory management
- No delivery tracking or logistics integration
- No WhatsApp Business API — orders open a pre-filled `wa.me` chat that a staff member confirms
  manually
- Images are stored as compressed data URLs in the browser, not in cloud object storage
- Reference images for custom cakes cannot be attached to the WhatsApp message automatically —
  the customer attaches them manually inside the WhatsApp chat that opens

## Future Upgrade Roadmap

The service boundaries are already in place for these to be added without a frontend rewrite:

```
Customer Website
        |
        v
       API
        |
        +---- Product Service
        +---- Order Service
        +---- Customer Service
        +---- Payment Service (e.g. Razorpay)
        +---- Delivery Service
        +---- WhatsApp Business API Service
        +---- Inventory Service
        +---- Production/Kitchen Service
        |
        v
   PostgreSQL
```

Order status could then progress through: Request Received → Quote Sent → Confirmed → Payment
Pending → Payment Received → Production → Ready → Out for Delivery → Completed / Cancelled.
