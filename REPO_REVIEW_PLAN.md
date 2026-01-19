# Repo Review Plan

## 1) Executive Summary
- Static, multi-language Astro portfolio/resume site using MDX content collections and JSON data files; content is built at compile time.
- Clear separation of page routes, layouts, component sections, and content collections; i18n utilities are centralized.
- Strengths: structured content schemas for MDX, consistent layout wrappers, and reusable lifecycle helpers for client JS.
- Biggest structural risk: language support and content sources are duplicated across config, data, and scripts, creating drift risk.
- Runtime JS is embedded per component, increasing maintenance cost and cross-page interaction risk.
- Filtering and animation utilities are global-ish and rely on document-level selectors; this can cause hidden coupling.
- Custom validation script only covers a subset of data and only compares EN vs ES translations.
- Top priorities: centralize language/source-of-truth config, standardize data validation, and consolidate client scripts to reduce duplication.

## 2) Repository Map
| Path / Folder | Responsibility | Key files | Notes / risks |
| --- | --- | --- | --- |
| `astro.config.mjs` | Astro app config, i18n, Vite plugins | `astro.config.mjs` | i18n locales defined here; should be single source of truth |
| `src/pages` | File-based routing and page assembly | `src/pages/index.astro`, `src/pages/[lang]/index.astro`, `src/pages/[lang]/resume.astro`, `src/pages/[lang]/case-studies/*`, `src/pages/[lang]/perspectives/*` | Repeated lang validation and static paths; content ordering hardcoded in some pages |
| `src/layouts` | Layout shells and shared SEO | `src/layouts/Base.astro`, `src/layouts/Page.astro` | Base embeds global scripts and theme init; inline scripts may be hard to trace |
| `src/components` | Section and UI components | `src/components/core/*`, `src/components/home/*`, `src/components/cases/*`, `src/components/perspectives/*`, `src/components/resume/*` | Many components include large inline CSS and JS; behavior spread across files |
| `src/content` | MDX content collections and entries | `src/content/config.ts`, `src/content/cases/*.mdx`, `src/content/articles/*.mdx`, `src/content/pages/*.md` | Content schema uses zod; good baseline for validation |
| `src/data` | Structured JSON content for sections | `src/data/home.json`, `src/data/site.json`, `src/data/experience.json`, `src/data/skills.json` | No schema validation beyond custom script; multiple language fields stored inline |
| `src/i18n` | Translation dictionaries and helpers | `src/i18n/index.ts`, `src/i18n/config.ts`, `src/i18n/*.json` | Translation keys are string-based; missing keys only validated for ES vs EN |
| `src/lib` | Cross-component utilities | `src/lib/seo.ts`, `src/lib/lifecycle.ts`, `src/lib/motion.ts`, `src/lib/ui/*` | Global store for lifecycle; some utilities query the document globally |
| `src/styles` | Global tokens and Tailwind config | `src/styles/tokens.css`, `src/styles/global.css` | Global styles and print rules; large block of global animations |
| `scripts` | Node scripts for validation and PDF generation | `scripts/validate-content.ts`, `scripts/generate-pdf.ts` | Validation is partial; PDF generation depends on running server |
| `public` | Static assets | `public/assets/*`, `public/pdf/*`, `public/og/*` | Build-time PDFs generated here; ensure build output is not tracked |
| `dist` | Build output | `dist/` | Should stay untracked; ensure not committed |
| `docs` and planning | Documentation and plans | `SPEC.md`, `V2PLAN.md`, `TODO.md`, `CONTENT_MAP.md`, `effect_library.md` | Valuable context but not integrated into code workflows |

## 3) Architecture & Data Flow
- Startup
  - Astro initializes with `astro.config.mjs` (MDX integration, Tailwind Vite plugin, i18n routing).
  - Global styles and theme initialization script run in `src/layouts/Base.astro`.
- Routing
  - File-based routing in `src/pages`, with `[lang]` dynamic segment for all localized pages.
  - `src/pages/index.astro` redirects to default language.
  - Each page validates lang via `src/i18n/config.ts` and redirects on invalid codes.
- State / Data fetching
  - Content collections: `src/content/config.ts` defines schemas; pages use `getCollection` to load MDX entries at build time.
  - Section data: JSON files in `src/data` imported directly in page components.
  - Translations: JSON dictionaries in `src/i18n`; `t()` and `createTranslator()` resolve keys at runtime.
- Caching / performance
  - Static build output; no runtime caching layer.
  - Client-side scripts run for animations, filters, and UI behavior on page load / transitions.
- Error handling
  - Lang validation results in redirects; no centralized error boundary.
  - Content validation script exists but is optional and partial.
- Logging / Observability
  - No runtime logging or build-time reporting beyond the validation script.
- Boundaries and dependency direction
  - Pages depend on layouts, components, data, content collections, and i18n utilities.
  - Components depend on i18n and lib utilities; many embed their own CSS/JS.
  - lib utilities are shared across UI features; scripts are initialized via `src/lib/lifecycle.ts`.

## 4) Structural Issues (Ranked)
1. Symptom: Language config duplicated in multiple places.
   - Root cause: `supportedLangs` defined in `src/i18n/config.ts` but also hardcoded in scripts and build logic.
   - Risk: Missing or inconsistent locale support across pages, scripts, and assets.
   - Evidence: `src/i18n/config.ts`, `src/pages/*`, `scripts/generate-pdf.ts`.
   - Recommendation: Create a single source of truth for locales and import it wherever needed.
   - Effort: S | Risk: Med
2. Symptom: Data validation is partial and inconsistent.
   - Root cause: `scripts/validate-content.ts` only checks select JSON files and ES vs EN translations.
   - Risk: Silent content regressions or broken builds due to missing fields or invalid i18n in FR/PT.
   - Evidence: `scripts/validate-content.ts`, `src/i18n/*.json`, `src/data/*.json`.
   - Recommendation: Expand validation to all locales and all data files; consider schema validation for JSON.
   - Effort: M | Risk: Med
3. Symptom: Client JS embedded in many `.astro` components.
   - Root cause: Each component includes its own `<script>` block for interactions.
   - Risk: Harder to trace behavior, test, and deduplicate logic; higher bundle fragmentation.
   - Evidence: `src/components/core/Header.astro`, `src/components/core/LangSwitch.astro`, `src/components/home/Hero.astro`.
   - Recommendation: Consolidate shared behaviors into `src/lib/ui` modules and import once per page or layout.
   - Effort: M | Risk: Med
4. Symptom: Filtering utilities query the document globally.
   - Root cause: `useFilters` uses `document.querySelectorAll` for cards rather than scoping to the root.
   - Risk: Cross-component interference if multiple filterable lists are present.
   - Evidence: `src/lib/ui/filters.ts`, `src/components/cases/CaseFilters.astro`, `src/components/perspectives/ArticleFilters.astro`.
   - Recommendation: Scope queries to the root container or pass container element explicitly.
   - Effort: S | Risk: Low
5. Symptom: Repeated lang validation and static path generation across pages.
   - Root cause: Each page defines its own `getStaticPaths` and lang checks.
   - Risk: Inconsistent behavior or missing updates when adding languages.
   - Evidence: `src/pages/[lang]/index.astro`, `src/pages/[lang]/resume.astro`, `src/pages/[lang]/case-studies/index.astro`, `src/pages/[lang]/perspectives/index.astro`.
   - Recommendation: Extract helpers for static paths and lang validation in a shared module.
   - Effort: S | Risk: Low
6. Symptom: Case study navigation order is hardcoded.
   - Root cause: Array defined in page logic rather than derived from content metadata.
   - Risk: New case entries require manual updates; mismatch across locales.
   - Evidence: `src/pages/[lang]/case-studies/[slug].astro`.
   - Recommendation: Move ordering into content metadata or a data file; derive nav programmatically.
   - Effort: S | Risk: Med
7. Symptom: Translation keys are runtime-only and stringly typed.
   - Root cause: No type generation or compile-time checks for translation keys.
   - Risk: Broken text and fallback usage without detection.
   - Evidence: `src/i18n/index.ts`, `src/components/**`.
   - Recommendation: Introduce a typed translation key map or key extraction tool.
   - Effort: M | Risk: Med
8. Symptom: Content sources split between MDX and JSON with overlapping concerns.
   - Root cause: Pages use JSON for section content while MDX handles articles and cases.
   - Risk: Harder to maintain content consistency and validation coverage.
   - Evidence: `src/content/*`, `src/data/*`.
   - Recommendation: Define clear boundaries (e.g., all narrative content in collections, all structured content in JSON with schemas).
   - Effort: M | Risk: Med
9. Symptom: Inline CSS in components is extensive.
   - Root cause: Styles live inside component files rather than shared layers.
   - Risk: Harder global refactors; duplicated styles; larger diffs.
   - Evidence: `src/components/core/Header.astro`, `src/components/home/Hero.astro`, `src/components/core/LangSwitch.astro`.
   - Recommendation: Extract repeated styles into `src/styles` layers or component-level CSS modules.
   - Effort: M | Risk: Low
10. Symptom: Theme initialization exists in multiple places.
   - Root cause: Theme state set in `Base.astro` and also re-checked in `ThemeToggle.astro`.
   - Risk: Potential inconsistency and flicker when logic changes in one place.
   - Evidence: `src/layouts/Base.astro`, `src/components/core/ThemeToggle.astro`.
   - Recommendation: Centralize theme initialization and expose a single API for toggles.
   - Effort: S | Risk: Low
11. Symptom: Build artifacts and generated PDFs are stored under `public`.
   - Root cause: PDF generation writes to `public/pdf` and relies on a running server.
   - Risk: Manual workflow and risk of stale artifacts if not regenerated.
   - Evidence: `scripts/generate-pdf.ts`, `public/pdf/*`.
   - Recommendation: Document a build step or CI task to regenerate PDFs consistently.
   - Effort: S | Risk: Low
12. Symptom: Missing centralized error handling for content rendering.
   - Root cause: Pages assume content validity; error handling is per-page redirects only.
   - Risk: Build-time failures or runtime fallbacks are hard to debug.
   - Evidence: `src/pages/[lang]/*`, `src/content/config.ts`.
   - Recommendation: Add build-time validation for all collections and data sources; use consistent error messaging.
   - Effort: M | Risk: Med

## 5) Improvement Plan (Phased Roadmap)
### Phase 0: Safety & Observability
- Objectives
  - Reduce drift between content sources and languages.
  - Make validation failures explicit in CI/local workflows.
- Steps
  - Define a single locale source (module or JSON) and reference it from scripts and pages.
  - Expand `validate-content.ts` to cover all locales and JSON files.
  - Add a minimal validation step in CI or a documented pre-build checklist.
- Acceptance criteria
  - `npm run validate` reports missing keys for all locales.
  - Adding a new locale requires changes in only one place.
  - No UI or behavior change in `npm run dev` and `npm run build`.
- Rollback strategy
  - Keep previous validation script as a backup; revert to earlier script if false positives block builds.

### Phase 1: Quick Wins
- Objectives
  - Reduce duplication in routing and initialization.
- Steps
  - Extract shared helpers for `getStaticPaths` and lang validation.
  - Scope `useFilters` to the root container to avoid cross-page coupling.
  - Document the PDF generation flow in `SPEC.md` or `README`.
- Acceptance criteria
  - All localized pages use the same helper utilities.
  - Filtering works identically on case studies and perspectives pages.
- Rollback strategy
  - Keep the original inline logic in a backup branch or a commented reference file.

### Phase 2: Medium Refactors
- Objectives
  - Consolidate client behavior and data validation.
- Steps
  - Move shared UI behavior to `src/lib/ui` and register from pages/layouts.
  - Introduce JSON schema validation (zod or similar) for `src/data` files.
  - Establish a single content boundary: MDX for narrative content, JSON for structured data only.
- Acceptance criteria
  - Client scripts are imported from shared modules and initialized in one place.
  - Data validation covers all `src/data` files and fails fast on errors.
- Rollback strategy
  - Keep component-level scripts in place until the consolidated modules are stable.

### Phase 3: Larger Structural Changes (if justified)
- Objectives
  - Improve long-term maintainability and consistency.
- Steps
  - Consider a content pipeline that generates typed data from MDX and i18n files.
  - Introduce typed translation keys and locale-aware content adapters.
- Acceptance criteria
  - Translation keys are type-checked or validated pre-build.
  - Content updates do not require manual sync across multiple files.
- Rollback strategy
  - Retain existing content structure during migration; enable opt-in paths.

## 6) Decision Points (2-3 options max each)
1. Locale source of truth
   - Option A: Keep `src/i18n/config.ts` as canonical and import it everywhere.
   - Option B: Create a `src/config/locales.ts` module consumed by i18n, scripts, and pages.
   - Tradeoffs: A is minimal but risks tight coupling to i18n; B is clearer but adds a new module.
   - Recommended: Option B for clarity and reuse.
2. Data validation strategy
   - Option A: Extend existing `validate-content.ts` with JSON schema validation.
   - Option B: Introduce a separate validation tool or script per data domain.
   - Tradeoffs: A is centralized and simple; B can be more modular but increases setup.
   - Recommended: Option A for lower overhead and consistent reporting.
3. Client script organization
   - Option A: Keep scripts in components but standardize initialization helpers.
   - Option B: Centralize scripts by page or layout and import utility modules.
   - Tradeoffs: A is incremental; B reduces fragmentation but requires refactoring.
   - Recommended: Option B for maintainability and predictable behavior.

## 7) Assumptions & Open Questions
- ASSUMPTIONS:
  - The site is fully static and does not require runtime API calls.
  - Content changes are managed by developers rather than a CMS.
  - No CI pipeline is currently enforcing validation or formatting.
- QUESTIONS (only if truly blocking):
  - None at this stage.

## 8) Verification Checklist (No UI Change)
- Commands to run
  - `npm run validate`
  - `npm run check`
  - `npm run build`
  - `npm run preview`
- Minimal smoke test checklist
  - Load `/{lang}` for all locales and confirm no console errors.
  - Navigate to `/case-studies` and `/perspectives` and confirm filters work.
  - Open a case study and article detail page and confirm navigation links work.
  - Toggle theme and language; confirm persistence and correct routing.
  - Generate PDFs via `npm run gen:pdf` with preview server running.
