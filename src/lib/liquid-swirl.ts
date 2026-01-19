/**
 * Liquid Swirl Effect Module
 * Implementa un efecto visual de vórtice líquido en tarjetas de contacto
 * Al pasar el mouse, crea una absorción hipnotizante hacia el centro
 */

interface LiquidSwirlConfig {
  container: HTMLElement;
  intensity: number; // 0-1, qué tan intenso es el efecto
  radius: number; // radio del vórtice en px
  throttle: number; // ms entre actualizaciones de mouse
  baseFrequency: number; // frecuencia base para turbulencia
}

interface MouseState {
  x: number;
  y: number;
  isInside: boolean;
}

/**
 * Inicializa el efecto Liquid Swirl para una tarjeta
 */
export function initLiquidSwirl(config: LiquidSwirlConfig): () => void {
  const { container, intensity = 0.8, radius = 150, throttle = 16, baseFrequency = 0.3 } = config;

  // Referencias a elementos clave
  const card = container as HTMLElement;
  const svgFilter = card.querySelector('svg[data-liquid-filter]') as SVGElement;
  const clipPath = card.querySelector('[data-swirl-clip]') as HTMLElement;

  if (!svgFilter || !clipPath) {
    console.warn('LiquidSwirl: SVG filter o clip-path no encontrados', { card });
    return () => {};
  }

  // Estado del mouse
  const mouseState: MouseState = {
    x: 0,
    y: 0,
    isInside: false,
  };

  // RAF control
  let rafId: number | null = null;
  let idleTimer: number | null = null;
  let idleIntensityBoost = 0;

  // Variables CSS para animación
  const setCSSVar = (name: string, value: string | number) => {
    card.style.setProperty(name, String(value));
  };

  // Throttle para eventos de mouse
  let lastMouseUpdate = 0;
  const updateMouse = (e: MouseEvent) => {
    const now = Date.now();
    if (now - lastMouseUpdate < throttle) return;
    lastMouseUpdate = now;

    const rect = card.getBoundingClientRect();
    mouseState.x = e.clientX - rect.left;
    mouseState.y = e.clientY - rect.top;
    mouseState.isInside = true;

    // Reset idle boost when mouse moves
    idleIntensityBoost = 0;
    if (idleTimer) clearTimeout(idleTimer);
    
    // Start idle timer (increase intensity if mouse stays still)
    idleTimer = window.setTimeout(() => {
      let boostProgress = 0;
      const boostDuration = 500;
      const startTime = Date.now();
      
      const animateBoost = () => {
        if (!mouseState.isInside) return;
        
        const elapsed = Date.now() - startTime;
        boostProgress = Math.min(elapsed / boostDuration, 1);
        idleIntensityBoost = boostProgress * 0.2; // Max 0.2 boost
        
        updateSwirlEffect();
        
        if (boostProgress < 1) {
          requestAnimationFrame(animateBoost);
        }
      };
      
      animateBoost();
    }, 500);

    updateSwirlEffect();
  };

  // Calcula la intensidad del efecto basada en distancia desde centro
  const updateSwirlEffect = () => {
    if (!mouseState.isInside) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Distancia desde el centro de la tarjeta
    const dx = mouseState.x - centerX;
    const dy = mouseState.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Intensidad decrece con distancia
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const distanceRatio = Math.max(0, 1 - distance / maxDistance);
    const currentIntensity = (distanceRatio * intensity) + idleIntensityBoost;

    // Ángulo hacia el cursor para rotación del vórtice
    const angle = Math.atan2(dy, dx);

    // Actualiza variables CSS para clip-path y filtro
    setCSSVar('--swirl-x', `${mouseState.x}px`);
    setCSSVar('--swirl-y', `${mouseState.y}px`);
    setCSSVar('--swirl-intensity', currentIntensity);
    setCSSVar('--swirl-angle', `${angle}rad`);
    setCSSVar('--swirl-distance', `${distance}px`);

    // Actualiza el filtro SVG feTurbulence
    const turbulence = svgFilter.querySelector('feTurbulence') as SVGElement;
    if (turbulence) {
      const dynamicFreq = baseFrequency + currentIntensity * 0.3;
      turbulence.setAttribute('baseFrequency', String(dynamicFreq));
      
      // Añade variación sutil en el tiempo
      const time = Date.now() / 1000;
      const seed = Math.floor(Math.sin(time * 0.5) * 100 + 100);
      turbulence.setAttribute('seed', String(seed));
    }
  };

  // Restaura estado cuando sale del mouse
  const resetSwirlEffect = () => {
    mouseState.isInside = false;
    idleIntensityBoost = 0;
    
    // Clear timers
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    // Anima la salida del efecto
    let transitionProgress = 0;
    const transitionDuration = 400; // ms
    const startTime = Date.now();

    const animateExit = () => {
      const elapsed = Date.now() - startTime;
      transitionProgress = Math.min(elapsed / transitionDuration, 1);

      // Easing out cubic
      const eased = 1 - Math.pow(1 - transitionProgress, 3);
      const currentIntensity = (1 - eased) * parseFloat(getComputedStyle(card).getPropertyValue('--swirl-intensity') || '0');

      setCSSVar('--swirl-intensity', currentIntensity);

      if (transitionProgress < 1) {
        rafId = requestAnimationFrame(animateExit);
      } else {
        rafId = null;
      }
    };

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animateExit);
  };

  // Event listeners
  card.addEventListener('mousemove', updateMouse);
  card.addEventListener('mouseleave', resetSwirlEffect);
  card.addEventListener('mouseenter', () => {
    mouseState.isInside = true;
  });

  // Retorna función cleanup
  return () => {
    card.removeEventListener('mousemove', updateMouse);
    card.removeEventListener('mouseleave', resetSwirlEffect);
    card.removeEventListener('mouseenter', () => {});
    
    // Clear any pending timers/rafs
    if (idleTimer) clearTimeout(idleTimer);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

/**
 * Inicializa Liquid Swirl en todas las tarjetas de contacto
 * Con soporte para prefers-reduced-motion
 */
export function initAllLiquidSwirls(): () => void {
  // Respeta preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    console.debug('LiquidSwirl: disabled due to prefers-reduced-motion');
    return () => {};
  }

  // Selecciona todas las tarjetas con el atributo data-liquid-swirl
  const cards = document.querySelectorAll('[data-liquid-swirl]') as NodeListOf<HTMLElement>;

  if (cards.length === 0) {
    return () => {};
  }

  // Inicializa cada tarjeta
  const cleanups: Array<() => void> = [];

  cards.forEach((card) => {
    const config: LiquidSwirlConfig = {
      container: card,
      intensity: parseFloat(card.dataset.swirlIntensity || '0.8'),
      radius: parseInt(card.dataset.swirlRadius || '150', 10),
      throttle: 16, // ~60fps
      baseFrequency: parseFloat(card.dataset.swirlBaseFrequency || '0.3'),
    };

    const cleanup = initLiquidSwirl(config);
    cleanups.push(cleanup);
  });

  // Retorna cleanup que deshace todas las inicializaciones
  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
