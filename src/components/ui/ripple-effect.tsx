/**
 * NEXUS Ripple Effect Component
 * Material-design inspired ripple effect for interactive elements
 */

import React, { useState, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

interface RippleEffectProps {
  children: ReactNode;
  color?: string;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  color = "rgba(255, 255, 255, 0.3)",
  duration = 600,
  className = "",
  disabled = false,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, duration);
  }, [disabled, duration]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animation: `ripple ${duration}ms ease-out`,
          }}
        />
      ))}
    </div>
  );
};

// Add to index.css or tailwind config
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}
