/**
 * NEXUS Confetti Hook
 * Easy-to-use hook for triggering confetti celebrations
 */

import { useState, useCallback } from "react";

export const useConfetti = () => {
  const [isActive, setIsActive] = useState(false);

  const trigger = useCallback((duration: number = 3000) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), duration + 100);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    trigger,
    reset,
  };
};
