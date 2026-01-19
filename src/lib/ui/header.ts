import { initSection, initOnce } from '@/lib/lifecycle';

export function initHeaderUI() {
  function initHeader() {
    const header = document.querySelector('[data-header]') as HTMLElement;
    initOnce(header, 'header', (root) => {
      const menuToggle = root.querySelector('[data-menu-toggle]') as HTMLElement | null;
      const mobileMenu = root.querySelector('[data-mobile-menu]') as HTMLElement | null;
      const navLinks = root.querySelectorAll('[data-nav-link]');
      const navIndicator = root.querySelector('[data-nav-indicator]') as HTMLElement | null;
      const logo = root.querySelector('[data-logo]') as HTMLElement | null;
      const cta = root.querySelector('[data-cta]') as HTMLElement | null;
      const disposers: Array<() => void> = [];

      const on = (
        target: EventTarget,
        event: string,
        handler: (e: Event) => void,
        options?: AddEventListenerOptions
      ) => {
        target.addEventListener(event, handler, options);
        disposers.push(() => target.removeEventListener(event, handler, options));
      };

      // === SCROLL BEHAVIOR ===
      const scrollThreshold = 50;
      const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > scrollThreshold) {
          root.classList.add('is-scrolled');
        } else {
          root.classList.remove('is-scrolled');
        }
      };

      on(window, 'scroll', handleScroll, { passive: true });
      handleScroll();

      // === MOBILE MENU TOGGLE ===
      if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
          const isOpen = mobileMenu.classList.contains('is-open');
          if (isOpen) {
            mobileMenu.classList.remove('is-open');
            menuToggle.classList.remove('is-open');
            document.body.style.overflow = '';
          } else {
            mobileMenu.classList.add('is-open');
            menuToggle.classList.add('is-open');
            document.body.style.overflow = 'hidden';
          }
        };

        on(menuToggle, 'click', toggleMenu);

        mobileMenu.querySelectorAll('a').forEach((link) => {
          const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            menuToggle.classList.remove('is-open');
            document.body.style.overflow = '';
          };
          on(link, 'click', closeMenu);
        });
      }

      // === NAV LINK HOVER INDICATOR ===
      if (navIndicator && navLinks.length > 0) {
        const moveIndicator = (link: Element) => {
          const rect = (link as HTMLElement).getBoundingClientRect();
          const containerRect = link.parentElement?.getBoundingClientRect();
          if (!containerRect) return;

          navIndicator.style.width = `${rect.width}px`;
          navIndicator.style.left = `${rect.left - containerRect.left}px`;
          navIndicator.style.opacity = '1';
        };

        const hideIndicator = () => {
          navIndicator.style.opacity = '0';
        };

        navLinks.forEach((link) => {
          on(link, 'mouseenter', () => moveIndicator(link));
        });

        const container = (navLinks[0] as HTMLElement | undefined)?.parentElement;
        if (container) {
          on(container, 'mouseleave', hideIndicator);
        }
      }

      // === MAGNETIC EFFECT ON LINKS ===
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

      if (!prefersReducedMotion && hasFinePointer) {
        navLinks.forEach((link) => {
          const el = link as HTMLElement;
          const handleMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = el.getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left - rect.width / 2;
            const y = mouseEvent.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
          };
          const handleLeave = () => {
            el.style.transform = 'translate(0, 0)';
          };
          on(el, 'mousemove', handleMove);
          on(el, 'mouseleave', handleLeave);
        });

        if (cta) {
          const handleMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = cta.getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left - rect.width / 2;
            const y = mouseEvent.clientY - rect.top - rect.height / 2;
            cta.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px) translateY(-2px)`;
          };
          const handleLeave = () => {
            cta.style.transform = 'translate(0, 0)';
          };
          on(cta, 'mousemove', handleMove);
          on(cta, 'mouseleave', handleLeave);
        }

        if (logo) {
          const handleMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = logo.getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left - rect.width / 2;
            const y = mouseEvent.clientY - rect.top - rect.height / 2;
            logo.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
          };
          const handleLeave = () => {
            logo.style.transform = 'translate(0, 0)';
          };
          on(logo, 'mousemove', handleMove);
          on(logo, 'mouseleave', handleLeave);
        }
      }

      return () => {
        disposers.forEach((dispose) => dispose());
        if (mobileMenu) mobileMenu.classList.remove('is-open');
        if (menuToggle) menuToggle.classList.remove('is-open');
        document.body.style.overflow = '';
      };
    });
  }

  // Use initSection to ensure header re-initializes on every page load
  // Header elements get recreated during View Transitions and need fresh event listeners
  initSection('header-init', initHeader);
}
