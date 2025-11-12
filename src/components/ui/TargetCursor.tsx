"use client";

import React, { useEffect, useState, useRef } from 'react';

interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  parallaxOn?: boolean;
  targetClassName?: string;
}

export default function TargetCursor({
  spinDuration = 2,
  hideDefaultCursor = true,
  parallaxOn = true,
  targetClassName = 'cursor-target'
}: TargetCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isTarget = target.closest(`.${targetClassName}`) !== null;
      setIsHovering(isTarget);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', checkHover);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', checkHover);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [targetClassName]);

  useEffect(() => {
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      const style = document.createElement('style');
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
      
      return () => {
        document.body.style.cursor = '';
        document.head.removeChild(style);
      };
    }
  }, [hideDefaultCursor]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] mix-blend-difference"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: parallaxOn ? 'transform 0.1s ease-out' : 'none',
      }}
    >
      {/* Outer ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-white transition-all duration-300 ${
          isHovering ? 'w-16 h-16' : 'w-8 h-8'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          animation: `spin ${spinDuration}s linear infinite`,
        }}
      >
        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white transform -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white transform -translate-x-1/2" />
      </div>
      
      {/* Center dot */}
      <div
        className={`absolute bg-white rounded-full transition-all duration-300 ${
          isHovering ? 'w-2 h-2' : 'w-1 h-1'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
