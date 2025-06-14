
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border border-primary/20",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        outline: "border-2 border-slate-600 bg-slate-950 text-slate-100 hover:bg-slate-800 hover:text-white hover:border-slate-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-slate-800 hover:text-white text-slate-300 rounded-lg",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        warning: "bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 font-bold",
        // New variants for tabs and navigation
        tab: "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary shadow-sm hover:shadow-md",
        "tab-active": "bg-primary text-white border border-primary/30 shadow-lg",
        navigation: "bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-600 shadow-sm hover:shadow-md hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
        xs: "h-7 rounded-lg px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
