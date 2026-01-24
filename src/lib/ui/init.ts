export function initUI() {
  const loadIfPresent = <T extends Record<string, () => void>>(
    selector: string,
    loader: () => Promise<T>,
    initKey: keyof T
  ) => {
    if (!document.querySelector(selector)) return;
    void loader().then((mod) => {
      mod[initKey]();
    });
  };

  loadIfPresent('[data-header]', () => import('./header'), 'initHeaderUI');
  loadIfPresent('[data-lang-switch]', () => import('./lang-switch'), 'initLangSwitchUI');
  loadIfPresent('.theme-toggle', () => import('./theme-toggle'), 'initThemeToggleUI');
  loadIfPresent('.case-filters', () => import('./case-filters'), 'initCaseFiltersUI');
  loadIfPresent('.article-filters', () => import('./article-filters'), 'initArticleFiltersUI');
  loadIfPresent('#contact', () => import('./contact'), 'initContactUI');
  loadIfPresent('#hero', () => import('./hero'), 'initHeroUI');
  loadIfPresent('#languages', () => import('./languages'), 'initLanguagesUI');
  loadIfPresent('#timeline', () => import('./timeline'), 'initTimelineUI');
  loadIfPresent('#proof', () => import('./proof-strip'), 'initProofStripUI');
  loadIfPresent('#awards', () => import('./awards'), 'initAwardsUI');
  loadIfPresent('#education', () => import('./education'), 'initEducationUI');
  loadIfPresent('#hired-for', () => import('./hired-for'), 'initHiredForUI');
}
