import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-primary text-primary-foreground hover:scale-105",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105",
        outline: "text-foreground border-border hover:bg-accent/10 hover:scale-105",
        success: "border-transparent bg-success text-success-foreground hover:scale-105",
        warning: "border-transparent bg-warning text-warning-foreground hover:scale-105",
        glass: "glass-card border-border/50 backdrop-blur-md hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
