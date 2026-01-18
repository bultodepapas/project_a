# GEMINI.md — Cinematic CV / Portfolio Site (Project Context)

This file is the operational contract for Gemini (Agent mode). It is NOT marketing copy.
Goal: produce correct, minimal, evidence-backed changes aligned with the project SPEC.

---

## 0) Priority order (resolve conflicts like this)
1) This GEMINI.md
2) SPEC.md (source of truth for requirements) SPEK.MD is king
3) Existing repo conventions (folders, naming, patterns)
4) Your general best practices

If instructions conflict, stop and ask before proceeding.

---

## 1) Non-negotiables (hard rules)
- **No hallucinated facts.** Do not invent metrics, org names, budgets, awards, dates, or outcomes.
- **Evidence over claims.** Any “big claim” must be backed by:
  - a Case Study (MDX) section, or
  - a `proof.json` item, or
  - a referenced artifact (image/PDF/diagram), or
  - a confidentiality note explaining what can’t be shown.
- **Performance is part of the design.** Avoid global JS. Use islands only when necessary.
- **Accessibility is mandatory.** Respect `prefers-reduced-motion`, keyboard navigation, focus visible, semantics.
- **No secrets ever.** Never output or request tokens/keys. Never commit credentials. Never add telemetry by default.
- **No big refactors without permission.** Ask first for:
  - folder moves, architecture rewrites, dependency swaps, CSS system changes, i18n rewrites, build pipeline changes.

---

## 2) Working agreement (how to collaborate)
Before coding:
1) Write a short plan (3–7 bullets)
2) List files you will touch
3) List risks / tradeoffs
4) Wait if ambiguity exists (ask questions)

While coding:
- Prefer **small, reversible diffs**
- Preserve existing patterns unless SPEC explicitly says otherwise
- If you must choose between “clever” and “clear”, choose **clear**

After coding:
- Summarize what changed and why
- List commands that should pass (see Section 9)

---

## 3) Creative Direction (Legacy Soul — V0.1)
This project is a “cinematic CV”: narrative + proof + elegance. It is NOT a long CV page.
It’s an interactive proof-driven story with a recruiter fast mode.

### Editorial principles
1) Proof before biography: lead with credibility (Proof Strip), then method, then cases; “About” stays short and late.
2) Two paths, two intents:
   - Cinematic Home = memorability + narrative + systems thinking
   - Recruiter Mode (/resume) = conversion + ATS scan in 45–90 seconds, minimal motion
3) WOW is measurable:
   - 10s: headline + proof strip + “hired for”
   - 60s: recruiter mode signals seniority without effort
   - 2–4min: one case proves governance + adoption + decision impact
4) Motion Tier B only: **one pinned section total** (perfect > many average).
5) Reduced motion must still look premium (designed fallback, not “disabled”).

### Anti-patterns
- No invented metrics or vague “helped with…” copy
- No multi-pinned scroll sequences
- No hardcoded lists in components (content must be data-driven)
- No motion that blocks usability or requires scroll to access core content

---

## 4) Architecture constraints (must follow)
### 4.1 Routing & i18n
- Required routes:
  - `/{lang}/` (home)
  - `/{lang}/resume`
  - `/{lang}/case-studies`
  - `/{lang}/case-studies/{slug}`
- `lang` currently: `en`, `es` (PT/FR later)
- Default redirect: `/` → `/en/`
- Case fallback: if ES case missing, render EN with a visible i18n banner (SEO-safe).

### 4.2 Content as source of truth
- Content lives in:
  - `src/content/cases/*.mdx` (or the repo’s established equivalent)
  - `src/content/pages/*.md`
  - `src/data/*.json`
  - `src/i18n/*.json`
- Use Astro Content Collections + Zod schema (`src/content/config.ts`).
- **Do not hardcode** proof/capabilities/experience lists inside components.

### 4.3 Islands & JS budget
- Default: static HTML (Astro).
- Only one “heavy” interactive island:
  - `ChapterDeck` (GSAP/ScrollTrigger)
- Load the island with `client:visible` (or equivalent) and degrade gracefully.

### 4.4 Motion rules (Tier B)
- Exactly **1 pinned** section total (Home Systems/ChapterDeck only).
- Micro-animations should be light (IntersectionObserver, CSS).
- **Reduced motion**:
  - Replace pinned/GSAP with an accordion or static layout.
  - Ensure content is fully readable and navigable.

### 4.5 SEO
- All pages must include:
  - unique title/description
  - canonical
  - hreflang alternates
  - OG metadata
  - JSON-LD:
    - Person on Home
    - Article on Case detail

---

## 5) Case Study contract (must be satisfied)
Each case must contain:
- Problem
- Approach
- System design (bullets + optional diagram)
- Data sources & tooling
- Outputs
- **Decision impact** (>= 3 bullets)
- Adoption & cadence
- Governance & stakeholders
- Tools
- Confidentiality note (if needed)
- Artifacts (if allowed)

Narrative framing:
Challenge → Strategy → Execution → Results → Learnings
(Adapt to the case structure but do not lose this logic.)

---

## 6) Recruiter Mode (/resume) rules
- Minimal motion (almost none)
- Highly scannable in 45–90s
- Tight hierarchy, no fluff
- Provide:
  - Summary (3–4 lines)
  - Key strengths (<= 5 bullets)
  - Experience (<= 3 bullets per role, outcome-first)
  - Education, Languages, Awards (if present)
  - Links to top 3 cases
  - PDF download (pre-generated preferred)

---

## 7) Data & validation gates (CI expectations)
- Maintain/extend `scripts/validate-content.*`
- Critical constraints (errors):
  - proof items <= 5
  - capabilities blocks <= 6
  - `decisionImpact` present and length >= 3 per case
  - required case sections must exist
- Warnings allowed (but try to fix):
  - missing translations
  - missing optional artifacts

---

## 8) Style & code conventions
- TypeScript strict, no `any` without justification.
- Keep components small and domain-scoped.
- Use tokens (`src/styles/tokens.css`) as the source of truth for base design.
- Do not add dependencies unless SPEC explicitly requires it.

Accessibility baseline:
- Skip-to-content link
- Landmarks: header/main/footer
- Focus-visible styles
- Images must have alt + dimensions to prevent CLS
- Modals/lightboxes: focus trap + ESC + aria labels

---

## 9) Commands (must keep working)
Use the repo’s actual scripts. If present, expect:
- `npm run dev`
- `npm run validate`
- `npm run build`
- `npm run check`
- (optional) `npm run lint`, `npm run format`

When you deliver a change, state which of these should pass.

---

## 10) When you’re unsure (required behavior)
- Search the repo first (SPEC.md, content schemas, existing components).
- If data is missing:
  - implement the structure and validation,
  - keep public copy honest and non-numeric,
  - add internal placeholders in data files only (never visible in UI).
- If ambiguity blocks correctness: ask questions before changing code.

---

## 11) Debug protocol (if GEMINI.md seems ignored)
- Confirm which `GEMINI.md` applies (global vs repo vs subfolder).
- If needed, explicitly include it in the prompt: `@GEMINI.md`
- Keep this file concise; prefer additional module-level GEMINI.md files over bloating this one.

## MCP tools available (use them when helpful)
You have these MCP servers enabled and should use them proactively when they reduce guessing:
- `filesystem` (scoped to `D:\DEVELOMENT\Project_A\project_a`): read the repo first, make minimal diffs, and avoid destructive operations unless explicitly requested.
- `context7`: when proposing APIs/config for Astro/Tailwind/GSAP/i18n/View Transitions, fetch up-to-date docs first (e.g., “use context7”) instead of relying on memory.
- `playwright`: run targeted UI/UX checks for routing, i18n fallbacks, keyboard navigation, and `prefers-reduced-motion` behavior before finalizing interaction/motion work.
- `github` (Copilot MCP): use it to inspect PRs/issues/repo context rather than assuming conventions.
- `supabase` and `homeassistant`: only use if the task explicitly involves Supabase or Home Assistant; otherwise do not introduce them.
- `my-tool`: use only after confirming its purpose, inputs/outputs, and safety constraints from project documentation.

