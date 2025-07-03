
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const ModernTabs = TabsPrimitive.Root

const ModernTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 p-2 shadow-xl",
      "w-full overflow-x-auto scrollbar-none",
      className
    )}
    {...props}
  />
))
ModernTabsList.displayName = TabsPrimitive.List.displayName

const ModernTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    gradient?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
>(({ className, gradient, icon: Icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 overflow-hidden min-w-0 flex-1",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
      "data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-black/25",
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
        "relative flex items-center justify-center w-5 h-5 rounded-lg transition-all duration-300 flex-shrink-0",
        "group-data-[state=active]:bg-white/20 group-data-[state=active]:shadow-lg",
        "bg-slate-700/50 group-hover:bg-slate-600/50"
      )}>
        <Icon className="h-4 w-4" />
      </div>
    )}
    
    {/* Text content */}
    <span className="relative z-10 truncate">
      {children}
    </span>
    
    {/* Hover shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
  </TabsPrimitive.Trigger>
))
ModernTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const ModernTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "animate-fade-in",
      className
    )}
    {...props}
  />
))
ModernTabsContent.displayName = TabsPrimitive.Content.displayName

export { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent }
