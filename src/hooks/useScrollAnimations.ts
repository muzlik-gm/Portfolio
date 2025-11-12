"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, Timeline } from "animejs";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Anime.js scroll progress tracking
const useScrollProgress = () => {
  const progress = useRef(0);
  const listeners = useRef<Set<() => void>>(new Set());

  const updateProgress = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    progress.current = Math.min(scrollTop / (documentHeight - windowHeight), 1);

    listeners.current.forEach(callback => callback());
  }, []);

  const addListener = useCallback((callback: () => void) => {
    listeners.current.add(callback);
    return () => listeners.current.delete(callback);
  }, []);

  const getProgress = useCallback(() => progress.current, []);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  return { getProgress, addListener };
};

export function useScrollAnimations() {
  const initialized = useRef(false);
  const animeTimelines = useRef<Map<string, any>>(new Map());
  const scrollProgress = useScrollProgress();

  // Create scroll-responsive Anime.js timeline with scrub behavior
  const createScrubTimeline = useCallback((
    targets: string | HTMLElement | NodeListOf<Element>,
    keyframes: any[],
    options: {
      id?: string;
      scrub?: boolean;
      duration?: number;
      ease?: string;
    } = {}
  ) => {
    const { id, scrub = true, duration = 1000, ease = 'linear' } = options;

    const timeline = new Timeline({
      autoplay: false
    });

    keyframes.forEach((keyframe, index) => {
      timeline.add({
        targets,
        ...keyframe,
        duration: duration / keyframes.length,
        easing: ease
      }, `+=${index * (duration / keyframes.length)}`);
    });

    if (scrub) {
      const cleanup = scrollProgress.addListener(() => {
        const progress = scrollProgress.getProgress();
        timeline.seek(progress * duration);
      });

      return { timeline, cleanup };
    }

    if (id) animeTimelines.current.set(id, timeline);

    return { timeline };
  }, [scrollProgress]);

  // Background blur-out effect during section transitions
  const createBackgroundBlurEffect = useCallback((
    backgroundElements: string | HTMLElement | NodeListOf<Element>,
    options: {
      blurStart?: number;
      blurEnd?: number;
      opacityStart?: number;
      opacityEnd?: number;
    } = {}
  ) => {
    const { blurStart = 0, blurEnd = 10, opacityStart = 1, opacityEnd = 0.3 } = options;

    return createScrubTimeline(
      backgroundElements,
      [
        {
          filter: `blur(${blurStart}px)`,
          opacity: opacityStart
        },
        {
          filter: `blur(${blurEnd}px)`,
          opacity: opacityEnd
        }
      ],
      {
        id: 'background-blur',
        duration: 800,
        ease: 'easeInOutQuad'
      }
    );
  }, [createScrubTimeline]);

  // Slide-in animation for new elements
  const createSlideInAnimation = useCallback((
    targets: string | HTMLElement | NodeListOf<Element>,
    options: {
      direction?: 'left' | 'right' | 'top' | 'bottom';
      distance?: number;
      stagger?: number;
      delay?: number;
    } = {}
  ) => {
    const { direction = 'bottom', distance = 100, stagger = 100, delay = 0 } = options;

    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case 'left':
        translateX = -distance;
        break;
      case 'right':
        translateX = distance;
        break;
      case 'top':
        translateY = -distance;
        break;
      case 'bottom':
        translateY = distance;
        break;
    }

    return createScrubTimeline(
      targets,
      [
        {
          translateX,
          translateY,
          opacity: 0,
          scale: 0.8
        },
        {
          translateX: 0,
          translateY: 0,
          opacity: 1,
          scale: 1
        }
      ],
      {
        id: `slide-in-${direction}`,
        duration: 600,
        ease: 'easeOutExpo'
      }
    );
  }, [createScrubTimeline]);

  // GPU-accelerated transforms for performance
  const applyGPUTransforms = useCallback((
    element: HTMLElement,
    transforms: Record<string, any>
  ) => {
    const gpuTransforms = {
      transform: Object.entries(transforms)
        .map(([prop, value]) => `${prop}(${value})`)
        .join(' '),
      willChange: 'transform'
    };

    Object.assign(element.style, gpuTransforms);

    // Reset willChange after animation completes
    setTimeout(() => {
      element.style.willChange = 'auto';
    }, 100);
  }, []);

  useEffect(() => {
    if (initialized.current || typeof window === "undefined") return;

    initialized.current = true;

    // Hero parallax animation - multiple layers (GSAP)
    gsap.to(".hero-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Hero content parallax - more subtle (GSAP)
    gsap.to(".hero-content", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Background elements parallax - simplified (GSAP)
    gsap.utils.toArray(".parallax-bg").forEach((element: any) => {
      gsap.to(element, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    });

    // Floating elements parallax - remove rotation, add subtle movement (GSAP)
    gsap.utils.toArray(".parallax-float").forEach((element: any, index) => {
      gsap.to(element, {
        yPercent: -30 + (index * 5),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Anime.js Background blur-out effects during section transitions
    const backgroundElements = document.querySelectorAll('.section-background') as NodeListOf<HTMLElement>;
    if (backgroundElements.length > 0) {
      backgroundElements.forEach((element, index) => {
        const { timeline, cleanup } = createBackgroundBlurEffect(element, {
          blurStart: 0,
          blurEnd: 8,
          opacityStart: 1,
          opacityEnd: 0.4
        });

        // Store cleanup function for later
        if (cleanup) {
          element.setAttribute('data-blur-cleanup', cleanup.toString());
        }

        // Apply GPU acceleration
        applyGPUTransforms(element, {
          translateZ: '0',
          backfaceVisibility: 'hidden'
        });
      });
    }

    // Anime.js Slide-in animations for new elements
    const slideInElements = document.querySelectorAll('.slide-in-element') as NodeListOf<HTMLElement>;
    if (slideInElements.length > 0) {
      slideInElements.forEach((element, index) => {
        const direction = element.dataset.direction as 'left' | 'right' | 'top' | 'bottom' || 'bottom';
        const { timeline, cleanup } = createSlideInAnimation(element, {
          direction,
          distance: 80,
          stagger: index * 100
        });

        // Store cleanup function
        if (cleanup) {
          element.setAttribute('data-slide-cleanup', cleanup.toString());
        }

        // Apply GPU acceleration
        applyGPUTransforms(element, {
          translateZ: '0',
          backfaceVisibility: 'hidden'
        });
      });
    }

    // Fade in animations for sections
    gsap.utils.toArray(".fade-in-section").forEach((section: any) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Staggered animations for project cards
    gsap.utils.toArray(".project-card").forEach((card: any, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Parallax background elements
    gsap.utils.toArray(".parallax-slow").forEach((element: any) => {
      gsap.to(element, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    gsap.utils.toArray(".parallax-medium").forEach((element: any) => {
      gsap.to(element, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    gsap.utils.toArray(".parallax-fast").forEach((element: any) => {
      gsap.to(element, {
        yPercent: -80,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Text reveal animations
    gsap.utils.toArray(".text-reveal").forEach((text: any) => {
      const words = text.textContent.split(" ");
      text.innerHTML = words
        .map((word: string) => `<span class="word">${word}</span>`)
        .join(" ");

      gsap.fromTo(
        text.querySelectorAll(".word"),
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: text,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Cleanup function
    return () => {
      // Kill GSAP ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Cleanup Anime.js timelines and scroll listeners
      animeTimelines.current.forEach((timeline) => {
        if (timeline && typeof timeline.pause === 'function') {
          timeline.pause();
        }
      });
      animeTimelines.current.clear();

      // Cleanup stored cleanup functions
      document.querySelectorAll('[data-blur-cleanup]').forEach((element) => {
        element.removeAttribute('data-blur-cleanup');
      });
      document.querySelectorAll('[data-slide-cleanup]').forEach((element) => {
        element.removeAttribute('data-slide-cleanup');
      });
    };
  }, []);
}