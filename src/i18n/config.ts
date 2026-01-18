/**
 * i18n Configuration
 * Central configuration for internationalization
 */

export const defaultLang = 'en' as const;
export const supportedLangs = ['en', 'es', 'fr', 'pt'] as const;

export type Lang = (typeof supportedLangs)[number];

export const langNames: Record<Lang, string> = {
  en: 'English',
  es: 'Espanol',
  fr: 'Francais',
  pt: 'Portugues',
};

export const langNamesShort: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
  pt: 'PT',
};

/**
 * Check if a string is a valid language code
 */
export function isValidLang(lang: string): lang is Lang {
  // @ts-ignore - Check inclusion in readonly array
  return supportedLangs.includes(lang as Lang);
}

/**
 * Get language from URL pathname
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (isValidLang(lang)) {
    return lang;
  }
  return defaultLang;
}

/**
 * Get the localized path for a given path and language
 */
export function getLocalizedPath(path: string, lang: Lang): string {
  // Remove existing lang prefix if present
  const cleanPath = path.replace(/^\/(en|es|fr|pt)/, '');
  const normalizedPath = cleanPath || '/';
  return `/${lang}${normalizedPath === '/' ? '' : normalizedPath}`;
}

/**
 * Get alternate URLs for hreflang tags
 */
export function getAlternateUrls(
  currentPath: string,
  baseUrl: string
): { lang: Lang; url: string }[] {
  return supportedLangs.map((lang) => ({
    lang,
    url: `${baseUrl}${getLocalizedPath(currentPath, lang)}`,
  }));
}

/**
 * Remove language prefix from path
 */
export function removeLanguagePrefix(path: string): string {
  return path.replace(/^\/(en|es|fr|pt)/, '') || '/';
}