# CODEBASE.md — File-by-File Map

Companion to [`../AGENTS.md`](../AGENTS.md) (read that first for rules).
This document explains **what every file does, how data flows, and what depends on what**,
so an AI or developer can make changes without reading everything.

Snapshot: Astro 5.18, 17 generated pages, zero client-side frameworks.

---

## 1. Data flow at a glance

```
src/site.ts ───────────────┐  (SITE info, SERVICES, NAV, faNum, faDate)
                           ▼
src/content/*/*.md ──► content.config.ts (Zod validation) ──► getCollection()/render()
                                                                    │
                                                                    ▼
                                    src/pages/**  ──uses──►  layouts/Base.astro
                                         │                    ├─ components/Header.astro
                                         │                    ├─ components/Footer.astro
                                         ├─ components/PageHead.astro
                                         └─ components/Art.astro
                                                                    │
                                                    npm run build   ▼
                                                     dist/ (static HTML, sitemap, rss.xml)
                                                                    │
                                     push to main → GitHub Actions → GitHub Pages → ddszeinali.ir
```

## 2. Generated routes (17 pages)

| URL | Source file | Data |
|---|---|---|
| `/` | `src/pages/index.astro` | latest 3 portfolio + latest 3 thoughts, `SERVICES` |
| `/about/` | `src/pages/about.astro` | hard-coded text + `principles` array |
| `/aesthetics/` | `src/pages/aesthetics.astro` | all services sorted by `order` |
| `/contact/` | `src/pages/contact.astro` | `SITE.email/instagram/phone/clinic` |
| `/portfolio/` | `src/pages/portfolio/index.astro` | all portfolio, newest first |
| `/portfolio/<slug>/` ×3 | `src/pages/portfolio/[slug].astro` | one portfolio entry |
| `/services/<slug>/` ×4 | `src/pages/services/[slug].astro` | one service entry + others |
| `/thoughts/` | `src/pages/thoughts/index.astro` | all thoughts, newest first |
| `/thoughts/<slug>/` ×3 | `src/pages/thoughts/[slug].astro` | one thought entry |
| `/404.html` | `src/pages/404.astro` | — |
| `/rss.xml` | `src/pages/rss.xml.ts` | all thoughts |
| `/sitemap-index.xml` | `@astrojs/sitemap` (auto) | all pages |

`<slug>` = the Markdown filename without `.md` (Astro's `entry.id`).

## 3. Root files

| File | Purpose |
|---|---|
| `package.json` | Scripts `dev`, `build`, `preview`, `og`. Deps: `astro`, `@astrojs/rss`, `@astrojs/sitemap`, `@fontsource/vazirmatn`. ESM (`"type": "module"`). |
| `package-lock.json` | Locked dependency tree. Commit it. |
| `astro.config.mjs` | `site: 'https://ddszeinali.ir'`, `trailingSlash: 'ignore'`, `build.format: 'directory'` (→ `/about/index.html`), `inlineStylesheets: 'always'` (CSS inlined in HTML for speed), sitemap integration. |
| `.gitignore` | Ignores `node_modules/`, `dist/`, `.astro/`. |
| `AGENTS.md` | Master blueprint / rules for AI assistants. |
| `CLAUDE.md`, `GEMINI.md` | Pointers to `AGENTS.md` for tools that look for those names. |
| `README.md` | Human quick start + copy-paste handoff prompt. |

## 4. `src/site.ts` — global settings (most-edited file)

- `SITE` — `url`, `name` ("دکتر محمد رضا زینلی"), `nameAlt`, default `title`, default `description`, `email` (`info@ddszeinali.ir`), `instagram`, `telegram` (empty), `phone` (empty), `clinic` (`null` or `{ city, street, lat, lng, hours }`).
  - Used by: `Base.astro` (meta + JSON-LD), `Footer`, `contact.astro`, `index.astro`, `rss.xml.ts`, detail pages.
  - Empty strings / `null` are handled: missing phone hides the phone card and `telephone` schema; `null` clinic shows "به‌زودی اعلام می‌شود".
- `SERVICES` — `{ slug, title, en, color }` ×4. `slug` **must match** a file in `src/content/services/`. `color` (`red|blue|yellow`) maps to a shape on the homepage strip (`red→sq`, `blue→tr`, `yellow→ci`). Used by `index.astro` and `Footer.astro`.
- `NAV` — main menu `{ href, label }`. Used by `Header.astro` (with `aria-current` highlight) and `Footer.astro`.
- `faNum(n)` — converts Latin digits to Persian digits.
- `faDate(d)` — formats a `Date` as a Persian (Solar Hijri) long date via `Intl` `fa-IR`.

## 5. `src/content.config.ts` — content schemas

Three collections, each loading `**/*.md` from its folder with the `glob` loader:

| Collection | Required fields | Optional / defaults |
|---|---|---|
| `portfolio` | `title`, `description`, `date`, `service` | `sessions?`, `art = 0` |
| `thoughts` | `title`, `description`, `date` | `tags = []`, `art?` (0–4; if set, an `Art` picture shows under the article header) |
| `services` | `title`, `en`, `seoTitle`, `description`, `order` | `art = 0`, `faqs = []` (`{q, a}`) |

`date` uses `z.coerce.date()` → write `YYYY-MM-DD`. A missing required field **fails the build** with a clear error — that's the safety net.

## 6. `src/content/` — current content

- `services/`: `composite-veneers.md` (order 1), `smile-design.md` (2), `smile-aesthetics.md` (3), `whitening.md` (4). Each has intro sections + FAQs.
- `portfolio/`: `diastema-closure.md`, `full-smile-design.md`, `natural-whitening.md`. Structure: مسئله / طرح درمان / نتیجه.
- `thoughts/`: `luxury-is-invisible.md`, `form-follows-function.md`, `composite-or-porcelain.md`.
- **Unpublished drafts:** `drafts/thoughts/*.md` (50 essays on smile beauty, smile harmony, attraction, oral hygiene and dating, each with a «منابع» citation list, `art`, and `draft: true`). Astro does not read this folder. To publish, move a file into `src/content/thoughts/`. `draft: true` is not in the schema; Zod drops it, so it does no harm. See `drafts/thoughts/README.md`. They are loaded as the `drafts` collection (README excluded) and previewed at `/drafts/` by `src/pages/drafts/[...slug].astro`, which returns no paths when `import.meta.env.PROD`, so the live site never contains them.

All sample texts are written in the doctor's first-person voice ("من…"). Keep that voice.

## 7. `src/layouts/Base.astro` — page shell

Props: `title?`, `description?` (default `SITE.description`), `image?` (default `/og.png`), `type?` (`website|article`), `schema?` (extra JSON-LD objects), `breadcrumbs?` (`{name,url}[]`, "خانه" is prepended automatically), `published?` (Date).

Does:
- Imports Vazirmatn weights 400/600/700/800 and `global.css`.
- Builds `<title>` as `"<title> | SITE.name"` or `SITE.title` for home.
- Canonical URL, description, author, theme-color, favicon, sitemap link, RSS alternate link.
- Open Graph (`fa_IR`, 1200×630 image), `article:published_time`, Twitter `summary_large_image`.
- JSON-LD `@graph`: `Person#person`, `Dentist#dentist` (+ telephone/address/geo when set in `SITE`), `WebSite#website`, page `schema` items, optional `BreadcrumbList`.
- Body: skip link → `<Header/>` → `<main id="main"><slot/></main>` → `<Footer/>`.

## 8. `src/components/`

| Component | Props | Notes |
|---|---|---|
| `Header.astro` | — | Sticky header; logo = 3 Bauhaus shapes + "دکتر زینلی". Menu is a `<details>` element: collapsible on mobile, forced open on desktop (≥860px) by a tiny inline script. Active link gets yellow background via `aria-current`. |
| `Footer.astro` | — | 3 columns: name+tagline, services (from `SERVICES`), links (from `NAV` + RSS). Black bottom bar with Persian year via `faNum`. |
| `PageHead.astro` | `kicker`, `title`, `lead?`, `color?` (`red` square / `yellow` circle / `blue` triangle) + `<slot/>` | Hero block at the top of inner pages; contains the page `<h1>`. |
| `Art.astro` | `v?` (number, wraps mod 5), `label?` (aria-label) | 5 hand-made Bauhaus SVG compositions used as **placeholder images** (4:3, 2px border) until real photos exist. Portfolio detail shows `art` as "before" and `art+1` as "after". |

## 9. `src/pages/` — page details

- **`index.astro`** — Hero (big name, motto, 2 CTA buttons, CSS-only Bauhaus composition) → black services strip → 01 About teaser → 02 Portfolio (3 cards) → 03 Thoughts (3 items) → red CTA block with email.
- **`about.astro`** — Portrait placeholder box, story, education list (**placeholders in `[...]`**), "three principles" cards.
- **`aesthetics.astro`** — Philosophy essay on "luxury" in smiles + 4-step treatment path + grid of all services. Acts as the services hub (breadcrumb parent of service pages).
- **`contact.astro`** — Channel cards (email, Instagram, phone if set) + blue clinic-address card.
- **`services/[slug].astro`** — `getStaticPaths` over `services`. PageHead color from `order` (`['red','blue','yellow','red']`). Markdown body + sticky sidebar (Art + consultation card). FAQ accordion (`<details>`). "Other services" grid. Schema: `MedicalProcedure` + `FAQPage`.
- **`portfolio/[slug].astro`** — Before/after pair, meta strip (service, sessions, date), Markdown body, consent/disclaimer note. Schema: `CreativeWork`.
- **`thoughts/[slug].astro`** - Yellow article header (breadcrumb, date, title, lead, author), optional `Art` picture (when `art` is set, max 720px), prose body, closing CTA. Schema: `BlogPosting`.
- **`portfolio/index.astro`, `thoughts/index.astro`** — Listing pages sorted newest first.
- **`404.astro`** — Big red ۴۰۴ + back-home button.
- **`rss.xml.ts`** — RSS feed of thoughts using `@astrojs/rss`, `language fa-IR`.

## 10. `src/styles/global.css`

Sections in order: design tokens (`:root`) → reset (`border-radius: 0` everywhere) → base typography (16px / 1.8, Vazirmatn) → heading classes → layout (`.wrap`, `.section`, `.sec-head`) → components (`.btn`, `.card`, `.grid`, `.tag`) → shapes (`.sq`, `.ci`, `.tr`, sized with `--s`) → `.prose` (article typography: red side bar on `h2`, yellow `blockquote`) → skip link → smooth scroll.

Breakpoints used across the project: **720px** (grids), **860px** (desktop menu), **900px** (two-column layouts, bigger section padding).

## 11. `public/`

| File | Purpose |
|---|---|
| `CNAME` | `ddszeinali.ir` — custom domain for GitHub Pages. Don't delete. |
| `favicon.svg` | Bauhaus favicon. |
| `og.png` | 1200×630 social share image (generated by `npm run og`). |
| `robots.txt` | Allow all + sitemap URL. |

## 12. `scripts/og.mjs`

Renders an inline SVG (blue panel, yellow circle, red block, name + "دندانپزشکی زیبایی" + domain) to `public/og.png` with `sharp`. `sharp` isn't listed in `package.json`; it's available because Astro installs it. If it's ever missing: `npm i -D sharp`.

## 13. `.github/workflows/deploy.yml`

On push to `main` (or manual run): `actions/checkout@v4` → `withastro/action@v3` (installs deps, builds, uploads `dist/`) → `actions/deploy-pages@v4`. Requires GitHub repo **Settings → Pages → Source: GitHub Actions**.

## 14. Generated / ignore

`dist/` (build output), `.astro/` (Astro type cache), `node_modules/` — never edit by hand; safe to delete and regenerate.

## 15. Known quirks & gotchas

- `SERVICES` (site.ts) and `src/content/services/` are two sources for the same list — keep in sync.
- Service color/shape arrays only cover `order` 1–4.
- `Art` index `v` wraps modulo 5, so values above 4 repeat.
- Contact page shows the Instagram handle as the hard-coded text `@ddszeinali`; update it if the URL changes.
- The desktop menu relies on a tiny inline script; without JS, desktop users see the "منو" toggle (still works).
- Local folder is not a git repo yet.
