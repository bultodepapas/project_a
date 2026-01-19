import { initOnce, initSection } from '@/lib/lifecycle';
import { animateCounter, bindTilt, createRevealObserver } from '@/lib/ui/animations';

function parseMetric(metric: string) {
  const prefix = metric.startsWith('$') ? '$' : '';
  let suffix = '';
  if (metric.includes('K')) suffix += 'K';
  if (metric.includes('%')) suffix += '%';
  if (metric.includes('+')) suffix += '+';
  const numericPart = metric.replace(/[^0-9]/g, '');
  const target = parseInt(numericPart, 10) || 0;
  return { prefix, suffix, target };
}

function updateConnectionLines() {
  const svg = document.querySelector('.connection-lines');
  if (!svg || window.innerWidth < 1024) return;

  const cards = document.querySelectorAll('.hired-card');
  if (cards.length < 3) return;

  const path1 = svg.querySelector('.connection-path-1');
  const path2 = svg.querySelector('.connection-path-2');

  const svgRect = svg.getBoundingClientRect();

  const getCardCenter = (card: Element) => {
    const rect = card.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - svgRect.left,
      y: rect.top + rect.height / 2 - svgRect.top,
    };
  };

  const card1 = getCardCenter(cards[0]);
  const card2 = getCardCenter(cards[1]);
  const card3 = getCardCenter(cards[2]);

  const curve1 = `M ${card1.x} ${card1.y} Q ${(card1.x + card2.x) / 2} ${card1.y - 50} ${card2.x} ${card2.y}`;
  const curve2 = `M ${card2.x} ${card2.y} Q ${(card2.x + card3.x) / 2} ${card2.y - 50} ${card3.x} ${card3.y}`;

  if (path1) path1.setAttribute('d', curve1);
  if (path2) path2.setAttribute('d', curve2);
}

export function initHiredForUI() {
  function initHiredFor() {
    const section = document.getElementById('hired-for');
    initOnce(section, 'hired-for', (root) => {
      const cleanups: Array<() => void> = [];
      const timeouts: number[] = [];

      const revealCleanup = createRevealObserver(root, {
        selector: '.reveal-element',
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px',
        visibleClass: '',
        onReveal: (el) => {
          el.classList.remove('opacity-0', 'translate-y-8', 'translate-y-12');
          el.classList.add('opacity-100', 'translate-y-0');

          if (el.classList.contains('hired-card')) {
            // Initialize tilt effect after reveal to avoid transform conflicts
            cleanups.push(
              bindTilt(el as HTMLElement, {
                intensity: 20,
                scale: 1.02,
                perspective: 1200,
                onMove: () => {
                  // Disable CSS transition during tilt for smooth movement
                  (el as HTMLElement).style.transition = 'none';
                },
                onLeave: () => {
                  // Re-enable transition and reset transform
                  (el as HTMLElement).style.transition = '';
                  (el as HTMLElement).style.transform = '';
                },
              })
            );

            const metricEl = el.querySelector('.metric-value') as HTMLElement | null;
            if (metricEl) {
              const metric = metricEl.dataset.metric || metricEl.textContent || '';
              const { prefix, suffix, target } = parseMetric(metric);
              if (!target) {
                metricEl.textContent = metric;
              } else {
                const timeoutId = window.setTimeout(() => {
                  cleanups.push(
                    animateCounter(metricEl, {
                      start: 0,
                      target,
                      duration: 1500,
                      easing: 'easeOutExpo',
                      prefix,
                      suffix,
                    })
                  );
                }, 400);
                timeouts.push(timeoutId);
              }
            }
          }
        },
      });

      updateConnectionLines();
      const resizeHandler = () => updateConnectionLines();
      window.addEventListener('resize', resizeHandler);

      return () => {
        revealCleanup();
        timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
        cleanups.forEach((cleanup) => cleanup());
        window.removeEventListener('resize', resizeHandler);
      };
    });
  }

  initSection('hired-for-init', initHiredFor);
}
