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

  const setButtonState = (button: Element, isActive: boolean) => {
    if (isActive) {
      button.classList.remove(...inactiveClasses);
      button.classList.add(...activeClasses);
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.classList.remove(...activeClasses);
      button.classList.add(...inactiveClasses);
      button.setAttribute('aria-pressed', 'false');
    }
  };

  let activeFilter = 'all';
  const initialActive = buttons.find((btn) => btn.classList.contains('active'));
  if (initialActive) {
    activeFilter = initialActive.getAttribute('data-filter') || 'all';
  }

  buttons.forEach((btn) => {
    const isActive = btn.getAttribute('data-filter') === activeFilter;
    setButtonState(btn, isActive);
  });

  buttons.forEach((btn) => {
    on(btn, 'click', () => {
      const group = btn.getAttribute(groupAttr) || '';
      const filter = btn.getAttribute('data-filter') || 'all';

      root
        .querySelectorAll(`${buttonSelector}[${groupAttr}="${group}"]`)
        .forEach((item) => setButtonState(item, false));

      setButtonState(btn, true);

      activeFilter = filter;
      filterCards();
    });
  });

  function filterCards() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardFilter = card.getAttribute(filterAttr);
      const values = cardFilter
        ? cardFilter.split(',').map((value) => value.trim()).filter(Boolean)
        : [];
      const isVisible =
        activeFilter === 'all' || values.includes(activeFilter);

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
