
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin globally
gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initChapterDeck(section: HTMLElement) {
  const pinWrapper = section.querySelector('.chapter-pin-wrapper') as HTMLElement;
  const cards = section.querySelectorAll('.chapter-card');
  const dots = section.querySelectorAll('.chapter-dot');
  const accordion = section.querySelector('.chapter-accordion') as HTMLElement;
  
  if (!pinWrapper || !cards || cards.length === 0) return;

  // Cleanup any existing ScrollTriggers for this element to prevent duplicates
  ScrollTrigger.getAll().forEach(t => {
    if (t.trigger === section) t.kill();
  });

  const isReduced = prefersReducedMotion();
  const isMobile = window.innerWidth < 768;

  if (isReduced || isMobile) {
    pinWrapper.style.display = 'none';
    if (accordion) {
      accordion.classList.remove('hidden');
      accordion.classList.add('flex');
    }
    return;
  }

  // Ensure pinned wrapper is visible
  pinWrapper.style.display = 'block';
  if (accordion) {
    accordion.classList.add('hidden');
    accordion.classList.remove('flex');
  }

  // GSAP Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${cards.length * 100}%`,
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true, // Important for resize/navigation
    }
  });

  // Animate cards
  cards.forEach((card, i) => {
    // 1. Fade in & Slide up
    tl.to(card, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      onStart: () => {
        updateDots(i);
      },
      onReverseComplete: () => {
        updateDots(i - 1);
      }
    });
    
    // 2. Hold
    tl.to(card, { duration: 0.5 });

    // 3. Exit (except last)
    if (i < cards.length - 1) {
      tl.to(card, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.in'
      });
    }
  });

  function updateDots(activeParam: number) {
    const activeIndex = Math.max(0, Math.min(activeParam, dots.length ? dots.length - 1 : 0));
    dots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add('bg-accent');
        dot.classList.remove('bg-border/60');
      } else {
        dot.classList.remove('bg-accent');
        dot.classList.add('bg-border/60');
      }
    });
  }
}

// Global cleanup function for Astro View Transitions
export function cleanupMotion() {
  ScrollTrigger.getAll().forEach(t => t.kill());
}
