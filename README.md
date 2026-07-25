# Kavach Pest Management — Website

Static multi-page site, "Field Report" design system. Plain HTML/CSS/JS — no framework, no build step, no backend. Built from `Kavach-Website-Plan.md`.

**Live phone number:** 981-8499308 (`+977 9818499308`) — wired into tap-to-call, WhatsApp and Viber deep links on every page.

## Run locally

```
python -m http.server 8737
```

Then open http://localhost:8737. Links are root-relative, so use a server — don't open the files directly.

## Structure

- One HTML file per page (13 pages + `thank-you.html`), `guides/` folder for articles
- `assets/css/main.css` — the entire design system (colour tokens, type scale, components)
- `assets/js/` — six vanilla modules: `nav.js` (menu + night indicator), `estimator.js`, `record.js` (tabs, visit log, station map, room grid), `kitchenmap.js`, `pests.js`, `reveal.js`
- `_snippets/header.html` + `_snippets/footer.html` — source of truth for the shared header/footer. To change navigation: edit the snippet, then use VS Code "Replace in Files" (Ctrl+Shift+H) to update all pages. Not linked from anywhere and disallowed in `robots.txt`.
- `assets/docs/kavach-sample-service-record.pdf` — downloadable sample record (replace with a properly designed PDF when you have one)

## Deploy to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorise GitHub and pick the `kavach-site` repo
3. Build settings — leave everything empty:
   - Framework preset: **None**
   - Build command: *(blank)*
   - Build output directory: `/`
4. **Save and Deploy.** You get a `*.pages.dev` URL in about a minute.
5. Once `kavach.com.np` is approved (free from Mercantile), add it under **Custom domains**.

Every `git push` to `main` redeploys automatically.

Note: Cloudflare Pages serves clean URLs — `/pricing.html` redirects to `/pricing`. That matches the canonical tags and `sitemap.xml`, which already use the extensionless form.

## ⚠ Still to replace before going live

1. ~~**Phone number**~~ — done (981-8499308)
2. **Registration + PAN** — `000000/082/083` and `000000000` in every footer and on `/about`
3. **Web3Forms key** — `YOUR-ACCESS-KEY` in `contact.html` (free key at web3forms.com). Also confirm the `redirect` URL once the domain is live.
4. **Senior technician block** on `about.html` — real name, photo, actual years of experience. This is the site's credibility anchor.
5. **Photos** — every `[ FIELD PHOTO ]` placeholder (`the-record.html` photo report, `about.html`). Shoot these during the five free Thamel treatments. Do not launch with placeholders.
6. **Fonts** — currently loaded from Google Fonts + Fontshare CDNs. For production, download the WOFF2 files into `assets/fonts/` and swap the `<link>` tags for `@font-face` rules with `font-display: swap` (plan §3.3).
7. **Address** — footer says "Chabahil, Kathmandu"; update to the real office.
8. **Email** — `grish@kavach.com.np` needs the Zoho Mail free-tier mailbox to exist.

## Launch gate (from the plan)

- [ ] Every photograph is one you took
- [x] Every price matches the business plan rate card
- [x] Estimator tested against all four premises types
- [ ] Forms deliver to your inbox — test 3×, including from mobile
- [ ] WhatsApp and Viber deep links tested on a real Android phone
- [ ] Lighthouse mobile performance 90+
- [ ] Technician's real name and photo on `/about`
- [ ] Registration number, PAN and phone correct in footer
- [ ] Someone who is not you has read the homepage and can state your differentiator back to you
