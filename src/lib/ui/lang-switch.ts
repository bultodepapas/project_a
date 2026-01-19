import { initSection, initOnce } from '@/lib/lifecycle';

export function initLangSwitchUI() {
  function initLangSwitch() {
    const switches = document.querySelectorAll('[data-lang-switch]');

    switches.forEach((wrapper) => {
      initOnce(wrapper, 'lang-switch', (root) => {
        const trigger = root.querySelector('.lang-trigger') as HTMLElement | null;
        const dropdown = root.querySelector('.lang-dropdown') as HTMLElement | null;
        const options = root.querySelectorAll('.lang-option');
        const disposers: Array<() => void> = [];

        if (!trigger || !dropdown) return;

        const on = (
          target: EventTarget,
          event: string,
          handler: EventListenerOrEventListenerObject,
          options?: AddEventListenerOptions
        ) => {
          target.addEventListener(event, handler, options);
          disposers.push(() => target.removeEventListener(event, handler, options));
        };

        // Toggle dropdown
        on(trigger, 'click', (e) => {
          e.stopPropagation();
          const isOpen = root.classList.contains('is-open');

          document.querySelectorAll('[data-lang-switch].is-open').forEach((other) => {
            if (other !== root) {
              other.classList.remove('is-open');
              other.querySelector('.lang-trigger')?.setAttribute('aria-expanded', 'false');
            }
          });

          root.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', String(!isOpen));
        });

        // Language selection with particle effect
        options.forEach((option) => {
          on(option, 'click', () => {
            root.classList.add('is-switching');
            setTimeout(() => {
              root.classList.remove('is-switching');
            }, 600);
          });
        });

        // Close on outside click
        on(document, 'click', (e) => {
          if (!root.contains(e.target as Node)) {
            root.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });

        // Keyboard navigation
        on(trigger, 'keydown', (e: Event) => {
          const keyEvent = e as KeyboardEvent;
          if (keyEvent.key === 'Escape') {
            root.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
          }
          if (keyEvent.key === 'ArrowDown' && root.classList.contains('is-open')) {
            keyEvent.preventDefault();
            (options[0] as HTMLElement | undefined)?.focus();
          }
        });

        options.forEach((option, index) => {
          on(option, 'keydown', (e: Event) => {
            const keyEvent = e as KeyboardEvent;
            if (keyEvent.key === 'Escape') {
              root.classList.remove('is-open');
              trigger.setAttribute('aria-expanded', 'false');
              trigger.focus();
            }
            if (keyEvent.key === 'ArrowDown') {
              keyEvent.preventDefault();
              (options[index + 1] as HTMLElement | undefined)?.focus();
            }
            if (keyEvent.key === 'ArrowUp') {
              keyEvent.preventDefault();
              if (index === 0) {
                trigger.focus();
              } else {
                (options[index - 1] as HTMLElement | undefined)?.focus();
              }
            }
          });
        });

        return () => {
          disposers.forEach((dispose) => dispose());
        };
      });
    });
  }

  // Use initSection instead of initGlobal so LangSwitch re-initializes on every page load
  // This ensures the dropdown listeners are properly set up even after navigation
  initSection('lang-switch-init', initLangSwitch);
}
