import { initOnce, initSection } from '@/lib/lifecycle';
import { animateCounter, animateWaveBar, createRevealObserver } from '@/lib/ui/animations';

export function initEducationUI() {
  function initEducation() {
    const section = document.getElementById('education');
    initOnce(section, 'education', (root) => {
      const disposers: Array<() => void> = [];
      const cleanups: Array<() => void> = [];
      const on = (
        target: EventTarget,
        event: string,
        handler: EventListenerOrEventListenerObject,
        options?: AddEventListenerOptions
      ) => {
        target.addEventListener(event, handler, options);
        disposers.push(() => target.removeEventListener(event, handler, options));
      };

      let animationId: number | null = null;

      // === CONSTELLATION PARTICLE NETWORK ===
      const canvas = root.querySelector('#edu-constellation') as HTMLCanvasElement | null;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            hue: number;
          }> = [];
          const mouse = { x: 0, y: 0, active: false };
          const container = canvas.parentElement ?? root;

          const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
          };

          const createParticles = () => {
            particles = [];
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < count; i++) {
              particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                hue: [160, 220, 280][Math.floor(Math.random() * 3)],
              });
            }
          };

          const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const isDark = document.documentElement.classList.contains('dark');
            const baseOpacity = isDark ? 0.6 : 0.4;
            const lineOpacity = isDark ? 0.3 : 0.15;

            particles.forEach((p, i) => {
              if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                  p.vx += dx * 0.00005;
                  p.vy += dy * 0.00005;
                }
              }

              p.x += p.vx;
              p.y += p.vy;

              if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
              if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${p.hue}, ${isDark ? 70 : 60}%, ${isDark ? 60 : 45}%, ${baseOpacity})`;
              ctx.fill();

              particles.slice(i + 1).forEach((p2) => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(p2.x, p2.y);
                  const alpha = (1 - dist / 120) * lineOpacity;
                  ctx.strokeStyle = `hsla(${(p.hue + p2.hue) / 2}, ${
                    isDark ? 60 : 50
                  }%, ${isDark ? 50 : 40}%, ${alpha})`;
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
                }
              });
            });

            animationId = requestAnimationFrame(animate);
          };

          resize();
          createParticles();
          animate();

          const handleResize = () => {
            resize();
            createParticles();
          };
          on(window, 'resize', handleResize);

          on(container, 'mousemove', (e) => {
            const mouseEvent = e as MouseEvent;
            const rect = canvas.getBoundingClientRect();
            mouse.x = mouseEvent.clientX - rect.left;
            mouse.y = mouseEvent.clientY - rect.top;
            mouse.active = true;
          });

          on(container, 'mouseleave', () => {
            mouse.active = false;
          });
        }
      }

      // === MAGNETIC CARD TILT ===
      root.querySelectorAll('.edu-card-wrapper').forEach((wrapper) => {
        const card = wrapper.querySelector('.edu-card') as HTMLElement | null;
        const spotlight = wrapper.querySelector('.edu-spotlight') as HTMLElement | null;
        const holographic = wrapper.querySelector('.edu-holographic') as HTMLElement | null;
        if (!card) return;

        let isFlipped = false;

        const handleMove = (e: Event) => {
          if (isFlipped) return;
          const mouseEvent = e as MouseEvent;
          const rect = (wrapper as HTMLElement).getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left;
          const y = mouseEvent.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 15;
          const rotateY = (centerX - x) / 15;

          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          if (spotlight) {
            spotlight.style.opacity = '1';
            spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`;
          }

          if (holographic) {
            holographic.style.background = `
              linear-gradient(
                ${110 + (x / rect.width) * 40}deg,
                transparent 0%,
                hsla(${(x / rect.width) * 360}, 100%, 70%, 0.1) 30%,
                hsla(${((x / rect.width) * 360 + 60) % 360}, 100%, 70%, 0.15) 50%,
                hsla(${((x / rect.width) * 360 + 120) % 360}, 100%, 70%, 0.1) 70%,
                transparent 100%
              )
            `;
          }
        };

        const handleLeave = () => {
          if (!isFlipped) {
            card.style.transform = 'rotateX(0) rotateY(0)';
          }
          if (spotlight) spotlight.style.opacity = '0';
        };

        const handleFlip = () => {
          isFlipped = !isFlipped;
          if (isFlipped) {
            card.style.transform = 'rotateY(180deg)';
          } else {
            card.style.transform = 'rotateY(0deg)';
          }
        };

        on(wrapper, 'mousemove', handleMove);
        on(wrapper, 'mouseleave', handleLeave);
        on(card, 'click', handleFlip);
      });

      // === FLAG 3D ROTATION ===
      root.querySelectorAll('.edu-flag-3d').forEach((flag) => {
        const handleMove = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (flag as HTMLElement).getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left - rect.width / 2;
          const y = mouseEvent.clientY - rect.top - rect.height / 2;
          (flag as HTMLElement).style.transform = `rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg) scale(1.2)`;
        };
        const handleLeave = () => {
          (flag as HTMLElement).style.transform = 'rotateY(0) rotateX(0) scale(1)';
        };
        on(flag, 'mousemove', handleMove);
        on(flag, 'mouseleave', handleLeave);
      });

      // === REVEAL ANIMATIONS ===
      const revealCleanup = createRevealObserver(root, {
        selector: '.edu-reveal',
        threshold: 0.4,
        rootMargin: '-50px 0px -50px 0px',
        onReveal: (el) => {
          el.querySelectorAll('.edu-progress-bar').forEach((bar) => {
            cleanups.push(animateWaveBar(bar as HTMLElement, { delay: 600 }));
          });
        },
      });

      // === PARALLAX ORBS ===
      const orbs = root.querySelectorAll('.edu-orb');
      if (orbs.length) {
        on(root, 'mousemove', (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (root as HTMLElement).getBoundingClientRect();
          const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5;
          const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5;

          orbs.forEach((orb, i) => {
            const depth = (i + 1) * 20;
            (orb as HTMLElement).style.transform = `translate(${x * depth}px, ${y * depth}px)`;
          });
        });
      }

      // === STAT COUNTER ANIMATION ===
      const statsCleanup = createRevealObserver(root, {
        selector: '.edu-stat-value',
        threshold: 0.5,
        onReveal: (el) => {
          const targetEl = el as HTMLElement;
          const text = targetEl.textContent || '';
          const match = text.match(/(\d+)/);
          if (!match) return;

          const target = parseInt(match[1], 10);
          const suffix = text.replace(/\d+/, '');

          cleanups.push(
            animateCounter(targetEl, {
              start: 0,
              target,
              duration: 1000,
              suffix,
            })
          );
        },
      });

      return () => {
        if (animationId !== null) cancelAnimationFrame(animationId);
        disposers.forEach((dispose) => dispose());
        revealCleanup();
        statsCleanup();
        cleanups.forEach((cleanup) => cleanup());
      };
    });
  }

  initSection('education-init', initEducation);
}
