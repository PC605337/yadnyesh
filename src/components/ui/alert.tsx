import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border-2 p-5 shadow-md [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-5 [&>svg]:top-5 [&>svg]:text-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-gradient-card text-foreground border-border hover:shadow-lg",
        destructive: "border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive [&>svg]:text-destructive hover:shadow-xl",
        success: "border-success/50 bg-success/5 text-success [&>svg]:text-success hover:shadow-xl",
        warning: "border-warning/50 bg-warning/5 text-warning-foreground [&>svg]:text-warning hover:shadow-xl",
        info: "border-primary/50 bg-primary/5 text-primary [&>svg]:text-primary hover:shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
