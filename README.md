# Kavach Pest Management — Website

Static multi-page site. Plain HTML/CSS/JS — no framework, no build step, no backend.

**Live phone number:** 981-8499308 (`+977 9818499308`) — wired into tap-to-call, WhatsApp and Viber deep links on every page.

## Run locally

```
python -m http.server 8737
```

Then open http://localhost:8737. Links are root-relative, so use a server — don't open the files directly.

## Design system

Deep indigo on cool paper, hairline-bordered grids, bracketed monospace section labels.

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
| `--brand-dark` | `#072077` | hover |
| `--amber` | `#D37300` | emergency, callback, activity status |

**Type.** Inter Tight (display, 800, `-0.045em`, `0.92` line-height) · Inter (body) · JetBrains Mono (labels, prices, dates, batch numbers) · Noto Sans Devanagari (Nepali).

**Radii.** 2px on buttons and inputs, 6px on cards and panels. Nothing rounder.

**Key patterns:**
- `.hero-split` — 50/50 hero, copy left with a hairline divider, visual right
- `.cells .cells--N` — the signature grid: hairline-bordered cells, no gaps, no floating cards
- `.band--white` / `.band--blue` / `.challenge-band` — full-bleed section bands that alternate down the page
- `.section-head` with `<span class="idx">[SEC-01] Name</span>` — bracketed mono eyebrow over a display headline
- `.link-arrow` — uppercase bold text link with an animated arrow
- `.stat-strip` — 4-up monospace figures
- `.doc-art` — inline SVG document renderings (logbook page, certificate) with a mono caption

## Structure

- One HTML file per page (13 pages + `thank-you.html`), `guides/` folder for articles
- `assets/css/main.css` — the whole design system in one file
- `assets/js/` — six vanilla modules: `nav.js` (menu + night indicator), `estimator.js`, `record.js` (tabs, visit log, station map, room grid), `kitchenmap.js`, `pests.js`, `reveal.js`
- `_snippets/header.html` + `_snippets/footer.html` — source of truth for shared chrome. Edit there, then use VS Code "Replace in Files" (Ctrl+Shift+H) across all pages. Not linked anywhere and disallowed in `robots.txt`.
- `assets/docs/kavach-sample-service-record.pdf` — downloadable sample record, regenerate with `assets/docs/make-sample-pdf.py`

## Deploy to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorise GitHub and pick the `kavach-site` repo
3. Build settings — leave everything empty:
   - Framework preset: **None**
   - Build command: *(blank)*
   - Build output directory: `/`
4. **Save and Deploy.** A `*.pages.dev` URL appears in about a minute.
5. Once `kavach.com.np` is approved (free from Mercantile), add it under **Custom domains**.

Every `git push` to `main` redeploys automatically.

Note: Cloudflare Pages serves clean URLs — `/pricing.html` redirects to `/pricing`. That matches the canonical tags and `sitemap.xml`, which already use the extensionless form.

## ⚠ Still to replace before going live

1. ~~**Phone number**~~ — done (981-8499308)
2. **Registration + PAN** — `000000/082/083` and `000000000` in every footer and on `/about`
3. **Web3Forms key** — `YOUR-ACCESS-KEY` in `contact.html` (free key at web3forms.com). Until this is set the booking form delivers nowhere. Also confirm the `redirect` URL once the domain is live.
4. **Senior technician block** on `about.html` — real name, photo, actual years of experience. This is the site's credibility anchor.
5. **Field photography** — the `.photo-slot` blocks (`the-record.html` photo report, `about.html`) are hatched placeholders. Shoot these during the five free Thamel treatments. The SVG document art (`.doc-art`) is permanent and needs no replacing.
6. **Fonts** — loaded from Google Fonts. For production, self-host the WOFF2 files in `assets/fonts/` and swap the `<link>` for `@font-face` with `font-display: swap`.
7. **Address** — footer says "Chabahil, Kathmandu 44600"; confirm the real office.
8. **Email** — `grish@kavach.com.np` needs the Zoho Mail free-tier mailbox to exist.

## Launch gate

- [ ] Every photograph is one you took
- [x] Every price matches the business plan rate card
- [x] Estimator tested against all four premises types
- [x] No horizontal overflow at 375px; tap targets above 44px
- [ ] Forms deliver to your inbox — test 3×, including from mobile
- [ ] WhatsApp and Viber deep links tested on a real Android phone
- [ ] Lighthouse mobile performance 90+
- [ ] Technician's real name and photo on `/about`
- [ ] Registration number, PAN and phone correct in footer
- [ ] Someone who is not you has read the homepage and can state your differentiator back to you
