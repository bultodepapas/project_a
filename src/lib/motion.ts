
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

  /**
   * Update card stack visibility for "peek" effect
   * Shows current card fully, next 2 cards peeking behind
   */
  function updateCardStack(activeIndex: number) {
    cards.forEach((card, i) => {
      const htmlCard = card as HTMLElement;

      if (i === activeIndex) {
        // Active card: fully visible, highest z-index
        htmlCard.style.zIndex = '30';
        htmlCard.style.pointerEvents = 'auto';
      } else if (i === activeIndex + 1) {
        // Next card: peek behind (20% opacity, slight offset)
        htmlCard.style.zIndex = '20';
        htmlCard.style.pointerEvents = 'none';
      } else if (i === activeIndex + 2) {
        // Second next card: barely visible peek (10% opacity, more offset)
        htmlCard.style.zIndex = '10';
        htmlCard.style.pointerEvents = 'none';
      } else {
        // All other cards: hidden
        htmlCard.style.zIndex = '0';
        htmlCard.style.pointerEvents = 'none';
      }
    });
  }

  // GSAP Timeline with enhanced scrub for smoother feel
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${cards.length * 100}%`,
      pin: true,
      scrub: 0.8, // Slightly increased for more luxurious feel
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Calculate current active card based on scroll progress
        const progress = self.progress;
        const currentIndex = Math.min(
          Math.floor(progress * cards.length),
          cards.length - 1
        );
        updateCardStack(currentIndex);
      }
    }
  });

  // Animate cards with stack peek effect
  cards.forEach((card, i) => {
    const isLast = i === cards.length - 1;

    // Set initial state for peek cards
    if (i > 0) {
      gsap.set(card, {
        opacity: i === 1 ? 0.2 : i === 2 ? 0.1 : 0,
        y: i === 1 ? 12 : i === 2 ? 24 : 0,
        scale: i === 1 ? 0.97 : i === 2 ? 0.94 : 1,
      });
    }

    // 1. Fade in & Slide up (active card)
    tl.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      onStart: () => {
        updateDots(i);
        updateCardStack(i);
      },
      onReverseComplete: () => {
        updateDots(i - 1);
        updateCardStack(i - 1);
      }
    });

    // 2. Hold (card is fully visible)
    tl.to(card, { duration: 0.5 });

    // 3. Exit to peek position (if not last card)
    if (!isLast) {
      // Check if there are cards after this one to show peek
      const hasNextCard = i < cards.length - 1;
      const hasSecondNextCard = i < cards.length - 2;

      tl.to(card, {
        opacity: 0,
        y: -50,
        scale: 0.95,
        duration: 1,
        ease: 'power2.in'
      });

      // Animate next cards into peek position
      if (hasNextCard) {
        tl.to(
          cards[i + 1],
          {
            opacity: 0.2,
            y: 12,
            scale: 0.97,
            duration: 0.8,
            ease: 'power2.out'
          },
          '<' // Start with previous animation
        );
      }

      if (hasSecondNextCard) {
        tl.to(
          cards[i + 2],
          {
            opacity: 0.1,
            y: 24,
            scale: 0.94,
            duration: 0.8,
            ease: 'power2.out'
          },
          '<'
        );
      }
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

  // Initialize stack on first load
  updateCardStack(0);
}

// Global cleanup function for Astro View Transitions
export function cleanupMotion() {
  ScrollTrigger.getAll().forEach(t => t.kill());
}
