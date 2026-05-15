"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useDecision } from "@/context/DecisionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const TEMPLATES = [
  {
    title: "Job Offer Selection",
    subject: "choose the best job offer",
    options: ["Startup Offer", "Enterprise Offer"],
  },
  {
    title: "Mom's Birthday Gift",
    subject: "select the perfect gift for your mom's birthday",
    options: ["Jewelry", "Spa Day", "Handmade Craft"],
  },
  {
    title: "Choosing a Car",
    subject: "choosing the right car",
    options: ["Electric SUV", "Hybrid Sedan", "Gasoline Truck"],
  },
];

export default function Home() {
  const router = useRouter();
  const { setSubject, setOptions } = useDecision();
  
  const [localSubject, setLocalSubject] = useState("");
  const [localOptions, setLocalOptions] = useState(["", ""]);

  const handleAddOption = () => setLocalOptions([...localOptions, ""]);
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...localOptions];
    newOptions[index] = value;
    setLocalOptions(newOptions);
  };

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setLocalSubject(template.subject);
    setLocalOptions([...template.options, ""]); // Add one empty slot
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = localOptions.filter((opt) => opt.trim() !== "");
    if (filteredOptions.length < 2) return;
    
    setSubject(localSubject || "make a decision");
    setOptions(filteredOptions);
    router.push("/criteria");
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isValid = localOptions.filter((opt) => opt.trim() !== "").length >= 2;

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
      {/* Background decoration to look like a studio surface */}
      <div className="absolute inset-0 pointer-events-none opacity-20 shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="max-w-2xl w-full space-y-8 relative z-10"
      >
        <div className="text-center space-y-2 mb-8 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          <h1 className="text-4xl font-bold tracking-widest text-zinc-800 uppercase">ezzzy</h1>
          <p className="text-zinc-600 font-medium tracking-wide text-sm">Configure your parameters or select a template</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 panel-metal p-8 rounded-xl relative" suppressHydrationWarning>
           {/* Decorative corner screws for the form panel */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-400 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-500"></div>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-400 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-500"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-400 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-500"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-400 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-500"></div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 text-shadow-[0_1px_0_rgba(255,255,255,0.8)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8),inset_0_1px_2px_rgba(255,255,255,0.5)]"></div>
              Goal Parameter
            </label>
            <Input 
              placeholder="e.g., choose a new car..." 
              value={localSubject}
              onChange={(e) => setLocalSubject(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 text-shadow-[0_1px_0_rgba(255,255,255,0.8)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_5px_rgba(20,184,166,0.8),inset_0_1px_2px_rgba(255,255,255,0.5)]"></div>
              Option Arrays
            </label>
            <div className="space-y-2 p-3 bg-zinc-800/5 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-zinc-300">
              {localOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-zinc-500 font-bold w-4">{idx + 1}.</span>
                  <Input 
                    placeholder={`Opt ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-400/30 shadow-[0_-1px_0_rgba(255,255,255,0.5)]">
            <Button type="button" variant="secondary" size="sm" onClick={handleAddOption}>
              + Add Node
            </Button>
            
            <Button 
              type="submit" 
              disabled={!mounted || !isValid}
              className="gap-2"
              variant="primary"
            >
              INITIALIZE <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-4 py-2 opacity-60">
          <div className="h-[2px] bg-zinc-400/50 flex-1 shadow-[0_1px_0_rgba(255,255,255,0.8)]"></div>
          <span className="text-xs text-zinc-600 uppercase font-bold tracking-widest text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Quick Templates</span>
          <div className="h-[2px] bg-zinc-400/50 flex-1 shadow-[0_1px_0_rgba(255,255,255,0.8)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((template, idx) => (
            <Card 
              key={idx} 
              className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2 h-full">
                <div className="w-8 h-8 rounded-full bg-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.5)] flex items-center justify-center mb-1">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-sm font-bold text-zinc-800">{template.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
