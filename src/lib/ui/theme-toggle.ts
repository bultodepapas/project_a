import { initSection, initOnce } from '@/lib/lifecycle';

export function initThemeToggleUI() {
  function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    if (toggleBtns.length === 0) return;

    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toggleBtns.forEach((btn) => {
      initOnce(btn, 'theme-toggle', (root) => {
        const handler = () => {
          const isDarkNow = document.documentElement.classList.contains('dark');
          const nextIsDark = !isDarkNow;

          root.classList.add('is-animating');
          setTimeout(() => {
            root.classList.remove('is-animating');
          }, 600);

          if (nextIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
        };

        root.addEventListener('click', handler);
        return () => root.removeEventListener('click', handler);
      });
    });
  }

  // Use initSection to ensure theme toggle re-initializes on every page load
  // This is critical because the toggle button element gets recreated during View Transitions
  initSection('theme-toggle-init', initThemeToggle);
}
