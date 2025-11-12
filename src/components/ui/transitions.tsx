/**
 * NEXUS Transition Components
 * Reusable transition wrappers for smooth animations
 */

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TransitionProps {
  children: ReactNode;
  show?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

// Fade Transition
export const FadeTransition: React.FC<TransitionProps> = ({
  children,
  show = true,
  duration = 300,
  delay = 0,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "transition-opacity",
        show ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Slide Transition
interface SlideTransitionProps extends TransitionProps {
  direction?: "left" | "right" | "up" | "down";
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  show = true,
  direction = "right",
  duration = 300,
  delay = 0,
  className = "",
}) => {
  const directionMap = {
    left: show ? "translate-x-0" : "-translate-x-full",
    right: show ? "translate-x-0" : "translate-x-full",
    up: show ? "translate-y-0" : "-translate-y-full",
    down: show ? "translate-y-0" : "translate-y-full",
  };

  return (
    <div
      className={cn(
        "transition-all",
        directionMap[direction],
        show ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Scale Transition
export const ScaleTransition: React.FC<TransitionProps> = ({
  children,
  show = true,
  duration = 300,
  delay = 0,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "transition-all origin-center",
        show ? "scale-100 opacity-100" : "scale-95 opacity-0",
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {children}
    </div>
  );
};

// Page Transition Wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
};

// Stagger Children Transition (for lists)
interface StaggerTransitionProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export const StaggerTransition: React.FC<StaggerTransitionProps> = ({
  children,
  staggerDelay = 50,
  className = "",
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <FadeTransition
          key={index}
          delay={index * staggerDelay}
          className={className}
        >
          {child}
        </FadeTransition>
      ))}
    </>
  );
};
