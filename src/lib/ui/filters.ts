export type FilterOptions = {
  buttonSelector?: string;
  cardSelector: string;
  filterAttr: string;
  groupAttr?: string;
  noResultsEl?: HTMLElement | null;
  displayStyle?: string;
  activeClasses?: string[];
  inactiveClasses?: string[];
  onShow?: (card: Element) => void;
  onHide?: (card: Element) => void;
};

export function useFilters(root: Element, options: FilterOptions) {
  const {
    buttonSelector = '.filter-btn',
    cardSelector,
    filterAttr,
    groupAttr = 'data-group',
    noResultsEl,
    displayStyle = 'flex',
    activeClasses = ['bg-primary', 'text-white', 'border-primary'],
    inactiveClasses = ['bg-transparent', 'text-muted', 'border-border'],
    onShow,
    onHide,
  } = options;

  const buttons = Array.from(root.querySelectorAll(buttonSelector));
  if (buttons.length === 0) return () => {};

  const cards = Array.from(document.querySelectorAll(cardSelector));
  const disposers: Array<() => void> = [];

  const on = (
    target: EventTarget,
    event: string,
    handler: (e: Event) => void
  ) => {
    target.addEventListener(event, handler);
    disposers.push(() => target.removeEventListener(event, handler));
  };

  let activeFilter = 'all';

  buttons.forEach((btn) => {
    on(btn, 'click', () => {
      const group = btn.getAttribute(groupAttr) || '';
      const filter = btn.getAttribute('data-filter') || 'all';

      root
        .querySelectorAll(`${buttonSelector}[${groupAttr}="${group}"]`)
        .forEach((item) => {
          item.classList.remove(...activeClasses);
          item.classList.add(...inactiveClasses);
        });

      btn.classList.remove(...inactiveClasses);
      btn.classList.add(...activeClasses);

      activeFilter = filter;
      filterCards();
    });
  });

  function filterCards() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardFilter = card.getAttribute(filterAttr);
      const isVisible = activeFilter === 'all' || cardFilter === activeFilter;

      if (isVisible) {
        (card as HTMLElement).style.display = displayStyle;
        if (onShow) onShow(card);
        visibleCount++;
      } else {
        (card as HTMLElement).style.display = 'none';
        if (onHide) onHide(card);
      }
    });

    if (noResultsEl) {
      noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  return () => {
    disposers.forEach((dispose) => dispose());
  };
}
