/**
 * SEO Utilities
 * Helpers for meta tags, Schema.org, and Open Graph
 */

import type { Lang } from '@/i18n/config';
import { getAlternateUrls } from '@/i18n/config';

export interface SEOProps {
  title: string;
  description: string;
  lang: Lang;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface PersonSchema {
  name: string;
  jobTitle: string;
  url: string;
  email?: string;
  sameAs?: string[];
  knowsAbout?: string[];
  image?: string;
}

/**
 * Generate Person Schema.org JSON-LD
 */
export function generatePersonSchema(person: PersonSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    ...(person.email && { email: `mailto:${person.email}` }),
    ...(person.sameAs && { sameAs: person.sameAs }),
    ...(person.knowsAbout && { knowsAbout: person.knowsAbout }),
    ...(person.image && { image: person.image }),
  };

  return JSON.stringify(schema);
}

/**
 * Generate ProfilePage Schema.org JSON-LD
 */
export function generateProfilePageSchema(
  person: PersonSchema,
  dateModified?: string
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: person.name,
      jobTitle: person.jobTitle,
      url: person.url,
    },
    ...(dateModified && { dateModified }),
  };

  return JSON.stringify(schema);
}

/**
 * Generate Article Schema.org JSON-LD (for case studies)
 */
export function generateArticleSchema(options: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author: {
    name: string;
    url: string;
  };
  image?: string;
}): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    url: options.url,
    author: {
      '@type': 'Person',
      name: options.author.name,
      url: options.author.url,
    },
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.image && { image: options.image }),
  };

  return JSON.stringify(schema);
}

/**
 * Generate BreadcrumbList Schema.org JSON-LD
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Site-wide SEO defaults
 */
export const siteConfig = {
  name: 'Angela Parra Sanchez',
  url: 'https://angelaparra.com',
  email: 'angelae.parras@gmail.com',
  linkedin: 'https://www.linkedin.com/in/angela-parra-sanchez-89548165',
  jobTitle: 'Data & Impact Assessment Specialist',
  knowsAbout: [
    'Impact Assessment',
    'Data Analysis',
    'Monitoring & Evaluation',
    'Social Listening',
    'Climate Communications',
    'Results-Based Management',
  ],
};

/**
 * Generate alternate language URLs for hreflang
 */
export function getHrefLangUrls(currentPath: string): Array<{ lang: Lang; url: string }> {
  return getAlternateUrls(currentPath, siteConfig.url);
}
