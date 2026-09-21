"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CAMPUS_SEED, SEED_VERSION } from "@/data/campus";
import type {
  CampusConfig,
  CampusState,
  ResearchProject,
  ResearchStatus,
  WelfareStatus,
} from "@/data/campus/types";

const STORAGE_KEY = "gw-campus-store:v1";

interface CampusContextValue {
  state: CampusState;
  allocateProfessor: (turmaId: string, professorId: string) => void;
  setCapacity: (turmaId: string, capacity: number) => void;
  enroll: (turmaId: string, delta: 1 | -1) => void;
  addResearch: (input: { title: string; area: string; lead: string; funding: number }) => ResearchProject;
  setResearchStatus: (id: string, status: ResearchStatus) => void;
  bumpResearch: (id: string, delta: number) => void;
  setWelfareStatus: (id: string, status: WelfareStatus) => void;
  toggleConfig: (key: keyof CampusConfig, value: boolean) => void;
  reset: () => void;
}

const CampusContext = createContext<CampusContextValue | null>(null);

/** GW Campus — Gestão Universitária Completa: estado persistido no navegador. */
export function CampusProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CampusState>(() => JSON.parse(JSON.stringify(CAMPUS_SEED)));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; state: Partial<CampusState> };
        if (parsed?.version === SEED_VERSION && parsed.state) {
          setState((prev) => ({ ...prev, ...parsed.state }));
        }
      }
    } catch {
      /* armazenamento indisponível */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, state }));
    } catch {
      /* sem armazenamento */
    }
  }, [state]);

  const allocateProfessor = useCallback((turmaId: string, professorId: string) => {
    setState((prev) => ({
      ...prev,
      turmas: prev.turmas.map((t) => (t.id === turmaId ? { ...t, professorId } : t)),
    }));
  }, []);

  const setCapacity = useCallback((turmaId: string, capacity: number) => {
    setState((prev) => ({
      ...prev,
      turmas: prev.turmas.map((t) => (t.id === turmaId ? { ...t, capacity: Math.max(1, Math.min(200, capacity)) } : t)),
    }));
  }, []);

  const enroll = useCallback((turmaId: string, delta: 1 | -1) => {
    setState((prev) => ({
      ...prev,
      turmas: prev.turmas.map((t) =>
        t.id === turmaId ? { ...t, enrolled: Math.max(0, Math.min(t.capacity, t.enrolled + delta)) } : t,
      ),
    }));
  }, []);

  const addResearch = useCallback(
    ({ title, area, lead, funding }: { title: string; area: string; lead: string; funding: number }): ResearchProject => {
      const project: ResearchProject = {
        id: `rs-${Date.now()}`,
        title,
        area,
        lead,
        funding,
        status: "pipeline",
        progress: 0,
        members: 2,
        startedAt: "2026/27",
      };
      setState((prev) => ({ ...prev, research: [project, ...prev.research] }));
      return project;
    },
    [],
  );

  const setResearchStatus = useCallback((id: string, status: ResearchStatus) => {
    setState((prev) => ({
      ...prev,
      research: prev.research.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  }, []);

  const bumpResearch = useCallback((id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      research: prev.research.map((r) =>
        r.id === id ? { ...r, progress: Math.max(0, Math.min(100, r.progress + delta)) } : r,
      ),
    }));
  }, []);

  const setWelfareStatus = useCallback((id: string, status: WelfareStatus) => {
    setState((prev) => ({
      ...prev,
      welfare: prev.welfare.map((w) => (w.id === id ? { ...w, status } : w)),
    }));
  }, []);

  const toggleConfig = useCallback((key: keyof CampusConfig, value: boolean) => {
    setState((prev) => ({ ...prev, config: { ...prev.config, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    setState(JSON.parse(JSON.stringify(CAMPUS_SEED)));
  }, []);

  const value = useMemo(
    () => ({
      state,
      allocateProfessor,
      setCapacity,
      enroll,
      addResearch,
      setResearchStatus,
      bumpResearch,
      setWelfareStatus,
      toggleConfig,
      reset,
    }),
    [state, allocateProfessor, setCapacity, enroll, addResearch, setResearchStatus, bumpResearch, setWelfareStatus, toggleConfig, reset],
  );

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}

export function useCampus(): CampusContextValue {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error("useCampus deve ser usado dentro de <CampusProvider>.");
  return ctx;
}