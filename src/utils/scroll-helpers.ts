/**
 * NEXUS Scroll Utilities
 * Smooth scroll and focus management helpers
 */

interface ScrollToOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export const scrollHelpers = {
  // Smooth scroll to element by ID
  toElement: (elementId: string, options?: ScrollToOptions) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: options?.behavior || "smooth",
        block: options?.block || "start",
        inline: options?.inline || "nearest",
      });
    }
  },

  // Smooth scroll to top of page
  toTop: (behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: 0,
      behavior,
    });
  },

  // Smooth scroll to bottom of page
  toBottom: (behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior,
    });
  },

  // Scroll to specific Y position
  toY: (y: number, behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: y,
      behavior,
    });
  },

  // Get current scroll position
  getPosition: () => {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop,
    };
  },

  // Check if element is in viewport
  isInViewport: (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Get scroll percentage (0-100)
  getScrollPercentage: () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
  },
};

export const focusHelpers = {
  // Focus element and scroll into view
  focusElement: (elementId: string, options?: ScrollToOptions) => {
    const element = document.getElementById(elementId) as HTMLElement;
    if (element) {
      element.focus({ preventScroll: true });
      scrollHelpers.toElement(elementId, options);
    }
  },

  // Focus first input in a form
  focusFirstInput: (formElement: HTMLFormElement) => {
    const firstInput = formElement.querySelector<HTMLInputElement>(
      'input:not([type="hidden"]), textarea, select'
    );
    if (firstInput) {
      firstInput.focus();
    }
  },

  // Trap focus within element (useful for modals)
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);
    return () => element.removeEventListener("keydown", handleTabKey);
  },
};
