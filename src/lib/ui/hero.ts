import { initOnce, initSection } from '@/lib/lifecycle';
import { animateCounter, bindTilt, createRevealObserver } from '@/lib/ui/animations';

export function initHeroUI() {
  function initHero() {
    const heroSection = document.getElementById('hero');
    initOnce(heroSection, 'hero', (root) => {
      const counters = Array.from(root.querySelectorAll('.stat-counter')) as HTMLElement[];
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cleanups: Array<() => void> = [];
      const timeouts: number[] = [];
      let countersStarted = false;

      const startCounters = () => {
        if (countersStarted || prefersReducedMotion) return;
        countersStarted = true;
        counters.forEach((counter, index) => {
          const timeoutId = window.setTimeout(() => {
            cleanups.push(
              animateCounter(counter, {
                start: 0,
                target: parseInt(counter.dataset.target || '0', 10),
                duration: 1500,
              })
            );
          }, 1500 + index * 200);
          timeouts.push(timeoutId);
        });
      };

      const revealCleanup = createRevealObserver(root, {
        selector: '.orb-container',
        threshold: 0.3,
        onReveal: startCounters,
      });

      const orbContainer = root.querySelector('.orb-container') as HTMLElement | null;
      if (orbContainer) {
        cleanups.push(
          bindTilt(orbContainer, {
            intensity: 40,
            scale: 1.02,
            perspective: 1200,
            disabled: prefersReducedMotion,
          })
        );
      }

      return () => {
        revealCleanup();
        timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
        cleanups.forEach((cleanup) => cleanup());
      };
    });
  }

  initSection('hero-init', initHero);
}
