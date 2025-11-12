// Animation utilities and configurations
import { Variants } from "framer-motion";
import { animate, Timeline, stagger as animeStagger, random, createScope } from 'animejs';

// Word-by-word text reveal animation
export const createWordRevealVariants = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay + i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
});

// Staggered container animation
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Breathing glow effect
export const breathingGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(221, 215, 141, 0.3)",
      "0 0 40px rgba(221, 215, 141, 0.5)", 
      "0 0 20px rgba(221, 215, 141, 0.3)"
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Light sweep effect for hover interactions
export const lightSweep: Variants = {
  initial: { x: "-100%", opacity: 0 },
  animate: { 
    x: "100%", 
    opacity: [0, 1, 0],
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

// Parallax scroll effect
export const parallaxVariants = {
  slow: { y: "-20%" },
  medium: { y: "-50%" },
  fast: { y: "-80%" }
};

// Page transition variants
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Scroll-triggered reveal animation
export const scrollReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Magnetic hover effect
export const magneticHover = {
  rest: { x: 0, y: 0 },
  hover: { 
    x: 0, 
    y: -8,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  }
};

// Utility function to create custom easing
export const customEasing = [0.25, 0.46, 0.45, 0.94];

// Reduced motion variants for accessibility
export const createReducedMotionVariants = (variants: Variants): Variants => {
  const reducedVariants: Variants = {};

  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      reducedVariants[key] = {
        ...variant,
        transition: { duration: 0.01 }
      };
    } else {
      reducedVariants[key] = variant;
    }
  });

  return reducedVariants;
};

// Anime.js Timeline Functions

// Reveal animation timeline with stagger
export const createRevealTimeline = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    easing?: string;
  } = {}
) => {
  const {
    delay = 0,
    duration = 800,
    stagger = 100,
    easing = 'easeOutExpo'
  } = options;

  const animation = animate(targets, {
    opacity: [0, 1],
    translateY: [50, 0],
    duration,
    delay: animeStagger(stagger, { start: delay }),
    easing: easing as any
  });

  return animation;
};

// Stagger animation for multiple elements
export const createStaggerAnimation = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    direction?: 'normal' | 'reverse';
    properties?: Record<string, any>;
  } = {}
) => {
  const {
    delay = 0,
    duration = 600,
    stagger = 50,
    direction = 'normal',
    properties = {
      opacity: [0, 1],
      translateY: [30, 0]
    }
  } = options;

  return animate(targets, {
    ...properties,
    duration,
    delay: animeStagger(stagger * (direction === 'reverse' ? -1 : 1)),
    easing: 'easeOutQuad'
  });
};

// Morphing shape animation timeline
export const createMorphingTimeline = (
  targets: string | HTMLElement | NodeListOf<Element>,
  shapes: string[],
  options: {
    duration?: number;
    loop?: boolean;
    direction?: 'alternate';
  } = {}
) => {
  const {
    duration = 2000,
    loop = true,
    direction = 'alternate'
  } = options;

  const animations = shapes.map((shape, index) => {
    return animate(targets, {
      d: shape,
      duration: duration,
      easing: 'easeInOutQuad' as any,
      autoplay: false
    });
  });

  return { animations, loop, duration };
};

// Particle animation effect
export const createParticleEffect = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    count?: number;
    spread?: number;
    duration?: number;
    delay?: number;
  } = {}
) => {
  const {
    count = 10,
    spread = 100,
    duration = 1000,
    delay = 0
  } = options;

  return animate(targets, {
    translateX: () => random(-spread, spread),
    translateY: () => random(-spread, spread),
    scale: () => random(0.5, 1.5),
    opacity: [1, 0],
    duration,
    delay: animeStagger(delay, { start: delay }),
    easing: 'easeOutQuad'
  });
};

// Smooth scroll animation
export const createScrollAnimation = (
  targets: string | HTMLElement | NodeListOf<Element>,
  scrollTrigger: number,
  options: {
    duration?: number;
    easing?: string;
  } = {}
) => {
  const {
    duration = 600,
    easing = 'easeOutExpo'
  } = options;

  return animate(targets, {
    opacity: [0, 1],
    translateY: [50, 0],
    duration,
    easing,
    autoplay: false
  });
};

// Utility to pause/resume animations
export const controlAnimation = (animation: any, action: 'play' | 'pause' | 'restart') => {
  switch (action) {
    case 'play':
      animation.play();
      break;
    case 'pause':
      animation.pause();
      break;
    case 'restart':
      animation.restart();
      break;
  }
};

// Anime.js Entrance Animations

// Text Reveal Animation with vertical/horizontal offsets and opacity scaling
export const createTextRevealAnimation = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    direction?: 'vertical' | 'horizontal';
    stagger?: number;
    duration?: number;
    delay?: number;
    rotationalBias?: boolean;
  } = {}
) => {
  const {
    direction = 'vertical',
    stagger = 150,
    duration = 800,
    delay = 0,
    rotationalBias = false
  } = options;

  const baseProps = {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration,
    delay: animeStagger(stagger),
    easing: 'easeOutExpo'
  };

  if (direction === 'vertical') {
    return animate(targets, {
      ...baseProps,
      translateY: [50, 0],
      ...(rotationalBias && { rotateX: [15, 0] })
    });
  } else {
    return animate(targets, {
      ...baseProps,
      translateX: [-50, 0],
      ...(rotationalBias && { rotateY: [-15, 0] })
    });
  }
};

// Word-by-word text reveal with rotational bias
export const createWordRevealAnimation = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    stagger?: number;
    duration?: number;
    delay?: number;
    rotationalBias?: boolean;
  } = {}
) => {
  const {
    stagger = 100,
    duration = 600,
    delay = 0,
    rotationalBias = true
  } = options;

  return animate(targets, {
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.9, 1],
    ...(rotationalBias && { rotateX: [10, 0] }),
    duration,
    delay: animeStagger(stagger, { start: delay }),
    easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)'
  });
};

// Card reveal with clip-path polygons
export const createCardRevealAnimation = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    stagger?: number;
    duration?: number;
    delay?: number;
    clipPath?: string;
  } = {}
) => {
  const {
    stagger = 120,
    duration = 1000,
    delay = 0,
    clipPath = 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
  } = options;

  return animate(targets, {
    clipPath: [
      clipPath,
      'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
    ],
    scale: [0.95, 1],
    opacity: [0, 1],
    duration,
    delay: animeStagger(stagger, { start: delay }),
    easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)'
  });
};

// Image blur-to-sharp transition with glow effect
export const createImageRevealAnimation = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    duration?: number;
    delay?: number;
    glowColor?: string;
  } = {}
) => {
  const {
    duration = 1200,
    delay = 0,
    glowColor = 'rgba(221, 215, 141, 0.3)'
  } = options;

  const blurAnimation = animate(targets, {
    filter: ['blur(10px)', 'blur(0px)'],
    scale: [1.1, 1],
    opacity: [0.8, 1],
    duration: duration * 0.7,
    easing: 'easeOutQuad' as any
  });

  const glowAnimation = animate(targets, {
    boxShadow: [
      `0 0 0 ${glowColor}`,
      `0 0 20px ${glowColor}`,
      `0 0 40px ${glowColor}`,
      `0 0 20px ${glowColor}`
    ],
    duration: duration * 0.3,
    easing: 'easeInOutQuad' as any
  });

  return { blurAnimation, glowAnimation };
};

// Sweeping text reveal animation
export const createSweepingTextAnimation = (
  targets: string | HTMLElement | NodeListOf<Element>,
  options: {
    direction?: 'left' | 'right' | 'top' | 'bottom';
    stagger?: number;
    duration?: number;
    delay?: number;
  } = {}
) => {
  const {
    direction = 'left',
    stagger = 80,
    duration = 700,
    delay = 0
  } = options;

  let translateProps;
  switch (direction) {
    case 'left':
      translateProps = { translateX: [-100, 0] };
      break;
    case 'right':
      translateProps = { translateX: [100, 0] };
      break;
    case 'top':
      translateProps = { translateY: [-50, 0] };
      break;
    case 'bottom':
    default:
      translateProps = { translateY: [50, 0] };
      break;
  }

  return animate(targets, {
    ...translateProps,
    opacity: [0, 1],
    scale: [0.95, 1],
    duration,
    delay: animeStagger(stagger, { start: delay }),
    easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)'
  });
};

// IntersectionObserver integration for scroll-triggered animations
export const createScrollTriggeredAnimation = (
  element: HTMLElement,
  animationFactory: () => any,
  options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
  } = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          animationFactory();
          if (triggerOnce) {
            hasAnimated = true;
            observer.unobserve(element);
          }
        }
      });
    },
    { threshold, rootMargin }
  );

  observer.observe(element);
  return observer;
};

// Data-attribute based animation initializer
export const initializeDataAnimations = () => {
  // Text reveals
  document.querySelectorAll('[data-scroll-reveal="text"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    createScrollTriggeredAnimation(htmlEl, () =>
      createTextRevealAnimation(htmlEl, { direction: 'vertical' })
    );
  });

  document.querySelectorAll('[data-scroll-reveal="text-horizontal"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    createScrollTriggeredAnimation(htmlEl, () =>
      createTextRevealAnimation(htmlEl, { direction: 'horizontal' })
    );
  });

  // Word reveals
  document.querySelectorAll('[data-scroll-reveal="words"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const words = htmlEl.textContent?.split(' ') || [];
    htmlEl.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    createScrollTriggeredAnimation(htmlEl, () =>
      createWordRevealAnimation(htmlEl.querySelectorAll('.word'))
    );
  });

  // Card reveals
  document.querySelectorAll('[data-scroll-reveal="cards"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const cards = htmlEl.querySelectorAll('.project-card');
    createCardRevealAnimation(cards, {
      stagger: 120,
      delay: 200
    });
  });

  // Image reveals
  document.querySelectorAll('[data-scroll-reveal="image"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    createScrollTriggeredAnimation(htmlEl, () =>
      createImageRevealAnimation(htmlEl)
    );
  });

  // Sweeping text
  document.querySelectorAll('[data-scroll-reveal="sweep"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const direction = htmlEl.dataset.sweepDirection as any || 'bottom';
    createScrollTriggeredAnimation(htmlEl, () =>
      createSweepingTextAnimation(htmlEl, { direction })
    );
  });
};