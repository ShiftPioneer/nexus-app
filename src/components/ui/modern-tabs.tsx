
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const ModernTabs = TabsPrimitive.Root

const ModernTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-2xl bg-card/50 backdrop-blur-sm border border-border p-1.5 sm:p-2 shadow-xl",
      "w-full overflow-x-auto scrollbar-none",
      "gap-1 sm:gap-1.5",
      className
    )}
    {...props}
  />
))
ModernTabsList.displayName = TabsPrimitive.List.displayName

interface ModernTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  gradient?: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

const ModernTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  ModernTabsTriggerProps
>(({ className, gradient, icon: Icon, count, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 overflow-hidden min-w-0 flex-1",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      "data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:shadow-black/25",
      gradient && `data-[state=active]:bg-gradient-to-r ${gradient}`,
      !gradient && "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-orange-500",
      className
    )}
    {...props}
  >
    {/* Background effects */}
    <div className={cn(
      "absolute inset-0 opacity-0 group-data-[state=active]:opacity-10 transition-opacity duration-300",
      gradient ? `bg-gradient-to-r ${gradient}` : "bg-gradient-to-r from-primary/20 to-orange-500/20"
    )} />
    
    {/* Icon container */}
    {Icon && (
      <div className={cn(
        "relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-lg transition-all duration-300 flex-shrink-0",
        "group-data-[state=active]:bg-white/20 group-data-[state=active]:shadow-lg",
        "bg-muted/50 group-hover:bg-muted/70"
      )}>
        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      </div>
    )}
    
    {/* Text content */}
    <span className="relative z-10 truncate">
      {children}
    </span>
    
    {/* Count badge - show when count is defined (including 0) */}
    {count !== undefined && (
      <span className={cn(
        "ml-1 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-full transition-all duration-300 min-w-[18px] text-center",
        "group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white",
        "bg-slate-700/50 text-slate-400",
        count === 0 && "opacity-60"
      )}>
        {count > 99 ? '99+' : count}
      </span>
    )}
    
    {/* Hover shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
  </TabsPrimitive.Trigger>
))
ModernTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const ModernTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 sm:mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  </TabsPrimitive.Content>
))
ModernTabsContent.displayName = TabsPrimitive.Content.displayName

export { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent }
