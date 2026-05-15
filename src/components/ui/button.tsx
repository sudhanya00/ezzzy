import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded font-bold transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:duration-75",
          {
            "btn-primary-mech": variant === "primary",
            "btn-mechanical text-foreground": variant === "secondary",
            "bg-transparent hover:bg-black/5 text-foreground active:translate-y-[1px]": variant === "ghost",
            "h-8 px-4 text-xs": size === "sm",
            "h-10 px-6 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
