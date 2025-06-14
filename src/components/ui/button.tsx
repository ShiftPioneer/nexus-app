
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-error text-error-foreground hover:bg-error-600 active:bg-error-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        outline: "border border-border bg-background-secondary hover:bg-background-tertiary hover:text-text-primary text-text-secondary shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-background-secondary text-text-primary hover:bg-background-tertiary border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-background-secondary hover:text-text-primary text-text-secondary",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-600",
        success: "bg-success text-success-foreground hover:bg-success-600 active:bg-success-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        warning: "bg-warning text-warning-foreground hover:bg-warning-600 active:bg-warning-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
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
