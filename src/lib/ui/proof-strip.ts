import { initOnce, initSection } from '@/lib/lifecycle';
import { animateCounter, animateRing, createRevealObserver } from '@/lib/ui/animations';

export function initProofStripUI() {
  function initProofStrip() {
    const section = document.getElementById('proof');
    initOnce(section, 'proof-strip', (root) => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cleanups: Array<() => void> = [];
      const timeouts: number[] = [];

      const headerCleanup = createRevealObserver(root, {
        selector: '.reveal-element',
        threshold: 0.2,
        visibleClass: '',
        onReveal: (el) => {
          el.classList.remove('opacity-0', 'translate-y-6');
          el.classList.add('opacity-100', 'translate-y-0');
        },
      });

      const cardCleanup = createRevealObserver(root, {
        selector: '.proof-card',
        threshold: 0.5,
        rootMargin: '-80px 0px -80px 0px',
        visibleClass: '',
        onReveal: (el) => {
          const card = el as HTMLElement;
          const cardIndex = parseInt(card.dataset.index || '0', 10);
          const baseDelay = cardIndex * 100;

          const progressRing = card.querySelector('.progress-ring') as SVGCircleElement | null;
          const numberEl = card.querySelector('.proof-number') as HTMLElement | null;

          if (reduced) {
            if (progressRing) {
              progressRing.style.strokeDashoffset = progressRing.dataset.offset || '0';
            }
            if (numberEl) {
              numberEl.textContent = numberEl.dataset.target || '0';
            }
            return;
          }

          if (numberEl) {
            numberEl.textContent = '0';
          }

          card.classList.remove('opacity-0', 'translate-y-8');
          card.classList.add('opacity-100', 'translate-y-0');

          if (progressRing) {
            cleanups.push(animateRing(progressRing, { delay: baseDelay + 400 }));
          }
          if (numberEl) {
            const timeoutId = window.setTimeout(() => {
              cleanups.push(
                animateCounter(numberEl, {
                  start: 0,
                  target: parseInt(numberEl.dataset.target || '0', 10),
                  duration: 2000,
                  easing: 'easeOutExpo',
                })
              );
            }, baseDelay + 600);
            timeouts.push(timeoutId);
          }
        },
      });

      return () => {
        headerCleanup();
        cardCleanup();
        timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
        cleanups.forEach((cleanup) => cleanup());
      };
    });
  }

  initSection('proof-strip-init', initProofStrip);
}
