"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCcw, Trophy } from "lucide-react";
import { useDecision } from "@/context/DecisionContext";
import { Button } from "@/components/ui/button";

export default function MatrixPage() {
  const router = useRouter();
  const { subject, options, criteria, weights, scores, setScore, reset } = useDecision();
  const [totals, setTotals] = useState<number[]>([]);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (criteria.length === 0 || options.length < 2) {
      router.push("/");
    }
  }, [criteria, options, router]);

  useEffect(() => {
    // Calculate totals
    const newTotals = options.map((_, optIdx) => {
      return criteria.reduce((acc, crit) => {
        const score = scores[`${optIdx}_${crit.id}`] || 0;
        const weight = weights[crit.id] || 0;
        return acc + (score * weight);
      }, 0);
    });

    setTotals(newTotals);
    
    // Find winner if all totals > 0 or if we want to show it immediately
    const maxScore = Math.max(...newTotals);
    if (maxScore > 0) {
      // Find all options with the max score
      const winners = newTotals
        .map((score, index) => ({ score, index }))
        .filter(x => x.score === maxScore);
      
      // If there's a tie, maybe don't show winner yet, or just show the first one. 
      // We'll show the first one for simplicity.
      if (winners.length === 1) {
        setWinnerIndex(winners[0].index);
      } else {
        setWinnerIndex(null); // Tie
      }
    } else {
      setWinnerIndex(null);
    }

  }, [scores, weights, criteria, options]);

  const handleReset = () => {
    reset();
    router.push("/");
  };

  if (criteria.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col p-6 md:p-12 w-full max-w-6xl mx-auto relative">
      <div className="absolute inset-0 pointer-events-none opacity-20 shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="w-full space-y-8 relative z-10"
      >
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => router.push("/weights")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> REVERT
          </Button>
          <div className="display-recessed px-3 py-1 rounded font-mono text-xs uppercase tracking-widest text-brand-600 font-bold border border-brand-500/30">
            FINAL OUTPUT
          </div>
        </div>

        <div className="space-y-2 text-center text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 uppercase">
            Analysis Matrix: {subject}
          </h1>
          <p className="text-zinc-600 font-medium">
            Fine-tune individual option parameters to calculate the optimal outcome.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl panel-metal p-2 relative">
          {/* Hardware screw details */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-zinc-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-400">
            <div className="w-full h-px bg-zinc-600 absolute top-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-zinc-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-400">
            <div className="w-full h-px bg-zinc-600 absolute top-1/2 -translate-y-1/2 rotate-[135deg]"></div>
          </div>

          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr>
                <th className="p-4 border-b border-r border-zinc-400/50 w-1/4">
                  <div className="font-bold text-xs uppercase tracking-widest text-zinc-600 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Parameters</div>
                </th>
                {options.map((opt, idx) => (
                  <th key={idx} className="p-4 border-b border-zinc-400/50 text-center w-[calc(75%/var(--opt-count))] min-w-[200px]" style={{"--opt-count": options.length} as any}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-3 h-3 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-zinc-400 ${winnerIndex === idx ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8),inset_0_1px_2px_rgba(255,255,255,0.8)]' : 'bg-zinc-300'}`}></div>
                      <span className="font-bold text-lg text-zinc-800 uppercase tracking-wider text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{opt}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((crit) => (
                <tr key={crit.id} className="border-b border-zinc-400/50 hover:bg-zinc-300/30 transition-colors">
                  <td className="p-4 border-r border-zinc-400/50 bg-zinc-200/50">
                    <div className="font-bold uppercase text-zinc-800 tracking-wide text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{crit.name}</div>
                    <div className="text-xs text-zinc-600 mb-3">{crit.description}</div>
                    <div className="display-recessed inline-flex px-2 py-1 rounded text-[10px] font-mono font-bold tracking-widest">
                      WGT: {weights[crit.id] || 3}x
                    </div>
                  </td>
                  {options.map((_, optIdx) => {
                    const score = scores[`${optIdx}_${crit.id}`] || 0;
                    return (
                      <td key={optIdx} className="p-4 align-top">
                        <div className="flex flex-col gap-4 bg-zinc-100 p-4 rounded shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] border border-zinc-300">
                          <div className="flex justify-between items-center font-mono text-xs font-bold">
                            <span className="text-zinc-500 uppercase">Input: {score}</span>
                            <span className="text-brand-700">
                              OUT: {score * (weights[crit.id] || 0)}
                            </span>
                          </div>
                          <div className="relative w-full py-2 flex items-center">
                            {/* Mini slider track */}
                            <div className="absolute left-0 right-0 h-2 bg-zinc-800 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.8)] border border-zinc-900 pointer-events-none"></div>
                            
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="1"
                              value={score}
                              onChange={(e) => setScore(optIdx, crit.id, parseInt(e.target.value))}
                              className="w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-zinc-200 [&::-webkit-slider-thumb]:to-zinc-400 [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-500
                                [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-zinc-200 [&::-moz-range-thumb]:to-zinc-400 [&::-moz-range-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-zinc-500
                                focus:outline-none"
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-200/80">
                <td className="p-4 border-r border-zinc-400/50 font-bold uppercase tracking-widest text-zinc-800 text-right text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                  TOTAL OUTPUT
                </td>
                {options.map((_, optIdx) => (
                  <td key={optIdx} className="p-4 text-center">
                    <div className="display-recessed py-3 rounded-lg border border-zinc-400">
                      <div className={`font-mono text-4xl font-bold tracking-wider ${winnerIndex === optIdx ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-zinc-400"}`}>
                        {totals[optIdx] || 0}
                      </div>
                      {winnerIndex === optIdx && (
                        <div className="text-[10px] font-bold uppercase text-amber-600 mt-1 tracking-widest">
                          OPTIMAL MATCH
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="secondary" onClick={handleReset} className="gap-2 px-8 uppercase font-bold tracking-widest text-xs border border-red-500/30 hover:border-red-500/80 transition-colors">
            <RefreshCcw className="w-4 h-4 text-red-600" /> SYSTEM RESET
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
