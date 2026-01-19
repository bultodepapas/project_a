# Codebase Documentation

**Last Updated:** January 19, 2026
**Project:** Angela Parra Portfolio
**Type:** Static Site (SSG)

## 1. Project Overview
A multi-lingual, cinematic portfolio built with **Astro 5** and **Tailwind CSS 4**. The architecture combines static Markdown/MDX content with strict JSON data validation. It features high-fidelity motion (GSAP) with robust fallback for reduced-motion preferences and uses a custom "Cinematic CV" routing structure.

## 2. Quick Start Checklist

- **Install:** `npm install` (Node 20+ required).
- **Dev Server:** `npm run dev` (Runs at `http://localhost:4321`).
- **Validate Content:** `npm run validate` (Must pass for build).
- **Generate PDFs:** `npm run gen:pdf` (Requires `dev` server running).
- **Build:** `npm run build` (Outputs to `dist/`).
- **Preview:** `npm run preview` (Serves `dist/`).

## 3. Tech Stack

| Category | Technology | Version | Config Source |
|----------|------------|---------|---------------|
| **Core** | Astro | 5.0.0 | `astro.config.mjs` |
| **Language** | TypeScript | 5.7.0 | `tsconfig.json` (Strict) |
| **Styling** | Tailwind CSS | 4.0.0 | `@tailwindcss/vite` |
| **Motion** | GSAP | 3.12.0 | `src/lib/motion.ts` |
| **Content** | MDX | 4.0.0 | `@astrojs/mdx` |
| **PDF** | Puppeteer | 24.35.0 | `scripts/generate-pdf.ts` |
| **Runtime** | Node.js | >=20.0.0 | `package.json` |

## 4. Non-negotiable Invariants
*Rules that break the build or site if ignored.*

1.  **Strict Validation:** The build pipeline **will fail** if `npm run validate` reports errors. All JSON data and MDX frontmatter must match the schemas in `scripts/validate-content.ts` and `src/content/config.ts`.
2.  **i18n Parity:** `en.json` is the source of truth. Every key added to `en.json` **must** exist in `es.json`, `fr.json`, and `pt.json`. The validator enforces this.
3.  **URL Structure:** All visible pages live under `/[lang]/`. The root `/` performs a redirect. Never link to non-prefixed routes.
4.  **Motion Cleanup:** Every GSAP ScrollTrigger or Observer **must** be killed/disconnected in `cleanupMotion()` or `runCleanups()` to prevent memory leaks during Astro View Transitions.

## 5. Rendering & Redirect Semantics

| Feature | Behavior | Evidence |
|---------|----------|----------|
| **Mode** | **SSG** (Static Site Generation) | No `adapter` or `output: 'server'` in `astro.config.mjs`. |
| **Root Redirect** | **Meta Refresh** (Client-side) | `Astro.redirect` in `src/pages/index.astro` (SSG behavior). |
| **View Transitions** | **Enabled** | `<ClientRouter />` in `src/layouts/Base.astro`. |

**Note on Redirects:**
Since this is an SSG site, `Astro.redirect()` generates an HTML file with `<meta http-equiv="refresh" content="0;url=...">`. Hosting platforms (Vercel/Netlify) may need separate configuration (`vercel.json` or `_redirects`) if a true 302 HTTP status is required for SEO.

## 6. Playbooks (How-To)

### Add a New Case Study
1.  Create `src/content/cases/my-case-slug.en.mdx` (and .es, .fr, .pt).
2.  Add frontmatter matching `src/content/config.ts`:
    - `caseSlug`, `title`, `decisionImpact` (min 3 items), `problem`, `approach`.
3.  Run `npm run validate` to ensure schema compliance.
4.  **Debug:** `src/content/config.ts` (Schema definition).

### Add a Translation Key
1.  Open `src/i18n/en.json` and add `"myKey": "Value"`.
2.  Run `npm run validate`. It will fail and list missing keys.
3.  Add `"myKey"` to `es.json`, `fr.json`, `pt.json`.
4.  **Debug:** `scripts/validate-content.ts` (Validation logic).

### Add a Motion Effect
1.  Create logic in `src/lib/ui/my-effect.ts`.
2.  Wrap initialization in `initSection('my-effect-key', () => { ... })` from `src/lib/lifecycle.ts`.
3.  Ensure you return a cleanup function.
4.  Import and call in `src/lib/ui/init.ts`.
5.  **Important:** Check `prefersReducedMotion()` and return early if true.

## 7. Effects & Motion System

### System Overview
The motion architecture is hybrid, combining **GSAP ScrollTrigger** for complex pinned sequences with lightweight **CSS/Vanilla JS** for micro-interactions.

- **GSAP:** Used exclusively for the "Chapter Deck" home section (`src/lib/motion.ts`).
- **Custom Observers:** `createRevealObserver` (`src/lib/ui/animations.ts`) handles standard "fade-up" reveals via `IntersectionObserver`.
- **Liquid FX:** SVG filter-based distortion (`src/lib/liquid-swirl.ts`) for interactive cards.
- **Physics:** `bindTilt` (`src/lib/ui/animations.ts`) provides 3D mouse-tracking tilt effects.

### Initialization Flow
Lifecycle management is critical for Astro View Transitions.
1. **Entry:** `src/layouts/Base.astro` calls `initUI()` inline.
2. **Re-init:** `document.addEventListener('astro:page-load', ...)` re-triggers init on navigation.
3. **Cleanup:** `src/lib/lifecycle.ts` maintains a `WeakMap` of initialized elements and runs `runCleanups()` on `astro:before-swap` to kill ScrollTriggers and observers.

### GSAP Patterns
Implemented in `src/lib/motion.ts`:
- **Timeline:** `gsap.timeline({ scrollTrigger: { pin: true, scrub: 1 } })`.
- **Cleanup:** Explicit `ScrollTrigger.getAll().forEach(t => t.kill())` called in `cleanupMotion()`.
- **Responsive:** Manual check `window.innerWidth < 768` (instead of `ScrollTrigger.matchMedia`) disables pinning on mobile.

### Reduced Motion Strategy
- **CSS:** `tokens.css` forces `animation: none !important` if `prefers-reduced-motion: reduce`.
- **JS:** Helpers in `motion.ts` / `animations.ts` return early or disable effects.

### Effect Specs (Implementation Details)

#### Effect: Chapter Deck
- **Lives in:** `src/lib/motion.ts`, `ChapterDeck.astro`.
- **DOM Contract:** Container with `.chapter-pin-wrapper`, cards with `.chapter-card`.
- **Tunables:** Hardcoded GSAP timeline values (scrub: 1, pin: true).
- **Reduced Motion:** Disables pinning; shows vertical accordion layout.
- **Cleanup:** `ScrollTrigger.getAll().forEach(t => t.kill())`.

#### Effect: Liquid Swirl
- **Lives in:** `src/lib/liquid-swirl.ts`, `LiquidSwirl.astro`.
- **DOM Contract:** Container with `data-liquid-swirl`, SVG filter `#liquidSwirl`.
- **Init:** `initAllLiquidSwirls` selects all data-attributes.
- **Tunables:** `intensity`, `radius` (passed via props/data-attrs).
- **Reduced Motion:** Effect disabled; `prefers-reduced-motion` media query hides visual artifacts.

#### Effect: Hero Orb & Tilt
- **Lives in:** `src/lib/ui/hero.ts`, `src/lib/ui/animations.ts`.
- **DOM Contract:** `#hero`, `.orb-container`.
- **Init:** `bindTilt` called on `mousemove`.
- **Reduced Motion:** `bindTilt` returns no-op.
- **Cleanup:** Removes event listeners.

## 8. Repo Map

```text
/
├── .github/workflows/   # CI/CD pipelines (ci.yml)
├── config/              # Source of truth for locales (locales.mjs)
├── scripts/             # TypeScript automation scripts
│   ├── generate-pdf.ts  # Puppeteer PDF generator
│   └── validate-content.ts # Zod-like content & i18n validator
├── src/
│   ├── components/      # UI Components (.astro)
│   ├── content/         # Content Collections (MDX)
│   │   ├── config.ts    # Zod schemas
│   ├── data/            # Resume data JSON (awards, education, etc.)
│   ├── i18n/            # Translation keys (en.json, es.json...)
│   ├── layouts/         # Base & Page layouts
│   ├── lib/             # Utilities
│   │   ├── lifecycle.ts    # Init/Cleanup manager (Self-registering pattern)
│   │   ├── motion.ts       # GSAP logic
│   │   └── seo.ts          # Schema.org & Meta tags
│   ├── pages/           # File-based Routing
│   └── styles/          # Global styles & Tokens
└── astro.config.mjs     # Configuration
```

## 9. Environment Variables & External Dependencies
- **Environment Variables:** No `process.env` or `import.meta.env` usage detected in codebase.
- **External Dependencies:**
    - **Puppeteer:** Requires a valid Chrome/Chromium executable or installed libraries if running in a minimal CI container (handled by `npm install`).
    - **Fonts:** Loads Inter and Syne from `fonts.googleapis.com` (Performance bottleneck).

## 10. CI/CD & Quality Gates
**File:** `.github/workflows/ci.yml`
- **Triggers:** Push to `main`, PR to `main`.
- **Jobs:**
    1. **validate:** `npm run validate` (Blocker).
    2. **check:** `npm run check` (Type safety).
    3. **build:** `npm run build` (SSG build).
    4. **lighthouse:** (PR only) Checks Performance > 0.75, Accessibility > 0.90.

## 11. Troubleshooting
- **Validation Failed:** Check console output. It pinpoints specific JSON files/fields (e.g., "Too many bullet points").
- **GSAP Ghosting:** If animations replay over new content, `cleanupMotion()` in `motion.ts` is likely not firing or not clearing the specific trigger.
- **PDF Generation Fails:** "Connection refused" means no local server is running. Run `npm run dev` first.
- **i18n Missing Keys:** `npm run validate` acts as the source of truth for missing translations.

## 12. Roadmap & Architecture Maturity
*Analysis by Senior Developer (Jan 2026)*

The codebase is technically sound but lacks maturity in automated testing, observability, and advanced SEO.

### A. Quality & Stability (High Priority)
- **Missing Tests:** No unit tests (Vitest) or E2E tests (Playwright) found.
- **Risk:** Routing logic (`src/lib/i18n-routing.ts`) and PDF generation (`gen:pdf`) are fragile to regression.
- **Plan:** Add `vitest` for library logic and `playwright` for critical paths (Home -> Case Study -> Resume).

### B. Motion Robustness
- **Issue:** Magic strings/numbers in `src/lib/motion.ts` (e.g., `scrub: 1`, duration values).
- **Cleanup Strategy:** `cleanupMotion()` kills *all* triggers globally. This is aggressive and may conflict with potential persistent animations.
- **Plan:** Create `src/lib/motion-config.ts` to centralize constants and implement a scoped cleanup registry per component.

### C. SEO & Discovery
- **Missing:** `@astrojs/sitemap`. Google cannot easily index all 4 language variants.
- **Schema:** `src/lib/seo.ts` exists but requires manual implementation in pages.
- **Plan:** Install `@astrojs/sitemap`, automate JSON-LD injection in `Base.astro` via props, and ensure `hreflang` validation in CI.

### D. Performance & DX
- **Fonts:** Currently loading from Google Fonts (render-blocking). Should migrate to `@fontsource/*` for self-hosting.
- **Validation Script:** `validate-content.ts` is a monolith. Should be refactored into smaller, domain-specific validators.
- **Accessibility:** `animateCounter` reads every number to screen readers. Needs `aria-hidden` + invisible final value span. Focus management on View Transitions needs audit.