
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
  const navDots = section.querySelectorAll('.chapter-nav-dot');
  const progressBar = section.querySelector('.scroll-progress') as HTMLElement;
  const progressGlow = section.querySelector('.scroll-progress-glow') as HTMLElement;
  const accordion = section.querySelector('.chapter-accordion') as HTMLElement;
  const orbPrimary = section.querySelector('.orb-primary') as HTMLElement;
  const orbSecondary = section.querySelector('.orb-secondary') as HTMLElement;

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

  const cardElements = Array.from(cards) as HTMLElement[];
  const cardColors = cardElements.map(card => card.dataset.color || '#6ee7b7');

  /**
   * Update background orbs color based on active card
   */
  function updateOrbColors(activeIndex: number) {
    const color = cardColors[activeIndex] || cardColors[0];
    const nextColor = cardColors[Math.min(activeIndex + 1, cardColors.length - 1)] || color;

    if (orbPrimary) {
      orbPrimary.style.setProperty('--orb-color', color);
      orbPrimary.style.opacity = '0.15';
    }
    if (orbSecondary) {
      orbSecondary.style.setProperty('--orb-color-secondary', nextColor);
      orbSecondary.style.opacity = '0.1';
    }
  }

  /**
   * Update card stack visibility for "peek" effect
   * Shows current card fully, next 2 cards peeking behind
   */
  function updateCardStack(activeIndex: number) {
    cardElements.forEach((htmlCard, i) => {
      const cardGlow = htmlCard.querySelector('.card-glow') as HTMLElement;

      if (i === activeIndex) {
        // Active card: fully visible, highest z-index
        htmlCard.style.zIndex = '30';
        htmlCard.style.pointerEvents = 'auto';
        if (cardGlow) cardGlow.style.opacity = '0.4';
      } else if (i === activeIndex + 1) {
        // Next card: peek behind (20% opacity, slight offset)
        htmlCard.style.zIndex = '20';
        htmlCard.style.pointerEvents = 'none';
        if (cardGlow) cardGlow.style.opacity = '0';
      } else if (i === activeIndex + 2) {
        // Second next card: barely visible peek (10% opacity, more offset)
        htmlCard.style.zIndex = '10';
        htmlCard.style.pointerEvents = 'none';
        if (cardGlow) cardGlow.style.opacity = '0';
      } else {
        // All other cards: hidden
        htmlCard.style.zIndex = '0';
        htmlCard.style.pointerEvents = 'none';
        if (cardGlow) cardGlow.style.opacity = '0';
      }
    });
  }

  /**
   * Update navigation dots with progress ring animation
   */
  function updateNavigation(activeIndex: number, progress: number) {
    const circumference = 100.5; // 2 * PI * 16

    navDots.forEach((dot, i) => {
      const progressRing = dot.querySelector('.progress-ring') as SVGCircleElement;

      if (i === activeIndex) {
        dot.classList.add('active');
        // Animate progress ring fill
        if (progressRing) {
          progressRing.style.strokeDashoffset = '0';
          progressRing.style.opacity = '1';
        }
      } else if (i < activeIndex) {
        // Completed cards - full ring
        dot.classList.remove('active');
        if (progressRing) {
          progressRing.style.strokeDashoffset = '0';
          progressRing.style.opacity = '0.5';
        }
      } else {
        dot.classList.remove('active');
        if (progressRing) {
          progressRing.style.strokeDashoffset = String(circumference);
          progressRing.style.opacity = '0';
        }
      }
    });

    // Update linear progress bar
    const totalProgress = progress * 100;
    if (progressBar) {
      progressBar.style.width = `${totalProgress}%`;
    }
    if (progressGlow) {
      progressGlow.style.width = `${totalProgress}%`;
    }
  }

  function setInitialCardStates() {
    cardElements.forEach((card, i) => {
      if (i === 0) {
        gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      } else if (i === 1) {
        gsap.set(card, { opacity: 0.2, y: 16, scale: 0.96 });
      } else if (i === 2) {
        gsap.set(card, { opacity: 0.1, y: 32, scale: 0.92 });
      } else {
        gsap.set(card, { opacity: 0, y: 0, scale: 1 });
      }
    });

    updateNavigation(0, 0);
    updateCardStack(0);
    updateOrbColors(0);
  }

  // GSAP Timeline with enhanced scrub for smoother feel
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${cards.length * 100}%`,
      pin: true,
      scrub: 1, // Smoother scrub for premium feel
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
        updateNavigation(currentIndex, progress);
        updateOrbColors(currentIndex);
      }
    }
  });

  setInitialCardStates();

  // Animate cards with stack peek effect
  cardElements.forEach((card, i) => {
    const isLast = i === cards.length - 1;

    // Set initial state for peek cards
    if (i > 0) {
      gsap.set(card, {
        opacity: i === 1 ? 0.2 : i === 2 ? 0.1 : 0,
        y: i === 1 ? 16 : i === 2 ? 32 : 0,
        scale: i === 1 ? 0.96 : i === 2 ? 0.92 : 1,
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
        updateCardStack(i);
        updateOrbColors(i);
      },
      onReverseComplete: () => {
        updateCardStack(i - 1);
        updateOrbColors(i - 1);
      }
    });

    // 2. Hold (card is fully visible)
    tl.to(card, { duration: 0.6 });

    // 3. Exit to peek position (if not last card)
    if (!isLast) {
      // Check if there are cards after this one to show peek
      const hasNextCard = i < cards.length - 1;
      const hasSecondNextCard = i < cards.length - 2;

      tl.to(card, {
        opacity: 0,
        y: -60,
        scale: 0.94,
        duration: 1,
        ease: 'power2.in'
      });

      // Animate next cards into peek position
      if (hasNextCard) {
        tl.to(
          cards[i + 1],
          {
            opacity: 0.2,
            y: 16,
            scale: 0.96,
            duration: 0.9,
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
            y: 32,
            scale: 0.92,
            duration: 0.9,
            ease: 'power2.out'
          },
          '<'
        );
      }
    }
  });

  // Initialize stack on first load
  updateCardStack(0);
  updateOrbColors(0);
}

// Global cleanup function for Astro View Transitions
export function cleanupMotion() {
  ScrollTrigger.getAll().forEach(t => t.kill());
}
