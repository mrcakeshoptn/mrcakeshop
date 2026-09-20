# M.R Cake Shop — Website + Admin Dashboard

A mobile-first cake catalogue and ordering site for **M.R Cake Shop** (Tiruppur, Tamil Nadu).
Customers browse cakes, customise weight/shape/egg type/steps, and send an order request straight
to WhatsApp. A full admin dashboard manages the catalogue, orders, customers, staff logins, and
site content — backed by a real shared database, not just this browser.

---

## Tech Stack

- Next.js 14 (App Router) + TypeScript, configured for **static export** (`output: 'export'`),
  deployed to GitHub Pages
- Tailwind CSS with a custom design system matching the M.R Cake Shop brand
- **Supabase** (Postgres + Auth) as the real backend — every visitor and every admin device reads
  and writes the same shared data; see [Architecture](#architecture)

## Local Development

```bash
npm install
npm run dev
```

You'll need a `.env.local` file with your Supabase credentials for the site to load any real
data locally:

```
NEXT_PUBLIC_SUPABASE_URL=https://xyvsxetxyzaetkcigymi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_k7tadVtWxs_szwQ_8qrZgw_Kh6Y1zR7
```

(The anon/publishable key is safe to expose — it's the public client key. Real access control is
enforced by Postgres Row Level Security policies, not by keeping this key secret.)

Visit `http://localhost:3000` for the customer site and `http://localhost:3000/admin` for the
admin dashboard.

**Note on fonts:** the first build needs internet access once, to fetch Baloo 2, Dancing Script
and Inter from Google Fonts (Next.js then self-hosts them — no runtime calls to Google after that).

## Production Build

```bash
npm run build
```

This produces a fully static site in `./out` — no Node.js server needed to host it. The Supabase
env vars above must be set at build time (see the GitHub Actions workflow below for how this
happens on deploy).

## GitHub Deployment

The included workflow at `.github/workflows/deploy.yml` builds and deploys automatically on every
push to `main`. It needs two repo secrets — add them at **Settings → Secrets and variables →
Actions → New repository secret**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Use the same values as in your local `.env.local` above.

**Project pages vs. custom domain:** this repo is currently live at
`https://mrcakeshoptn.github.io/mrcakeshop/` — a GitHub Pages *project* page, served from the
`/mrcakeshop` sub-path. `next.config.mjs` and the workflow are both set up for exactly that today.

**Important:** `public/CNAME` is also already set to `mrcakeshop.in` (see below). Once that custom
domain's DNS is live and GitHub Pages switches over to serving from it, the site moves to the
domain's *root* — at that point `/mrcakeshop` would be wrong and must be removed. When that
happens: change `NEXT_PUBLIC_BASE_PATH: '/mrcakeshop'` to `NEXT_PUBLIC_BASE_PATH: ''` in
`.github/workflows/deploy.yml`, and change the default in `next.config.mjs` to `''` too — then
redeploy. Leaving the sub-path set after switching to the custom domain will break the logo, the
favicon, and internal navigation.

## Custom Domain — mrcakeshop.in

`public/CNAME` is already set to `mrcakeshop.in`. At your domain registrar, add:

**A records** (apex domain, `mrcakeshop.in`) — point all four to GitHub's IPs:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME record** (for `www.mrcakeshop.in`, optional but recommended):
```
www → <your-github-username>.github.io
```

Then, in the GitHub repository → **Settings → Pages → Custom domain**, enter `mrcakeshop.in` and
save. GitHub Pages issues an HTTPS certificate automatically once DNS resolves — this can take up
to a few hours. If GitHub's own DNS requirements have changed since this was written, their
[Pages documentation](https://docs.github.com/pages) is the final authority.

## Admin Dashboard

Visit `/admin`. This uses **real Supabase Auth** — there's no shared demo password anymore.

**Creating your first login:** open your Supabase project dashboard → **Authentication → Users →
Add User**, enter your email and a password, and log in with those at `/admin/login`. A matching
staff profile is created for you automatically the first time you log in.

**Adding more staff:** repeat the same step for each person — every admin gets their own login,
never share one. See `/admin/team` in the dashboard for the current staff list and a reminder of
these steps.

From the dashboard you can:
- **Products** — add, edit, duplicate, activate/deactivate, and feature cakes; set weight-based
  pricing, shape charges, eggless charges, and step rules per cake. By default, 2-step is available
  from 1.5 kg and 3-step from 3 kg, editable per cake. Weights can start as low as 0.5 kg. A
  "Fast-Moving" flag marks cakes you keep pre-made and ready (typically 0.5–1 kg sizes)
- **Orders** — every order and custom cake request, from any device, in one place. Confirming an
  order calculates an expected pickup-ready time using your rules in Settings → Order Readiness
- **Customers** — a real, shared customer list; anyone who orders or sends a custom request is
  saved here automatically, visible to every logged-in staff member
- **Team** — see who has dashboard access
- **Settings** — business details, WhatsApp number, Google Maps and Instagram links, currency,
  delivery on/off (shows "coming soon" when off), order-readiness time rules, and the text shown
  on the About Us and Privacy Policy pages
- **Export** your catalogue or customer list as a JSON backup any time

## Order Readiness Rules

Configured in Settings → Order Readiness. When you confirm an order in Admin → Orders, the app
works out an expected ready-for-pickup time using these admin-editable rules (all times are
Tiruppur local time, IST):

- **Closed hours** (default midnight–6am): orders generally shouldn't be confirmed in this window
- **Morning window** (default until 1pm): normal cakes (Fresh Cream, Butter Cream) ready in a
  configurable number of hours (default 2); Designer/Custom/Eggless cakes take longer (default 6)
- **Afternoon window** (default 1pm–6pm): all cakes ready in a configurable number of hours
  (default 3)
- **Evening** (after 6pm): ready by a configurable hour the next morning (default 6am)

These are starting defaults matching a typical bakery day — tune every number in Settings to match
how your kitchen actually runs.

## Brand Assets

The M.R Cake Shop logo is baked into the site as static files:

```
public/logo-icon.png     — chef-hat icon, used in the header and admin login (120×120)
public/logo-lockup.png   — full logo + "Baking Happiness Since Always" tagline, used in the footer
src/app/icon.png         — favicon (Next.js picks this up automatically; 180×180)
```

To update the brand later, replace these three files with new exports at the same names and
dimensions — no code changes needed.

**Typography:** headings use Baloo 2 (bold and rounded, echoing the logo's chunky lettering) and
the tagline uses Dancing Script (matching the logo's cursive strokes). Prices are set in Inter
with tabular numerals rather than the display font, since the display font's digits and rupee
symbol didn't read clearly at small sizes.

## Customer-Facing Pages

- **About** (`/about`) — content is fully editable from Admin → Settings
- **Contact** (`/contact`) — phone, WhatsApp, Google Maps and Instagram links, live from Settings
- **Privacy Policy** (`/privacy`) — content is fully editable from Admin → Settings; **have a
  legal professional review it** (including for India's Digital Personal Data Protection Act)
  before relying on it

All three are linked from the footer on every page.

## Architecture

A real Postgres database (via Supabase) backs everything — no data lives only in one browser
anymore. Five tables: `products`, `settings` (a single row), `customers`, `orders`, and
`admin_profiles`. Row Level Security policies control access:

- `products` and `settings` are readable by anyone (it's a public storefront), writable only by
  logged-in staff
- `customers` and `orders` are **never** read or written directly by the public — a customer
  placing an order calls the `submit_order()` Postgres function instead, which safely creates or
  updates their customer record and order behind the scenes without ever exposing other people's
  data to them. Only logged-in staff can list or update these tables directly
- `admin_profiles` extends Supabase's own `auth.users` — a database trigger creates a profile row
  automatically the first time someone logs in

Repository interfaces still isolate the UI from the storage mechanism, the same pattern as before,
just backed by Supabase calls instead of `localStorage`:

```
ProductRepository   — src/lib/repositories/productRepository.ts
SettingsRepository  — src/lib/repositories/settingsRepository.ts
CustomerRepository  — src/lib/repositories/customerRepository.ts
OrderRepository     — src/lib/repositories/orderRepository.ts
```

Pricing logic lives in one place, `src/lib/pricing.ts`, and order-readiness time logic lives in
`src/lib/readiness.ts` — every screen that needs either calls through these rather than
re-deriving them.

### Supabase GitHub integration (optional)

Supabase can also sync database schema changes from this repo automatically: Project Settings →
Integrations → GitHub Integration, pointing at a `supabase/migrations/` folder. This project's
schema was applied directly via the Supabase MCP connector rather than committed migration files,
so if you want schema changes to flow through git going forward, set that up and run
`supabase db pull` to capture the current schema as a first migration.

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
| Your admin login | Supabase Dashboard → Authentication → Users | none created yet |

## Current Limitations

- No online payment — orders are requests, confirmed manually over WhatsApp
- No delivery logistics — pickup only for now; the Delivery Enabled setting only changes the
  "coming soon" message, it doesn't add courier integration
- No inventory management or automatic stock tracking
- No WhatsApp Business API — orders open a pre-filled `wa.me` chat that a staff member confirms
  manually
- Reference images for custom cakes can't be attached to the WhatsApp message automatically — the
  customer attaches them manually inside the WhatsApp chat that opens
- Staff account creation happens in the Supabase Dashboard, not from within the app itself — this
  is intentional (creating logins requires privileged access that should never sit in client-side
  code), but it does mean the shop owner needs occasional access to Supabase directly

## Future Upgrade Roadmap

With a real backend now in place, natural next additions include:

```
Payment integration (e.g. Razorpay) for deposits or full payment
Delivery logistics and courier integration
WhatsApp Business API for automated order confirmations
Inventory tracking tied to the Fast-Moving flag
Role-based permissions in Admin → Team (owner vs. staff capabilities)
```

Order status already progresses through: Pending → Confirmed → Ready → Completed (or Cancelled)
in Admin → Orders — payment and delivery stages would slot into that same flow.
