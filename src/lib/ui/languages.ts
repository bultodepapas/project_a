import { initOnce, initSection } from '@/lib/lifecycle';
import {
  animateCounter,
  animateRing,
  animateWaveBar,
  bindTilt,
  createRevealObserver,
} from '@/lib/ui/animations';

export function initLanguagesUI() {
  function initLanguages() {
    const section = document.getElementById('languages');
    initOnce(section, 'languages', (root) => {
      const cleanups: Array<() => void> = [];
      const timeouts: number[] = [];
      const schedule = (fn: () => void, delay: number) => {
        const id = window.setTimeout(fn, delay);
        timeouts.push(id);
      };

      const cleanupReveal = createRevealObserver(root, {
        selector: '.lang-reveal',
        threshold: 0.45,
        rootMargin: '-60px 0px -60px 0px',
        visibleClass: '',
        onReveal: (el) => {
          const counters = el.querySelectorAll('.lang-counter');
          counters.forEach((counter) => {
            (counter as HTMLElement).textContent = '0';
          });

          el.classList.add('is-visible');

          const progressRing = el.querySelector('.lang-progress-ring') as SVGCircleElement | null;
          if (progressRing) {
            cleanups.push(animateRing(progressRing, { delay: 500 }));
          }

          const waveBar = el.querySelector('.lang-wave-bar') as HTMLElement | null;
          if (waveBar) {
            cleanups.push(animateWaveBar(waveBar, { delay: 700 }));
          }

          counters.forEach((counter, i) => {
            schedule(() => {
              cleanups.push(
                animateCounter(counter as HTMLElement, { start: 0, duration: 1000 })
              );
            }, 900 + i * 150);
          });
        },
      });

      root.querySelectorAll('.lang-card').forEach((card) => {
        const cleanupTilt = bindTilt(card as HTMLElement, {
          intensity: 20,
          scale: 1.02,
          perspective: 1000,
          spotlight: '.lang-spotlight',
          shimmer: '.lang-shimmer',
        });
        cleanups.push(cleanupTilt);
      });

      root.querySelectorAll('.lang-flag-3d').forEach((flag) => {
        const el = flag as HTMLElement;
        const handleMove = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = el.getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left - rect.width / 2;
          const y = mouseEvent.clientY - rect.top - rect.height / 2;
          el.style.transform = `rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg) scale(1.2)`;
        };
        const handleLeave = () => {
          el.style.transform = 'rotateY(0) rotateX(0) scale(1)';
        };
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
        cleanups.push(() => {
          el.removeEventListener('mousemove', handleMove);
          el.removeEventListener('mouseleave', handleLeave);
        });
      });

      return () => {
        cleanupReveal();
        timeouts.forEach((id) => window.clearTimeout(id));
        cleanups.forEach((cleanup) => cleanup());
      };
    });
  }

  initSection('languages-init', initLanguages);
}
