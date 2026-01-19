import { initOnce, initSection } from '@/lib/lifecycle';
import { bindTilt, createRevealObserver } from '@/lib/ui/animations';

export function initTimelineUI() {
  function initTimeline() {
    const section = document.getElementById('timeline');
    initOnce(section, 'timeline', (root) => {
      const cleanupReveal = createRevealObserver(root, {
        selector: '.tl-reveal',
        threshold: 0.35,
        rootMargin: '-60px 0px -60px 0px',
        visibleClass: 'is-visible',
      });

      const cleanups: Array<() => void> = [];
      root.querySelectorAll('.tl-card').forEach((card) => {
        const cardEl = card as HTMLElement;
        const cleanupTilt = bindTilt(cardEl, {
          intensity: 20,
          scale: 1.02,
          perspective: 1000,
          onMove: ({ x, y }) => {
            const spotlight = cardEl.querySelector('.tl-spotlight') as HTMLElement | null;
            if (spotlight) {
              spotlight.style.setProperty('--mouse-x', `${x}px`);
              spotlight.style.setProperty('--mouse-y', `${y}px`);
            }
          },
        });
        cleanups.push(cleanupTilt);
      });

      return () => {
        cleanupReveal();
        cleanups.forEach((cleanup) => cleanup());
      };
    });
  }

  initSection('timeline-init', initTimeline);
}
