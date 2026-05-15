"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Settings2 } from "lucide-react";
import { useDecision } from "@/context/DecisionContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function WeightsPage() {
  const router = useRouter();
  const { criteria, weights, setWeight } = useDecision();

  useEffect(() => {
    if (criteria.length === 0) {
      router.push("/");
    }
  }, [criteria, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/matrix");
  };

  const getWeightLabel = (val: number) => {
    if (val === 1) return "LOW";
    if (val === 2) return "MED-LOW";
    if (val === 3) return "NOMINAL";
    if (val === 4) return "HIGH";
    if (val === 5) return "CRITICAL";
    return "";
  };

  if (criteria.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col items-center p-6 md:p-12 max-w-4xl mx-auto w-full relative">
      <div className="absolute inset-0 pointer-events-none opacity-20 shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="w-full space-y-8 relative z-10"
      >
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => router.push("/criteria")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> REVERT
          </Button>
          <div className="display-recessed px-3 py-1 rounded font-mono text-xs uppercase tracking-widest text-brand-600 font-bold border border-brand-500/30">
            SEQ 3/4
          </div>
        </div>

        <div className="space-y-2 text-center text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 uppercase flex items-center justify-center gap-3">
            <Settings2 className="w-8 h-8 text-zinc-600" />
            Parameter Weights
          </h1>
          <p className="text-zinc-600 font-medium">Adjust the faders to set the relative importance of each metric</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {criteria.map((criterion) => {
              const weightVal = weights[criterion.id] || 3;
              return (
                <Card key={criterion.id} className="p-1 bg-zinc-300">
                  <div className="p-5 flex flex-col gap-6 bg-zinc-200 rounded border border-zinc-300/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] h-full">
                    <div className="space-y-1">
                      <h3 className="font-bold uppercase text-zinc-800 tracking-wide text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                        {criterion.name}
                      </h3>
                      <p className="text-xs text-zinc-600 line-clamp-2 min-h-[32px]">{criterion.description}</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-end space-y-4">
                      <div className="display-recessed px-3 py-2 rounded flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest border border-zinc-300">
                        <span className="text-zinc-500">LVL: {weightVal}</span>
                        <span className={
                          weightVal >= 4 ? "text-amber-600" : 
                          weightVal <= 2 ? "text-blue-600" : "text-brand-600"
                        }>
                          {getWeightLabel(weightVal)}
                        </span>
                      </div>
                      <div className="px-2">
                        <Slider 
                          min={1} 
                          max={5} 
                          step={1} 
                          value={weightVal}
                          onValueChange={(val) => setWeight(criterion.id, val)}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500 px-3 uppercase tracking-widest">
                        <span>Min</span>
                        <span>Max</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-center pt-8">
            <Button type="submit" variant="primary" size="lg" className="gap-3 px-12 text-lg tracking-widest shadow-[0_5px_10px_rgba(0,0,0,0.2)]">
              CALCULATE MATRIX <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
