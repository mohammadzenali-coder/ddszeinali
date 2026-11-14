# AGENTS.md — Master Blueprint for AI Assistants

> **Read this file first, completely, before doing anything.**
> This is the single source of truth for any AI (or human) continuing work on this project.
> If anything here conflicts with your own habits or defaults, **this file wins**.
> Detailed file-by-file map: [`docs/CODEBASE.md`](docs/CODEBASE.md).

---

## 1. What this project is

- **Personal website of Dr. Mohammad Reza Zeinali** (دکتر محمد رضا زینلی), a cosmetic dentist.
- Live domain: **https://ddszeinali.ir** (GitHub Pages, custom domain via `public/CNAME`).
- Purpose: personal brand + portfolio + SEO for cosmetic dentistry services
  (composite veneers, smile design, smile aesthetics, whitening) + short essays ("thoughts").
- Audience: Persian-speaking patients in Iran.
- **Language of the website: Persian (Farsi), right-to-left.**
  **Language of conversation with the owner: whatever language they write to you in** (usually English).

## 2. How to work with the owner (rules of engagement)

1. **Obey the owner's instructions literally and completely.** If an instruction is ambiguous, ask one short, specific question instead of guessing on anything big.
2. **Small, focused changes.** Do not refactor, rename, reformat, or "modernize" code that wasn't part of the request.
3. **Never add dependencies, frameworks (React/Vue/Tailwind/etc.), trackers, analytics, or client-side JS** unless the owner explicitly asks.
4. **Never invent facts about the doctor** (university, years, phone, address, prices, results, patient stories). Use a clearly marked placeholder like `[نام دانشگاه، سال]` or a `// TODO` and tell the owner.
5. **Medical/ethical content:** no exaggerated claims, no guarantees, no "best dentist in Iran" type wording. Keep the existing disclaimer on portfolio pages. Before/after photos require written patient consent.
6. **Always verify with `npm run build`** after code changes. It must finish with `Complete!` and no errors.
7. **Report back briefly**: what you changed (file paths), how you verified it, and anything the owner must do or decide.
8. Do not delete or overwrite files you don't understand — ask first.

## 3. Tech stack

| Thing | Value |
|---|---|
| Framework | **Astro 5** (static output, `.astro` components, no UI framework) |
| Language | TypeScript (in frontmatter / `.ts`), plain CSS |
| Content | Markdown files in `src/content/*` via Astro Content Collections (Zod schemas) |
| Font | Vazirmatn (self-hosted via `@fontsource/vazirmatn`, weights 400/600/700/800) |
| Integrations | `@astrojs/sitemap`, `@astrojs/rss` |
| Hosting | GitHub Pages, deployed by `.github/workflows/deploy.yml` on push to `main` |
| Node | Node 20+ (developed on Node 24, npm 11) |

## 4. Commands

```bash
npm install        # first time only
npm run dev        # local dev server → http://localhost:4321
npm run build      # production build → dist/   (ALWAYS run to verify)
npm run preview    # serve dist/ locally
npm run og         # regenerate public/og.png (social share image) from scripts/og.mjs
```

Deploy = commit and push to the `main` branch of the GitHub repo; GitHub Actions builds and publishes. No manual upload.

## 5. Folder map (short version)

```
src/
  site.ts               ← GLOBAL SETTINGS: name, email, socials, phone, clinic, SERVICES list, NAV menu, Persian number/date helpers
  content.config.ts     ← schemas (required frontmatter fields) for the 3 content collections
  content/
    services/*.md       ← one file per service page  → /services/<filename>/
    portfolio/*.md      ← one file per case study    → /portfolio/<filename>/
    thoughts/*.md       ← one file per essay/blog    → /thoughts/<filename>/  (+ RSS)
  layouts/Base.astro    ← <html dir="rtl">, <head>, SEO meta, Open Graph, JSON-LD schema, header/footer
  components/           ← Header, Footer, PageHead (page hero), Art (placeholder Bauhaus SVG art)
  pages/                ← routes (file = URL)
  styles/global.css     ← design tokens + shared classes
drafts/thoughts/        ← UNPUBLISHED essay drafts (Astro ignores this folder; move a file into src/content/thoughts/ to publish)
templates/              ← NOT published: Bauhaus image frames (post/story/cover × 4 variations, SVG+PNG). Regenerate: node templates/build.mjs (see templates/README.md)
public/                 ← static files copied as-is (CNAME, favicon.svg, og.png, robots.txt)
scripts/og.mjs          ← generates public/og.png
.github/workflows/      ← deploy pipeline
```

## 6. Design system — "Bauhaus" (DO NOT DRIFT)

The visual identity is strict Bauhaus: flat primary colors, thick black borders, geometric shapes, no decoration.

- **Colors (only these):** `--bg #F7F4EE`, `--surface #FFFFFF`, `--text #111111`, `--text-2 #4B5563`, `--border #111111`, `--red #CC3333`, `--yellow #F4C430`, `--blue #1C39BB`.
- **Shapes = brand language:** red **square** `.sq`, yellow **circle** `.ci`, blue **triangle** `.tr`. Size via `style="--s:20px"`.
- **No rounded corners** (global `border-radius: 0`) — except true circles.
- **No shadows, no gradients for decoration, no animations** (except smooth scroll when motion is allowed).
- Borders: `--b1/--b2/--b3` (1/2/3px), always solid black.
- Spacing tokens: `--xs 8px`, `--sm 16px`, `--md 24px`, `--lg 48px`. Max width `--max 1200px`.
- Type classes: `.h-xl`, `.h-lg`, `.h-sm`, `.label`, `.muted`. Long text goes in `.prose`.
- Layout helpers: `.wrap` (centered container), `.section` (vertical block with bottom border), `.sec-head`, `.grid .g-2 .g-3`, `.card`, `.btn`, `.btn--ghost`, `.tag`.
- Component-specific styles go in a scoped `<style>` block at the bottom of the `.astro` file.
- Motto used across the site: **"Form Follows Function" — فرم از عملکرد پیروی می‌کند.**

## 7. RTL & Persian rules (critical)

- `<html lang="fa-IR" dir="rtl">` is set in `Base.astro`. Never remove.
- **Use logical CSS properties**: `margin-inline`, `padding-inline-start`, `inset-inline-end`, `border-inline-start`… **never** `left`/`right`/`margin-left` etc.
- Arrows are mirrored: "forward/next" = `←`, "back" = `→`.
- Persian digits in visible text: use `faNum()` for numbers and `faDate()` for dates (both in `src/site.ts`). In Markdown prose, type Persian digits directly (۱۲۳).
- English words inside Persian text: wrap in `<span class="en">…</span>` (isolates LTR direction).
- Use the Persian zero-width non-joiner (نیم‌فاصله, U+200C) correctly: `نمونه‌کارها`, `یادداشت‌ها`, `می‌شود`.
- Persian comma is `،`. Dates in frontmatter are **Gregorian ISO** (`2026-11-01`); they display as Persian (Solar Hijri) automatically.

## 8. Common tasks — exact recipes

### Add a new essay (thought)
Create `src/content/thoughts/<english-slug>.md`:
```md
---
title: عنوان یادداشت
description: یک جمله‌ی خلاصه (برای گوگل و شبکه‌های اجتماعی، حدود ۱۵۰ کاراکتر)
date: 2026-11-14
tags: [زیبایی‌شناسی, کامپوزیت]
art: 3                         # optional, 0–4: Bauhaus picture under the title
---

متن مقدمه...

## زیرعنوان

متن...

> نقل‌قول برجسته (زرد نمایش داده می‌شود)
```
It automatically appears on `/thoughts/`, the homepage (latest 3), and `/rss.xml`.

**Drafts:** if the owner says "don't publish" or "drafts", write to `drafts/thoughts/<slug>.md` instead (same format, plus `draft: true`). To publish later, move the file into `src/content/thoughts/` and run `npm run build`. Preview drafts at http://localhost:4321/drafts/ while `npm run dev` runs (dev-only route `src/pages/drafts/[...slug].astro`, `drafts` collection in `content.config.ts`; nothing is built in production). If a `title`/`description` contains `: `, wrap it in double quotes or YAML breaks.

### Writing rules for all visitor text (anti-slop)
All Persian copy follows the copywriting rules of [antislop](https://github.com/miqdadbadjuber/anti-slop) (`skills/antislop-copywriting/SKILL.md`):
- No em/en dashes (— –); use ، . : or parentheses. Page ranges in citations use a hyphen (8-15).
- No buzzwords or hype (معجزه، انقلابی، راز، فوق‌العاده)، no «در دنیای امروز…» openers, no «بیایید ببینیم» signposting, no «راستش؟» / «نکته اینجاست:» / «خبر خوب این است» theatrics.
- No formula phrasing: «نه فقط X، بلکه Y»، aphorisms like «لبخند زبان اعتماد است»، forced lists of three, runs of short dramatic fragments, generic upbeat endings.
- No bold-label lists (`- **عنوان:** متن`), no bold everywhere, no scare quotes, no emoji.
- Citations must be real and verifiable (check the DOI). Never invent studies, numbers or quotes.
- Tone: warm, plain, very little jargon (explain any technical word once).

### Add a new portfolio case
Create `src/content/portfolio/<english-slug>.md`:
```md
---
title: عنوان پرونده
description: خلاصه‌ی یک‌خطی
date: 2026-11-14
service: کامپوزیت ونیر        # Persian service name, shown as a tag
sessions: دو جلسه              # optional
art: 2                         # 0–4, picks a placeholder Bauhaus image
---

## مسئله
## طرح درمان
## نتیجه
```

### Add a new service
1. Create `src/content/services/<slug>.md` with: `title`, `en`, `seoTitle`, `description`, `order` (number), `art`, optional `faqs` (list of `q`/`a`). FAQs automatically produce FAQ rich-result schema.
2. **Also add it to `SERVICES` in `src/site.ts`** (same `slug`) — this list drives the homepage strip and footer. The two must stay in sync.
3. If the new `order` is > 4, extend the `colors` array in `src/pages/services/[slug].astro` and `shapes` in `src/pages/aesthetics.astro`.

### Change contact info / social links / clinic address
Edit only `src/site.ts` → `SITE`. When `clinic` is filled in (`{ city, street, lat, lng, hours }`), the contact page and the Dentist JSON-LD schema update automatically. When `phone` is set, a phone card appears on the contact page.

### Add a page to the menu
Create `src/pages/<name>.astro` using `<Base title=… description=… breadcrumbs=…>` and `<PageHead …/>`, then add `{ href: '/<name>/', label: '…' }` to `NAV` in `src/site.ts`.

### Replace placeholder art with real photos
Currently `Art.astro` draws abstract SVGs in place of photos. To use real images: put them in `src/assets/`, use Astro's `<Image>` from `astro:assets`, keep the 4:3 ratio and the `2px` black border, and always write Persian `alt` text. Ask the owner before changing the schema.

### Change the social share image
Edit the SVG in `scripts/og.mjs`, then run `npm run og`. (Uses `sharp`, which comes installed with Astro.)

## 9. SEO conventions (already built — keep them working)

- Every page passes `title` and a unique Persian `description` to `<Base>`. Title format becomes `"<title> | دکتر محمد رضا زینلی"`.
- Non-home pages pass `breadcrumbs` → BreadcrumbList schema.
- Base outputs JSON-LD `@graph`: `Person` (`#person`), `Dentist` (`#dentist`), `WebSite` (`#website`) + page-specific items (`MedicalProcedure`, `FAQPage`, `BlogPosting`, `CreativeWork`).
- Canonical URLs, Open Graph, Twitter card, sitemap (`/sitemap-index.xml`), RSS (`/rss.xml`), `robots.txt` are all automatic.
- URLs use trailing slashes and English slugs (`/services/composite-veneers/`). Don't rename existing slugs (breaks SEO links).

## 10. Open TODOs (need info from the owner — do NOT make up)

- [ ] `src/site.ts`: exact Instagram URL (currently guessed `instagram.com/ddszeinali`), Telegram, phone number.
- [ ] `src/site.ts`: clinic address, coordinates, working hours (`clinic` is `null`).
- [ ] `src/pages/about.astro`: real university/year and course names (placeholders in `[...]`), real portrait photo.
- [ ] Real before/after photos for portfolio cases (currently geometric placeholders via `Art.astro`).
- [ ] 50 essay drafts in `drafts/thoughts/` await the owner's review before publishing. Unconfirmed citations: Tarantili et al. 2005 (`smile-and-face-shape.md`), Newton et al. 2003 (`teeth-as-health-signal.md`, `surveys-teeth-partner-choice.md`), WHO 2015 sugar guideline URL (`diet-and-smile.md`). Check study figures against the abstracts.
- [x] Git connected: `origin` = https://github.com/mohammadzenali-coder/ddszeinali (public, branch `main`). `drafts/` is in `.gitignore` on purpose (unpublished drafts stay local). Owner must still set **Settings → Pages → Source: GitHub Actions** and the DNS records for ddszeinali.ir if not done.

## 11. Don'ts (summary)

- ❌ No left/right CSS, no LTR layout, no English UI text for visitors.
- ❌ No new colors, rounded corners, shadows, gradients, icon libraries, or web fonts other than Vazirmatn.
- ❌ No new npm packages / frameworks / CMS / analytics without explicit permission.
- ❌ No invented medical claims, credentials, prices, or reviews.
- ❌ Don't edit `dist/`, `.astro/`, or `node_modules/` (generated).
- ❌ Don't rename existing URLs/slugs.

## 12. Handoff checklist for a new AI

1. Read this file and `docs/CODEBASE.md`.
2. Run `npm install` then `npm run build` → expect "17 page(s) built … Complete!" (more if content was added).
3. Ask the owner what they want to do next; consult section 10 for pending items.
