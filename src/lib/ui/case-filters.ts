import { initOnce, initSection } from '@/lib/lifecycle';
import { useFilters } from '@/lib/ui/filters';

export function initCaseFiltersUI() {
  function initFilters() {
    const container = document.querySelector('.case-filters');
    initOnce(container, 'case-filters', (root) => {
      const noResultsMsg = document.getElementById('no-results-message');
      const cardsRoot = root.closest('.section') ?? document;

      return useFilters(root, {
        cardSelector: '.case-card',
        cardsRoot,
        filterAttr: 'data-theme',
        noResultsEl: noResultsMsg,
        onShow: (card) => {
          setTimeout(() => {
            card.classList.remove('opacity-0', 'translate-y-4');
            card.classList.add('opacity-100', 'translate-y-0');
          }, 50);
        },
        onHide: (card) => {
          card.classList.add('opacity-0', 'translate-y-4');
          card.classList.remove('opacity-100', 'translate-y-0');
        },
      });
    });
  }

  initSection('case-filters-init', initFilters);
}
