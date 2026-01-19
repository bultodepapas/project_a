# Effect Library & Animation Reference

Este documento recopila los efectos implementados, así como un catálogo de tecnologías, librerías y tendencias para referencia futura.

---

## 1. Apéndice E: Artilugios y Efectos Implementados

Resumen de los efectos visuales y funcionales actualmente activos en el proyecto.

| Categoría | Efecto / Artilugio | Ubicación Principal | Implementación Técnica |
| :--- | :--- | :--- | :--- |
| **Motion Core** | View Transitions | `src/layouts/Base.astro` | `ClientRouter` (Astro Transitions) |
| | Pinned Section | `src/components/home/ChapterDeck.astro` | GSAP ScrollTrigger (`motion.ts`) |
| | Reduced Motion | `src/lib/motion.ts` | CSS Media Query + JS Fallbacks |
| **Hero & Atmosphere** | Aurora Background | `Hero.astro`, `Education.astro` | CSS Keyframes (`aurora-float`) |
| | Floating Orbs/Particles | Global (`Hero`, `Proof`, `Awards`) | CSS Animation + Parallax JS |
| | Mesh Gradient Orb | `Hero.astro` | CSS Radial Gradients (`mesh-gradient`) |
| | Constellation Network | `Education.astro` | Canvas 2D + JS Particles |
| **Interactive Elements** | 3D Tilt Cards | `Timeline.astro`, `Education.astro` | JS `mousemove` + CSS `transform: rotateX/Y` |
| | Spotlight Hover | `Timeline.astro`, `Education.astro` | JS Mouse Tracking (CSS Vars) |
| | Magnetic/Flip Cards | `Education.astro` | CSS `transform-style: preserve-3d` |
| | Trophy Bounce | `Awards.astro` | CSS Keyframes (`:hover`) |
| **Data Visualization** | Animated Counters | `Hero.astro`, `ProofStrip.astro` | JS `requestAnimationFrame` |
| | Progress Rings | `ProofStrip.astro` | SVG `stroke-dashoffset` |
| | Line Draw / Flow | `Timeline.astro`, `OperatingModel.astro` | CSS `scaleY` / `translateX` |
| **Visual Polish** | Glassmorphism | `src/styles/global.css` | `backdrop-filter: blur()` |
| | Holographic Shimmer | `Education.astro` | CSS `mix-blend-mode: color-dodge` |
| | Glitch Text | `Education.astro` | CSS Keyframes + Clip Path |
| | Shine / Sweep | `Awards.astro`, `ProofStrip.astro` | CSS Gradient Animation |
| | Glow Pulse (Nodes) | `OperatingModel.astro`, `Timeline.astro` | CSS Keyframes (`pulse-node`) |

---

## 2. Catálogo de Tecnologías y Estrategias

Recopilación de librerías, APIs y técnicas para elevar la experiencia de usuario y visual.

### Arquitectura & Core Motion

#### **Astro View Transitions** (MPA → sensación de app)
*   **Qué hace:** Transiciones animadas entre páginas sin “flash” de recarga, manteniendo continuidad visual (muy “premium”).
*   **Cómo lo hace:** Astro se apoya en la View Transitions API del navegador y agrega un router/controles para persistir elementos, estados y animar cambios de vista.
*   **Estrategia 2026:**
    *   **Qué es:** Transiciones nativas entre vistas/DOM states, tanto en SPA como en navegación MPA.
    *   **Por qué 2026:** Pieza central de compatibilidad/estándares (Interop), con guías para diseñarlas bien.
    *   **Aplicación (Astro 5):** Continuidad visual real: el header “viaja”, cards se “teletransportan”, fondo aurora se mantiene. Define `view-transition-name` en elementos clave.

#### **Barba.js**
*   **Por qué sigue WOW:** Logra sensación de “fluidez” entre rutas sin que el usuario perciba el salto típico.
*   **Cómo funciona:** Intercepta navegación, hace swap del contenedor y da hooks (leave/enter) para animaciones. Pequeña y sin dependencias.
*   **Caso de uso:** Transiciones complejas más allá de View Transitions o control total de persistencia.
*   **Nota adicional:** Cuando quieres transiciones coreografiadas y persistencia de elementos, y no depender solo del comportamiento nativo. Ojo en Astro: define bien qué contenedor reemplaza y reinicializa animaciones.

#### **CSS Scroll-Driven Animations**
*   **Qué es:** Animar propiedades en función del scroll (no del tiempo). El scroll se vuelve la “línea de tiempo” nativa (`animation-timeline: scroll() / view()`).
*   **Por qué 2026:** Estándar formalizado y empujado por MDN. Reduce dependencia de JS para muchos reveals y micro-cinematics.
*   **Aplicación:** Para reveals, parallax suave, progress indicators, “chapters” livianos. Reserva GSAP para escenas complejas; usa esto para el 70-80% de efectos de apoyo.

### Scroll & Navegación

#### **GSAP ScrollTrigger**
*   **Qué hace:** El estándar para experiencias tipo “capítulos” (como ChapterDeck): pin, scrub, snap, triggers precisos.
*   **Cómo lo hace:** Engancha timelines/tweens a hitos de scroll; permite “pin” (fijar secciones) y “scrub” (sincronizar animación con scroll).

#### **GSAP ScrollSmoother**
*   **Qué hace:** Smooth scroll vertical con look “cinema” sin problemas de accesibilidad típicos.
*   **Cómo lo hace:** Suaviza usando scroll nativo (sin barras falsas), integrado con ScrollTrigger.

#### **Lenis**
*   **Qué hace:** Suaviza el scroll y lo vuelve “fluido”, control simple y performance-friendly.
*   **Cómo lo hace:** Loop con `requestAnimationFrame`, aplica easing y expone eventos de scroll.

#### **Locomotive Scroll (v5)**
*   **Por qué sigue WOW:** Clásico de Awwwards, ahora v5 se apoya en Lenis con mejor performance/touch.
*   **Cómo funciona:** Wrapper “opinionado” con smooth scroll + detection layer, y parallax con `data-scroll-speed`.
*   **En tu stack:** Para páginas “cinematic” específicas. Si ya usas ScrollTrigger, define una sola fuente de scroll.

#### **instant.page**
*   **Por qué sigue WOW:** Sube brutalmente la percepción de velocidad: el sitio “se siente caro”.
*   **Cómo funciona:** Prefetch del destino cuando el usuario hace hover (o touchstart).
*   **En tu stack:** Perfecto para navegación principal y cards clicables. Usar con criterio.

### Animación & Micro-interacciones

#### **Motion (motion.dev)**
*   **Qué hace:** Animaciones súper fluidas (UI, scroll, gestures) con footprint pequeño (~2.3kb). Motor híbrido (WAAPI + rAF).
*   **Por qué es WOW:** Microinteracciones y animación UI sin meter GSAP en todo.
*   **En tu stack:** Islas Astro pequeñas (botones “magnetic”, hover depth, counters, loaders).

#### **Anime.js (v4)**
*   **Por qué sigue WOW:** Para micro-interacciones elegantes y finas cuando no quieres GSAP.
*   **Cómo funciona:** API directa (`animate`) + timelines, staggering, easings. Muy “animator-friendly”.
*   **En tu stack:** Motor local en islas pequeñas: botones, loaders, badges.

#### **Theatre.js**
*   **Qué hace:** Motion design de alta fidelidad con mentalidad de “editor”: secuencias, keyframes, escenas cinemáticas.
*   **En tu stack:** Ideal para `ChapterDeck`. Un “director” de secuencias (capítulos, keyframes, cámaras/objetos) que exporta estados a producción.

#### **Vanilla-tilt.js**
*   **Por qué sigue WOW:** Sensación de profundidad/“producto real” sin 3D pesado.
*   **Cómo funciona:** Rotación/tilt según cursor, permite “glare” y parallax interno.
*   **En tu stack:** Cards de skills, pricing, “featured projects”. (2–4 elementos clave).

#### **GSAP Flip**
*   **Qué hace:** Animaciones tipo “muevo cards de lugar y se ve natural” ante cambios agresivos de DOM/layout.
*   **Cómo lo hace:** Registra estado inicial -> cambio DOM -> anima compensando offsets. Brutal para filtros y grids.

#### **Animaciones Rápidas (CSS/Tailwind)**
*   **Tailwind Animation Utilities:** Definir `@keyframes` y tokens `--animate-*` (v4) para clases tipo `animate-wiggle`.
*   **tailwindcss-animate:** Clases listas para entradas/salidas (fade/zoom/slide/spin) con control de delay/duration. Útil para modales, tooltips.
*   **AOS (Animate On Scroll):** Animaciones simples al entrar en viewport usando data-attributes.

### UI Patterns & Componentes

#### **Popover API (Nativo)**
*   **Qué es:** Estándar nativo para popovers/overlays con atributo `popover` y métodos JS mínimos.
*   **Por qué 2026:** Reemplaza componentes custom (menos deps, más accesible). `popover="hint"` abre puertas a UX rica.
*   **Aplicación:** Menús idioma, help bubbles, glosarios.

#### **CSS Anchor Positioning**
*   **Qué es:** Posicionar elementos relativos a un “anchor” con CSS puro, sin hacks JS.
*   **Por qué 2026:** Cambia cómo se construyen UI flotantes (menos popper/floating libs).
*   **Aplicación:** Tooltips “pixel-perfect”, tarjetas hover, menús contextuales.

#### **Floating UI**
*   **Qué hace:** Posicionamiento inteligente de popovers/tooltips, evita colisiones, “smart anchor positioning”.
*   **Por qué sigue WOW:** Arregla los detalles donde otros fallan (bordes, mobile).
*   **En tu stack:** Menús complejos, help bubbles, tooltips en skills. Combina con Popover API.

#### **Tippy.js**
*   **Qué hace:** Tooltips y menús “listos para producción”, powered by Popper.
*   **En tu stack:** Ahorra wiring para opciones de estilo/UX completas.

#### **Swiper**
*   **Por qué sigue WOW:** Estándar por touch nativo, performance y flexibilidad.
*   **En tu stack:** Case Studies (galerías), testimonios, carruseles de logos.

#### **PhotoSwipe**
*   **Por qué sigue WOW:** Lightbox/galería pro (zoom, swipe) que se siente “Apple-like”.
*   **En tu stack:** Portfolio: pantallazos, renders, fotos de proyectos.

#### **Plyr**
*   **Por qué sigue WOW:** Player de video/audio con UI pro + accesible.
*   **En tu stack:** Case studies con demo video, reels.

#### **Micromodal.js**
*   **Descripción:** Modal pequeño, dependency-free y a11y-friendly (WAI-ARIA). Oro para profesionalismo.

#### **shadcn/ui**
*   **Qué hace:** Componentes UI modernos y accesibles que copias a tu codebase (no instalas lib cerrada). Estilizados con Tailwind.

### Gráficos, WebGL & Efectos Visuales

#### **Unicorn Studio**
*   **Qué es:** Herramienta no-code para escenas WebGL “Awwwards-level” embebibles.
*   **Por qué tu stack (Astro):** Permite 1–2 “signature moments” sin un proyecto Three.js gigante. Runtime pequeño.
*   **Estrategia:** Componente `UnicornScene.astro` con carga lazy (IntersectionObserver).
*   **Efectos:** Image reveal con distorsión, fondos vivos (aurora/metal/licuo), micro-interacciones premium.

#### **Three.js + WebGPU + TSL**
*   **Qué es:** Salto a gráficos modernos/eficientes. Shaders “nueva era” (Three Shader Language).
*   **Por qué 2026:** Efectos “imposibles” con WebGL típico: deformaciones complejas, partículas 3D densas, tipografía destruible.
*   **Aplicación:** “Signature effect” top 1%. Hero o sección puntual. Degrade elegante a Canvas/WebGL.

#### **PixiJS (v8)**
*   **Qué hace:** Motor 2D ultra rápido en GPU (WebGL/WebGPU).
*   **Por qué es WOW:** Experiencias ricas (sprites, filtros, partículas, glow) a velocidades muy altas. Sistemas modulares.
*   **En tu stack:** Interactividad viva sin full 3D: fondos reactivos, badges animados, data art 2D.

#### **Curtains.js**
*   **Qué hace:** Convierte elementos HTML (img/video) en planos WebGL animables con shaders.
*   **Por qué es WOW:** Look de distorsión/hover/video transitions sin reconstruir toda la UI en canvas.
*   **En tu stack:** Hero o galería: cards con shader sutil (warp, liquid reveal).

#### **OGL**
*   **Qué hace:** WebGL minimalista con poca abstracción.
*   **En tu stack:** “Momento cine” (1–2 secciones) con firma visual propia (shaders de autor).

#### **Regl**
*   **Qué hace:** WebGL “funcional”. Fuerte para partículas masivas y visualizaciones GPU.

#### **Paper.js & Two.js**
*   **Paper.js:** Vector art serio sobre Canvas (beziers, scene graph). Ideal para ilustración generativa elegante.
*   **Two.js:** Dibujo 2D renderer-agnostic (SVG/Canvas/WebGL). Gráficos/interacciones “limpias”.

#### **p5.js**
*   **Qué hace:** Creative coding, arte generativo y motion orgánico.
*   **En tu stack:** Atmosphere layers (grano, partículas suaves) que no dependen de 3D pesado.

#### **D3.js**
*   **Qué hace:** Data viz artesanal con control total.
*   **En tu stack:** Secciones de “impact / métricas / historias con datos”.

#### **GSAP MorphSVG**
*   **Qué hace:** Transformaciones entre formas SVG con look ultra-premium.

#### **Vivus**
*   **Qué hace:** “Dibujado” de SVG (logos, firmas).
*   **En tu stack:** Intro de marca, iconografía de secciones.

### Contenido, Tipografía & DX

#### **Shiki + @shikijs/rehype**
*   **Qué hace:** Resaltado de sintaxis de alta calidad (VS Code theme).
*   **En tu stack:** MDX/Case Studies técnicos.

#### **Tailwind Typography**
*   **Qué hace:** Markdown “bonito” instantáneo (`prose`) para que el contenido se lea como editorial.

#### **Pagefind**
*   **Qué hace:** Búsqueda estática ultra rápida para sitios SSG sin backend.
*   **En tu stack:** Case studies/documentación. Indexa en build time.

#### **GSAP SplitText / Splitting.js**
*   **GSAP SplitText:** Revela titulares con stagger (chars/words/lines). Cuidado de a11y.
*   **Splitting.js:** Divide texto y expone CSS vars para animar. Alternativa ligera para efectos editoriales.

#### **Tipografía 2026**
*   **Tendencia:** Expresiva + variable + kinetic. Giro contra lo uniforme.
*   **Aplicación:** Variable fonts para breakpoints, micro textura, animación tipográfica.

### Assets Generativos & Diseño

#### **Generadores de Assets**
*   **Haikei:** SVG assets generativos (blobs, waves, low-poly).
*   **GetWaves:** Olas SVG rápidas para separar secciones.
*   **SVG Backgrounds:** Colección de fondos personalizables.
*   **SVG Shape Dividers:** Divisores orgánicos (waves, angles).
*   **Hero Patterns:** Patrones SVG repetibles (grid, dots).

#### **Design Tokens & Color**
*   **Open Props:** Set de variables CSS (colores, spacing, easings).
*   **Hypercolor:** Gradientes Tailwind listos (auroras, acentos).

#### **Iconografía**
*   **Lucide:** Stroke icons consistentes y livianos.
*   **Heroicons:** Íconos coherentes con Tailwind (outline/solid/mini).
*   **Tabler Icons:** Enorme set personalizable (grid 24x24).

### Otras Tendencias & Conceptos 2026

#### **“Browser as cinema”: Scroll-storytelling**
*   **Concepto:** El scroll es narrativa (capítulos, escenas, ritmo).
*   **Aplicación:** Tu `ChapterDeck`. Sumar microinteracciones funcionales y transiciones nativas.

#### **Codrops Creative Hub**
*   **Concepto:** Vitrina de experimentos open-source cutting-edge.
*   **Estrategia:** Adaptar demos (mesh lines, distortions) en islas Astro controladas.

#### **CSS @scope**
*   **Qué es:** Styles encapsulados en subárboles DOM.
*   **Por qué 2026:** Respuesta moderna a la cascada. Define scopes por sección (Hero, ChapterDeck).

#### **“Anti-AI craft” + Textura**
*   **Concepto:** Volver a texturas reales, imperfección intencional, grano, luz natural.
*   **Aplicación:** Overlays de noise, gradients vivos, sombras suaves, micro-motion sutil.
