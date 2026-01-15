import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(174,72%,56%)] text-[hsl(174,72%,56%)]-[hsl(210,40%,98%)] shadow-md hover:bg-[hsl(174,72%,56%)]/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)] hover:text-[hsl(222,47%,20%)]-[hsl(210,40%,98%)]",
        secondary:
          "bg-[hsl(222,47%,20%)] text-[hsl(222,47%,20%)]-[hsl(210,40%,98%)] shadow-sm hover:bg-[hsl(222,47%,20%)]/80",
        ghost:
          "text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)] hover:text-[hsl(222,47%,20%)]-[hsl(210,40%,98%)]",
        link:
          "text-[hsl(174,72%,56%)] underline-offset-4 hover:underline",
        hero:
          "bg-[hsl(174,72%,56%)] text-[hsl(174,72%,56%)]-[hsl(210,40%,98%)] font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]",
        "hero-outline":
          "border-2 border-[hsl(174,72%,56%)]/50 bg-transparent text-[hsl(210,40%,98%)] font-medium hover:bg-[hsl(174,72%,56%)]/10 hover:border-[hsl(174,72%,56%)] hover:scale-[1.02] active:scale-[0.98]",
        nav:
          "bg-transparent text-[hsl(210,40%,98%)]/80 font-medium hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)]/50",
        "nav-primary":
          "bg-[hsl(174,72%,56%)] text-[hsl(174,72%,56%)]-[hsl(210,40%,98%)] font-medium hover:bg-[hsl(174,72%,56%)]/90 hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
