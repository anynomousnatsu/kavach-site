# Kavach Pest Management — Website

Static 5-page site. Plain HTML/CSS/JS — no framework, no build step, no backend.

**Phone:** 981-8499308 (`+977 9818499308`) — tap-to-call, WhatsApp and Viber on every page.

## Pages

| File | URL | Content |
|---|---|---|
| `index.html` | `/` | Hero, fixed-price bar, work grid, stat rows, four pricing plans, feature banner, testimonials, CTA |
| `services.html` | `/services` | `[MOD-01]` four Shield programmes with full spec lists · ten one-off treatments |
| `pricing.html` | `/pricing` | `[MOD-03]` Kitchen Shield tier table, other programme rates, the guarantee |
| `about.html` | `/about` | `[MOD-04]` why we exist, four operating rules, what we don't do |
| `contact.html` | `/contact` | `[MOD-05]` quotation request form + direct contact |
| `thank-you.html` | — | Form redirect target (noindex) |
| `404.html` | — | Not-found page (noindex) |

## Run locally

```bash
python -m http.server 8737
```

Open <http://localhost:8737>. Links are root-relative, so use a server — don't open the
files directly.

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

`proof-logbook` and `proof-certificate` ship at 400×400 — they render into a 150px slot,
so the original 800×800 was carrying four times the pixels it could ever show.

The original hand-drawn SVG illustrations are still in `assets/img/` if you would rather
use line art than photography — point the `<img src>` at those instead.

Icons are inline SVG on a shared spec: `fill="none" stroke="currentColor"
stroke-width="1.7"`, round caps and joins, 24×24 viewBox. They inherit `currentColor`,
so they recolour automatically inside lime and black panels.

## Deploy to Cloudflare Pages

1. Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick the `kavach-site` repo
3. Framework preset **None**, build command **blank**, output directory `/`
4. **Save and Deploy** → a `*.pages.dev` URL in about a minute
5. Add `kavach.com.np` under **Custom domains** once the `.com.np` registration is approved

Every push to `main` redeploys. Cloudflare serves clean URLs, so `/pricing.html`
redirects to `/pricing` — matching the canonical tags and `sitemap.xml`.

## ⚠ Before going live

1. ~~**Phone number**~~ — done (981-8499308)
2. ~~**The ten photographs**~~ — done, WebP generated, `<picture>` wired up.
3. **Testimonials** — `index.html` ships four clearly-marked placeholder quote cards
   with a visible "Placeholder" badge. **Replace them with real, permissioned client
   quotes or delete the section.** Do not publish invented testimonials.
4. **Web3Forms key** — `YOUR-ACCESS-KEY` in `contact.html`. **Until this is set the form
   delivers nowhere.** Free key at web3forms.com. Confirm the `redirect` URL after the
   domain is live.
5. **Address** — footer and contact page say "Chabahil, Ward 7, Kathmandu 44600".
   Confirm the real office.
6. **Email** — `operations@kavach.com.np` needs a real mailbox (Zoho Mail free tier).
7. **Registration + PAN** — not currently shown anywhere. Add to the footer once the
   Pvt. Ltd. certificate lands; it is a genuine trust signal for a Nepali B2B buyer.
8. **Fonts** — loaded from Google Fonts. For production, self-host WOFF2 in
   `assets/fonts/` with `font-display: swap`.
9. **The two circular "document" buttons** (hero and feature banner) open the sample
   service-record PDF. If you ever shoot a night-service video, swap the glyph for a
   play triangle and point them at the video instead.

## Launch gate

- [x] Every price matches the business plan rate card
- [x] No horizontal overflow at 375 / 768 / 1440px; tap targets above 44px
- [x] Every image has descriptive alt text; missing files degrade to labelled tiles
- [x] Ten photographs in place, all at exact aspect ratio (zero crop)
- [x] Photographs optimised — WebP via `<picture>`, 35% lighter, oversized pair downsized
- [ ] Placeholder testimonials replaced with real quotes — or the section removed
- [ ] Form delivers to your inbox — test 3×, including from mobile
- [ ] WhatsApp and Viber deep links tested on a real Android phone
- [ ] Lighthouse mobile performance 90+
- [ ] Someone who is not you has read the homepage and can state your differentiator back to you
