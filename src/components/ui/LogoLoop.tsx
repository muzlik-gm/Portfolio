"use client";

import React from 'react';

interface Logo {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
}

export default function LogoLoop({
  logos,
  speed = 100,
  direction = 'left',
  logoHeight = 48,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = '#ffffff',
  ariaLabel = 'Logo carousel'
}: LogoLoopProps) {
  const isHorizontal = direction === 'left' || direction === 'right';
  
  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];
  
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      aria-label={ariaLabel}
    >
      <div
        className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} logo-loop-animate`}
        style={{
          gap: `${gap}px`,
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' || direction === 'down' ? 'reverse' : 'normal',
          willChange: 'transform',
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className={`flex-shrink-0 flex items-center justify-center ${
              scaleOnHover ? 'hover:scale-110 transition-transform duration-200' : ''
            }`}
            style={{ height: `${logoHeight}px`, width: isHorizontal ? 'auto' : '100%' }}
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-full"
                title={logo.title || logo.alt}
              >
                {logo.node ? (
                  <div className="text-3xl text-foreground/60 hover:text-foreground/80 transition-colors duration-200">
                    {logo.node}
                  </div>
                ) : logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt || ''}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                  />
                ) : null}
              </a>
            ) : (
              <>
                {logo.node ? (
                  <div className="text-3xl text-foreground/60">
                    {logo.node}
                  </div>
                ) : logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt || ''}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                  />
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
      
      {fadeOut && (
        <>
          <div
            className="absolute top-0 left-0 h-full w-24 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className="absolute top-0 right-0 h-full w-24 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}
      

    </div>
  );
}
