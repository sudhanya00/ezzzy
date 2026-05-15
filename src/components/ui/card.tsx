import React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-lg panel-metal text-foreground overflow-hidden",
      className
    )}
    {...props}
  >
    {/* Decorative corner screws */}
    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-400">
      <div className="w-full h-px bg-zinc-600 absolute top-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-400">
      <div className="w-full h-px bg-zinc-600 absolute top-1/2 -translate-y-1/2 rotate-[135deg]"></div>
    </div>
    <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-400">
      <div className="w-full h-px bg-zinc-600 absolute top-1/2 -translate-y-1/2 rotate-[120deg]"></div>
    </div>
    <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-400">
      <div className="w-full h-px bg-zinc-600 absolute top-1/2 -translate-y-1/2 rotate-[15deg]"></div>
    </div>
    {children}
  </div>
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4 border-b border-zinc-400/30 shadow-[0_1px_0_rgba(255,255,255,0.5)]", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bold text-lg uppercase tracking-wider text-zinc-800 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
