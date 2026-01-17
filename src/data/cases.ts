/**
 * Case Studies Data
 * Temporary data store until we implement Content Collections
 */

import type { Lang } from '@/i18n/config';

export interface CaseStudy {
  title: string;
  role: string;
  org: string;
  timeframe: string;
  regions: string[];
  problem: string;
  approach: string[];
  systemDesign: string[];
  dataSources: string[];
  outputs: string[];
  decisionImpact: string[];
  adoption: string;
  governance: string;
  tools: string[];
}

export interface CaseStudyMeta {
  slug: string;
  theme: 'audience' | 'benchmark' | 'narrative' | 'capacity';
  featured: boolean;
}

export const caseSlugs = ['audience-framework', 'benchmark-system', 'narrative-tracking'] as const;
export type CaseSlug = (typeof caseSlugs)[number];

export const caseMeta: Record<CaseSlug, CaseStudyMeta> = {
  'audience-framework': {
    slug: 'audience-framework',
    theme: 'audience',
    featured: true,
  },
  'benchmark-system': {
    slug: 'benchmark-system',
    theme: 'benchmark',
    featured: true,
  },
  'narrative-tracking': {
    slug: 'narrative-tracking',
    theme: 'narrative',
    featured: true,
  },
};

export const casesData: Record<CaseSlug, Record<Lang, CaseStudy>> = {
  'audience-framework': {
    en: {
      title: 'Audience Intelligence Framework',
      role: 'Lead Designer & Strategist',
      org: 'European Climate Foundation',
      timeframe: '2021 - Present',
      regions: ['LATAM', 'US/Canada', 'Europe'],
      problem:
        'Regional teams lacked a standardized methodology to understand and segment audiences across different climate narratives. Each team used different approaches, making cross-regional learning impossible and strategic decisions inconsistent.',
      approach: [
        'Conducted landscape analysis of existing audience research across regions',
        'Designed unified segmentation integrating qualitative and quantitative indicators',
        'Built indicator framework tracking awareness, attitudes, and behavioral intent',
        'Created standardized reporting templates for regional teams',
      ],
      systemDesign: [
        'Multi-country methodology for behavioral change measurement',
        'Policy awareness indicators integrated with campaign metrics',
        'Qualitative + quantitative data integration pipeline',
      ],
      dataSources: ['Brandwatch', 'BuzzSumo', 'Audiense', 'Google BigQuery', 'Custom surveys'],
      outputs: [
        'Quarterly audience intelligence reports',
        'Regional performance scorecards',
        'Strategic recommendation memos',
        'Training workshops for regional teams',
      ],
      decisionImpact: [
        'Informed results-based management across LATAM, Canada, and US teams',
        'Enabled evidence-based reporting to donors and EU-aligned partners',
        'Standardized evaluation methodologies across philanthropic consortia',
      ],
      adoption:
        'Used by regional teams in Latin America, Canada, and United States for strategic planning and donor reporting',
      governance:
        'Collaboration with EU-aligned partners and philanthropic consortia on performance monitoring systems',
      tools: ['Brandwatch', 'BuzzSumo', 'Audiense', 'Google BigQuery', 'Power BI', 'Excel'],
    },
    es: {
      title: 'Framework de Inteligencia de Audiencias',
      role: 'Disenadora Lider y Estratega',
      org: 'European Climate Foundation',
      timeframe: '2021 - Presente',
      regions: ['LATAM', 'US/Canada', 'Europa'],
      problem:
        'Los equipos regionales carecian de una metodologia estandarizada para entender y segmentar audiencias en diferentes narrativas climaticas. Cada equipo usaba enfoques distintos, haciendo imposible el aprendizaje inter-regional y las decisiones estrategicas inconsistentes.',
      approach: [
        'Analisis del panorama de investigacion de audiencias existente',
        'Diseno de segmentacion unificada integrando indicadores cualitativos y cuantitativos',
        'Framework de indicadores de conciencia, actitudes e intencion conductual',
        'Plantillas de reportes estandarizadas para equipos regionales',
      ],
      systemDesign: [
        'Metodologia multi-pais para medicion de cambio conductual',
        'Indicadores de conciencia politica integrados con metricas de campana',
        'Pipeline de integracion de datos cualitativos + cuantitativos',
      ],
      dataSources: [
        'Brandwatch',
        'BuzzSumo',
        'Audiense',
        'Google BigQuery',
        'Encuestas personalizadas',
      ],
      outputs: [
        'Reportes trimestrales de inteligencia de audiencias',
        'Scorecards de desempeno regional',
        'Memos de recomendaciones estrategicas',
        'Talleres de capacitacion para equipos regionales',
      ],
      decisionImpact: [
        'Informo la gestion basada en resultados en equipos de LATAM, Canada y US',
        'Habilito reportes basados en evidencia para donantes y socios UE',
        'Estandarizo metodologias de evaluacion entre consorcios filantropicos',
      ],
      adoption:
        'Usado por equipos regionales en LATAM, Canada y Estados Unidos para planificacion estrategica y reportes a donantes',
      governance:
        'Colaboracion con socios alineados con UE y consorcios filantropicos en sistemas de monitoreo de desempeno',
      tools: ['Brandwatch', 'BuzzSumo', 'Audiense', 'Google BigQuery', 'Power BI', 'Excel'],
    },
  },
  'benchmark-system': {
    en: {
      title: 'Performance Benchmark System',
      role: 'Lead Analyst',
      org: 'European Climate Foundation',
      timeframe: '2021 - Present',
      regions: ['LATAM', 'US/Canada', 'Europe'],
      problem:
        'Campaign efficiency varied significantly across regional teams with no standardized way to compare performance or identify improvement areas. Strategic decisions were made without comparable baseline data.',
      approach: [
        'Defined standardized performance metrics applicable across regions',
        'Created baseline measurement protocols for campaign efficiency',
        'Designed comparative dashboards for regional leadership',
        'Established improvement tracking and learning loops',
      ],
      systemDesign: [
        'KPI framework aligned across all regional programmes',
        'Automated data collection from multiple campaign platforms',
        'Comparative scoring methodology',
      ],
      dataSources: ['Google Analytics', 'Campaign platforms', 'Partner reporting data', 'Event Registry'],
      outputs: [
        'Regional benchmark reports',
        'Performance improvement recommendations',
        'Quarterly comparative dashboards',
      ],
      decisionImpact: [
        'Identified strategic improvement areas across regional teams',
        'Enabled data-driven resource allocation decisions',
        'Strengthened institutional learning through comparable metrics',
      ],
      adoption:
        'Integrated into quarterly strategic planning sessions across all regional programmes',
      governance: 'Owned by data team, consumed by Regional Directors and Programme Managers',
      tools: ['Tableau', 'Google BigQuery', 'Looker Studio', 'Excel'],
    },
    es: {
      title: 'Sistema de Benchmark de Desempeno',
      role: 'Analista Lider',
      org: 'European Climate Foundation',
      timeframe: '2021 - Presente',
      regions: ['LATAM', 'US/Canada', 'Europa'],
      problem:
        'La eficiencia de campanas variaba significativamente entre equipos regionales sin forma estandarizada de comparar desempeno o identificar areas de mejora. Las decisiones estrategicas se tomaban sin datos base comparables.',
      approach: [
        'Definicion de metricas de desempeno estandarizadas aplicables entre regiones',
        'Protocolos de medicion base para eficiencia de campanas',
        'Dashboards comparativos para liderazgo regional',
        'Tracking de mejoras y ciclos de aprendizaje',
      ],
      systemDesign: [
        'Framework de KPIs alineado entre todos los programas regionales',
        'Recoleccion automatizada de datos de multiples plataformas',
        'Metodologia de scoring comparativo',
      ],
      dataSources: [
        'Google Analytics',
        'Plataformas de campana',
        'Datos de reportes de socios',
        'Event Registry',
      ],
      outputs: [
        'Reportes de benchmark regional',
        'Recomendaciones de mejora de desempeno',
        'Dashboards comparativos trimestrales',
      ],
      decisionImpact: [
        'Identifico areas de mejora estrategica entre equipos regionales',
        'Habilito decisiones de asignacion de recursos basadas en datos',
        'Fortalecio el aprendizaje institucional mediante metricas comparables',
      ],
      adoption:
        'Integrado en sesiones de planificacion estrategica trimestral en todos los programas regionales',
      governance:
        'Propiedad del equipo de datos, consumido por Directores Regionales y Gerentes de Programa',
      tools: ['Tableau', 'Google BigQuery', 'Looker Studio', 'Excel'],
    },
  },
  'narrative-tracking': {
    en: {
      title: 'Narrative Tracking System',
      role: 'System Designer',
      org: 'European Climate Foundation',
      timeframe: '2021 - Present',
      regions: ['Global'],
      problem:
        'Environmental discourse trends and sentiment shifts were not being systematically monitored, making it difficult to assess communication impact or adapt messaging strategy in real-time.',
      approach: [
        'Integrated multiple data sources for comprehensive narrative monitoring',
        'Designed taxonomy for environmental discourse classification',
        'Built sentiment and trend analysis pipelines',
        'Created actionable insight delivery system',
      ],
      systemDesign: [
        'Multi-platform data aggregation (social, news, policy)',
        'Automated trend detection and alerting',
        'Sentiment classification using mixed methods',
      ],
      dataSources: ['Brandwatch', 'BuzzSumo', 'Event Registry', 'Talkwalker', 'Google BigQuery'],
      outputs: [
        'Real-time narrative dashboards',
        'Trend alert reports',
        'Strategic messaging recommendations',
        'Monthly discourse analysis briefs',
      ],
      decisionImpact: [
        'Enabled real-time adaptation of communication strategies',
        'Informed messaging priorities based on discourse trends',
        'Provided evidence base for partner communications guidance',
      ],
      adoption:
        'Monitored by communications team, insights consumed by programme leads and partners',
      governance:
        'Data pipeline owned by analytics team, strategic recommendations reviewed by Communications Director',
      tools: ['Brandwatch', 'BuzzSumo', 'Event Registry', 'Talkwalker', 'NVivo', 'ATLAS.ti'],
    },
    es: {
      title: 'Sistema de Seguimiento Narrativo',
      role: 'Disenadora de Sistema',
      org: 'European Climate Foundation',
      timeframe: '2021 - Presente',
      regions: ['Global'],
      problem:
        'Las tendencias del discurso ambiental y los cambios de sentimiento no se monitoreaban sistematicamente, dificultando evaluar el impacto comunicacional o adaptar la estrategia de mensajes en tiempo real.',
      approach: [
        'Integracion de multiples fuentes de datos para monitoreo narrativo integral',
        'Diseno de taxonomia para clasificacion del discurso ambiental',
        'Pipelines de analisis de sentimiento y tendencias',
        'Sistema de entrega de insights accionables',
      ],
      systemDesign: [
        'Agregacion de datos multi-plataforma (social, noticias, politica)',
        'Deteccion automatizada de tendencias y alertas',
        'Clasificacion de sentimiento usando metodos mixtos',
      ],
      dataSources: ['Brandwatch', 'BuzzSumo', 'Event Registry', 'Talkwalker', 'Google BigQuery'],
      outputs: [
        'Dashboards de narrativa en tiempo real',
        'Reportes de alertas de tendencias',
        'Recomendaciones estrategicas de mensajes',
        'Briefs mensuales de analisis de discurso',
      ],
      decisionImpact: [
        'Habilito adaptacion en tiempo real de estrategias de comunicacion',
        'Informo prioridades de mensajes basadas en tendencias de discurso',
        'Proveyo base de evidencia para guia de comunicaciones a socios',
      ],
      adoption:
        'Monitoreado por equipo de comunicaciones, insights consumidos por lideres de programa y socios',
      governance:
        'Pipeline de datos propiedad del equipo de analitica, recomendaciones revisadas por Director de Comunicaciones',
      tools: ['Brandwatch', 'BuzzSumo', 'Event Registry', 'Talkwalker', 'NVivo', 'ATLAS.ti'],
    },
  },
};

/**
 * Get case study data by slug and language
 */
export function getCaseStudy(slug: string, lang: Lang): CaseStudy | null {
  if (slug in casesData) {
    return casesData[slug as CaseSlug][lang];
  }
  return null;
}

/**
 * Get all case slugs
 */
export function getAllCaseSlugs(): string[] {
  return [...caseSlugs];
}

/**
 * Check if slug is valid
 */
export function isValidCaseSlug(slug: string): slug is CaseSlug {
  return caseSlugs.includes(slug as CaseSlug);
}