/**
 * NEXUS Confetti Effect Component
 * Celebration animation for achievements and milestones
 */

import React, { useEffect, useState } from "react";

interface ConfettiEffectProps {
  active?: boolean;
  duration?: number;
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

const colors = [
  "#FF6500", // Primary orange
  "#024CAA", // Secondary blue
  "#FFD700", // Gold
  "#FF1493", // Pink
  "#00FF00", // Green
  "#FF4500", // Red-orange
];

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  active = false,
  duration = 3000,
  particleCount = 50,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      }));

      setParticles(newParticles);

      // Clear after duration
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, particleCount]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall ${duration}ms ease-out forwards`,
            animationDelay: `${Math.random() * 200}ms`,
          }}
        />
      ))}
    </div>
  );
};

// CSS animation (add to index.css or tailwind config)
const style = document.createElement("style");
style.textContent = `
  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}
