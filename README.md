# Kavach Pest Management — Website

Static 5-page site. Plain HTML/CSS/JS — no framework, no build step, no backend.

**Phone:** 981-8499308 (`+977 9818499308`) — tap-to-call, WhatsApp and Viber on every page.

## Pages

| File | URL | Content |
|---|---|---|
| `index.html` | `/` | Hero, five market gaps, four programmes, three evidence artefacts, CTA |
| `services.html` | `/services` | `[MOD-01]` four Shield programmes with full spec lists · `[MOD-02]` ten one-off treatments |
| `pricing.html` | `/pricing` | `[MOD-03]` Kitchen Shield tier table, other programme rates, the guarantee |
| `about.html` | `/about` | `[MOD-04]` why we exist, four operating rules, what we don't do |
| `contact.html` | `/contact` | `[MOD-05]` quotation request form + direct contact |
| `thank-you.html` | — | Form redirect target (noindex) |
| `404.html` | — | Not-found page (noindex) |

## Run locally

```
python -m http.server 8737
```

Open http://localhost:8737. Links are root-relative, so use a server — don't open files directly.

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F7FAFD` | page background |
| `--card` | `#FFFFFF` | alternating bands, cards |
| `--surface` | `#F2F5F8` | recessed panels, table headers |
| `--fg` | `#091123` | headings |
| `--fg-2` | `#2A3446` | body text |
| `--muted-fg` | `#586475` | captions, meta |
| `--border` | `#DDE2E8` | every hairline |
| `--brand` | `#173796` | primary — buttons, links, blue bands |
| `--amber` | `#D37300` | emergency, activity status |

**Type.** Inter Tight (display, 800, `-0.045em`, `0.92` line-height) · Inter (body) · JetBrains Mono (labels, prices, codes) · Noto Sans Devanagari (Nepali).

**Radii.** 2px controls, 6px cards.

**Patterns:** `.hero-split` (50/50 hero) · `.cells--N` (hairline cell grids) · `.band--white` / `.band--blue` · `.section-head .idx` holding `[SEC-01]` / `[MOD-01]` eyebrows · `.prog-block` (programme + spec list + illustration) · `.rate-rows` · `.spec-list` · `.guarantee` · `.info-grid` · `.how-list` · `.icon-badge`.

## Images

All artwork is hand-built SVG in `assets/img/` — no raster files, no external requests, a few KB each. They stay sharp at any size and cost almost nothing on a Nepali mobile connection.

| File | Shows |
|---|---|
| `hero-kit.svg` | Open logbook with dated entries and batch numbers, respirator, gloves, torch, gel applicator |
| `svc-kitchen.svg` | Commercial kitchen at night, five numbered stations, range line, drain, dry store |
| `svc-room.svg` | Guest room with mattress seam, headboard joints, skirting marked; steam wand |
| `svc-store.svg` | Warehouse racking, pallets, tamper-proof stations, trend clipboard |
| `svc-home.svg` | Apartment cutaway — kitchen, bathroom drain, bedroom, balcony |

Icons are inline SVG (`.icon`, `.icon-badge`) drawn from a 16-glyph set: shield, flame, bed, box, house, clipboard, award, clock, droplet, bug, spray bottle, net, moon, file, pin, check. They inherit `currentColor`, so they recolour automatically on the blue bands.

**If you want photographs instead:** drop JPG/WebP files into `assets/img/` and swap the `<img src>` in the relevant `<figure class="svc-figure">`. Keep the `width`/`height` attributes to avoid layout shift, and keep the alt text descriptive.

## Deploy to Cloudflare Pages

1. Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick the `kavach-site` repo
3. Framework preset **None**, build command **blank**, output directory `/`
4. **Save and Deploy** → a `*.pages.dev` URL in about a minute
5. Add `kavach.com.np` under **Custom domains** once the `.com.np` registration is approved

Every push to `main` redeploys. Cloudflare serves clean URLs, so `/pricing.html` redirects to `/pricing` — matching the canonical tags and `sitemap.xml`.

## ⚠ Before going live

1. ~~**Phone number**~~ — done (981-8499308)
2. **Web3Forms key** — `YOUR-ACCESS-KEY` in `contact.html`. **Until this is set the form delivers nowhere.** Free key at web3forms.com. Confirm the `redirect` URL after the domain is live.
3. **Address** — footer and contact page say "Chabahil, Ward 7, Kathmandu 44600". Confirm the real office.
4. **Email** — `operations@kavach.com.np` needs a real mailbox (Zoho Mail free tier).
5. **Registration + PAN** — not currently shown anywhere. Add to the footer once the Pvt. Ltd. certificate lands, since it's a genuine trust signal for a Nepali B2B buyer.
6. **Fonts** — loaded from Google Fonts. For production, self-host WOFF2 in `assets/fonts/` with `font-display: swap`.

## Launch gate

- [x] Every price matches the business plan rate card
- [x] No horizontal overflow at 375px; tap targets above 44px
- [x] All illustrations load; every image has descriptive alt text
- [ ] Form delivers to your inbox — test 3×, including from mobile
- [ ] WhatsApp and Viber deep links tested on a real Android phone
- [ ] Lighthouse mobile performance 90+
- [ ] Someone who is not you has read the homepage and can state your differentiator back to you
