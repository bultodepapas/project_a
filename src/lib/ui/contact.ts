import { initOnce, initSection } from '@/lib/lifecycle';
import { createRevealObserver } from '@/lib/ui/animations';

export function initContactUI() {
  function initContact() {
    const section = document.getElementById('contact');
    initOnce(section, 'contact', (root) => {
      const cleanupReveal = createRevealObserver(root, {
        threshold: 0.2,
        rootMargin: '50px',
        onReveal: (el) => {
          el.classList.remove('opacity-0', 'translate-y-6');
          el.classList.add('opacity-100', 'translate-y-0');
        },
      });

      // LiquidSwirl effect is handled by inline script in component

      const copyBtn = root.querySelector('#copy-email-btn') as HTMLElement | null;
      const feedback = root.querySelector('#copy-feedback') as HTMLElement | null;

      let clickHandler: ((e: Event) => void) | null = null;
      if (copyBtn && feedback) {
        clickHandler = async (e: Event) => {
          e.preventDefault();
          const email = copyBtn.dataset.email;

          if (email) {
            try {
              await navigator.clipboard.writeText(email);
              feedback.classList.remove('opacity-0');
              feedback.classList.add('opacity-100');

              setTimeout(() => {
                feedback.classList.remove('opacity-100');
                feedback.classList.add('opacity-0');
              }, 2000);
            } catch (err) {
              console.error('Failed to copy email:', err);
            }
          }
        };
        copyBtn.addEventListener('click', clickHandler);
      }

      return () => {
        cleanupReveal();
        if (copyBtn && clickHandler) {
          copyBtn.removeEventListener('click', clickHandler);
        }
      };
    });
  }

  initSection('contact-init', initContact);
}
