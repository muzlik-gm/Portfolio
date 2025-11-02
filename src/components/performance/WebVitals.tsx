"use client";

import { useEffect } from "react";

export function WebVitals() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV === 'production') {
      import('web-vitals').then((webVitals) => {
        if (webVitals.onCLS) webVitals.onCLS(console.log);
        if (webVitals.onFCP) webVitals.onFCP(console.log);
        if (webVitals.onLCP) webVitals.onLCP(console.log);
        if (webVitals.onTTFB) webVitals.onTTFB(console.log);
        if (webVitals.onINP) webVitals.onINP(console.log);
      }).catch(() => {
        // Silently fail if web-vitals is not available
      });
    }
  }, []);

  return null;
}