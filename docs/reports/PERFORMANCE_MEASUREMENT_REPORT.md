# Performance Measurement Report

Date: 2026-01-24
Scope: Baseline measurements (local + Vercel) for critical routes

## 1) Objectives and Scope
- Measure baseline performance for critical routes without code changes.
- Compare local static build vs Vercel production.
- Focus on Web Vitals and JS cost (LCP/INP proxies, TBT, CLS, TTI).

Critical routes:
- `/en/`
- `/en/resume`
- `/en/case-studies`

Devices and conditions:
- Lighthouse mobile emulation (Moto G power 2022, 4G).
- Cold cache (LH default) and static hosting via LHCI local server.

## 2) Tooling and Commands Used
Build:
- `npm run build`

Local Lighthouse CI (static dist):
- `npx @lhci/cli collect --config=lighthouserc.json --outputDir=.lighthouseci`

Vercel production (mobile):
- `npx lighthouse https://www.angelaparra.me/en/ --output json --output-path .lighthouseci/vercel-en.json --quiet --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo`
- `npx lighthouse https://www.angelaparra.me/en/resume --output json --output-path .lighthouseci/vercel-resume.json --quiet --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo`
- `npx lighthouse https://www.angelaparra.me/en/case-studies --output json --output-path .lighthouseci/vercel-case-studies.json --quiet --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo`

Note on Windows temp permissions:
- Lighthouse CLI needed a custom temp directory to avoid EPERM errors. A repo-local temp directory was used: `.tmp`.

Artifacts:
- Local LHCI reports: `.lighthouseci/lhr-*.json` and `.lighthouseci/lhr-*.html`
- Vercel reports: `.lighthouseci/vercel-*.json`

## 3) Results (Local, LHCI)
All scores are Lighthouse mobile, single run.

### /en/
- Performance: 0.50
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 3.1 s
- LCP: 3.8 s
- TBT: 1,140 ms
- CLS: 0.189
- Speed Index: 3.1 s
- TTI: 4.5 s

### /en/resume/
- Performance: 0.95
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 2.2 s
- LCP: 2.4 s
- TBT: 0 ms
- CLS: 0.028
- Speed Index: 2.2 s
- TTI: 2.4 s

### /en/case-studies/
- Performance: 0.91
- Accessibility: 0.98
- Best Practices: 1.00
- SEO: 1.00
- FCP: 2.6 s
- LCP: 2.9 s
- TBT: 0 ms
- CLS: 0.022
- Speed Index: 2.6 s
- TTI: 2.9 s

## 4) Results (Vercel Production, Lighthouse CLI)
All scores are Lighthouse mobile, single run.

### https://www.angelaparra.me/en/
- Performance: 0.60
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 2.4 s
- LCP: 3.0 s
- TBT: 980 ms
- CLS: 0
- Speed Index: 32.7 s
- TTI: 3.7 s

### https://www.angelaparra.me/en/resume
- Performance: 0.98
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 1.8 s
- LCP: 1.9 s
- TBT: 30 ms
- CLS: 0.028
- Speed Index: 1.9 s
- TTI: 2.0 s

### https://www.angelaparra.me/en/case-studies
- Performance: 0.97
- Accessibility: 0.98
- Best Practices: 1.00
- SEO: 1.00
- FCP: 1.9 s
- LCP: 2.2 s
- TBT: 80 ms
- CLS: 0.022
- Speed Index: 2.9 s
- TTI: 2.2 s

## 5) Interpretation and Initial Findings
- The home page is the clear bottleneck compared to other routes. It shows high TBT and LCP around 3s on Vercel, whereas resume and case-studies are within good thresholds.
- Speed Index on Vercel home is extremely high (32.7 s). This often indicates continuous visual changes (canvas/animations) that keep the page from reaching "visual complete" in Lighthouse.
- Local home CLS is high (0.189) while Vercel shows 0. This discrepancy requires a follow-up trace to confirm the source of layout shifts locally.

## 6) Known Factors Likely Affecting Home
Based on code review (no changes made yet):
- Heavy client-side logic and continuous animations (GSAP, Pixi, canvas effects).
- Script execution on page load for multiple sections.
- Potential duplicate scripts (inline component scripts plus `initUI` modules).

## 7) After Changes (Local, LHCI)
Changes applied before this run:
- Lazy `initUI` module loading by DOM presence.
- Operating Model: dynamic deps + viewport gate.
- Chapter Deck: viewport gate + dynamic `initChapterDeck`.

All scores are Lighthouse mobile, single run.

### /en/
- Performance: 0.89
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 2.6 s
- LCP: 2.7 s
- TBT: 220 ms
- CLS: 0
- Speed Index: 2.6 s
- TTI: 2.9 s

### /en/resume/
- Performance: 0.97
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 2.0 s
- LCP: 2.1 s
- TBT: 0 ms
- CLS: 0.028
- Speed Index: 2.0 s
- TTI: 2.1 s

### /en/case-studies/
- Performance: 0.96
- Accessibility: 0.98
- Best Practices: 1.00
- SEO: 1.00
- FCP: 2.2 s
- LCP: 2.3 s
- TBT: 0 ms
- CLS: 0.022
- Speed Index: 2.2 s
- TTI: 2.3 s

## 8) After Changes (Vercel Production, Lighthouse CLI)
All scores are Lighthouse mobile, single run.

### https://www.angelaparra.me/en/
- Performance: 0.71
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 2.0 s
- LCP: 2.1 s
- TBT: 1,320 ms
- CLS: 0
- Speed Index: 3.9 s
- TTI: 3.6 s

### https://www.angelaparra.me/en/resume
- Performance: 0.99
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00
- FCP: 1.7 s
- LCP: 1.8 s
- TBT: 30 ms
- CLS: 0.028
- Speed Index: 1.8 s
- TTI: 1.8 s

### https://www.angelaparra.me/en/case-studies
- Performance: 0.96
- Accessibility: 0.98
- Best Practices: 1.00
- SEO: 1.00
- FCP: 1.8 s
- LCP: 1.9 s
- TBT: 130 ms
- CLS: 0.022
- Speed Index: 3.0 s
- TTI: 2.1 s

## 9) Delta Summary (Before vs After)
- Home (local): perf 0.50 -> 0.89, LCP 3.8 s -> 2.7 s, TBT 1,140 ms -> 220 ms.
- Home (Vercel): perf 0.60 -> 0.71, LCP 3.0 s -> 2.1 s, Speed Index 32.7 s -> 3.9 s.
- Resume and Case Studies: small improvements, already strong.

## 10) Data Gaps and Next Steps
Pending phases:
1) Bundle analysis: map JS chunks for home vs other routes (`dist/_astro`).
2) Performance traces: confirm long tasks and background animations in home.
3) Continue optimizations (Education + Contact viewport gating and pause on hidden).

## 11) Repo State Notes
Untracked artifacts from measurement:
- `.lighthouseci/`
- `.tmp/`

These are measurement artifacts only and should not be committed.
