"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Criterion {
  id: string;
  name: string;
  description: string;
}

export interface DecisionState {
  subject: string;
  options: string[];
  criteria: Criterion[];
  weights: Record<string, number>; // criteriaId -> weight (1-5)
  scores: Record<string, number>; // "optionIndex_criteriaId" -> score (0-5)
}

interface DecisionContextType extends DecisionState {
  setSubject: (subject: string) => void;
  setOptions: (options: string[]) => void;
  setCriteria: (criteria: Criterion[]) => void;
  setWeight: (criteriaId: string, weight: number) => void;
  setScore: (optionIndex: number, criteriaId: string, score: number) => void;
  reset: () => void;
}

const initialState: DecisionState = {
  subject: "",
  options: ["", ""],
  criteria: [],
  weights: {},
  scores: {},
};

const DecisionContext = createContext<DecisionContextType | undefined>(
  undefined
);

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DecisionState>(initialState);

  const setSubject = (subject: string) =>
    setState((prev) => ({ ...prev, subject }));

  const setOptions = (options: string[]) =>
    setState((prev) => ({ ...prev, options }));

  const setCriteria = (criteria: Criterion[]) => {
    // Initialize default weights for new criteria if not present
    const newWeights = { ...state.weights };
    criteria.forEach((c) => {
      if (newWeights[c.id] === undefined) {
        newWeights[c.id] = 3; // Default middle weight
      }
    });
    setState((prev) => ({ ...prev, criteria, weights: newWeights }));
  };

  const setWeight = (criteriaId: string, weight: number) =>
    setState((prev) => ({
      ...prev,
      weights: { ...prev.weights, [criteriaId]: weight },
    }));

  const setScore = (optionIndex: number, criteriaId: string, score: number) => {
    const key = `${optionIndex}_${criteriaId}`;
    setState((prev) => ({
      ...prev,
      scores: { ...prev.scores, [key]: score },
    }));
  };

  const reset = () => setState(initialState);

  return (
    <DecisionContext.Provider
      value={{
        ...state,
        setSubject,
        setOptions,
        setCriteria,
        setWeight,
        setScore,
        reset,
      }}
    >
      {children}
    </DecisionContext.Provider>
  );
}

export function useDecision() {
  const context = useContext(DecisionContext);
  if (context === undefined) {
    throw new Error("useDecision must be used within a DecisionProvider");
  }
  return context;
}
