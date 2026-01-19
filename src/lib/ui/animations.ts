export type RevealOptions = {
  selector?: string;
  visibleClass?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  onReveal?: (el: Element) => void;
};

export function createRevealObserver(root: Element, options: RevealOptions = {}) {
  const {
    selector = '.reveal-element',
    visibleClass = 'is-visible',
    threshold = 0.3,
    rootMargin = '-40px 0px -40px 0px',
    once = true,
    onReveal,
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (visibleClass) {
          entry.target.classList.add(visibleClass);
        }

        if (onReveal) {
          onReveal(entry.target);
        }

        if (once) {
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );

  root.querySelectorAll(selector).forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

export type CounterOptions = {
  start?: number;
  target?: number;
  duration?: number;
  easing?: 'easeOutCubic' | 'easeOutExpo';
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function animateCounter(el: HTMLElement, options: CounterOptions = {}) {
  const {
    start,
    target = parseInt(el.dataset.target || '0', 10),
    duration = 1200,
    easing = 'easeOutCubic',
    prefix = '',
    suffix = '',
    formatter,
  } = options;

  const initialText = el.textContent || '';
  const inferredStart = parseInt(initialText.replace(/[^0-9]/g, ''), 10);
  const startValue: number = (typeof start === 'number' && Number.isFinite(start))
    ? start
    : (Number.isFinite(inferredStart) ? inferredStart : 0);

  if (startValue === target) {
    el.textContent = formatter ? formatter(target) : `${prefix}${target}${suffix}`;
    return () => {};
  }

  let rafId: number | null = null;
  const startTime = performance.now();
  const easingFn = easing === 'easeOutExpo' ? easeOutExpo : easeOutCubic;

  const render = (value: number) => {
    if (formatter) return formatter(value);
    return `${prefix}${value}${suffix}`;
  };

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easingFn(progress);
    const current = Math.floor(startValue + (target - startValue) * eased);

    el.textContent = render(current);

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      el.textContent = render(target);
      rafId = null;
    }
  };

  rafId = requestAnimationFrame(step);

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}

export type RingOptions = {
  offset?: string;
  delay?: number;
};

export function animateRing(el: SVGCircleElement, options: RingOptions = {}) {
  const { offset = el.dataset.offset || '0', delay = 400 } = options;
  const timeoutId = window.setTimeout(() => {
    el.style.strokeDashoffset = offset;
  }, delay);

  return () => window.clearTimeout(timeoutId);
}

export type WaveOptions = {
  width?: number;
  delay?: number;
};

export function animateWaveBar(el: HTMLElement, options: WaveOptions = {}) {
  const width = options.width ?? Number(el.dataset.width || 0);
  const delay = options.delay ?? 500;
  const timeoutId = window.setTimeout(() => {
    el.style.width = `${width}%`;
  }, delay);

  return () => window.clearTimeout(timeoutId);
}

export type TiltContext = {
  el: HTMLElement;
  event: MouseEvent;
  rect: DOMRect;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
};

export type TiltOptions = {
  intensity?: number;
  scale?: number;
  perspective?: number;
  spotlight?: HTMLElement | string;
  shimmer?: HTMLElement | string;
  disabled?: boolean;
  onMove?: (context: TiltContext) => void;
  onLeave?: () => void;
};

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resolveElement(
  target: HTMLElement,
  ref?: HTMLElement | string
): HTMLElement | null {
  if (!ref) return null;
  if (typeof ref === 'string') {
    return target.querySelector(ref);
  }
  return ref;
}

export function bindTilt(el: HTMLElement, options: TiltOptions = {}) {
  const {
    intensity = 20,
    scale = 1.02,
    perspective = 1000,
    spotlight,
    shimmer,
    disabled = prefersReducedMotion(),
    onMove,
    onLeave,
  } = options;

  if (disabled) return () => {};

  const spotlightEl = resolveElement(el, spotlight);
  const shimmerEl = resolveElement(el, shimmer);

  const handleMove = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const rect = el.getBoundingClientRect();
    const x = mouseEvent.clientX - rect.left;
    const y = mouseEvent.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / intensity;
    const rotateY = (centerX - x) / intensity;

    el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

    if (spotlightEl) {
      spotlightEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`;
      spotlightEl.style.opacity = '1';
    }

    if (shimmerEl) {
      const percent = (x / rect.width) * 100;
      shimmerEl.style.background = `linear-gradient(
        ${105 + (x / rect.width) * 30}deg,
        transparent 0%,
        rgba(255,255,255,0.05) ${percent - 10}%,
        rgba(255,255,255,0.1) ${percent}%,
        rgba(255,255,255,0.05) ${percent + 10}%,
        transparent 100%
      )`;
    }

    if (onMove) {
      onMove({ el, event: mouseEvent, rect, x, y, centerX, centerY });
    }
  };

  const handleLeave = () => {
    el.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale(1)`;
    if (spotlightEl) {
      spotlightEl.style.opacity = '0';
    }
    if (shimmerEl) {
      shimmerEl.style.background = 'transparent';
    }
    if (onLeave) onLeave();
  };

  el.addEventListener('mousemove', handleMove);
  el.addEventListener('mouseleave', handleLeave);

  return () => {
    el.removeEventListener('mousemove', handleMove);
    el.removeEventListener('mouseleave', handleLeave);
  };
}
