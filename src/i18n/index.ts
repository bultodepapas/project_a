/**
 * i18n Utilities
 * Translation helpers and utilities for internationalization
 */

import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import pt from './pt.json';
import { defaultLang, type Lang } from './config';

// Re-export config
export * from './config';

// Translation dictionaries
const translations: Record<Lang, typeof en> = {
  en,
  es,
  fr,
  pt,
};

type TranslationKey = string;

/**
 * Get a translation by key path (e.g., "nav.systems")
 * Returns the key itself if translation is not found
 */
export function t(lang: Lang, key: TranslationKey): string {
  const keys = key.split('.');
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to default language
      value = translations[defaultLang];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get a translation with placeholder replacement
 * e.g., t(lang, "footer.copyright", { year: "2024" })
 */
export function tWithParams(
  lang: Lang,
  key: TranslationKey,
  params: Record<string, string | number>
): string {
  let text = t(lang, key);

  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
  }

  return text;
}

/**
 * Get all translations for a specific section
 */
export function getSection<T = Record<string, unknown>>(lang: Lang, section: string): T {
  const keys = section.split('.');
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return {} as T;
    }
  }

  return value as T;
}

/**
 * Create a translation function bound to a specific language
 * Useful in components to avoid passing lang repeatedly
 */
export function createTranslator(lang: Lang) {
  return {
    t: (key: TranslationKey) => t(lang, key),
    tWithParams: (key: TranslationKey, params: Record<string, string | number>) =>
      tWithParams(lang, key, params),
    getSection: <T = Record<string, unknown>>(section: string) => getSection<T>(lang, section),
    lang,
  };
}

/**
 * Type-safe translation helper for use in Astro components
 */
export type Translator = ReturnType<typeof createTranslator>;