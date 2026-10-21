# Kavach Pest Management — Website

Static site with 17 intended indexable pages, plus two noindex legacy/error
templates. Plain HTML/CSS/JS — no framework, no build step, no form backend.

**Phone:** 981-8499308 (`+977 9818499308`) — WhatsApp and tap-to-call on every page. No Viber.

## Pages

| File | URL | Content |
|---|---|---|
| `index.html` | `/` | Hero, quote bar, work grid, how a visit works, programmes, visible FAQ, CTA |
| `services.html` | `/services` | Four Shield programmes · ten one-off treatments (all quoted) |
| `restaurant-pest-control.html` | `/restaurant-pest-control` | Kitchen Shield sector page — the only published price |
| `hotel-pest-control.html` | `/hotel-pest-control` | Room Shield sector page — quarterly room inspections, bed-bug treatment |
| `warehouse-pest-control.html` | `/warehouse-pest-control` | Store Shield sector page — dry warehouses and godowns only |
| `pricing.html` | `/pricing` | Kitchen price table, everything else quoted, `#guarantee` callback clause |
| `about.html` | `/about` | Why records, four operating rules, what we don't do |
| `contact.html` | `/contact` | Quote form that opens WhatsApp + direct contact |
| `cockroach-control.html` | `/cockroach-control` | Quoted cockroach treatment, distinct from the recurring kitchen programme |
| `bed-bug-treatment.html` | `/bed-bug-treatment` | Hotel/home treatment, separate from quarterly hotel inspections |
| `resources.html` | `/resources` | Commercial buyer guide hub |
| `restaurant-pest-control-records.html` | `/restaurant-pest-control-records` | Record checklist; blank specimen distinguished from completed-client proof |
| `hotel-bed-bug-preparation.html` | `/hotel-bed-bug-preparation` | Hotel assessment information and access checklist |
| `warehouse-pest-monitoring.html` | `/warehouse-pest-monitoring` | Dry-storage station/visit-record guide |
| `nepali.html` | `/nepali` | Nepali commercial service overview; reciprocal homepage hreflang |
| `contact-nepali.html` | `/contact-nepali` | Nepali quote form with stable internal option values |
| `privacy.html` | `/privacy` | Quote handoff, session attribution and optional analytics information |
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
| `--muted` | `#636B5F` | readable captions, meta, placeholder text |
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

Fonts are self-hosted through `assets/css/fonts.css`. Four primary variable WOFF2 subsets
(Archivo normal/italic Latin, Inter Latin and Noto Sans Devanagari) retain the
existing typography without a runtime Google Fonts stylesheet request. Font
filenames contain hashes; SIL Open Font Licence files are in `assets/fonts/`.
Nepali pages use the Devanagari family for headings and body text.
English pages use an additional small Devanagari subset for their fixed Nepali
labels; Nepali pages keep the full Devanagari face. This avoids downloading the
full face just for a short English-page label. After changing those labels, run
`python tools/subset_nepali_labels.py` (free Fonts API), then `python tools/build_css.py`.
The latter combines maintained `fonts.css` and `main.css` into the served
`assets/css/site.min.css`. Commit the generated stylesheet with source edits;
there is no build step on the hosting platform.

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
falls back to the original JPEG/PNG. The original WebP collection measured
**931 KB instead of 1,442 KB — 35% less**, before the newer responsive gallery
variants. Actual delivered bytes depend on viewport and density.
The two transparent cutouts use *lossless* WebP, which came out both
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

The three measured oversized work-gallery illustrations now have 480/800/1200px
WebP variants and layout-matched `sizes`, used on the homepage and sector pages.
Original JPEG fallbacks and illustration labels remain intact. Lazy images use
async decoding. To regenerate after changing originals, run
`python tools/responsive_images.py v3` with a **new** version suffix for fresh
cache URLs. Pillow is required for this maintenance utility.

The original hand-drawn SVG illustrations are still in `assets/img/` if you would rather
use line art than photography — point the `<img src>` at those instead.

Icons are inline SVG on a shared spec: `fill="none" stroke="currentColor"
stroke-width="1.7"`, round caps and joins, 24×24 viewBox. They inherit `currentColor`,
so they recolour automatically inside lime and black panels.

## SEO

**Live domain is `kavachpest.com`.** Everything — canonicals, `og:url`, the sitemap,
`robots.txt` and the enquiry attribution — points there. There is no configured
support mailbox. `kavach.com.np`
was never registered; if you do register it later, 301 it to `kavachpest.com` rather than
serving both, or you split your own ranking signal in half.

Cloudflare serves clean URLs and 307s `/x.html` to `/x`, so canonicals are extensionless.
Internal links point straight at the extensionless URLs — never link to `.html`.

**In place on every page:** individual `<title>`, concise `<meta description>`,
explicit `robots`, canonical, full Open Graph and
Twitter card pointing at `assets/img/og-card.jpg` (1200×630), and `lang="en-NP"`
or `lang="ne-NP"` for the two Nepali pages. No
`keywords` meta and no map coordinates — there is no office to pin.

**Structured data** (JSON-LD, one `@graph` per page):

| Type | Where | Notes |
|---|---|---|
| `LocalBusiness` (`/#business`) | every page | Service-area business: no address, no opening hours until days are confirmed |
| `Service` | services, each sector page and the two one-off treatment pages | `@id` = page URL + `#service`; only Kitchen Shield carries an `Offer` |
| `Offer` + `UnitPriceSpecification` | home, services, restaurant | `minPrice` 4000 NPR, `unitCode` `MON`, 12-month `eligibleDuration` |
| `WebPage` / `ContactPage` | existing public pages | Page entity separate from the business ID |
| `Article` | three buyer guides | Organization author, actual content date and relevant programme links |
| `CollectionPage` | resources | Guide hub |
| `BreadcrumbList` | inner pages | Sector pages: Home → Services → sector, matching the visible breadcrumb |
| `WebSite` | home | site name handling |

Never use `PestControlService` (not a schema.org type), and never add `Review` or
`AggregateRating` nodes without real, permitted reviews.

Visible FAQs remain useful, but FAQPage markup was removed: Google discontinued
FAQ rich results from 7 May 2026. No special AEO/GEO markup or llms.txt is required
for Google AI features. Content is available in raw HTML, with clear service
scope, prices, exclusions and buyer answers. See Google's official
[AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
and [documentation updates](https://developers.google.com/search/updates).

Content follows the SEO Bullet format: descriptive headings, direct answers,
focused fact lists and labelled comparison tables. Keep price units, contract
terms and exclusions beside the claims they qualify. Tables compare programme
schedules and hotel inspection/treatment charges; they do not introduce prices
for quoted work. Existing business/service entity IDs and offer facts remain
the source of truth for JSON-LD. Revise a guide's visible update date and its
Article `dateModified` together when its content changes.

English homepage/contact and their Nepali equivalents are self-canonical, with
reciprocal `en-NP`, `ne-NP` and `x-default` alternates in HTML. Language links
are explicit; there is no automatic browser-language redirect. Sector/treatment
pages have no hreflang until genuine equivalent translations exist. `geo.*`
meta tags are legacy descriptive metadata, not a Google targeting mechanism.

**After deploying, do these three things** — the markup alone will not rank you:

1. **Google Search Console** — add `kavachpest.com`, verify, submit
   `https://kavachpest.com/sitemap.xml`, then *Request indexing* on the homepage.
2. **Google Business Profile** — the biggest lever for "pest control Kathmandu". There
   is no office, so set it up as a **service-area business** (hide the address, list
   Kathmandu, Lalitpur and Bhaktapur). Category: *Pest Control Service*. Name and phone
   must match the site exactly.
3. **Real reviews** on that profile. Request honest reviews consistently after
   completed service, without incentives or screening for positive feedback.

The owner confirmed on 12 October 2026 that no GA4 ID, verified profile link,
real client photos/records or technician credentials were available for this
implementation. Account setup, verification and genuine proof remain pending.

## Enquiry attribution and optional GA4

`assets/js/enquiries.js` keeps a sanitized entry-page path and broad source
category in session storage. The WhatsApp quote includes that source clue so
the owner can reconcile received enquiries manually. No private name/address/
notes or full referrer/query URLs are stored in the attribution record.
Source is a clue, not guaranteed campaign attribution; unknown stays unknown.

`assets/js/analytics-config.js` has an empty `measurementId`, so **GA4 is off**.
No ID was invented and no Google Analytics request is sent by this integration
in its default configuration. Once the owner has a real GA4 property:

1. Set its `G-...` ID in that file.
2. Disable GA4 Enhanced Measurement form interactions and outbound-link tracking
   to avoid collecting WhatsApp message URLs or private form values.
3. Verify consent and sanitized payloads in DebugView before relying on reports.

With a valid configured ID, optional analytics loads only after opt-in and
respects Do Not Track / Global Privacy Control. Events are `phone_click`,
`whatsapp_click`, `quote_handoff` plus an explicit sanitized page view. Their
dimensions use enumerated sector/city/request buckets. These events are contact
action proxies, not received enquiries, qualified leads or contracts.
Cloudflare's existing hosting analytics is separate from this GA4 integration.

Future GBP website link: `https://kavachpest.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
This exact tag is recognized as profile traffic. No profile link was changed.
Maintain a private lead log by sector, city, qualification, quote and contract
outcome; deduplicate repeat contact actions and record attribution uncertainty.

The quote form now collects explicit city and request type and supports optional
pest prefill. Both language forms use the same internal values. No-JavaScript
visitors receive a direct WhatsApp path; no form field aggregation is claimed
without JS. Do not interpret `/thank-you` as a backend confirmation.

## Testimonials

The homepage has no testimonial section. It previously held clearly-badged placeholders;
those are gone, and an FAQ section answers practical programme and pricing
questions. It does not produce Google FAQ rich results.

`_snippets/testimonials.html` has the carousel ready to paste back above the CTA section
whenever you have real quotes; the CSS and carousel JS are still in place. Use it only
with words a client actually said and agreed to publish. Never invent clients,
outcomes, credentials, ratings or permissioned photographs.

## Deploy (Cloudflare Workers static assets)

The live site is a Cloudflare **Worker with static assets**, connected to this repo. Every
push to `main` redeploys.

- `wrangler.jsonc` — Worker name `kavach-site`, assets served from the repo root,
  `not_found_handling: "404-page"` so unknown URLs get `404.html` with a 404 status.
- `.assetsignore` — keeps `.git`, `.claude`, `_snippets`, `tools`, `*.md` and `*.py` off the
  public site. Anything new that should stay private goes in here.
- `_headers` — 30-day cache on `/assets/img/*`. Replace an image under a **new filename**,
  or visitors keep the old one for up to a month.
  Hash-named WOFF2 font files have a one-year immutable cache.

Dashboard-only settings (not in the repo): **SSL/TLS → Edge Certificates → Always Use
HTTPS** on; a proxied `www` record with a redirect rule `www.kavachpest.com/*` →
`https://kavachpest.com/$1` (301). Inspect verified search-crawler access in
Cloudflare/GSC before changing bot rules. Search access and model-training
preferences are separate; do not broadly disable protection to chase AI citations.

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
4. **Licence/credential evidence** — owner confirmation and actual documents are
   required before any credential or compliance claim is added.
5. **Days of operation** — add `openingHoursSpecification` once the days are confirmed.
6. **Real photos** with client permission, to replace the illustrations.
7. **Demand/performance evidence** — owner Search Console/lead data and live field
   CWV are still needed; local lab checks do not establish ranking or field results.

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
