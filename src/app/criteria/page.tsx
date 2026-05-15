"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import { useDecision } from "@/context/DecisionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function CriteriaPage() {
  const router = useRouter();
  const { subject, options, criteria, setCriteria } = useDecision();
  
  const [localCriteria, setLocalCriteria] = useState(criteria);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If no options, go back to start
    if (options.length < 2 || options[0] === "") {
      router.push("/");
      return;
    }

    // If we already have criteria, don't refetch
    if (criteria.length > 0) return;

    const fetchCriteria = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, options }),
        });
        
        if (!res.ok) throw new Error("Failed to fetch criteria");
        
        const data = await res.json();
        setLocalCriteria(data.criteria);
      } catch (err) {
        console.error(err);
        setError("Failed to generate criteria. Please add them manually.");
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, [subject, options, criteria, router]);

  const handleUpdateCriterion = (id: string, field: "name" | "description", value: string) => {
    setLocalCriteria(prev => 
      prev.map(c => c.id === id ? { ...c, [field]: value } : c)
    );
  };

  const handleRemoveCriterion = (id: string) => {
    setLocalCriteria(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCriterion = () => {
    setLocalCriteria([
      ...localCriteria, 
      { id: `crit_${Date.now()}`, name: "", description: "" }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validCriteria = localCriteria.filter(c => c.name.trim() !== "");
    if (validCriteria.length === 0) return;
    
    setCriteria(validCriteria);
    router.push("/weights");
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20 shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>
        <div className="p-8 panel-metal rounded-xl flex flex-col items-center space-y-4 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          <div className="display-recessed px-4 py-2 rounded font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_8px_#14b8a6]"></div>
            Processing Telemetry...
          </div>
        </div>
      </div>
    );
  }

  const isValid = localCriteria.some(c => c.name.trim() !== "");

  return (
    <div className="flex-1 flex flex-col items-center p-6 md:p-12 max-w-3xl mx-auto w-full relative">
      <div className="absolute inset-0 pointer-events-none opacity-20 shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="w-full space-y-8 relative z-10"
      >
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => router.push("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> REVERT
          </Button>
          <div className="display-recessed px-3 py-1 rounded font-mono text-xs uppercase tracking-widest text-brand-600 font-bold border border-brand-500/30">
            SEQ 2/4
          </div>
        </div>

        <div className="space-y-2 text-center text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 uppercase">Evaluation Criteria</h1>
          <p className="text-zinc-600 font-medium">Verify AI suggestions or input custom parameters</p>
          {error && <p className="text-sm font-bold text-red-600 bg-red-100/50 inline-block px-2 py-1 rounded">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {localCriteria.map((criterion, idx) => (
              <Card key={criterion.id} className="overflow-hidden p-1 bg-zinc-300">
                <div className="flex items-start p-4 gap-4 bg-zinc-100 rounded border border-zinc-300/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-800 text-brand-400 font-mono font-bold text-sm shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)]">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input 
                      placeholder="PARAMETER (e.g. COST)" 
                      value={criterion.name}
                      onChange={(e) => handleUpdateCriterion(criterion.id, "name", e.target.value)}
                      className="font-bold uppercase text-brand-700 bg-zinc-50 border-zinc-300"
                    />
                    <Input 
                      placeholder="Description data..." 
                      value={criterion.description}
                      onChange={(e) => handleUpdateCriterion(criterion.id, "description", e.target.value)}
                      className="text-xs text-zinc-600 bg-zinc-50 border-zinc-300"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveCriterion(criterion.id)}
                    className="text-zinc-500 hover:text-red-600 px-2 mt-1 shrink-0 bg-transparent shadow-none border-none"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-center py-4 opacity-60">
            <div className="h-[2px] bg-zinc-400/50 flex-1 shadow-[0_1px_0_rgba(255,255,255,0.8)]"></div>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddCriterion} className="mx-4 font-mono">
              <Plus className="w-4 h-4 mr-1" /> APPEND PARAM
            </Button>
            <div className="h-[2px] bg-zinc-400/50 flex-1 shadow-[0_1px_0_rgba(255,255,255,0.8)]"></div>
          </div>

          <div className="flex items-center justify-end pt-4">
            <Button 
              type="submit" 
              disabled={!isValid}
              className="gap-2 px-8"
              variant="primary"
            >
              ENGAGE WEIGHTS <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
