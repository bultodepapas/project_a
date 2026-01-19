# SPEC: Portfolio Cinematográfico — Ángela Parra

> **Versión**: 1.0
> **Fecha**: 2026-01-17
> **Estado**: Planificación completa, pendiente implementación

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Decisiones de Arquitectura](#2-decisiones-de-arquitectura)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Estructura del Sitio](#4-estructura-del-sitio)
5. [Flujos de Usuario](#5-flujos-de-usuario)
6. [Arquitectura de Contenido](#6-arquitectura-de-contenido)
7. [Estructura del Repositorio](#7-estructura-del-repositorio)
8. [Especificación de Componentes](#8-especificación-de-componentes)
9. [Sistema de Diseño](#9-sistema-de-diseño)
10. [Motion Spec (Tier B)](#10-motion-spec-tier-b)
11. [Internacionalización (i18n)](#11-internacionalización-i18n)
12. [SEO y Metadatos](#12-seo-y-metadatos)
13. [Performance y Accesibilidad](#13-performance-y-accesibilidad)
14. [Validación de Contenido](#14-validación-de-contenido)
15. [Plan de Ejecución (Sprints)](#15-plan-de-ejecución-sprints)
16. [Definition of Done por Página](#16-definition-of-done-por-página)
17. [Riesgos y Mitigaciones](#17-riesgos-y-mitigaciones)
18. [Datos Pendientes](#18-datos-pendientes)
19. [Checklist Pre-Launch](#19-checklist-pre-launch)
20. [Glosario](#20-glosario)

---

## 1. Resumen Ejecutivo

### 1.1 Qué es este proyecto

Un portfolio/CV cinematográfico para Ángela Parra, profesional senior de marketing digital especializada en sistemas de medición, inteligencia de audiencias y estrategia de narrativas para organizaciones internacionales (clima, desarrollo, cooperación).

### 1.2 Filosofía central

**No es un CV en una página. Es una experiencia narrativa.**

El sitio tiene dos modos:
- **Cinematic Mode**: Experiencia inmersiva con storytelling, animaciones controladas y prueba visual de competencias
- **Recruiter Mode**: Vista rápida, escaneable, ATS-friendly, optimizada para conversión en 45-90 segundos

### 1.3 Objetivo de comunicación

**Mensaje en 5-8 segundos:**
> "Ángela construye sistemas de medición e inteligencia de audiencias que convierten narrativa y datos en decisiones para portafolios climáticos internacionales"

### 1.4 Principios no negociables

| Principio | Descripción |
|-----------|-------------|
| **Proof over claims** | Cada afirmación debe apuntar a un caso, artefacto o referencia interna |
| **WOW ≠ animación** | WOW = claridad + dirección de arte + ritmo + evidencia |
| **Performance first** | El sitio debe "sentirse caro" Y ser rápido |
| **Accesibilidad real** | `prefers-reduced-motion` respetado, navegación por teclado, contraste adecuado |
| **Mantenibilidad** | Contenido en MDX/JSON, no hardcodeado en componentes |

---

## 2. Decisiones de Arquitectura

### 2.1 Opciones evaluadas

| Opción | Descripción | Veredicto |
|--------|-------------|-----------|
| **One-page cinematic** | Todo en una sola página larga | ❌ Rechazada: performance, SEO, mantenimiento |
| **Hybrid** | Home cinematic + Case pages + Resume | ✅ **Seleccionada** |
| **App-like dashboard** | Estilo producto/SaaS | ❌ Rechazada: riesgo de "demo vacía" |

### 2.2 Motion Tiers evaluados

| Tier | Descripción | Veredicto |
|------|-------------|-----------|
| **A - Minimal** | Solo reveals y transiciones suaves | ❌ Insuficiente para "WOW" |
| **B - Balanced** | 1 pinned section, View Transitions, micro-animations | ✅ **Seleccionado** |
| **C - Awwwards heavy** | Múltiples pinned, parallax, canvas | ❌ Riesgo de jank y accesibilidad |

### 2.3 Decisiones finales

```
✅ Arquitectura UX: Hybrid (Home + Cases + Resume)
✅ Motion: Tier B (Balanced cinematic)
✅ Hosting: Static + PDF pre-generado
✅ i18n: EN/ES completos al inicio (PT/FR posterior)
✅ 3D (Three.js): ELIMINADO — no justifica complejidad
✅ ChapterDeck: Vanilla JS + GSAP (no React/Svelte)
✅ PDF: Pre-generado + script npm para regenerar
✅ Validación: CI desde Sprint 0
```

---

## 3. Stack Tecnológico

### 3.1 Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Astro** | 5.x | Framework base, islas, SSG |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Sistema de diseño, utilidades |
| **GSAP + ScrollTrigger** | 3.x | Animaciones, pinned sections |

### 3.2 Contenido

| Tecnología | Propósito |
|------------|-----------|
| **MDX** | Case studies con componentes embebidos |
| **JSON** | Data estructurada (skills, experience, etc.) |
| **Astro Content Collections** | Tipado y validación de contenido |

### 3.3 Build & Deploy

| Tecnología | Propósito |
|------------|-----------|
| **Vite** | Bundler (incluido en Astro) |
| **Docker** | Containerización |
| **Caddy** | Reverse proxy + TLS automático |
| **GitHub Actions** | CI/CD |

### 3.4 Dependencias explícitas

```json
{
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "@astrojs/mdx": "^4.0.0",
    "gsap": "^3.12.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### 3.5 Lo que NO usamos (y por qué)

| Tecnología | Razón de exclusión |
|------------|-------------------|
| Three.js | Complejidad no justificada para el ROI |
| React/Vue/Svelte | Astro islands con vanilla JS es suficiente |
| CMS (Strapi/Directus) | Overkill para contenido estático |
| Analytics pesados | Solo eventos mínimos privacy-friendly |

---

## 4. Estructura del Sitio

### 4.1 Sitemap

```
/{lang}/                        → Home Cinematic
/{lang}/resume                  → Recruiter Mode (ATS)
/{lang}/case-studies            → Índice filtrable
/{lang}/case-studies/{slug}     → Detalle de caso

Idiomas: en, es
Default: en (redirect desde /)
```

### 4.2 Navegación principal

```
[Logo: Ángela Parra]  [Systems]  [Case Studies]  [Resume]  [Contact]  [EN|ES]
```

### 4.3 Jerarquía de información (orden de importancia visual)

1. **Headline + Proof Strip** (primeros 5 segundos)
2. **"What I'm hired for"** (siguientes 10 segundos)
3. **Systems Portfolio / ChapterDeck** (el WOW, 30-60 segundos)
4. **Operating Model** (señal de seniority)
5. **Case Studies** (evidencia profunda)
6. **Capabilities, Timeline, Education** (supporting)
7. **Contact** (conversión)

---

## 5. Flujos de Usuario

### 5.1 Flow A: Recruiter / Headhunter (45-90 segundos)

```
┌─────────────────────────────────────────────────────────────────┐
│  Landing (/)                                                    │
│       │                                                         │
│       ▼                                                         │
│  Proof Strip (10s) ──────► "Parece senior"                     │
│       │                                                         │
│       ▼                                                         │
│  Resume Mode (/resume) ──► Escaneo rápido                      │
│       │                                                         │
│       ▼                                                         │
│  PDF Download / LinkedIn / Email ──► CONVERSIÓN                │
└─────────────────────────────────────────────────────────────────┘

KPIs: clicks a resume, click download, click contact, time-to-first-case
```

### 5.2 Flow B: Hiring Manager (3-6 minutos)

```
┌─────────────────────────────────────────────────────────────────┐
│  Landing (/)                                                    │
│       │                                                         │
│       ▼                                                         │
│  Hero + Proof Strip ──► Primera impresión                      │
│       │                                                         │
│       ▼                                                         │
│  "What I'm hired for" ──► Relevancia                           │
│       │                                                         │
│       ▼                                                         │
│  ChapterDeck (pinned) ──► WOW + engagement                     │
│       │                                                         │
│       ▼                                                         │
│  Case Detail (/case-studies/slug) ──► Evidencia profunda       │
│       │                                                         │
│       ▼                                                         │
│  Operating Model ──► "Esta persona piensa en sistemas"         │
│       │                                                         │
│       ▼                                                         │
│  Contact ──► CONVERSIÓN                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Flow C: Donor / Partner (2-4 minutos)

```
┌─────────────────────────────────────────────────────────────────┐
│  Landing (/)                                                    │
│       │                                                         │
│       ▼                                                         │
│  Governance / Standards signals ──► Credibilidad               │
│       │                                                         │
│       ▼                                                         │
│  Case Detail (decision impact) ──► "Genera cambio real"        │
│       │                                                         │
│       ▼                                                         │
│  Capabilities (capacity building) ──► Sostenibilidad           │
│       │                                                         │
│       ▼                                                         │
│  Contact ──► CONVERSIÓN                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Arquitectura de Contenido

### 6.1 Fuentes de contenido (source of truth)

```
src/content/
├── config.ts                    # Astro content collections schema
├── cases/                       # Case studies (MDX)
│   ├── audience-framework.mdx
│   ├── benchmark-system.mdx
│   └── narrative-tracking.mdx
└── pages/                       # Páginas estáticas (MD)
    ├── home.en.md
    ├── home.es.md
    ├── resume.en.md
    └── resume.es.md

src/data/                        # Data estructurada (JSON)
├── site.json                    # Metadata global
├── proof.json                   # Proof strip items
├── skills.json                  # Capabilities + evidence
├── experience.json              # Timeline
├── education.json
└── languages.json
```

### 6.2 Schema: Case Study (frontmatter obligatorio)

```typescript
// src/content/config.ts

import { z, defineCollection } from 'astro:content'

const casesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // === IDENTIFICACIÓN ===
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['en', 'es']),

    // === CONTEXTO ===
    role: z.string(),                    // "Lead", "Designer", "Strategist"
    org: z.string(),                     // "ECF", "Fidelizador"
    regions: z.array(z.string()),        // ["LATAM", "US/Canada"]
    timeframe: z.string(),               // "2021-2023"

    // === CONTENIDO CORE ===
    problem: z.string(),                 // 3-5 líneas
    approach: z.array(z.string()),       // Bullets
    systemDesign: z.array(z.string()),   // Bullets + diagrama ref
    dataSources: z.array(z.string()),    // Brandwatch, BigQuery, etc.
    outputs: z.array(z.string()),        // Dashboards, memos, scorecards

    // === IMPACTO (CRÍTICO) ===
    decisionImpact: z.array(z.string()).min(3),  // MÍNIMO 3 bullets
    adoption: z.string(),                         // Quién lo usó, cadencia
    governance: z.string(),                       // Stakeholders, partners

    // === METADATA ===
    tools: z.array(z.string()),
    confidentialityNote: z.string().optional(),
    featured: z.boolean().default(false),

    // === ARTIFACTS ===
    artifacts: z.array(z.object({
      type: z.enum(['diagram', 'scorecard', 'screenshot', 'template']),
      src: z.string(),
      alt: z.string()
    })).optional()
  })
})

export const collections = {
  cases: casesCollection
}
```

### 6.3 Schema: Proof Strip (JSON)

```typescript
// src/data/proof.json

interface ProofItem {
  id: string
  title: {
    en: string
    es: string
  }
  detail: {
    en: string
    es: string
  }
  href: string          // Link a caso o sección
  icon?: string         // Nombre de icono (opcional)
}

// Ejemplo:
{
  "items": [
    {
      "id": "frameworks",
      "title": {
        "en": "3 impact frameworks built",
        "es": "3 frameworks de impacto creados"
      },
      "detail": {
        "en": "Standardized measurement across regions",
        "es": "Medición estandarizada entre regiones"
      },
      "href": "/en/case-studies/audience-framework"
    }
  ]
}
```

### 6.4 Schema: Skills/Capabilities (JSON)

```typescript
// src/data/skills.json

interface Capability {
  id: string
  name: {
    en: string
    es: string
  }
  tools: string[]           // 4-6 herramientas
  evidence: {
    en: string
    es: string
  }
  caseLink: string          // Link al caso que lo demuestra
}

// Máximo 6 capabilities
```

### 6.5 Schema: Experience Timeline (JSON)

```typescript
// src/data/experience.json

interface Role {
  id: string
  org: string
  title: {
    en: string
    es: string
  }
  period: string            // "2021 - Present"
  location: string
  bullets: {
    en: string[]            // Máximo 3 bullets
    es: string[]
  }
  tags: string[]            // Regions, stakeholders, outcomes
}
```

### 6.6 Reglas editoriales

| Regla | Descripción |
|-------|-------------|
| **Bullets outcomes-first** | Cada bullet responde "¿qué cambió?" |
| **Prohibido** | "Responsible for...", "Helped with...", "Assisted..." |
| **Obligatorio** | Verbo + sistema/acción + outcome |
| **Proof Strip** | Máximo 5 cards |
| **Capabilities** | Máximo 6 bloques |
| **Experience bullets** | Máximo 3 por rol |
| **Decision impact** | Mínimo 3 bullets por case (obligatorio) |

---

## 7. Estructura del Repositorio

```
project_a/
│
├── README.md                           # Documentación del proyecto
├── SPEC.md                             # Este documento
├── FULL_GUIDE.txt                      # Guía original
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── astro.config.mjs
├── tailwind.config.mjs
│
├── src/
│   │
│   ├── pages/
│   │   ├── index.astro                 # Redirect a /en/
│   │   └── [lang]/
│   │       ├── index.astro             # Home Cinematic
│   │       ├── resume.astro            # Recruiter Mode
│   │       └── case-studies/
│   │           ├── index.astro         # Case Index
│   │           └── [...slug].astro     # Case Detail (catch-all)
│   │
│   ├── layouts/
│   │   ├── Base.astro                  # HTML shell + head + scripts
│   │   ├── Page.astro                  # Header + Footer + View Transitions
│   │   ├── Case.astro                  # Layout específico para cases
│   │   └── Resume.astro                # Layout minimal ATS
│   │
│   ├── components/
│   │   │
│   │   ├── core/                       # Componentes reutilizables
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Nav.astro
│   │   │   ├── LangSwitch.astro
│   │   │   ├── SEO.astro
│   │   │   ├── Button.astro
│   │   │   ├── Chip.astro
│   │   │   └── Icon.astro
│   │   │
│   │   ├── home/                       # Componentes Home
│   │   │   ├── Hero.astro
│   │   │   ├── ProofStrip.astro
│   │   │   ├── HiredFor.astro
│   │   │   ├── ChapterDeck.astro       # GSAP island (client:visible)
│   │   │   ├── OperatingModel.astro
│   │   │   ├── Capabilities.astro
│   │   │   ├── Timeline.astro
│   │   │   ├── Education.astro
│   │   │   ├── Languages.astro
│   │   │   └── Contact.astro
│   │   │
│   │   ├── cases/                      # Componentes Case Studies
│   │   │   ├── CaseCard.astro
│   │   │   ├── CaseFilters.astro
│   │   │   ├── CaseHeader.astro
│   │   │   ├── CaseSection.astro
│   │   │   ├── Artifacts.astro
│   │   │   └── CaseNav.astro
│   │   │
│   │   └── resume/                     # Componentes Resume
│   │       ├── ResumeHeader.astro
│   │       ├── ResumeSection.astro
│   │       └── DownloadPDF.astro
│   │
│   ├── content/
│   │   ├── config.ts                   # Content collections schema
│   │   ├── cases/
│   │   │   ├── audience-framework.mdx
│   │   │   ├── benchmark-system.mdx
│   │   │   └── narrative-tracking.mdx
│   │   └── pages/
│   │       ├── home.en.md
│   │       ├── home.es.md
│   │       ├── resume.en.md
│   │       └── resume.es.md
│   │
│   ├── data/
│   │   ├── site.json                   # Metadata global
│   │   ├── proof.json                  # Proof strip items
│   │   ├── skills.json                 # Capabilities
│   │   ├── experience.json             # Timeline
│   │   ├── education.json
│   │   └── languages.json
│   │
│   ├── i18n/
│   │   ├── index.ts                    # Helpers (t function, getLang, etc.)
│   │   ├── en.json                     # UI strings EN
│   │   └── es.json                     # UI strings ES
│   │
│   ├── lib/
│   │   ├── content.ts                  # Helpers para content collections
│   │   ├── seo.ts                      # Schema.org, OG helpers
│   │   └── motion.ts                   # GSAP utilities, reduced-motion
│   │
│   ├── styles/
│   │   ├── global.css                  # Reset, base styles
│   │   └── tokens.css                  # CSS custom properties
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── diagrams/                   # SVGs para Operating Model, etc.
│
├── public/
│   ├── pdf/
│   │   ├── angela-parra-resume-en.pdf
│   │   └── angela-parra-resume-es.pdf
│   ├── og/                             # Open Graph images
│   │   ├── home.png
│   │   ├── resume.png
│   │   └── cases/
│   └── fonts/                          # Web fonts (si aplica)
│
├── scripts/
│   ├── validate-content.ts             # Validación CI
│   └── generate-pdf.ts                 # Regenerar PDFs desde contenido
│
├── docker/
│   ├── Dockerfile
│   └── Caddyfile
│
└── .github/
    └── workflows/
        ├── ci.yml                      # Build + validate
        └── deploy.yml                  # Deploy a producción
```

---

## 8. Especificación de Componentes

### 8.1 Core Components

#### Header.astro

```typescript
interface Props {
  lang: 'en' | 'es'
  currentPath: string
}

// Comportamiento:
// - Logo (link a /{lang}/)
// - Nav items con estado activo
// - LangSwitch
// - CTA "Resume" (variante outline)
// - Sticky on scroll (opcional, evaluar performance)
```

#### LangSwitch.astro

```typescript
interface Props {
  currentLang: 'en' | 'es'
  currentPath: string       // Para construir URL equivalente
}

// Comportamiento:
// - Toggle visual EN | ES
// - Mantiene la ruta actual al cambiar idioma
// - Preserva hash/query si existe
```

#### Button.astro

```typescript
interface Props {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  href?: string             // Si existe, renderiza <a>
  type?: 'button' | 'submit'
  disabled?: boolean
  fullWidth?: boolean
}

// Slots: default (contenido del botón)
```

#### Chip.astro

```typescript
interface Props {
  variant: 'default' | 'accent' | 'muted'
  size: 'sm' | 'md'
}

// Slots: default (texto)
// Uso: tags, categorías, metadata
```

#### SEO.astro

```typescript
interface Props {
  title: string
  description: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  canonicalUrl?: string
  lang: 'en' | 'es'
  alternateUrls?: { lang: string; url: string }[]
  schema?: object           // JSON-LD schema
}

// Renderiza:
// - <title>
// - <meta name="description">
// - Open Graph tags
// - Twitter Card tags
// - hreflang links
// - canonical
// - JSON-LD script
```

---

### 8.2 Home Components

#### Hero.astro

```typescript
interface Props {
  headline: string
  subheadline: string
  chips: string[]                                    // Máx 5
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  socialLinks: Array<{
    type: 'linkedin' | 'email'
    href: string
    label: string
  }>
}

// Comportamiento:
// - Full viewport height (100vh o 100svh)
// - Animación de entrada (text reveal + chips stagger)
// - Background effect sutil (CSS, no canvas)
// - CTAs prominentes
// - Social links discretos

// Animación:
// - Headline: fade + slide up (400ms, ease-out)
// - Subheadline: fade + slide up (400ms, delay 100ms)
// - Chips: stagger reveal (80ms por chip)
// - CTAs: fade in (300ms, delay 400ms)

// Reduced motion:
// - Todo visible inmediatamente, sin animación
```

#### ProofStrip.astro

```typescript
interface Props {
  items: Array<{
    title: string
    detail: string
    href: string
    icon?: string
  }>                        // Máx 5 items
}

// Comportamiento:
// - Grid responsive (5 cols desktop, 2-3 tablet, 1 mobile)
// - Cada card es clickeable (link a evidencia)
// - Hover: elevación sutil + highlight
// - Focus visible para a11y

// Animación:
// - Fade in cuando entra en viewport (IntersectionObserver)
// - Stagger entre cards (50ms)

// Validación (en build):
// - Error si items.length > 5
// - Error si algún href está vacío
```

#### HiredFor.astro

```typescript
interface Props {
  title: string             // "What I'm hired for"
  bullets: Array<{
    text: string
    href: string            // Link al caso relevante
  }>                        // Exactamente 3 bullets
}

// Comportamiento:
// - Sección destacada visualmente
// - Cada bullet es un link
// - Numeración visual (01, 02, 03)

// Animación:
// - Stagger reveal al entrar en viewport
```

#### ChapterDeck.astro

```typescript
interface Props {
  chapters: Array<{
    id: string
    title: string
    subtitle: string
    keyPoints: string[]
    href: string            // Link a case detail
    theme: 'impact' | 'benchmark' | 'narrative' | 'audience'
  }>
  enablePinned?: boolean    // Default: true (false si reduced-motion)
}

// Comportamiento (con GSAP):
// - Sección "pinned" durante scroll
// - Cada chapter se revela al hacer scroll
// - Click en chapter abre case detail
// - Progress indicator visual

// Comportamiento (reduced-motion):
// - Accordion normal, sin pinned
// - Click para expandir/colapsar
// - Sin animaciones de scroll

// Implementación:
// - client:visible para cargar GSAP solo cuando es necesario
// - Detectar prefers-reduced-motion en JS
// - Fallback graceful si GSAP falla

// Performance:
// - Solo 1 sección pinned en todo el sitio
// - Usar transform/opacity, nunca width/height
// - RequestAnimationFrame para sincronizar
```

#### OperatingModel.astro

```typescript
interface Props {
  nodes: Array<{
    id: string
    label: string
    description?: string
  }>
  edges: Array<{
    from: string
    to: string
  }>
  metadata: {
    cadence: string         // "Weekly / Monthly"
    consumers: string       // "Regional teams, partners"
    governance: string      // "QA owners, stakeholders"
  }
}

// Comportamiento:
// - Diagrama SVG (no canvas)
// - Flujo: Inputs → Processing → Outputs → Decisions → Learning loop
// - Tooltip en hover/focus de cada nodo

// Animación (opcional):
// - Line-draw effect al entrar en viewport
// - Solo si no reduced-motion

// Accesibilidad:
// - SVG con role="img" y aria-label
// - Texto alternativo completo
// - Navegable por teclado (nodos focuseables)
```

#### Capabilities.astro

```typescript
interface Props {
  title: string
  capabilities: Array<{
    name: string
    tools: string[]         // 4-6 herramientas
    evidence: string        // "Used in: Audience Framework"
    caseLink: string
  }>                        // Máx 6 capabilities
}

// Comportamiento:
// - Grid 2x3 (desktop) o stack (mobile)
// - Cada capability card muestra:
//   - Nombre
//   - Tools (chips pequeños)
//   - Evidence text
//   - Link a caso

// Validación:
// - Error en build si > 6 capabilities
// - Warning si alguna no tiene caseLink
```

#### Timeline.astro

```typescript
interface Props {
  title: string
  roles: Array<{
    org: string
    title: string
    period: string
    location: string
    bullets: string[]       // Máx 3
    tags: string[]
  }>
}

// Comportamiento:
// - Timeline vertical
// - Línea conectora visual
// - Expandible en mobile (accordion)

// Animación:
// - Reveal secuencial al scroll
```

#### Education.astro

```typescript
interface Props {
  title: string
  items: Array<{
    degree: string
    institution: string
    year: string
    status?: 'completed' | 'in-progress'
  }>
}

// Comportamiento:
// - Cards minimalistas
// - Badge "In Progress" si aplica
```

#### Languages.astro

```typescript
interface Props {
  title: string
  languages: Array<{
    name: string
    level: string           // "Native", "Fluent", "Professional"
    usedFor: string         // "Campaigns, reporting, stakeholder comms"
  }>
}

// Comportamiento:
// - No solo flags/niveles
// - Mostrar "para qué se usa cada idioma"
// - Conexión visual con el LangSwitch del sitio
```

#### Contact.astro

```typescript
interface Props {
  title: string
  subtitle?: string
  email: string
  linkedIn: string
  pdfUrl: string
  calendlyUrl?: string      // Opcional
}

// Comportamiento:
// - CTA prominente
// - Email con copy-to-clipboard
// - LinkedIn abre en nueva pestaña
// - PDF descarga directa
// - Calendly solo si se proporciona
```

---

### 8.3 Case Study Components

#### CaseCard.astro

```typescript
interface Props {
  title: string
  slug: string
  lang: 'en' | 'es'
  org: string
  regions: string[]
  outcomeTeaser: string     // 1 línea de resultado
  theme: string
  featured?: boolean
}

// Comportamiento:
// - Link completo clickeable
// - Hover: elevación + preview expandido
// - Badge "Featured" si aplica
// - Tags de región/tema
```

#### CaseFilters.astro

```typescript
interface Props {
  themes: string[]
  regions: string[]
  tools: string[]
  activeFilters: {
    theme?: string
    region?: string
    tool?: string
  }
}

// Comportamiento:
// - Filtros como pills/chips clickeables
// - Multi-select dentro de categoría
// - Clear all button
// - URL query params para deep-linking (nice-to-have)

// Estado vacío:
// - Mensaje amigable si no hay resultados
```

#### CaseHeader.astro

```typescript
interface Props {
  title: string
  org: string
  role: string
  regions: string[]
  timeframe: string
  tools: string[]
}

// Comportamiento:
// - Header hero del case
// - Metadata visible inmediatamente
// - Breadcrumb: Case Studies > [Title]
```

#### CaseSection.astro

```typescript
interface Props {
  title: string
  variant: 'default' | 'highlight' | 'artifact'
}

// Slots:
// - default: contenido de la sección

// Comportamiento:
// - Componente genérico para secciones del case
// - Variantes visuales según importancia
```

#### Artifacts.astro

```typescript
interface Props {
  items: Array<{
    type: 'diagram' | 'scorecard' | 'screenshot' | 'template'
    src: string
    alt: string
    caption?: string
  }>
}

// Comportamiento:
// - Gallery con thumbnails
// - Click abre lightbox (modal)
// - Lazy load images
// - Accesible (trap focus en modal, Escape para cerrar)
```

#### CaseNav.astro

```typescript
interface Props {
  prevCase?: { title: string; slug: string }
  nextCase?: { title: string; slug: string }
  indexUrl: string
}

// Comportamiento:
// - Navegación prev/next
// - Back to index
// - Sticky en bottom (opcional)
```

---

### 8.4 Resume Components

#### ResumeHeader.astro

```typescript
interface Props {
  name: string
  title: string
  location: string
  email: string
  linkedIn: string
  remoteNote?: string       // "EU timezone overlap"
}

// Comportamiento:
// - Header compacto, profesional
// - Links funcionales
// - Sin animaciones
```

#### ResumeSection.astro

```typescript
interface Props {
  title: string
  variant: 'summary' | 'experience' | 'education' | 'skills' | 'languages'
}

// Slots: default

// Comportamiento:
// - Secciones claramente separadas
// - Tipografía optimizada para escaneo
```

#### DownloadPDF.astro

```typescript
interface Props {
  url: string
  label: string
  version?: string          // "v1.2 - Jan 2026"
}

// Comportamiento:
// - Botón prominente
// - Descarga directa (no nueva pestaña)
// - Mostrar versión si existe
```

---

## 9. Sistema de Diseño

### 9.1 Tokens de Color

```css
/* src/styles/tokens.css */

:root {
  /* === BRAND === */
  --color-primary: #1a1a2e;         /* Navy profundo */
  --color-primary-light: #2d2d44;
  --color-accent: #4a90a4;          /* Teal profesional */
  --color-accent-light: #6ab0c4;

  /* === NEUTRALS === */
  --color-bg: #fafafa;
  --color-bg-alt: #f0f0f0;
  --color-surface: #ffffff;
  --color-border: #e0e0e0;
  --color-border-strong: #c0c0c0;

  /* === TEXT === */
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
  --color-text-inverse: #ffffff;

  /* === SEMANTIC === */
  --color-success: #2d8a6e;
  --color-warning: #c4841d;
  --color-error: #c43d3d;

  /* === SHADOWS === */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
}

/* Dark mode (si se implementa en futuro) */
@media (prefers-color-scheme: dark) {
  :root {
    /* ... override tokens ... */
  }
}
```

### 9.2 Tipografía

```css
:root {
  /* === FONT FAMILIES === */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Inter', system-ui, sans-serif;  /* Mismo, pero variable weight */

  /* === FONT SIZES (rem, mobile-first) === */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */

  /* === LINE HEIGHTS === */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* === FONT WEIGHTS === */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 9.3 Espaciado

```css
:root {
  /* === SPACING SCALE (rem) === */
  --space-0: 0;
  --space-1: 0.25rem;      /* 4px */
  --space-2: 0.5rem;       /* 8px */
  --space-3: 0.75rem;      /* 12px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-8: 2rem;         /* 32px */
  --space-10: 2.5rem;      /* 40px */
  --space-12: 3rem;        /* 48px */
  --space-16: 4rem;        /* 64px */
  --space-20: 5rem;        /* 80px */
  --space-24: 6rem;        /* 96px */
  --space-32: 8rem;        /* 128px */

  /* === SECTION SPACING === */
  --section-gap: var(--space-24);           /* Entre secciones */
  --section-gap-mobile: var(--space-16);

  /* === CONTAINER === */
  --container-max: 1200px;
  --container-padding: var(--space-6);
  --container-padding-mobile: var(--space-4);
}
```

### 9.4 Radii y Bordes

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-full: 9999px;

  --border-width: 1px;
  --border-width-2: 2px;
}
```

### 9.5 Breakpoints

```css
/* Tailwind defaults, para referencia */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### 9.6 Transiciones

```css
:root {
  /* === DURATIONS === */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;

  /* === EASINGS === */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.2, 0.8, 0.2, 1.2);

  /* === PRESETS === */
  --transition-colors: color var(--duration-fast) var(--ease-out),
                       background-color var(--duration-fast) var(--ease-out),
                       border-color var(--duration-fast) var(--ease-out);
  --transition-transform: transform var(--duration-normal) var(--ease-out);
  --transition-opacity: opacity var(--duration-normal) var(--ease-out);
  --transition-shadow: box-shadow var(--duration-normal) var(--ease-out);
}
```

---

## 10. Motion Spec (Tier B)

### 10.1 Principios de animación

1. **Purpose over decoration**: Cada animación debe tener un propósito (guiar atención, dar feedback, crear continuidad)
2. **Performance first**: Solo animar `transform` y `opacity`, nunca propiedades de layout
3. **Respect user preference**: `prefers-reduced-motion` siempre respetado
4. **One hero moment**: Solo 1 sección "pinned" en todo el sitio

### 10.2 Catálogo de animaciones

| Elemento | Tipo | Duración | Easing | Trigger | Reduced-motion |
|----------|------|----------|--------|---------|----------------|
| Hero headline | Fade + slide up | 400ms | ease-out | Page load | Instant visible |
| Hero subheadline | Fade + slide up | 400ms | ease-out | Page load + 100ms | Instant visible |
| Hero chips | Stagger reveal | 80ms/chip | ease-out | Page load + 200ms | Instant visible |
| Hero CTAs | Fade in | 300ms | ease-out | Page load + 400ms | Instant visible |
| Proof cards | Fade in viewport | 300ms | ease | IntersectionObserver | Instant visible |
| HiredFor bullets | Stagger reveal | 100ms/bullet | ease-out | IntersectionObserver | Instant visible |
| **ChapterDeck** | **ScrollTrigger pin** | **Scroll-sync** | **linear** | **Scroll position** | **Accordion** |
| Operating diagram | Line draw (optional) | 600ms | ease-in-out | IntersectionObserver | Static visible |
| Page transition | View Transition | 280ms | ease-in-out | Navigation | Instant |

### 10.3 GSAP ScrollTrigger Config (ChapterDeck)

```javascript
// src/lib/motion.ts

export function initChapterDeck(container: HTMLElement) {
  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initAccordionFallback(container)
    return
  }

  const chapters = container.querySelectorAll('.chapter')
  const totalScroll = (chapters.length - 1) * window.innerHeight

  gsap.registerPlugin(ScrollTrigger)

  ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: `+=${totalScroll}`,
    pin: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress
      const activeIndex = Math.floor(progress * chapters.length)
      updateActiveChapter(chapters, activeIndex)
    }
  })
}

function initAccordionFallback(container: HTMLElement) {
  // Simple accordion sin GSAP
  const chapters = container.querySelectorAll('.chapter')
  chapters.forEach((chapter, index) => {
    const header = chapter.querySelector('.chapter-header')
    header?.addEventListener('click', () => {
      toggleChapter(chapters, index)
    })
  })
}
```

### 10.4 View Transitions Config

```javascript
// astro.config.mjs

export default defineConfig({
  experimental: {
    viewTransitions: true
  }
})
```

```astro
<!-- src/layouts/Page.astro -->
---
import { ViewTransitions } from 'astro:transitions'
---

<head>
  <ViewTransitions />
</head>
```

### 10.5 Reduced Motion Implementation

```css
/* src/styles/global.css */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```typescript
// src/lib/motion.ts

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function onMotionPreferenceChange(callback: (reduced: boolean) => void) {
  if (typeof window === 'undefined') return

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', (e) => callback(e.matches))
}
```

---

## 11. Internacionalización (i18n)

### 11.1 Estrategia

- **Idiomas iniciales**: EN (default), ES
- **Idiomas futuros**: PT, FR (cuando el contenido esté listo)
- **Routing**: Por prefijo de ruta (`/en/`, `/es/`)
- **Fallback**: Si un case no existe en ES → mostrar EN con banner

### 11.2 Estructura de archivos i18n

```
src/i18n/
├── index.ts          # Helpers
├── en.json           # UI strings EN
└── es.json           # UI strings ES
```

### 11.3 Fuente de verdad de locales

- **Fuente única**: `config/locales.mjs`
- **Uso obligatorio**: routing (`astro.config.mjs`), scripts (`scripts/*.ts`) y helpers i18n (`src/i18n/config.ts`)
- **Regla**: no se permiten listas de locales hardcodeadas fuera de `config/locales.mjs`

### 11.4 Checklist para agregar un nuevo idioma

1. Añadir el locale a `config/locales.mjs`.
2. Crear `src/i18n/{locale}.json` con todas las keys (paridad con EN).
3. Completar campos localizados en `src/data/*.json` (todas las claves por locale).
4. Verificar con `npm run validate` y `npm run check`.

### 11.5 UI Strings (ejemplo)

```json
// src/i18n/en.json
{
  "nav": {
    "systems": "Systems",
    "caseStudies": "Case Studies",
    "resume": "Resume",
    "contact": "Contact"
  },
  "hero": {
    "cta": {
      "viewSystems": "View Systems",
      "recruiterMode": "Recruiter Mode"
    }
  },
  "proofStrip": {
    "title": "Proven Impact"
  },
  "hiredFor": {
    "title": "What I'm hired for"
  },
  "capabilities": {
    "title": "Capabilities",
    "evidencePrefix": "Used in:"
  },
  "timeline": {
    "title": "Experience"
  },
  "education": {
    "title": "Education",
    "inProgress": "In Progress"
  },
  "languages": {
    "title": "Languages",
    "usedFor": "Used for:"
  },
  "contact": {
    "title": "Let's Connect",
    "email": "Email",
    "linkedin": "LinkedIn",
    "downloadPdf": "Download PDF"
  },
  "cases": {
    "index": {
      "title": "Case Studies",
      "filters": {
        "all": "All",
        "theme": "Theme",
        "region": "Region",
        "tools": "Tools"
      },
      "noResults": "No cases match the current filters."
    },
    "detail": {
      "problem": "The Challenge",
      "approach": "Approach",
      "systemDesign": "System Design",
      "dataSources": "Data Sources",
      "outputs": "Outputs",
      "decisionImpact": "Decision Impact",
      "adoption": "Adoption & Cadence",
      "governance": "Governance",
      "tools": "Tools Used",
      "artifacts": "Artifacts",
      "backToIndex": "← All Case Studies",
      "nextCase": "Next Case →",
      "prevCase": "← Previous Case"
    },
    "fallback": {
      "banner": "This case study is available in English.",
      "viewInEnglish": "View in English"
    }
  },
  "resume": {
    "title": "Resume",
    "summary": "Summary",
    "strengths": "Key Strengths",
    "experience": "Experience",
    "education": "Education",
    "skills": "Skills",
    "languages": "Languages",
    "awards": "Recognition",
    "topCases": "Featured Case Studies",
    "downloadPdf": "Download PDF Resume"
  },
  "footer": {
    "copyright": "© {year} Ángela Parra. All rights reserved.",
    "builtWith": "Built with Astro"
  },
  "a11y": {
    "skipToContent": "Skip to content",
    "menuToggle": "Toggle menu",
    "languageSwitch": "Switch language",
    "closeModal": "Close",
    "externalLink": "Opens in new tab"
  }
}
```

### 11.4 Helper Functions

```typescript
// src/i18n/index.ts

import en from './en.json'
import es from './es.json'

const translations = { en, es }

export type Lang = keyof typeof translations
export const defaultLang: Lang = 'en'
export const supportedLangs: Lang[] = ['en', 'es']

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/')
  if (supportedLangs.includes(lang as Lang)) {
    return lang as Lang
  }
  return defaultLang
}

export function t(lang: Lang, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  return value ?? key
}

export function getLocalizedPath(path: string, lang: Lang): string {
  // Remove existing lang prefix if present
  const cleanPath = path.replace(/^\/(en|es)/, '')
  return `/${lang}${cleanPath || '/'}`
}

export function getAlternateUrls(currentPath: string): { lang: Lang; url: string }[] {
  return supportedLangs.map(lang => ({
    lang,
    url: getLocalizedPath(currentPath, lang)
  }))
}
```

### 11.5 Fallback para Cases

```astro
<!-- src/pages/[lang]/case-studies/[...slug].astro -->
---
import { getCollection } from 'astro:content'
import { getLangFromUrl, t } from '@/i18n'

const { slug } = Astro.params
const lang = getLangFromUrl(Astro.url)

// Intentar obtener case en idioma actual
let caseEntry = await getCollection('cases', ({ slug: s, data }) =>
  s === slug && data.lang === lang
)

let isFallback = false

// Si no existe, usar inglés como fallback
if (!caseEntry.length && lang !== 'en') {
  caseEntry = await getCollection('cases', ({ slug: s, data }) =>
    s === slug && data.lang === 'en'
  )
  isFallback = true
}

if (!caseEntry.length) {
  return Astro.redirect(`/${lang}/case-studies`)
}

const entry = caseEntry[0]
---

{isFallback && (
  <div class="fallback-banner">
    <p>{t(lang, 'cases.fallback.banner')}</p>
  </div>
)}

<!-- Rest of case detail -->
```

---

## 12. SEO y Metadatos

### 12.1 Meta tags por página

| Página | Title | Description |
|--------|-------|-------------|
| Home EN | "Ángela Parra — Digital Strategy & Impact Measurement" | "Building measurement systems and audience intelligence for international climate portfolios. 8+ years in strategic marketing and analytics." |
| Home ES | "Ángela Parra — Estrategia Digital y Medición de Impacto" | "Construyendo sistemas de medición e inteligencia de audiencias para portafolios climáticos internacionales. 8+ años en marketing estratégico y analítica." |
| Resume | "Resume — Ángela Parra" | "Senior strategist specializing in impact measurement, audience frameworks, and narrative intelligence systems." |
| Case Index | "Case Studies — Ángela Parra" | "Featured projects in impact assessment, audience intelligence, and strategic communications." |
| Case Detail | "[Case Title] — Ángela Parra" | "[Problem statement, truncated to 160 chars]" |

### 12.2 Open Graph

```html
<!-- Todas las páginas -->
<meta property="og:site_name" content="Ángela Parra">
<meta property="og:locale" content="en_US"> <!-- o es_ES -->
<meta property="og:type" content="website"> <!-- o article para cases -->

<!-- Home -->
<meta property="og:title" content="Ángela Parra — Digital Strategy & Impact Measurement">
<meta property="og:description" content="...">
<meta property="og:image" content="/og/home.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Cases -->
<meta property="og:type" content="article">
<meta property="og:image" content="/og/cases/{slug}.png">
```

### 12.3 Schema.org (JSON-LD)

```typescript
// Home page
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ángela Parra",
  "jobTitle": "Digital Strategy & Impact Measurement Specialist",
  "url": "https://angelaparra.com",
  "sameAs": [
    "https://linkedin.com/in/angelaparra"
  ],
  "knowsAbout": [
    "Impact Measurement",
    "Audience Intelligence",
    "Digital Strategy",
    "Climate Communications"
  ]
}

// Case study page
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": caseTitle,
  "author": {
    "@type": "Person",
    "name": "Ángela Parra"
  },
  "datePublished": "2024-01-01",
  "description": problemStatement
}
```

### 12.4 hreflang

```html
<link rel="alternate" hreflang="en" href="https://angelaparra.com/en/">
<link rel="alternate" hreflang="es" href="https://angelaparra.com/es/">
<link rel="alternate" hreflang="x-default" href="https://angelaparra.com/en/">
```

### 12.5 Canonical URLs

```html
<!-- Siempre apuntar a la URL canónica sin trailing slash -->
<link rel="canonical" href="https://angelaparra.com/en/case-studies/audience-framework">
```

---

## 13. Performance y Accesibilidad

### 13.1 Performance Budgets

| Métrica | Target Desktop | Target Mobile |
|---------|---------------|---------------|
| **LCP** | < 2.0s | < 2.5s |
| **FID** | < 100ms | < 100ms |
| **CLS** | < 0.1 | < 0.1 |
| **Total JS** | < 100KB gzip | < 100KB gzip |
| **Total CSS** | < 30KB gzip | < 30KB gzip |
| **Lighthouse Performance** | > 90 | > 75 |

### 13.2 Estrategia de carga

```
1. Critical CSS inline en <head>
2. Fonts: preload + font-display: swap
3. GSAP: client:visible (solo se carga cuando ChapterDeck entra en viewport)
4. Images:
   - Hero: preload, AVIF/WebP con fallback
   - Demás: lazy loading nativo
   - Tamaños explícitos para evitar CLS
5. View Transitions: progresivo (funciona sin JS)
```

### 13.3 Optimización de imágenes

```astro
<!-- Usando Astro Image -->
---
import { Image } from 'astro:assets'
import heroImage from '@/assets/images/hero.jpg'
---

<Image
  src={heroImage}
  alt="..."
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 1200px"
  format="avif"
  loading="eager"  <!-- Solo para hero -->
/>
```

### 13.4 Accessibility Checklist

| Criterio | Implementación |
|----------|----------------|
| **Navegación por teclado** | Todos los elementos interactivos focuseables |
| **Focus visible** | Outline claro, no solo `:focus` sino `:focus-visible` |
| **Skip to content** | Link oculto al inicio |
| **Color contrast** | Mínimo 4.5:1 para texto normal, 3:1 para texto grande |
| **Alt text** | Todas las imágenes con alt descriptivo |
| **ARIA labels** | Iconos sin texto, regiones landmarks |
| **Reduced motion** | Respetado en todas las animaciones |
| **Screen reader** | Estructura semántica, headings jerárquicos |
| **Zoom** | Funcional hasta 200% sin pérdida de contenido |

### 13.5 Lighthouse Targets

| Categoría | Target |
|-----------|--------|
| Performance | > 90 (desktop), > 75 (mobile) |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 95 |

---

## 14. Validación de Contenido

### 14.1 Script de validación

```typescript
// scripts/validate-content.ts

import { getCollection } from 'astro:content'
import proof from '../src/data/proof.json'
import skills from '../src/data/skills.json'

interface ValidationError {
  type: 'error' | 'warning'
  location: string
  message: string
}

const errors: ValidationError[] = []

async function validate() {
  // === PROOF STRIP ===
  if (proof.items.length > 5) {
    errors.push({
      type: 'error',
      location: 'data/proof.json',
      message: `Proof strip has ${proof.items.length} items, max is 5`
    })
  }

  proof.items.forEach((item, i) => {
    if (!item.href) {
      errors.push({
        type: 'error',
        location: `data/proof.json[${i}]`,
        message: `Proof item "${item.title.en}" missing href`
      })
    }
  })

  // === CAPABILITIES ===
  if (skills.capabilities.length > 6) {
    errors.push({
      type: 'error',
      location: 'data/skills.json',
      message: `Capabilities has ${skills.capabilities.length} items, max is 6`
    })
  }

  skills.capabilities.forEach((cap, i) => {
    if (!cap.caseLink) {
      errors.push({
        type: 'warning',
        location: `data/skills.json.capabilities[${i}]`,
        message: `Capability "${cap.name.en}" missing caseLink`
      })
    }
  })

  // === CASE STUDIES ===
  const cases = await getCollection('cases')

  cases.forEach((caseEntry) => {
    const { data, slug } = caseEntry

    // Decision impact mínimo 3
    if (data.decisionImpact.length < 3) {
      errors.push({
        type: 'error',
        location: `content/cases/${slug}`,
        message: `Case has ${data.decisionImpact.length} decision impacts, min is 3`
      })
    }

    // Required fields
    const requiredFields = ['problem', 'approach', 'adoption', 'governance']
    requiredFields.forEach(field => {
      if (!data[field] || data[field].length === 0) {
        errors.push({
          type: 'error',
          location: `content/cases/${slug}`,
          message: `Case missing required field: ${field}`
        })
      }
    })
  })

  // === REPORT ===
  const errorCount = errors.filter(e => e.type === 'error').length
  const warningCount = errors.filter(e => e.type === 'warning').length

  console.log('\n📋 Content Validation Report\n')

  errors.forEach(e => {
    const icon = e.type === 'error' ? '❌' : '⚠️'
    console.log(`${icon} [${e.location}] ${e.message}`)
  })

  console.log(`\n${errorCount} errors, ${warningCount} warnings\n`)

  if (errorCount > 0) {
    process.exit(1)
  }
}

validate()
```

### 14.2 Reglas de validación

| Regla | Tipo | Descripción |
|-------|------|-------------|
| `proof.maxItems` | Error | Proof strip máximo 5 items |
| `proof.requiredHref` | Error | Cada proof item debe tener href |
| `skills.maxCapabilities` | Error | Capabilities máximo 6 bloques |
| `skills.caseLink` | Warning | Cada capability debería tener caseLink |
| `case.decisionImpactMin` | Error | Cada case debe tener mínimo 3 decision impacts |
| `case.requiredFields` | Error | problem, approach, adoption, governance obligatorios |
| `experience.maxBullets` | Warning | Cada rol máximo 3 bullets |
| `i18n.missingKeys` | Warning | Keys de traducción faltantes |

### 14.3 CI Integration

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Validate content
        run: npm run validate

      - name: Build
        run: npm run build

      - name: Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
```

---

## 15. Plan de Ejecución (Sprints)

### 15.1 Resumen de Sprints

| Sprint | Duración | Objetivo |
|--------|----------|----------|
| **Sprint 0** | 1 día | Setup + CI + Validación |
| **Sprint 1** | 2 días | Content Engine + Skeletons |
| **Sprint 2** | 3 días | Componentes Home |
| **Sprint 3** | 3 días | Case Studies + Resume |
| **Sprint 4** | 3 días | Motion Tier B |
| **Sprint 5** | 3 días | Polish + Deploy |

**Total estimado**: ~15 días de desarrollo

---

### 15.2 Sprint 0 — Setup + Validación (Día 1)

**Objetivo**: Repo funcional con CI, sin contenido real

| ID | Ticket | Descripción | Criterio de aceptación |
|----|--------|-------------|------------------------|
| S0-01 | Init proyecto | Astro 5 + TypeScript + Tailwind | `npm run dev` funciona |
| S0-02 | i18n routing | Configurar rutas `/en/`, `/es/` | Ambas rutas renderizan |
| S0-03 | Design tokens | CSS custom properties | Variables disponibles |
| S0-04 | Base.astro | HTML shell + head | Layout base funciona |
| S0-05 | Page.astro | Header + Footer skeleton | Navegación visible |
| S0-06 | validate-content.ts | Script de validación básico | Script ejecuta sin error |
| S0-07 | CI pipeline | GitHub Actions build + validate | CI pasa en PR |

**DoD Sprint 0**:
- [x] `npm run dev` funciona
- [x] `/en/` y `/es/` renderizan página con header/footer
- [x] CI pipeline pasa

---

### 15.3 Sprint 1 — Content Engine + Skeletons (Días 2-3)

**Objetivo**: Estructura de contenido lista, páginas con placeholder

| ID | Ticket | Descripción | Criterio de aceptación |
|----|--------|-------------|------------------------|
| S1-01 | Content collections | config.ts con schemas | Collections tipadas |
| S1-02 | Data schemas | JSON files con estructura | Archivos creados |
| S1-03 | Home skeleton | Todas las secciones placeholder | Scroll completo |
| S1-04 | Resume skeleton | Layout ATS | Secciones visibles |
| S1-05 | Case index skeleton | Grid de cards placeholder | Lista renderiza |
| S1-06 | Case detail skeleton | Layout de secciones | Template funciona |
| S1-07 | LangSwitch | Toggle EN/ES funcional | Cambia idioma |
| S1-08 | SEO component | Title, desc, OG básico | Meta tags presentes |

**DoD Sprint 1**:
- [x] Navegación completa funciona
- [x] Contenido placeholder visible en todas las páginas
- [x] Cambio de idioma funciona
- [x] `validate-content` detecta campos faltantes

---

### 15.4 Sprint 2 — Componentes Home (Días 4-6)

**Objetivo**: Home visualmente completa, sin motion pesada

| ID | Ticket | Descripción | Criterio de aceptación |
|----|--------|-------------|------------------------|
| S2-01 | Hero.astro | Headline, chips, CTAs | Renderiza con data |
| S2-02 | ProofStrip.astro | 5 cards con links | Links funcionan |
| S2-03 | HiredFor.astro | 3 bullets | Links a cases |
| S2-04 | ChapterDeck.astro | Cards sin GSAP aún | Click abre case |
| S2-05 | OperatingModel.astro | Diagrama SVG estático | Visible |
| S2-06 | Capabilities.astro | 6 bloques | Data-driven |
| S2-07 | Timeline.astro | 3 roles | Renderiza |
| S2-08 | Education + Languages | Cards | Renderiza |
| S2-09 | Contact.astro | CTAs | Links funcionan |

**DoD Sprint 2**:
- [x] Home se ve "terminada" visualmente
- [x] Todos los componentes renderizan data real
- [x] Responsive funciona (mobile/desktop)
- [x] Lighthouse Performance > 85

---

### 15.5 Sprint 3 — Case Studies + Resume (Días 7-9)

**Objetivo**: Casos completos, Resume ATS-ready

| ID | Ticket | Descripción | Criterio de aceptación |
|----|--------|-------------|------------------------|
| S3-01 | CaseCard.astro | Card con metadata | Click navega |
| S3-02 | CaseFilters.astro | Filtros tema/región | Filtra lista |
| S3-03 | CaseHeader.astro | Header del case | Metadata visible |
| S3-04 | CaseSection.astro | Sección genérica | Variantes funcionan |
| S3-05 | Artifacts.astro | Gallery simple | Imágenes cargan |
| S3-06 | CaseNav.astro | Prev/Next/Back | Navegación funciona |
| S3-07 | 3 cases MDX | Contenido completo EN | Renderiza |
| S3-08 | Resume components | Header + Section + Bullets | Layout completo |
| S3-09 | DownloadPDF.astro | Botón descarga | PDF descarga |
| S3-10 | Resume content | EN + ES | Ambos idiomas |

**DoD Sprint 3**:
- [x] 3 cases navegables con estructura completa
- [x] Resume escaneable en 45s
- [x] PDF descargable funciona
- [x] Fallback i18n funciona ("Available in English")

---

### 15.6 Sprint 4 — Motion Tier B (Días 10-12)

**Objetivo**: El WOW controlado

| ID | Ticket | Descripción | Criterio de aceptación |
|----|--------|-------------|------------------------|
| S4-01 | Hero animation | Text reveal | Animación suave |
| S4-02 | ChapterDeck GSAP | Pinned section | Scroll smooth |
| S4-03 | View Transitions | Entre páginas | Transición fluida |
| S4-04 | Reduced motion | Fallback completo | Sin animaciones |
| S4-05 | OperatingModel animation | Line-draw (opcional) | Si tiempo permite |
| S4-06 | Performance audit | Fixes necesarios | Lighthouse > 80 mobile |

**DoD Sprint 4**:
- [x] 1 sección pinned funciona smooth
- [x] View transitions entre home/cases
- [x] `prefers-reduced-motion`: todo usable sin animación
- [x] FPS estable (no jank)
- [x] Lighthouse Performance > 80 mobile

---

### 15.7 Sprint 5 — Polish + Deploy (Días 13-15)

**Objetivo**: Producción

| ID | Ticket | Descripción | Criterio de aceptación |
|----|--------|-------------|------------------------|
| S5-01 | SEO completo | Schema, hreflang | Validadores pasan |
| S5-02 | OG images | Por página | Imágenes generadas |
| S5-03 | Image optimization | AVIF/WebP | Tamaño reducido |
| S5-04 | Contenido ES | Traducción completa | ES 100% |
| S5-05 | QA cross-browser | Safari iOS, Chrome Android | Sin bugs |
| S5-06 | Docker + Caddy | Config producción | Container funciona |
| S5-07 | Deploy | Producción | Sitio live |

**DoD Sprint 5**:
- [x] Lighthouse > 90 desktop, > 75 mobile
- [x] SEO > 95
- [x] Accessibility > 95
- [x] EN/ES 100% completos
- [x] Live en producción

---

## 16. Definition of Done por Página

### 16.1 Home (`/{lang}/`)

#### Contenido
- [ ] Headline y subheadline correctos
- [ ] Chips (máx 5) con info relevante
- [ ] Proof strip con links válidos (máx 5)
- [ ] 3 bullets "What I'm hired for" con links
- [ ] 3-4 chapters con teaser y link a case
- [ ] Operating model con diagrama
- [ ] Capabilities (máx 6) con evidencia
- [ ] Timeline con 3 roles
- [ ] Education cards
- [ ] Languages con "used for"
- [ ] Contact CTA funcional

#### Motion
- [ ] Hero reveal funciona
- [ ] 1 sección pinned (o fallback reduced-motion)
- [ ] No hay jank al scroll
- [ ] View transitions funcionan

#### A11y / Perf
- [ ] Navegación por teclado completa
- [ ] `prefers-reduced-motion` aplicado
- [ ] Focus visible en todos los interactivos
- [ ] LCP: hero visible sin bloquear por JS
- [ ] Lighthouse Performance > 80

---

### 16.2 Case Index (`/{lang}/case-studies`)

#### Contenido
- [ ] Cards con title, 1-liner, tags, outcome
- [ ] Featured cases primero
- [ ] Filtros (tema/región) operativos

#### UX
- [ ] Estado vacío si filtros no devuelven resultados
- [ ] Deep-link a filtros (nice-to-have)

#### Perf
- [ ] Sin animaciones pesadas
- [ ] Imágenes lazy-loaded

---

### 16.3 Case Detail (`/{lang}/case-studies/{slug}`)

#### Contenido obligatorio
- [ ] Problem (3-5 líneas)
- [ ] Approach (bullets)
- [ ] System design (bullets + diagrama)
- [ ] Outputs
- [ ] Decision impact (mín 3 bullets)
- [ ] Adoption & cadence
- [ ] Governance & stakeholders
- [ ] Tools
- [ ] Confidentiality note (si aplica)
- [ ] Artifacts (si existen)

#### UX
- [ ] Next/Prev case funciona
- [ ] Back to index funciona
- [ ] Fallback banner si idioma no disponible

#### Perf / A11y
- [ ] Imágenes optimizadas
- [ ] Gallery accesible

---

### 16.4 Resume (`/{lang}/resume`)

#### Contenido
- [ ] Summary 3-4 líneas
- [ ] Key strengths 5 bullets
- [ ] Experience con outcomes-first bullets
- [ ] Education
- [ ] Skills compactas
- [ ] Languages
- [ ] Awards
- [ ] Top 3 cases con links
- [ ] Download PDF funciona

#### UX
- [ ] Escaneable en 45 segundos
- [ ] Casi sin motion
- [ ] PDF se descarga (no abre nueva pestaña)

---

## 17. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **"Se ve bonito pero no dice nada"** | Media | Alto | Proof strip obligatorio + decision impact en cada case |
| **Animación jank en móvil** | Media | Alto | Tier B limitado, 1 pinned, performance budgets, reduced motion |
| **Confidencialidad de datos** | Alta | Alto | Artifacts anonimizados + confidentiality notes + revisión con Ángela |
| **Traducciones incompletas** | Media | Medio | EN + ES completos primero; PT/FR con fallback visible |
| **GSAP rompe accesibilidad** | Baja | Alto | Fallback a accordion sin JS, testing con screen reader |
| **Contenido pendiente bloquea desarrollo** | Alta | Alto | Placeholders claros internamente, validación que no bloquea UI |
| **Performance degradada por imágenes** | Media | Medio | AVIF/WebP, lazy load, tamaños explícitos |
| **SEO pobre por SPA behavior** | Baja | Medio | Astro SSG, contenido en HTML, no client-side rendering |

---

## 18. Datos Pendientes

### 18.1 Datos necesarios de Ángela (antes de Sprint 2)

| Dato | Impacto | Usado en | Fallback temporal |
|------|---------|----------|-------------------|
| **Headline definitivo** | Alto | Hero | Placeholder genérico |
| **5 proof points cuantitativos** | Alto | ProofStrip | Cualitativos genéricos |
| **Decision impact por case (3 bullets c/u)** | Crítico | Cases | No publicar case sin esto |
| **Artifacts publicables** | Medio | Cases | Sin gallery |
| **Foto profesional** | Bajo | About | Sin foto |
| **¿Calendly?** | Bajo | Contact | Solo email/LinkedIn |
| **Cadencia y adoption roles** | Alto | Cases, Operating Model | Genérico |
| **Métricas publicables (rangos ok)** | Alto | Proof, Cases | Cualitativos |

### 18.2 Cómo manejar datos faltantes

**En código (interno)**:
```json
{
  "decisionImpact": [
    "TODO: Pending from Ángela - specific decision 1",
    "TODO: Pending from Ángela - specific decision 2",
    "TODO: Pending from Ángela - specific decision 3"
  ],
  "_todo": true,
  "_todoNote": "Need exact cadence and adoption roles"
}
```

**En UI (público)**:
- Nunca mostrar "TODO"
- Usar lenguaje honesto pero fuerte si falta número exacto
- Ejemplo: "Multi-country methodology adopted across regional teams"

---

## 19. Checklist Pre-Launch

### 19.1 Contenido
- [ ] Todos los textos revisados por Ángela
- [ ] Sin placeholders visibles al público
- [ ] Todos los links funcionan
- [ ] PDFs actualizados y versionados
- [ ] OG images generadas

### 19.2 Técnico
- [ ] Build sin errores
- [ ] Validación de contenido pasa
- [ ] Lighthouse scores cumplen targets
- [ ] Cross-browser testing completo
- [ ] Reduced motion testing completo
- [ ] Screen reader testing básico

### 19.3 SEO
- [ ] Titles y descriptions únicos por página
- [ ] hreflang configurado
- [ ] Canonical URLs correctas
- [ ] Schema.org validado
- [ ] Sitemap generado
- [ ] robots.txt configurado

### 19.4 Deploy
- [ ] Domain configurado
- [ ] TLS/HTTPS funcionando
- [ ] Redirects configurados (www → non-www, http → https)
- [ ] 404 page personalizada
- [ ] Analytics (mínimo) configurado

---

## 20. Glosario

| Término | Definición |
|---------|------------|
| **ATS** | Applicant Tracking System. Software que usan recruiters para filtrar CVs. Resume mode debe ser compatible. |
| **ChapterDeck** | Componente principal de storytelling en home. Muestra los "sistemas" de Ángela como capítulos navegables. |
| **Content Collections** | Feature de Astro para tipar y validar contenido MDX/MD. |
| **Decision Impact** | Los 3+ bullets que explican qué decisiones reales se tomaron gracias al sistema/framework. Es el diferenciador senior. |
| **Fallback** | Cuando un contenido no existe en un idioma, mostrar la versión en inglés con un banner. |
| **GSAP** | GreenSock Animation Platform. Librería para animaciones avanzadas (ScrollTrigger para pinned sections). |
| **Island Architecture** | Patrón de Astro donde solo los componentes interactivos se hidratan con JS. El resto es HTML estático. |
| **LCP** | Largest Contentful Paint. Métrica de performance que mide cuándo el contenido principal es visible. |
| **Motion Tier B** | Nivel de animación "balanced cinematic": 1 pinned section, View Transitions, micro-animations. No Tier C (pesado). |
| **Pinned Section** | Sección que se "pega" mientras el usuario hace scroll y el contenido interno cambia. |
| **Proof Strip** | Las 5 cards de credibilidad inmediata debajo del hero. |
| **Recruiter Mode** | La página `/resume` optimizada para escaneo rápido (45-90s) y descarga de PDF. |
| **Reduced Motion** | Preferencia de usuario (`prefers-reduced-motion`) que desactiva animaciones. Debe respetarse siempre. |
| **ScrollTrigger** | Plugin de GSAP para sincronizar animaciones con scroll position. |
| **View Transitions** | API nativa del navegador (+ Astro) para transiciones fluidas entre páginas. |
| **WOW** | No es solo animación. Es: claridad + dirección de arte + ritmo + proof. |

---

## Apéndice A: Ejemplo de Case Study MDX

```mdx
---
title: "Audience Intelligence Framework"
slug: "audience-framework"
lang: "en"
role: "Lead Designer & Strategist"
org: "European Climate Foundation"
regions: ["LATAM", "US/Canada", "Europe"]
timeframe: "2021 - 2023"
problem: |
  Regional teams lacked a standardized way to understand and segment audiences
  across different climate narratives. Each team used different methodologies,
  making cross-regional learning impossible and strategic decisions inconsistent.
approach:
  - Conducted landscape analysis of existing audience research across 12 countries
  - Designed unified segmentation methodology integrating quantitative surveys and qualitative insights
  - Built indicator framework tracking awareness, attitudes, and behavioral intent
  - Created standardized reporting templates for regional teams
systemDesign:
  - Unified audience taxonomy (8 segments across regions)
  - Quarterly survey instrument (n=2000+ per region)
  - Dashboard integrating Brandwatch + survey data
  - Regional scorecards with comparable metrics
dataSources:
  - Brandwatch (social listening)
  - Custom surveys (Qualtrics)
  - Google Analytics
  - Partner reporting data
outputs:
  - Quarterly audience intelligence reports
  - Regional performance scorecards
  - Strategic recommendation memos
  - Training workshops for regional teams
decisionImpact:
  - Shifted messaging strategy in 3 regions based on segment migration data
  - Reallocated $2M+ in campaign budget toward high-potential segments
  - Informed partner selection criteria for 2023 grant cycle
adoption: |
  Used by 8 regional teams on monthly basis. Integrated into quarterly
  strategic planning sessions. Referenced in board reporting.
governance: |
  Owned by Strategy team. QA by Research Director.
  Consumed by Regional Directors, Partner Managers, and Board.
tools:
  - Brandwatch
  - Qualtrics
  - Google Data Studio
  - BigQuery
  - Notion
featured: true
artifacts:
  - type: diagram
    src: /assets/artifacts/audience-framework-diagram.svg
    alt: Audience Framework Architecture
  - type: scorecard
    src: /assets/artifacts/regional-scorecard-template.png
    alt: Regional Scorecard Template (anonymized)
---

## Additional Context

This framework became the foundation for ECF's audience strategy across all
climate narratives. The methodology was later adopted by partner organizations
and referenced in multi-country assessments.

### Key Innovation

The integration of social listening data with survey research allowed for
real-time validation of audience shifts, reducing the lag between market
changes and strategic response from quarters to weeks.
```

---

## Apéndice B: Copy Framework

### Frases permitidas (suenan senior)

```
✅ "Designed and implemented [system] used across [scope]"
✅ "Built a methodology integrating [x] + [y] indicators"
✅ "Operationalized [input] into decision loops"
✅ "Enabled [teams] through training + playbooks"
✅ "Standardized [process] achieving [outcome]"
✅ "Led the design of [framework] adopted by [users]"
✅ "Created [output] informing [decisions]"
```

### Frases prohibidas (suenan junior)

```
❌ "Helped with..."
❌ "Assisted in..."
❌ "Responsible for..."
❌ "Worked on..."
❌ "Participated in..."
❌ "Supported the team..."
❌ "Was involved in..."
```

### Estructura de bullet (outcomes-first)

```
[Verbo fuerte] + [sistema/acción] + [que resultó en] + [outcome medible]

Ejemplo:
"Designed audience segmentation framework adopted by 8 regional teams,
enabling $2M+ budget reallocation toward high-potential segments."
```

---

## Apéndice C: Comandos npm

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "validate": "tsx scripts/validate-content.ts",
    "generate-pdf": "tsx scripts/generate-pdf.ts",
    "lint": "eslint src --ext .ts,.astro",
    "format": "prettier --write .",
    "check": "astro check && tsc --noEmit"
  }
}
```

---

## Apéndice D: Variables de Entorno

```bash
# .env.example

# Site
PUBLIC_SITE_URL=https://angelaparra.com
PUBLIC_DEFAULT_LANG=en

# Analytics (opcional)
PUBLIC_ANALYTICS_ID=

# Build
NODE_ENV=production
```

---

*Documento generado: 2026-01-17*
*Próxima revisión: Después de Sprint 0*

## Apéndice E: Librería de Efectos y Referencias Visuales

Para detalles de implementación visual, herramientas de animación y referencias de diseño "cinemático", consultar el archivo dedicado:

> **📄 `effect_library.md`**

Este archivo contiene:
1. **Efectos Implementados**: Catálogo de animaciones actuales (View Transitions, ChapterDeck, Aurora Background, etc.) y su ubicación en el código.
2. **Catálogo de Tecnologías**: Referencias para Scroll-Driven Animations, WebGL ligero, micro-interacciones y más.
3. **Inspiración de Diseño**: Estrategias para lograr el look "premium" y "cinemático" (Motion Tiers, texturas, tipografía 2026).

**Uso:** Consultar este archivo antes de implementar nuevas animaciones o decidir sobre librerías visuales adicionales.
