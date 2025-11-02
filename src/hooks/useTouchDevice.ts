"use client";

import { useEffect, useState } from "react";

export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - msMaxTouchPoints is not in TypeScript types
        navigator.msMaxTouchPoints > 0
      );
    }
    return false;
  });

  useEffect(() => {
    // Listen for touch events to confirm touch capability
    const handleTouchStart = () => {
      setIsTouchDevice(true);
      window.removeEventListener('touchstart', handleTouchStart);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return isTouchDevice;
}