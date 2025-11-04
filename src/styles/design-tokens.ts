/**
 * NEXUS Design System Tokens
 * Phase 1: Foundation & Design System Standardization
 * 
 * This file contains all standardized design tokens for consistent
 * visual language across the entire application.
 */

// ==================== SPACING SCALE ====================
export const spacing = {
  compact: 4,      // 1rem = 16px
  normal: 6,       // 1.5rem = 24px
  comfortable: 8,  // 2rem = 32px
} as const;

// ==================== BACKGROUND PATTERNS ====================
export const backgrounds = {
  // Page backgrounds
  page: {
    primary: "bg-slate-900",
    gradient: "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800",
  },
  
  // Card backgrounds
  card: {
    primary: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50",
    secondary: "bg-slate-800/40 backdrop-blur-sm border border-slate-600/30",
    interactive: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/70 transition-all duration-300",
    glass: "bg-slate-900/30 backdrop-blur-md border border-slate-700/30",
  },
  
  // Special backgrounds
  elevated: "bg-slate-800/70 backdrop-blur-lg border border-slate-600/50 shadow-2xl",
  overlay: "bg-black/60 backdrop-blur-sm",
} as const;

// ==================== TYPOGRAPHY HIERARCHY ====================
export const typography = {
  // Page headers
  pageHeader: {
    dashboard: "text-4xl font-bold tracking-tight",
    primary: "text-3xl font-bold tracking-tight",
    secondary: "text-2xl font-bold tracking-tight",
  },
  
  // Section headers
  sectionHeader: {
    large: "text-2xl font-semibold",
    medium: "text-xl font-semibold",
    small: "text-lg font-semibold",
  },
  
  // Body text
  body: {
    large: "text-base",
    default: "text-sm",
    small: "text-xs",
  },
  
  // Descriptions and subtitles
  description: "text-slate-300",
  muted: "text-slate-400",
  subtle: "text-slate-500",
  
  // Stats and metrics
  stat: {
    value: "text-2xl font-bold",
    label: "text-sm text-slate-400",
  },
} as const;

// ==================== BORDER RADIUS ====================
export const radius = {
  small: "rounded-lg",      // 0.5rem = 8px
  medium: "rounded-xl",     // 0.75rem = 12px
  large: "rounded-2xl",     // 1rem = 16px
  full: "rounded-full",
} as const;

// ==================== SHADOWS ====================
export const shadows = {
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-xl",
  xlarge: "shadow-2xl",
  glow: "shadow-glow",
  glowLarge: "shadow-glow-lg",
} as const;

// ==================== PADDING SCALES ====================
export const padding = {
  card: {
    desktop: "p-6",
    mobile: "p-4",
    compact: "p-3",
  },
  section: {
    vertical: "py-8",
    horizontal: "px-6",
  },
  container: {
    default: "p-6",
    mobile: "p-4",
    compact: "p-3",
  },
} as const;

// ==================== GAP/SPACING ====================
export const gap = {
  section: "gap-8",      // Between major sections
  subsection: "gap-6",   // Between subsections
  cards: "gap-6",        // Between cards
  items: "gap-4",        // Between list items
  compact: "gap-2",      // Between compact elements
} as const;

// ==================== TRANSITIONS ====================
export const transitions = {
  fast: "transition-all duration-150 ease-out",
  default: "transition-all duration-300 ease-out",
  slow: "transition-all duration-500 ease-out",
  spring: "transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
} as const;

// ==================== HOVER EFFECTS ====================
export const hover = {
  lift: "hover:-translate-y-1 hover:shadow-2xl",
  scale: "hover:scale-[1.02]",
  glow: "hover:shadow-glow",
  brightness: "hover:brightness-110",
} as const;

// ==================== RESPONSIVE GRID PATTERNS ====================
export const grids = {
  stats: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  cards: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
  dashboard: "grid grid-cols-1 lg:grid-cols-5",
  twoColumn: "grid grid-cols-1 lg:grid-cols-2",
} as const;

// ==================== CONTAINER WIDTHS ====================
export const containers = {
  full: "w-full",
  content: "max-w-7xl mx-auto",
  narrow: "max-w-4xl mx-auto",
  form: "max-w-2xl mx-auto",
} as const;

// ==================== COMPONENT VARIANTS ====================
export const variants = {
  // Button variants
  button: {
    primary: "bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25",
    secondary: "border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white",
    ghost: "hover:bg-slate-800/50 text-slate-300 hover:text-white",
  },
  
  // Badge variants
  badge: {
    default: "bg-slate-700/50 text-slate-200 border border-slate-600/50",
    primary: "bg-primary/10 text-primary border border-primary/30",
    success: "bg-success/10 text-success border border-success/30",
    error: "bg-error/10 text-error border border-error/30",
  },
} as const;

// ==================== UTILITY FUNCTIONS ====================
export const buildClassName = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getCardClassName = (variant: keyof typeof backgrounds.card = "primary") => {
  return buildClassName(
    backgrounds.card[variant],
    radius.large,
    shadows.large,
    padding.card.desktop
  );
};

export const getPageClassName = () => {
  return buildClassName(
    backgrounds.page.primary,
    "min-h-full",
    "animate-fade-in"
  );
};
