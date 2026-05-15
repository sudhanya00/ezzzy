import React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 5, step = 1, value, onValueChange, ...props }, ref) => {
    return (
      <div className="relative w-full py-4 flex items-center">
        {/* Physical Track Background */}
        <div className="absolute left-0 right-0 h-4 bg-zinc-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-900 pointer-events-none"></div>
        
        {/* Tick marks wrapper */}
        <div className="absolute left-0 right-0 h-8 flex justify-between px-2 pointer-events-none">
          {Array.from({ length: max - min + 1 }).map((_, i) => (
            <div key={i} className="w-[2px] h-full bg-zinc-400/30 shadow-[1px_0_0_rgba(255,255,255,0.5)]"></div>
          ))}
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className={cn(
            "w-full h-4 appearance-none bg-transparent cursor-pointer relative z-10",
            // Thumb styling
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-zinc-200 [&::-webkit-slider-thumb]:to-zinc-400 [&::-webkit-slider-thumb]:shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-500 [&::-webkit-slider-thumb]:relative",
            // Add a highlight line to the thumb
            "[&::-webkit-slider-thumb]:after:content-[''] [&::-webkit-slider-thumb]:after:absolute [&::-webkit-slider-thumb]:after:w-full [&::-webkit-slider-thumb]:after:h-1 [&::-webkit-slider-thumb]:after:bg-zinc-800 [&::-webkit-slider-thumb]:after:top-1/2 [&::-webkit-slider-thumb]:after:-translate-y-1/2 [&::-webkit-slider-thumb]:after:shadow-[0_1px_0_rgba(255,255,255,0.5)]",
            
            "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:rounded [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-zinc-200 [&::-moz-range-thumb]:to-zinc-400 [&::-moz-range-thumb]:shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-zinc-500",
            
            "focus:outline-none",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";
