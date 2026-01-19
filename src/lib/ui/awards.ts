import { initOnce, initSection } from '@/lib/lifecycle';
import { createRevealObserver } from '@/lib/ui/animations';

export function initAwardsUI() {
  function initAwards() {
    const section = document.getElementById('awards');
    initOnce(section, 'awards', (root) => {
      const cleanupReveal = createRevealObserver(root, {
        selector: '.reveal-element',
        threshold: 0.35,
        rootMargin: '-40px 0px -40px 0px',
        onReveal: (el) => {
          el.classList.remove('opacity-0', 'translate-y-6');
          el.classList.add('opacity-100', 'translate-y-0');
        },
      });

      return () => {
        cleanupReveal();
      };
    });
  }

  initSection('awards-init', initAwards);
}
