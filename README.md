# Kavach Pest Management — Website

Static 8-page site. Plain HTML/CSS/JS — no framework, no build step, no backend.

**Phone:** 981-8499308 (`+977 9818499308`) — WhatsApp and tap-to-call on every page. No Viber.

## Pages

| File | URL | Content |
|---|---|---|
| `index.html` | `/` | Hero, quote bar, work grid, how a visit works, programmes, FAQ (with `FAQPage`), CTA |
| `services.html` | `/services` | Four Shield programmes · ten one-off treatments (all quoted) |
| `restaurant-pest-control.html` | `/restaurant-pest-control` | Kitchen Shield sector page — the only published price |
| `hotel-pest-control.html` | `/hotel-pest-control` | Room Shield sector page — quarterly room inspections, bed-bug treatment |
| `warehouse-pest-control.html` | `/warehouse-pest-control` | Store Shield sector page — dry warehouses and godowns only |
| `pricing.html` | `/pricing` | Kitchen price table, everything else quoted, `#guarantee` callback clause |
| `about.html` | `/about` | Why records, four operating rules, what we don't do |
| `contact.html` | `/contact` | Quote form that opens WhatsApp + direct contact |
| `thank-you.html` | `/thank-you` | Kept for old links (noindex); the form no longer redirects here |
| `404.html` | — | Served with a 404 status for unknown paths (noindex) |

## Run locally

```bash
python tools/preview_server.py
```

Open <http://localhost:8737>. The preview behaves like the live Cloudflare deploy:
extensionless URLs, `.html` → 307 redirects, the designed 404 page, and every path in
`.assetsignore` returning 404. A plain `python -m http.server` will not serve `/pricing`.

## Design system

White canvas, lime accent, poster grotesque with one word per headline set in true
italic. Everything is a pill or a soft-cornered card; there are no hard rectangles.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0B0B` | headings, footer background, dark buttons |
| `--ink-2` | `#3D423C` | body text |
| `--muted` | `#7C8079` | captions, meta, placeholder text |
| `--bg` | `#FFFFFF` | page background |
| `--soft` | `#F3F4F0` | alternating bands, inputs, CTA band |
| `--line` | `#E3E5DE` | card hairlines |
| `--line-2` | `#CFD2C8` | stat-row and rate-row rules |
| `--lime` | `#C5F24C` | primary — buttons, circles, guarantee panel |
| `--lime-d` | `#A8DD22` | hover, check marks, small accents |
| `--lime-soft` | `#EEFBCC` | icon chips, avatar circles |
| `--alert` | `#D2451E` | the emergency call button only |

**Type.** Archivo (display — uppercase, 700/800, `-0.035em`; the emphasis word inside
every `h1`/`h2` is a real `<em>` at weight 400 italic) · Inter (body) · Noto Sans
Devanagari (Nepali).

**Radii.** `999px` pills for controls, `20px` large panels, `14px` cards, `10px` thumbs.

**Headline convention.** Every display heading alternates roman and italic:

```html
<h2>Our <em>Work</em><br>That We Do</h2>
```

**Components:** `.hero-stage` (three-column hero: watch circle · cutout · pull-quote) ·
`.quotebar` (the fixed-price strip, a real GET form that prefills the contact page) ·
`.work-grid` (staggered photo tiles with `01/` captions) · `.explore-card` ·
`.statrows` · `.plans` / `.plan` · `.feature` (banner + centred circular button) ·
`.quotes-track` (scroll-snap testimonial carousel) · `.rates` · `.prog` · `.steps` ·
`.guarantee` · `.emergency` · `.wordmark` (the giant cropped footer logotype).

## Images

All ten photographs are in `assets/img/`, each with a `.webp` sibling.
**[IMAGE-PROMPTS.md](IMAGE-PROMPTS.md)** holds the prompt and spec behind each one — keep
it if you ever need to regenerate or reshoot a slot.

Every photo is served through a `<picture>`: browsers take the WebP, anything older
falls back to the original JPEG/PNG. That is **931 KB instead of 1,442 KB — 35% less**
over the whole set. The two transparent cutouts use *lossless* WebP, which came out both
smaller than the PNG and pixel-identical to it, so the hero loses nothing.

**Regenerating a WebP** after you replace a photo:

```bash
python -c "from PIL import Image; import sys; p=sys.argv[1]; i=Image.open(p); i.save(p.rsplit('.',1)[0]+'.webp', 'WEBP', quality=80, method=6)" assets/img/work-kitchen.jpg
```

Use `lossless=True` instead of `quality=80` for the transparent PNGs. Re-encoding the
JPEGs themselves is pointless — they already arrived as progressive JPEGs at about
quality 78, so a q78 pass saves nothing.

Every photo slot is a `.shot` tile with a fixed aspect ratio. If the file is missing,
`site.js` marks the tile `.is-empty` and it renders as a hatched placeholder naming the
file it wants. Drop the file into `assets/img/` under that name and it appears — no
markup change, no layout shift.

| File | Ratio | Shows |
|---|---|---|
| `kit-cutout.png` | 5:4, transparent | Hero centrepiece — the full service kit |
| `work-kitchen.jpg` | 4:3 | Gel baiting under a prep counter at night |
| `work-hotel.jpg` | 4:3 | Mattress seam inspection with a torch |
| `work-warehouse.jpg` | 4:3 | Numbered bait station at warehouse racking |
| `work-home.jpg` | 4:3 | Skirting treatment in an apartment kitchen |
| `proof-logbook.jpg` | 1:1 | Gloved hands writing the dated logbook entry |
| `proof-certificate.jpg` | 1:1 | Framed certificate on a kitchen wall |
| `feature-night.jpg` | 16:9 | Two technicians working a closed restaurant |
| `team-portrait.jpg` | 3:4 | The night crew |
| `footer-kit.png` | 3:1, transparent | Equipment line-up under the footer wordmark |
| `og-card.jpg` | 1200×630 | Social share card, composed from `feature-night.jpg` |

`proof-logbook` and `proof-certificate` ship at 400×400 — they render into a 150px slot,
so the original 800×800 was carrying four times the pixels it could ever show.

The original hand-drawn SVG illustrations are still in `assets/img/` if you would rather
use line art than photography — point the `<img src>` at those instead.

Icons are inline SVG on a shared spec: `fill="none" stroke="currentColor"
stroke-width="1.7"`, round caps and joins, 24×24 viewBox. They inherit `currentColor`,
so they recolour automatically inside lime and black panels.

## SEO

**Live domain is `kavachpest.com`.** Everything — canonicals, `og:url`, the sitemap,
`robots.txt`, the form redirect and the support mailbox — points there. `kavach.com.np`
was never registered; if you do register it later, 301 it to `kavachpest.com` rather than
serving both, or you split your own ranking signal in half.

Cloudflare serves clean URLs and 307s `/x.html` to `/x`, so canonicals are extensionless.
Internal links point straight at the extensionless URLs — never link to `.html`.

**In place on every page:** keyword-first `<title>`, `<meta description>` under 160
chars, explicit `robots`, canonical, `geo.region`/`geo.placename`, full Open Graph and
Twitter card pointing at `assets/img/og-card.jpg` (1200×630), and `lang="en-NP"`. No
`keywords` meta and no map coordinates — there is no office to pin.

**Structured data** (JSON-LD, one `@graph` per page):

| Type | Where | Notes |
|---|---|---|
| `LocalBusiness` (`/#business`) | every page | Service-area business: no address, no opening hours until days are confirmed |
| `Service` | services + each sector page | `@id` = page URL + `#service`; only Kitchen Shield carries an `Offer` |
| `Offer` + `UnitPriceSpecification` | home, services, restaurant | `minPrice` 4000 NPR, `unitCode` `MON`, 12-month `eligibleDuration` |
| `FAQPage` | home | Mirrors the visible FAQ. Google only shows FAQ rich results for gov/health sites |
| `BreadcrumbList` | inner pages | Sector pages: Home → Services → sector, matching the visible breadcrumb |
| `WebSite` | home | site name handling |

Never use `PestControlService` (not a schema.org type), and never add `Review` or
`AggregateRating` nodes without real, permitted reviews.

**After deploying, do these three things** — the markup alone will not rank you:

1. **Google Search Console** — add `kavachpest.com`, verify, submit
   `https://kavachpest.com/sitemap.xml`, then *Request indexing* on the homepage.
2. **Google Business Profile** — the biggest lever for "pest control Kathmandu". There
   is no office, so set it up as a **service-area business** (hide the address, list
   Kathmandu, Lalitpur and Bhaktapur). Category: *Pest Control Service*. Name and phone
   must match the site exactly.
3. **Real reviews** on that profile. Ask every contracted client after their third
   service.

## Testimonials

The homepage has no testimonial section. It previously held clearly-badged placeholders;
those are gone, and an FAQ section took the slot — which is worth more anyway, since it
feeds `FAQPage` rich results and covers long-tail queries like "how much does pest
control cost in Kathmandu".

`_snippets/testimonials.html` has the carousel ready to paste back above the CTA section
whenever you have real quotes; the CSS and carousel JS are still in place. Use it only
with words a client actually said and agreed to publish. Testimonials invented and
attributed to a named business are illegal in most markets, trivially disproved by a
phone call, and exactly what a competitor reports.

## Deploy (Cloudflare Workers static assets)

The live site is a Cloudflare **Worker with static assets**, connected to this repo. Every
push to `main` redeploys.

- `wrangler.jsonc` — Worker name `kavach-site`, assets served from the repo root,
  `not_found_handling: "404-page"` so unknown URLs get `404.html` with a 404 status.
- `.assetsignore` — keeps `.git`, `.claude`, `_snippets`, `tools`, `*.md` and `*.py` off the
  public site. Anything new that should stay private goes in here.
- `_headers` — 30-day cache on `/assets/img/*`. Replace an image under a **new filename**,
  or visitors keep the old one for up to a month.

Dashboard-only settings (not in the repo): **SSL/TLS → Edge Certificates → Always Use
HTTPS** on; a proxied `www` record with a redirect rule `www.kavachpest.com/*` →
`https://kavachpest.com/$1` (301); **AI Crawl Control / Bots → AI training bots allowed**
(robots.txt allows everyone, and the CDN should agree).

**Rollback:** Cloudflare dashboard → Workers & Pages → `kavach-site` → Deployments →
pick the previous version → *Rollback*. In git, `git revert <merge commit>` and push.

## Business facts the copy depends on (confirmed 2026-10-06)

Visits 5 AM – 9 PM by appointment · WhatsApp replies (quotes and complaints) within
2–3 hours · restaurants from NPR 4,000/month on a 12-month contract, 1–2 visits a month ·
everything else quoted · records: logbook, WhatsApp photo report, certificate, per-room
card (no monthly trend report) · steam for bed bugs · dry warehouses only · no
fumigation · no office · no Viber · not yet a registered company (never write "Pvt.
Ltd.") · photos are generated and labelled "Illustrative image".

Change any of these and grep the whole site — they repeat across pages, and the
callback clause must read the same everywhere, including the sample PDF.

## Still open

1. **Prices** for hotels, warehouses, homes and one-off treatments (currently "Quote").
2. **Email** — no mailbox yet, so no address is published. When one exists, add MX/SPF/
   DKIM in Cloudflare DNS, then add it to the footer, contact page and JSON-LD `email`.
3. **Company registration + PAN** — add both to the footer once they exist.
4. **Pesticide licence** — the Pesticides Management Act 2076 appears to require a
   provincial licence for commercial spraying. Check with the Bagmati Province committee.
5. **Days of operation** — add `openingHoursSpecification` once the days are confirmed.
6. **Real photos** with client permission, to replace the illustrations.
7. **Fonts** — self-host WOFF2 in `assets/fonts/` for speed.

## Launch gate

- [x] No horizontal overflow at 375px on any page
- [x] Every image labelled illustrative, with honest alt text
- [x] Responsive hero (480/800/1200 WebP) — phones load 36–78 KB instead of 223 KB
- [x] No `.html` internal links; 0 internal 3xx in a local crawl
- [x] Structured data uses only schema.org types; prices match visible copy
- [x] Quote form opens WhatsApp with the request pre-filled
- [ ] Google Search Console verified + sitemap submitted
- [ ] Google Business Profile (service-area) created and verified
- [ ] WhatsApp form and tap-to-call tested on a real Android phone
- [ ] Lighthouse / PageSpeed mobile run after deploy
