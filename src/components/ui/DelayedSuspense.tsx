import React, { useState, useEffect, Suspense, ReactNode, ComponentType } from "react";

interface DelayedSuspenseProps {
  children: ReactNode;
  delay?: number;
  fallback?: ReactNode;
}

/**
 * A Suspense wrapper that only shows the fallback after a delay.
 * This prevents loader flashing on fast connections/loads.
 */
const DelayedSuspense: React.FC<DelayedSuspenseProps> = ({
  children,
  delay = 400,
  fallback = null,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPending) {
        setShowFallback(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, isPending]);

  return (
    <Suspense
      fallback={
        showFallback ? (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-background" />
        )
      }
    >
      <SuspenseResolver onResolve={() => setIsPending(false)}>
        {children}
      </SuspenseResolver>
    </Suspense>
  );
};

/**
 * Helper component that calls onResolve when it mounts
 * (meaning the suspense has resolved)
 */
const SuspenseResolver: React.FC<{
  children: ReactNode;
  onResolve: () => void;
}> = ({ children, onResolve }) => {
  useEffect(() => {
    onResolve();
  }, [onResolve]);

  return <>{children}</>;
};

export default DelayedSuspense;
