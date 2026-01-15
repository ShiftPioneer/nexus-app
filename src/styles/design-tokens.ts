/**
 * NEXUS Design System Tokens
 * Phase 1-6: Complete Design System Foundation
 * 
 * This file contains all standardized design tokens for consistent
 * visual language across the entire application.
 */

// ==================== SPACING SCALE (8px base grid) ====================
export const spacing = {
  xs: 1,           // 0.25rem = 4px
  sm: 2,           // 0.5rem = 8px
  md: 4,           // 1rem = 16px
  lg: 6,           // 1.5rem = 24px
  xl: 8,           // 2rem = 32px
  '2xl': 12,       // 3rem = 48px
  '3xl': 16,       // 4rem = 64px
} as const;

// ==================== GLASSMORPHISM DEPTH LEVELS ====================
export const glass = {
  // Level 1: Page backgrounds (subtle)
  level1: "bg-slate-900/40 backdrop-blur-sm",
  // Level 2: Card surfaces (medium)
  level2: "bg-slate-900/60 backdrop-blur-md border border-slate-700/40",
  // Level 3: Modals/overlays (heavy)
  level3: "bg-slate-900/80 backdrop-blur-lg border border-slate-600/50 shadow-2xl",
  // Elevated glass
  elevated: "bg-slate-800/70 backdrop-blur-xl border border-slate-600/60 shadow-glow",
} as const;

// ==================== BACKGROUND PATTERNS ====================
export const backgrounds = {
  // Page backgrounds
  page: {
    primary: "bg-slate-900",
    gradient: "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800",
    ambient: "bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90",
  },
  
  // Card backgrounds with glassmorphism
  card: {
    primary: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50",
    secondary: "bg-slate-800/40 backdrop-blur-sm border border-slate-600/30",
    interactive: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/70 hover:shadow-xl transition-all duration-300",
    glass: "bg-slate-900/30 backdrop-blur-md border border-slate-700/30",
    glow: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:shadow-glow transition-all duration-300",
  },
  
  // Special backgrounds
  elevated: "bg-slate-800/70 backdrop-blur-lg border border-slate-600/50 shadow-2xl",
  overlay: "bg-black/60 backdrop-blur-sm",
  ambient: "bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5",
} as const;

// ==================== GLOW EFFECTS ====================
export const glowEffects = {
  primary: "shadow-[0_0_20px_rgba(255,101,0,0.3)]",
  primaryLg: "shadow-[0_0_40px_rgba(255,101,0,0.2)]",
  success: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  subtle: "shadow-[0_0_15px_rgba(255,255,255,0.05)]",
  card: "hover:shadow-[0_0_30px_rgba(255,101,0,0.15)]",
} as const;

// ==================== TYPOGRAPHY HIERARCHY ====================
export const typography = {
  // Display headers (hero sections)
  display: {
    xl: "text-5xl sm:text-6xl font-bold tracking-tight",
    lg: "text-4xl sm:text-5xl font-bold tracking-tight",
    md: "text-3xl sm:text-4xl font-bold tracking-tight",
  },
  
  // Page headers
  pageHeader: {
    dashboard: "text-3xl sm:text-4xl font-bold tracking-tight",
    primary: "text-2xl sm:text-3xl font-bold tracking-tight",
    secondary: "text-xl sm:text-2xl font-bold tracking-tight",
  },
  
  // Section headers
  sectionHeader: {
    large: "text-xl sm:text-2xl font-semibold",
    medium: "text-lg sm:text-xl font-semibold",
    small: "text-base sm:text-lg font-semibold",
  },
  
  // Body text
  body: {
    large: "text-base sm:text-lg",
    default: "text-sm sm:text-base",
    small: "text-xs sm:text-sm",
  },
  
  // Descriptions and subtitles
  description: "text-slate-300",
  muted: "text-slate-400",
  subtle: "text-slate-500",
  
  // Stats and metrics
  stat: {
    value: "text-2xl sm:text-3xl font-bold",
    label: "text-xs sm:text-sm text-slate-400",
    change: "text-xs text-slate-500",
  },
} as const;

// ==================== BORDER RADIUS ====================
export const radius = {
  xs: "rounded-md",       // 6px
  small: "rounded-lg",    // 8px
  medium: "rounded-xl",   // 12px
  large: "rounded-2xl",   // 16px
  xl: "rounded-3xl",      // 24px
  full: "rounded-full",
} as const;

// ==================== SHADOWS ====================
export const shadows = {
  none: "shadow-none",
  xs: "shadow-xs",
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-xl",
  xlarge: "shadow-2xl",
  glow: "shadow-glow",
  glowLarge: "shadow-glow-lg",
  inner: "shadow-inner",
} as const;

// ==================== PADDING SCALES ====================
export const padding = {
  card: {
    xs: "p-2",
    sm: "p-3",
    desktop: "p-4 sm:p-6",
    mobile: "p-3 sm:p-4",
    compact: "p-2 sm:p-3",
  },
  section: {
    vertical: "py-6 sm:py-8",
    horizontal: "px-4 sm:px-6",
  },
  container: {
    default: "p-4 sm:p-6",
    mobile: "p-3 sm:p-4",
    compact: "p-2 sm:p-3",
  },
} as const;

// ==================== GAP/SPACING ====================
export const gap = {
  section: "gap-6 sm:gap-8",    // Between major sections
  subsection: "gap-4 sm:gap-6", // Between subsections
  cards: "gap-4 sm:gap-6",      // Between cards
  items: "gap-3 sm:gap-4",      // Between list items
  compact: "gap-2",             // Between compact elements
  xs: "gap-1",                  // Minimal spacing
} as const;

// ==================== TRANSITIONS & ANIMATIONS ====================
export const transitions = {
  fast: "transition-all duration-150 ease-out",
  default: "transition-all duration-300 ease-out",
  slow: "transition-all duration-500 ease-out",
  spring: "transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
  bounce: "transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
} as const;

export const motionPresets = {
  // Page transitions
  pageEnter: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } },
  // Card stagger entry
  cardStagger: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
  // Scale pop
  scaleIn: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
  // Slide in
  slideIn: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
} as const;

// ==================== HOVER EFFECTS ====================
export const hover = {
  lift: "hover:-translate-y-1 hover:shadow-xl",
  liftLarge: "hover:-translate-y-2 hover:shadow-2xl",
  scale: "hover:scale-[1.02]",
  scaleLarge: "hover:scale-[1.05]",
  glow: "hover:shadow-glow",
  brightness: "hover:brightness-110",
  borderGlow: "hover:border-primary/50",
  combined: "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:border-slate-600/70",
} as const;

// ==================== RESPONSIVE GRID PATTERNS ====================
export const grids = {
  stats: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6",
  cards: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6",
  dashboard: "grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6",
  twoColumn: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6",
  threeColumn: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  autoFill: "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 sm:gap-6",
} as const;

// ==================== CONTAINER WIDTHS ====================
export const containers = {
  full: "w-full",
  ultraWide: "max-w-[1920px] mx-auto",
  wide: "max-w-7xl mx-auto",
  content: "max-w-6xl mx-auto",
  medium: "max-w-4xl mx-auto",
  narrow: "max-w-3xl mx-auto",
  form: "max-w-2xl mx-auto",
  compact: "max-w-xl mx-auto",
} as const;

// ==================== COMPONENT VARIANTS ====================
export const variants = {
  // Button variants
  button: {
    primary: "bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25",
    secondary: "border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white",
    ghost: "hover:bg-slate-800/50 text-slate-300 hover:text-white",
    glow: "bg-gradient-to-r from-primary to-orange-500 text-white shadow-glow hover:shadow-glow-lg",
  },
  
  // Badge variants
  badge: {
    default: "bg-slate-700/50 text-slate-200 border border-slate-600/50",
    primary: "bg-primary/10 text-primary border border-primary/30",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    error: "bg-red-500/10 text-red-400 border border-red-500/30",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  },
  
  // Card variants
  card: {
    default: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl",
    interactive: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800/60 hover:border-slate-600/70 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer",
    glow: "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:shadow-glow transition-all duration-300",
  },
} as const;

// ==================== STAT CARD PATTERNS ====================
export const statCard = {
  container: "relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/60",
  header: "flex items-start justify-between gap-2",
  value: "text-xl sm:text-2xl font-bold text-white",
  label: "text-xs sm:text-sm text-slate-400",
  icon: "rounded-lg p-2 sm:p-3",
  progress: "h-1.5 sm:h-2 w-full rounded-full bg-slate-700/50",
  progressBar: "h-1.5 sm:h-2 rounded-full",
} as const;

// ==================== EMPTY STATE PATTERNS ====================
export const emptyState = {
  container: "flex flex-col items-center justify-center text-center py-12 sm:py-16",
  icon: "w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center mb-4 sm:mb-6",
  title: "text-lg sm:text-xl font-semibold text-white mb-2",
  description: "text-sm sm:text-base text-slate-400 max-w-md mb-4 sm:mb-6",
} as const;

// ==================== UTILITY FUNCTIONS ====================
export const buildClassName = (...classes: (string | undefined | false | null)[]) => {
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

export const getStatCardClassName = () => {
  return buildClassName(
    statCard.container,
    padding.card.mobile,
    shadows.medium
  );
};

export const getEmptyStateClassName = () => {
  return emptyState.container;
};
