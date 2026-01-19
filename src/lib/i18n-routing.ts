import { defaultLang, isValidLang, supportedLangs, type Lang } from '@/i18n/config';

export function getLangStaticPaths() {
  return supportedLangs.map((lang) => ({
    params: { lang },
  }));
}

export function getLangOrRedirect(lang: string | undefined, fallbackPath: string) {
  if (lang && isValidLang(lang)) {
    return { lang: lang as Lang, redirect: null };
  }

  return { lang: defaultLang, redirect: fallbackPath };
}
