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

      return () => {
        cleanupReveal();
        cleanups.forEach((cleanup) => cleanup());
      };
    });
  }

  initSection('timeline-init', initTimeline);
}
