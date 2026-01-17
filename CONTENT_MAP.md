# CONTENT MAP: CV → Sitio Web

> **Fuente:** CV_Angela.md
> **Destino:** Arquitectura definida en SPEC.md
> **Fecha:** 2026-01-17
> **Estado:** Mapeo completo, listo para implementación

---

## 1. Datos de Identidad

```yaml
name: "Angela Parra Sánchez"
title: "Data & Impact Assessment Specialist"
location: "Bogotá, Colombia"
remote: "EU/Global time overlap"
email: "angelae.parras@gmail.com"
linkedin: "https://www.linkedin.com/in/angela-parra-sánchez-89548165"
```

---

## 2. Hero Section

### Headline
```
EN: "Data & Impact Assessment Specialist"
ES: "Especialista en Datos y Evaluación de Impacto"
```

### Subheadline
```
EN: "Building measurement systems and audience intelligence for international climate and sustainability programmes"
ES: "Construyendo sistemas de medición e inteligencia de audiencias para programas internacionales de clima y sostenibilidad"
```

### Chips (máx 5)
```yaml
- "Bogotá · Remote EU"
- "8+ years M&E"
- "SDG 8 · 9 · 13"
- "LATAM · US/Canada"
- "Climate & Trade"
```

### CTAs
```yaml
primary:
  en: "View Systems"
  es: "Ver Sistemas"
  href: "#systems"

secondary:
  en: "Recruiter Mode"
  es: "Modo Recruiter"
  href: "/{lang}/resume"
```

---

## 3. Proof Strip (5 cards)

```yaml
proof_items:
  - id: "frameworks"
    title:
      en: "3 impact frameworks built"
      es: "3 frameworks de impacto creados"
    detail:
      en: "Audience, Benchmark, Narrative Tracking"
      es: "Audiencias, Benchmark, Seguimiento Narrativo"
    href: "#systems"

  - id: "regional"
    title:
      en: "Cross-regional scope"
      es: "Alcance multi-regional"
    detail:
      en: "LATAM, US/Canada, Europe"
      es: "LATAM, US/Canadá, Europa"
    href: "/case-studies/audience-framework"

  - id: "experience"
    title:
      en: "8+ years in M&E"
      es: "8+ años en M&E"
    detail:
      en: "Monitoring, evaluation, data analysis"
      es: "Monitoreo, evaluación, análisis de datos"
    href: "#timeline"

  - id: "recognition-2023"
    title:
      en: "Recognized at ECF"
      es: "Reconocida en ECF"
    detail:
      en: "Data frameworks for cross-regional M&E (2023)"
      es: "Frameworks de datos para M&E regional (2023)"
    href: "#awards"

  - id: "reference-2024"
    title:
      en: "Multi-country reference"
      es: "Referencia multi-país"
    detail:
      en: "Systems referenced in impact assessments (2024)"
      es: "Sistemas referenciados en evaluaciones (2024)"
    href: "#awards"
```

---

## 4. What I'm Hired For (3 bullets)

```yaml
hired_for:
  - id: "evidence-systems"
    text:
      en: "Build evidence systems that survive turnover"
      es: "Construir sistemas de evidencia que sobrevivan la rotación"
    case_link: "/case-studies/audience-framework"

  - id: "narrative-strategy"
    text:
      en: "Translate narratives into measurable strategy"
      es: "Traducir narrativas en estrategia medible"
    case_link: "/case-studies/narrative-tracking"

  - id: "standardize-performance"
    text:
      en: "Standardize performance across teams and regions"
      es: "Estandarizar desempeño entre equipos y regiones"
    case_link: "/case-studies/benchmark-system"
```

---

## 5. Case Studies (Systems Portfolio)

### Case 1: Audience Framework

```yaml
slug: "audience-framework"
title:
  en: "Audience Intelligence Framework"
  es: "Framework de Inteligencia de Audiencias"

role: "Lead Designer & Strategist"
org: "European Climate Foundation"
regions: ["LATAM", "US/Canada", "Europe"]
timeframe: "2021 - Present"
theme: "audience"
featured: true

problem:
  en: |
    Regional teams lacked a standardized methodology to understand and segment
    audiences across different climate narratives. Each team used different
    approaches, making cross-regional learning impossible and strategic
    decisions inconsistent.
  es: |
    Los equipos regionales carecían de una metodología estandarizada para
    entender y segmentar audiencias en diferentes narrativas climáticas.
    Cada equipo usaba enfoques distintos, haciendo imposible el aprendizaje
    inter-regional y las decisiones estratégicas inconsistentes.

approach:
  en:
    - "Conducted landscape analysis of existing audience research across regions"
    - "Designed unified segmentation integrating qualitative and quantitative indicators"
    - "Built indicator framework tracking awareness, attitudes, and behavioral intent"
    - "Created standardized reporting templates for regional teams"
  es:
    - "Análisis del panorama de investigación de audiencias existente"
    - "Diseño de segmentación unificada integrando indicadores cuali y cuantitativos"
    - "Framework de indicadores de conciencia, actitudes e intención conductual"
    - "Plantillas de reportes estandarizadas para equipos regionales"

system_design:
  en:
    - "Multi-country methodology for behavioral change measurement"
    - "Policy awareness indicators integrated with campaign metrics"
    - "Qualitative + quantitative data integration pipeline"
  es:
    - "Metodología multi-país para medición de cambio conductual"
    - "Indicadores de conciencia política integrados con métricas de campaña"
    - "Pipeline de integración de datos cualitativos + cuantitativos"

data_sources:
  - "Brandwatch"
  - "BuzzSumo"
  - "Audiense"
  - "Google BigQuery"
  - "Custom surveys"

outputs:
  en:
    - "Quarterly audience intelligence reports"
    - "Regional performance scorecards"
    - "Strategic recommendation memos"
    - "Training workshops for regional teams"
  es:
    - "Reportes trimestrales de inteligencia de audiencias"
    - "Scorecards de desempeño regional"
    - "Memos de recomendaciones estratégicas"
    - "Talleres de capacitación para equipos regionales"

decision_impact:
  en:
    - "Informed results-based management across LATAM, Canada, and US teams"
    - "Enabled evidence-based reporting to donors and EU-aligned partners"
    - "Standardized evaluation methodologies across philanthropic consortia"
  es:
    - "Informó la gestión basada en resultados en equipos de LATAM, Canadá y US"
    - "Habilitó reportes basados en evidencia para donantes y socios UE"
    - "Estandarizó metodologías de evaluación entre consorcios filantrópicos"

adoption:
  en: "Used by regional teams in Latin America, Canada, and United States for strategic planning and donor reporting"
  es: "Usado por equipos regionales en LATAM, Canadá y Estados Unidos para planificación estratégica y reportes a donantes"

governance:
  en: "Collaboration with EU-aligned partners and philanthropic consortia on performance monitoring systems"
  es: "Colaboración con socios alineados con UE y consorcios filantrópicos en sistemas de monitoreo de desempeño"

tools:
  - "Brandwatch"
  - "BuzzSumo"
  - "Audiense"
  - "Google BigQuery"
  - "Power BI"
  - "Excel"
```

### Case 2: Benchmark System

```yaml
slug: "benchmark-system"
title:
  en: "Performance Benchmark System"
  es: "Sistema de Benchmark de Desempeño"

role: "Lead Analyst"
org: "European Climate Foundation"
regions: ["LATAM", "US/Canada", "Europe"]
timeframe: "2021 - Present"
theme: "benchmark"
featured: true

problem:
  en: |
    Campaign efficiency varied significantly across regional teams with no
    standardized way to compare performance or identify improvement areas.
    Strategic decisions were made without comparable baseline data.
  es: |
    La eficiencia de campañas variaba significativamente entre equipos
    regionales sin forma estandarizada de comparar desempeño o identificar
    áreas de mejora. Las decisiones estratégicas se tomaban sin datos
    base comparables.

approach:
  en:
    - "Defined standardized performance metrics applicable across regions"
    - "Created baseline measurement protocols for campaign efficiency"
    - "Designed comparative dashboards for regional leadership"
    - "Established improvement tracking and learning loops"
  es:
    - "Definición de métricas de desempeño estandarizadas aplicables entre regiones"
    - "Protocolos de medición base para eficiencia de campañas"
    - "Dashboards comparativos para liderazgo regional"
    - "Tracking de mejoras y ciclos de aprendizaje"

system_design:
  en:
    - "KPI framework aligned across all regional programmes"
    - "Automated data collection from multiple campaign platforms"
    - "Comparative scoring methodology"
  es:
    - "Framework de KPIs alineado entre todos los programas regionales"
    - "Recolección automatizada de datos de múltiples plataformas"
    - "Metodología de scoring comparativo"

data_sources:
  - "Google Analytics"
  - "Campaign platforms"
  - "Partner reporting data"
  - "Event Registry"

outputs:
  en:
    - "Regional benchmark reports"
    - "Performance improvement recommendations"
    - "Quarterly comparative dashboards"
  es:
    - "Reportes de benchmark regional"
    - "Recomendaciones de mejora de desempeño"
    - "Dashboards comparativos trimestrales"

decision_impact:
  en:
    - "Identified strategic improvement areas across regional teams"
    - "Enabled data-driven resource allocation decisions"
    - "Strengthened institutional learning through comparable metrics"
  es:
    - "Identificó áreas de mejora estratégica entre equipos regionales"
    - "Habilitó decisiones de asignación de recursos basadas en datos"
    - "Fortaleció el aprendizaje institucional mediante métricas comparables"

adoption:
  en: "Integrated into quarterly strategic planning sessions across all regional programmes"
  es: "Integrado en sesiones de planificación estratégica trimestral en todos los programas regionales"

governance:
  en: "Owned by data team, consumed by Regional Directors and Programme Managers"
  es: "Propiedad del equipo de datos, consumido por Directores Regionales y Gerentes de Programa"

tools:
  - "Tableau"
  - "Google BigQuery"
  - "Looker Studio"
  - "Excel"
```

### Case 3: Narrative Tracking System

```yaml
slug: "narrative-tracking"
title:
  en: "Narrative Tracking System"
  es: "Sistema de Seguimiento Narrativo"

role: "System Designer"
org: "European Climate Foundation"
regions: ["Global"]
timeframe: "2021 - Present"
theme: "narrative"
featured: true

problem:
  en: |
    Environmental discourse trends and sentiment shifts were not being
    systematically monitored, making it difficult to assess communication
    impact or adapt messaging strategy in real-time.
  es: |
    Las tendencias del discurso ambiental y los cambios de sentimiento no
    se monitoreaban sistemáticamente, dificultando evaluar el impacto
    comunicacional o adaptar la estrategia de mensajes en tiempo real.

approach:
  en:
    - "Integrated multiple data sources for comprehensive narrative monitoring"
    - "Designed taxonomy for environmental discourse classification"
    - "Built sentiment and trend analysis pipelines"
    - "Created actionable insight delivery system"
  es:
    - "Integración de múltiples fuentes de datos para monitoreo narrativo integral"
    - "Diseño de taxonomía para clasificación del discurso ambiental"
    - "Pipelines de análisis de sentimiento y tendencias"
    - "Sistema de entrega de insights accionables"

system_design:
  en:
    - "Multi-platform data aggregation (social, news, policy)"
    - "Automated trend detection and alerting"
    - "Sentiment classification using mixed methods"
  es:
    - "Agregación de datos multi-plataforma (social, noticias, política)"
    - "Detección automatizada de tendencias y alertas"
    - "Clasificación de sentimiento usando métodos mixtos"

data_sources:
  - "Brandwatch"
  - "BuzzSumo"
  - "Event Registry"
  - "Talkwalker"
  - "Google BigQuery"

outputs:
  en:
    - "Real-time narrative dashboards"
    - "Trend alert reports"
    - "Strategic messaging recommendations"
    - "Monthly discourse analysis briefs"
  es:
    - "Dashboards de narrativa en tiempo real"
    - "Reportes de alertas de tendencias"
    - "Recomendaciones estratégicas de mensajes"
    - "Briefs mensuales de análisis de discurso"

decision_impact:
  en:
    - "Enabled real-time adaptation of communication strategies"
    - "Informed messaging priorities based on discourse trends"
    - "Provided evidence base for partner communications guidance"
  es:
    - "Habilitó adaptación en tiempo real de estrategias de comunicación"
    - "Informó prioridades de mensajes basadas en tendencias de discurso"
    - "Proveyó base de evidencia para guía de comunicaciones a socios"

adoption:
  en: "Monitored by communications team, insights consumed by programme leads and partners"
  es: "Monitoreado por equipo de comunicaciones, insights consumidos por líderes de programa y socios"

governance:
  en: "Data pipeline owned by analytics team, strategic recommendations reviewed by Communications Director"
  es: "Pipeline de datos propiedad del equipo de analítica, recomendaciones revisadas por Director de Comunicaciones"

tools:
  - "Brandwatch"
  - "BuzzSumo"
  - "Event Registry"
  - "Talkwalker"
  - "NVivo"
  - "ATLAS.ti"
```

### Case 4 (Opcional): Department Building

```yaml
slug: "dept-building-fidelizador"
title:
  en: "Building Marketing & Communications from Zero"
  es: "Construyendo Marketing y Comunicaciones desde Cero"

role: "Department Head"
org: "Fidelizador"
regions: ["Chile", "LATAM"]
timeframe: "2018 - 2021"
theme: "capacity"
featured: false

problem:
  en: |
    The company lacked a dedicated Marketing and Communications function.
    Client performance metrics were not systematically tracked, and
    audience segmentation was ad-hoc.
  es: |
    La empresa carecía de una función dedicada de Marketing y Comunicaciones.
    Las métricas de desempeño de clientes no se rastreaban sistemáticamente,
    y la segmentación de audiencias era ad-hoc.

approach:
  en:
    - "Established Marketing and Communications Department from scratch"
    - "Designed internal monitoring tools for campaign outcomes"
    - "Implemented data visualization and insight-based strategy"
    - "Coordinated multidisciplinary team alignment"
  es:
    - "Establecimiento del Departamento de Marketing y Comunicaciones desde cero"
    - "Diseño de herramientas internas de monitoreo de resultados de campañas"
    - "Implementación de visualización de datos y estrategia basada en insights"
    - "Coordinación de alineación de equipo multidisciplinario"

decision_impact:
  en:
    - "Improved client performance metrics through data-driven insights"
    - "Established measurable organizational objectives"
    - "Created scalable processes for SME and B2B communications"
  es:
    - "Mejoró métricas de desempeño de clientes mediante insights basados en datos"
    - "Estableció objetivos organizacionales medibles"
    - "Creó procesos escalables para comunicaciones SME y B2B"

tools:
  - "Google Analytics"
  - "Data visualization tools"
  - "CRM systems"
```

---

## 6. Capabilities (6 bloques)

```yaml
capabilities:
  - id: "impact-assessment"
    name:
      en: "Impact Assessment & Evaluation"
      es: "Evaluación de Impacto"
    tools:
      - "KPI frameworks"
      - "Mixed-methods"
      - "ATLAS.ti"
      - "NVivo"
    evidence:
      en: "Designed 3 frameworks at ECF integrating qualitative and quantitative indicators"
      es: "Diseñó 3 frameworks en ECF integrando indicadores cualitativos y cuantitativos"
    case_link: "/case-studies/audience-framework"

  - id: "audience-insights"
    name:
      en: "Audience & Behavioral Insights"
      es: "Insights de Audiencia y Comportamiento"
    tools:
      - "Brandwatch"
      - "Audiense"
      - "Surveys"
      - "Segmentation"
    evidence:
      en: "Multi-country methodology measuring behavioral change and policy awareness"
      es: "Metodología multi-país midiendo cambio conductual y conciencia política"
    case_link: "/case-studies/audience-framework"

  - id: "social-listening"
    name:
      en: "Social Listening Systems"
      es: "Sistemas de Escucha Social"
    tools:
      - "Brandwatch"
      - "BuzzSumo"
      - "Talkwalker"
      - "Event Registry"
    evidence:
      en: "Narrative Tracking System monitoring environmental discourse trends"
      es: "Sistema de Seguimiento Narrativo monitoreando tendencias de discurso ambiental"
    case_link: "/case-studies/narrative-tracking"

  - id: "data-visualization"
    name:
      en: "Data Visualization & Reporting"
      es: "Visualización de Datos y Reportes"
    tools:
      - "Power BI"
      - "Tableau"
      - "Looker Studio"
      - "Google BigQuery"
    evidence:
      en: "Regional dashboards and scorecards for cross-team performance comparison"
      es: "Dashboards regionales y scorecards para comparación de desempeño entre equipos"
    case_link: "/case-studies/benchmark-system"

  - id: "research-methods"
    name:
      en: "Research & Mixed Methods"
      es: "Investigación y Métodos Mixtos"
    tools:
      - "Qualitative coding"
      - "Survey design"
      - "Data analysis"
      - "Excel"
    evidence:
      en: "Evidence-based reporting for donors and EU-aligned partners"
      es: "Reportes basados en evidencia para donantes y socios alineados con UE"
    case_link: "/case-studies/audience-framework"

  - id: "capacity-building"
    name:
      en: "Capacity Building & Training"
      es: "Desarrollo de Capacidades"
    tools:
      - "Workshop facilitation"
      - "Data literacy"
      - "Results measurement"
      - "Team coordination"
    evidence:
      en: "Training workshops for regional teams on data frameworks and evaluation"
      es: "Talleres de capacitación para equipos regionales en frameworks de datos y evaluación"
    case_link: "/case-studies/audience-framework"
```

---

## 7. Timeline (Experience)

```yaml
experience:
  - id: "ecf"
    org: "European Climate Foundation"
    title:
      en: "Data & Audience Insights Strategist"
      es: "Estratega de Datos e Insights de Audiencia"
    period: "2021 – Present"
    location: "Remote"
    bullets:
      en:
        - "Lead analytical design, monitoring, and evaluation for international climate programmes"
        - "Designed and implemented 3 impact assessment frameworks (Audience, Benchmark, Narrative)"
        - "Collaborated with EU-aligned partners and philanthropic consortia on evaluation methodologies"
      es:
        - "Liderazgo en diseño analítico, monitoreo y evaluación para programas climáticos internacionales"
        - "Diseño e implementación de 3 frameworks de evaluación de impacto"
        - "Colaboración con socios UE y consorcios filantrópicos en metodologías de evaluación"
    tags: ["LATAM", "US/Canada", "Climate", "M&E"]

  - id: "fidelizador"
    org: "Fidelizador"
    title:
      en: "Marketing & Communications Manager"
      es: "Gerente de Marketing y Comunicaciones"
    period: "2018 – 2021"
    location: "Santiago, Chile"
    bullets:
      en:
        - "Established Marketing and Communications Department from scratch"
        - "Designed monitoring tools improving client performance through data visualization"
        - "Coordinated multidisciplinary team ensuring measurable organizational objectives"
      es:
        - "Establecimiento del Departamento de Marketing y Comunicaciones desde cero"
        - "Diseño de herramientas de monitoreo mejorando desempeño de clientes"
        - "Coordinación de equipo multidisciplinario asegurando objetivos medibles"
    tags: ["Chile", "B2B", "SME", "Department Building"]

  - id: "eadbox"
    org: "Eadbox"
    title:
      en: "Digital Education and Marketing Specialist"
      es: "Especialista en Educación Digital y Marketing"
    period: "2017 – 2018"
    location: "São Paulo, Brazil"
    bullets:
      en:
        - "Supported digital learning programmes promoting inclusive access to education"
        - "Conducted data analysis on learner participation and institutional adoption"
        - "Addressed educational and infrastructural barriers in developing country contexts"
      es:
        - "Apoyo a programas de aprendizaje digital promoviendo acceso inclusivo a educación"
        - "Análisis de datos sobre participación de estudiantes y adopción institucional"
        - "Abordaje de barreras educativas e infraestructurales en contextos de países en desarrollo"
    tags: ["Brazil", "EdTech", "Digital Learning"]
```

---

## 8. Education

```yaml
education:
  - degree:
      en: "Master's Degree in Business Analytics"
      es: "Maestría en Analítica de Negocios"
    institution: "Aston University"
    location: "Birmingham, United Kingdom"
    year: "2026"
    status: "in-progress"
    focus:
      en: "Business Analytics, Data Analysis, Strategic Decision-Making"
      es: "Analítica de Negocios, Análisis de Datos, Toma de Decisiones Estratégicas"

  - degree:
      en: "Master's Degree in Global Business Management"
      es: "Maestría en Gestión de Negocios Globales"
    institution: "Rennes School of Business"
    location: "Rennes, France"
    year: "2016"
    status: "completed"

  - degree:
      en: "Bachelor's Degree in International Business and Relations"
      es: "Licenciatura en Negocios y Relaciones Internacionales"
    institution: "Universidad de La Salle"
    location: "Bogotá, Colombia"
    year: "2012 – 2016"
    status: "completed"
```

---

## 9. Languages

```yaml
languages:
  - name: "English"
    name_es: "Inglés"
    level: "Fluent"
    level_es: "Fluido"
    used_for:
      en: "Research, reporting, stakeholder communications, partner collaboration"
      es: "Investigación, reportes, comunicación con stakeholders, colaboración con socios"

  - name: "Spanish"
    name_es: "Español"
    level: "Native"
    level_es: "Nativo"
    used_for:
      en: "Regional team coordination, LATAM programmes, documentation"
      es: "Coordinación de equipos regionales, programas LATAM, documentación"

  - name: "Portuguese"
    name_es: "Portugués"
    level: "Advanced"
    level_es: "Avanzado"
    used_for:
      en: "Brazil operations, partner communications, research"
      es: "Operaciones Brasil, comunicación con socios, investigación"

  - name: "French"
    name_es: "Francés"
    level: "Working Proficiency"
    level_es: "Competencia Laboral"
    used_for:
      en: "EU partner communications, documentation review"
      es: "Comunicación con socios UE, revisión de documentación"
```

---

## 10. Awards & Recognition

```yaml
awards:
  - id: "ecf-2023"
    title:
      en: "Data Frameworks Recognition"
      es: "Reconocimiento por Frameworks de Datos"
    org: "European Climate Foundation"
    year: "2023"
    description:
      en: "Recognized for designing data frameworks enhancing cross-regional monitoring and evaluation"
      es: "Reconocida por diseñar frameworks de datos que mejoran el monitoreo y evaluación inter-regional"

  - id: "reference-2024"
    title:
      en: "Multi-Country Impact Reference"
      es: "Referencia de Impacto Multi-País"
    org: "International Assessments"
    year: "2024"
    description:
      en: "Contributor to performance systems referenced in multi-country impact assessments"
      es: "Contribuyó a sistemas de desempeño referenciados en evaluaciones de impacto multi-país"
```

---

## 11. Site Metadata

```yaml
site:
  name: "Angela Parra Sánchez"
  tagline:
    en: "Data & Impact Assessment Specialist"
    es: "Especialista en Datos y Evaluación de Impacto"
  description:
    en: "Building measurement systems and audience intelligence for international climate and sustainability programmes. 8+ years in M&E and data analysis."
    es: "Construyendo sistemas de medición e inteligencia de audiencias para programas internacionales de clima y sostenibilidad. 8+ años en M&E y análisis de datos."
  url: "https://angelaparra.com"
  default_lang: "en"
  supported_langs: ["en", "es"]

  social:
    linkedin: "https://www.linkedin.com/in/angela-parra-sánchez-89548165"
    email: "angelae.parras@gmail.com"

  sdgs:
    - number: 8
      name:
        en: "Decent Work and Economic Growth"
        es: "Trabajo Decente y Crecimiento Económico"
    - number: 9
      name:
        en: "Industry, Innovation and Infrastructure"
        es: "Industria, Innovación e Infraestructura"
    - number: 13
      name:
        en: "Climate Action"
        es: "Acción por el Clima"
```

---

## 12. Resume Mode (Condensed)

```yaml
resume:
  summary:
    en: |
      Data and impact assessment specialist with 8+ years in monitoring,
      evaluation, and data analysis for international sustainability and
      climate programmes. Expert in designing frameworks for impact measurement,
      results-based management, and evidence-based reporting. Experienced in
      multicultural, cross-regional environments supporting UN SDGs 8, 9, and 13.
    es: |
      Especialista en datos y evaluación de impacto con 8+ años en monitoreo,
      evaluación y análisis de datos para programas internacionales de
      sostenibilidad y clima. Experta en diseño de frameworks para medición
      de impacto, gestión basada en resultados y reportes basados en evidencia.

  key_strengths:
    en:
      - "Design and implementation of impact assessment frameworks"
      - "Cross-regional data analysis and performance monitoring"
      - "Social listening and narrative tracking systems"
      - "Results-based management and evidence-based reporting"
      - "Capacity building and data literacy training"
    es:
      - "Diseño e implementación de frameworks de evaluación de impacto"
      - "Análisis de datos multi-regional y monitoreo de desempeño"
      - "Sistemas de escucha social y seguimiento narrativo"
      - "Gestión basada en resultados y reportes basados en evidencia"
      - "Desarrollo de capacidades y capacitación en alfabetización de datos"

  top_cases:
    - slug: "audience-framework"
    - slug: "benchmark-system"
    - slug: "narrative-tracking"
```

---

## Notas de Implementación

### Prioridad de contenido
1. ✅ **Hero + Proof Strip** — Datos completos
2. ✅ **3 Cases principales** — Estructura lista, decision impact inferido
3. ✅ **Timeline + Education** — Datos completos
4. ✅ **Capabilities** — Mapeados desde skills + competencies
5. ✅ **Languages + Awards** — Datos completos

### Datos que podrían mejorarse después
- Decision impacts más específicos (con métricas si Ángela las proporciona)
- Artifacts visuales (diagramas SVG de los frameworks)
- Foto profesional (opcional)

### Flexibilidad del sistema
- Todo el contenido está en archivos JSON/MDX separados
- Cambiar un texto = editar un archivo, no código
- Agregar un case = crear un nuevo archivo MDX
- Content Collections validan automáticamente
