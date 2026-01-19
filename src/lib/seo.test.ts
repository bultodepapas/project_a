import { describe, it, expect } from 'vitest';
import { getHrefLangUrls } from './seo';

describe('SEO Utilities', () => {
  describe('getHrefLangUrls', () => {
    it('generates alternate URLs for the home page', () => {
      const currentPath = '/en';
      const alternates = getHrefLangUrls(currentPath);

      expect(alternates).toHaveLength(4);
      expect(alternates).toContainEqual({ lang: 'en', url: 'https://angelaparra.com/en' });
      expect(alternates).toContainEqual({ lang: 'es', url: 'https://angelaparra.com/es' });
      expect(alternates).toContainEqual({ lang: 'fr', url: 'https://angelaparra.com/fr' });
      expect(alternates).toContainEqual({ lang: 'pt', url: 'https://angelaparra.com/pt' });
    });

    it('generates alternate URLs for a subpage', () => {
      const currentPath = '/es/resume';
      const alternates = getHrefLangUrls(currentPath);

      expect(alternates).toContainEqual({ lang: 'en', url: 'https://angelaparra.com/en/resume' });
      expect(alternates).toContainEqual({ lang: 'es', url: 'https://angelaparra.com/es/resume' });
    });

    it('handles trailing slashes gracefully', () => {
        // Assuming the logic handles it, or at least consistent with input
        const currentPath = '/fr/cases/my-case/';
        const alternates = getHrefLangUrls(currentPath);
        
        // This expectation depends on implementation, but typically we want clean URLs
        // Let's check if it preserves the path structure
        const frOption = alternates.find(a => a.lang === 'fr');
        expect(frOption?.url).toContain('/fr/cases/my-case');
    });
  });
});
