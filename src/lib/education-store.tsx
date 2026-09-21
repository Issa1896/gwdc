"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type {
  Chamada,
  Diploma,
  EnrollmentRequest,
  Estudante,
  Fatura,
  LoanRecord,
  Material,
  NotaMateria,
  RecentEnrollment,
  Turma,
  VerificationLogEntry,
} from "@/data/education/types";
import { DIPLOMAS, ENROLLMENT_QUEUE, ESTUDANTES, FATURAS, RECENT_ENROLLMENTS, TURMAS, VERIFICATION_LOG, chamadasDe, notasDe } from "@/data/education";

const STORAGE_KEY = "gw-education-store:v1";
const SEED_VERSION = 1;

/** Turma padrão de cada curso do catálogo (c1–c8 → t1–t8). */
const CURSO_TURMA: Record<string, string> = { c1: "t1", c2: "t2", c3: "t3", c4: "t4", c5: "t5", c6: "t6", c7: "t7", c8: "t8" };

/** Cursos da fila de matrícula (nomes exibidos) → cursos do catálogo. */
const CURSO_SLUG_BY_NAME: Record<string, string> = {
  Medicina: "c4",
  "Engenharia Civil": "c1",
  Enfermagem: "c4",
  "Contabilidade e Gestão": "c3",
  "Ciência Política": "c6",
  "Medicina Veterinária": "c5",
};

const CONFIG_SEED: Record<string, boolean> = {
  sms: true,
  email: true,
  prazos: true,
  "matricula-auto": false,
  freq75: true,
  "boletim-range": false,
  "ia-evasao": true,
  "ia-correcao": true,
  "anti-copia": true,
};

const SEED_LOANS: LoanRecord[] = [
  { id: "l1", livroId: "b4", titulo: "Economia Digital da África Ocidental", leitor: "Quinta Mendes", inicio: "2026-08-04", devolucao: "2026-08-25" },
  { id: "l2", livroId: "b2", titulo: "Matemática Discreta e suas Aplicações", leitor: "Ibrahima Sané", inicio: "2026-07-29", devolucao: "2026-08-19" },
  { id: "l3", livroId: "b6", titulo: "Constituição da Guiné-Bissau Anotada", leitor: "Malam Sanhá", inicio: "2026-08-09", devolucao: "2026-08-30" },
  { id: "l4", livroId: "b9", titulo: "Geografia das Ilhas Bijagós", leitor: "Ussumane Cá", inicio: "2026-07-07", devolucao: "2026-07-28" },
  { id: "l5", livroId: "b12", titulo: "Direito Digital e Proteção de Dados", leitor: "N'djai Sanhá", inicio: "2026-08-14", devolucao: "2026-09-04" },
];

export interface EducationState {
  alunos: Estudante[];
  faturas: Fatura[];
  fila: EnrollmentRequest[];
  recentes: RecentEnrollment[];
  notas: Record<string, NotaMateria[]>;
  chamadas: Record<string, Chamada[]>;
  emprestimos: LoanRecord[];
  materiais: Record<string, Material[]>;
  entregas: Record<string, string[]>;
  diplomas: Diploma[];
  log: VerificationLogEntry[];
  turmas: Turma[];
  config: Record<string, boolean>;
  anoLetivo: string;
  instituicao: string;
}

const today = () => new Date().toISOString().slice(0, 10);

const isBrowser = () => typeof window !== "undefined";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function seedLoans(): LoanRecord[] {
  return clone(SEED_LOANS);
}

function initialState(): EducationState {
  return {
    alunos: clone(ESTUDANTES),
    faturas: clone(FATURAS),
    fila: clone(ENROLLMENT_QUEUE),
    recentes: clone(RECENT_ENROLLMENTS).map((r, i) => ({ ...r, id: `re-${i + 1}` }) as RecentEnrollment),
    notas: {},
    chamadas: {},
    emprestimos: seedLoans(),
    materiais: {},
    entregas: {},
    diplomas: clone(DIPLOMAS),
    log: clone(VERIFICATION_LOG),
    turmas: clone(TURMAS),
    config: { ...CONFIG_SEED },
    anoLetivo: "2026/2027",
    instituicao: "uac",
  };
}

function loadState(): EducationState {
  if (!isBrowser()) return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as EducationState & { version?: number };
      if (parsed.version === SEED_VERSION && Array.isArray(parsed.alunos)) return parsed;
    }
  } catch {
    /* estado corrompido → reinicia com o seed */
  }
  return initialState();
}

const nextMatricula = (alunos: Estudante[]) => {
  const max = alunos.reduce((acc, a) => {
    const n = Number.parseInt(a.id.replace("EA-", ""), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 2600);
  return `EA-${max + 1}`;
};

const nextFatuaSeq = (faturas: Fatura[]) => {
  const max = faturas.reduce((acc, f) => {
    const n = Number.parseInt(f.referencia.replace(/^PRO-2026\.2-/, ""), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return max + 1;
};

const nextDiplomaSeq = (diplomas: Diploma[]) => {
  const max = diplomas.reduce((acc, d) => {
    const n = Number.parseInt(d.code.split("-").at(-1) ?? "", 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return max + 1;
};

function pagamentoStatus(fatura: Fatura, hoje: string): Fatura["status"] {
  if (fatura.pago >= fatura.valor) return "pago";
  if (fatura.pago > 0) return "parcial";
  return fatura.vencimento < hoje ? "vencido" : "pendente";
}

function novoPrazo(dias: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dias);
  return date.toISOString().slice(0, 10);
}

function randomHash(): string {
  return `${Math.random().toString(16).slice(2, 8)}…${Math.random().toString(16).slice(2, 6)}`;
}

interface EducationContextValue {
  state: EducationState;
  alunoPorId: (id: string) => Estudante | undefined;
  getNotas: (estudanteId: string, cursoId: string) => NotaMateria[];
  getChamadas: (estudanteId: string) => Chamada[];
  addAluno: (dados: Omit<Estudante, "id">) => string;
  updateAluno: (id: string, dados: Partial<Estudante>) => void;
  deleteAluno: (id: string) => void;
  aprovarMatricula: (id: string) => void;
  recusarMatricula: (id: string) => void;
  salvarNotas: (estudanteId: string, notas: NotaMateria[]) => void;
  salvarChamadas: (estudanteId: string, chamadas: Chamada[]) => void;
  registrarAula: (estudanteId: string, chamada: Omit<Chamada, "dia">) => void;
  registrarPagamento: (faturaId: string, valor: number) => void;
  reservarLivro: (livroId: string, titulo: string, leitor: string) => void;
  devolverLivro: (emprestimoId: string) => void;
  publicarMaterial: (disciplineId: string, dados: { title: string; type: Material["type"] }) => void;
  toggleEntrega: (disciplineId: string, activityId: string) => void;
  emitirDiploma: (studentName: string, course: string, institution: string) => void;
  verificarDiploma: (id: string, holder: string) => void;
  criarTurma: (dados: Omit<Turma, "id">) => void;
  setConfig: (id: string, value: boolean) => void;
  setAnoLetivo: (ano: string) => void;
  setInstituicao: (id: string) => void;
  resetar: () => void;
}

const EducationContext = createContext<EducationContextValue | null>(null);

export function EducationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EducationState>(loadState);

  useEffect(() => {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: SEED_VERSION }));
    } catch {
      /* armazenamento indisponível → sessão apenas */
    }
  }, [state]);

  const alunoPorId = (id: string) => state.alunos.find((a) => a.id === id);

  const getNotas = (estudanteId: string, cursoId: string) => state.notas[estudanteId] ?? notasDe(estudanteId, cursoId);

  const getChamadas = (estudanteId: string) => state.chamadas[estudanteId] ?? chamadasDe(estudanteId);

  const addAluno = (dados: Omit<Estudante, "id">) => {
    const id = nextMatricula(state.alunos);
    setState((prev) => ({ ...prev, alunos: [...prev.alunos, { ...dados, id }] }));
    return id;
  };

  const updateAluno = (id: string, dados: Partial<Estudante>) =>
    setState((prev) => ({
      ...prev,
      alunos: prev.alunos.map((a) => (a.id === id ? { ...a, ...dados } : a)),
    }));

  const deleteAluno = (id: string) =>
    setState((prev) => ({
      ...prev,
      alunos: prev.alunos.filter((a) => a.id !== id),
      faturas: prev.faturas.filter((f) => f.estudanteId !== id),
      turmas: prev.turmas.map((t) => ({ ...t, estudantes: t.estudantes.filter((e) => e !== id) })),
      notas: Object.fromEntries(Object.entries(prev.notas).filter(([k]) => k !== id)),
      chamadas: Object.fromEntries(Object.entries(prev.chamadas).filter(([k]) => k !== id)),
    }));

  const aprovarMatricula = (id: string) => {
    const pedido = state.fila.find((m) => m.id === id);
    if (!pedido) return;
    setState((prev) => {
      const alunoId = nextMatricula(prev.alunos);
      const cursoId = CURSO_SLUG_BY_NAME[pedido.course] ?? "c1";
      const novoAluno: Estudante = {
        id: alunoId,
        nome: pedido.studentName,
        sexo: pedido.sexo ?? "M",
        nascimento: pedido.nascimento ?? "2005-01-01",
        regiao: pedido.regiao ?? "Bissau",
        telefone: "+245 95 000 000",
        email: pedido.email || `${pedido.studentName.toLowerCase().replace(/\s+/g, ".")}@educacao.gw`,
        cursoId,
        anoIngresso: 2026,
        status: "ativo",
      };
      const novaFatura: Fatura = {
        id: `fa-${Date.now()}`,
        referencia: `PRO-2026.2-${String(nextFatuaSeq(prev.faturas)).padStart(4, "0")}`,
        estudanteId: alunoId,
        descricao: "Propina 1ª parcela — S2/2026",
        vencimento: "2026-09-30",
        valor: 250000,
        pago: 0,
        status: "pendente",
      };
      const turmaId = CURSO_TURMA[cursoId];
      return {
        ...prev,
        alunos: [...prev.alunos, novoAluno],
        faturas: [...prev.faturas, novaFatura],
        fila: prev.fila.filter((m) => m.id !== id),
        recentes: [
          { id: `re-${Date.now()}`, student: pedido.studentName, course: pedido.course, date: today(), status: "Confirmada" },
          ...prev.recentes,
        ],
        turmas: turmaId ? prev.turmas.map((t) => (t.id === turmaId ? { ...t, estudantes: [...t.estudantes, alunoId] } : t)) : prev.turmas,
      };
    });
  };

  const recusarMatricula = (id: string) => {
    const pedido = state.fila.find((m) => m.id === id);
    if (!pedido) return;
    setState((prev) => ({
      ...prev,
      fila: prev.fila.filter((m) => m.id !== id),
      recentes: [
        { id: `re-${Date.now()}`, student: pedido.studentName, course: pedido.course, date: today(), status: "Documentos recusados" },
        ...prev.recentes,
      ],
    }));
  };

  const salvarNotas = (estudanteId: string, notas: NotaMateria[]) =>
    setState((prev) => ({ ...prev, notas: { ...prev.notas, [estudanteId]: notas } }));

  const salvarChamadas = (estudanteId: string, chamadas: Chamada[]) =>
    setState((prev) => ({ ...prev, chamadas: { ...prev.chamadas, [estudanteId]: chamadas } }));

  const registrarAula = (estudanteId: string, chamada: Omit<Chamada, "dia">) =>
    setState((prev) => {
      const atuais = prev.chamadas[estudanteId] ?? chamadasDe(estudanteId);
      const dia = today();
      if (atuais.some((c) => c.dia === dia)) return prev;
      return { ...prev, chamadas: { ...prev.chamadas, [estudanteId]: [{ dia, ...chamada }, ...atuais] } };
    });

  const registrarPagamento = (faturaId: string, valor: number) =>
    setState((prev) => ({
      ...prev,
      faturas: prev.faturas.map((f) => {
        if (f.id !== faturaId) return f;
        const pago = Math.min(f.valor, f.pago + Math.max(0, valor));
        return { ...f, pago, status: pagamentoStatus({ ...f, pago }, today()) };
      }),
    }));

  const reservarLivro = (livroId: string, titulo: string, leitor: string) =>
    setState((prev) => ({
      ...prev,
      emprestimos: [
        { id: `l-${Date.now()}`, livroId, titulo, leitor, inicio: today(), devolucao: novoPrazo(14) },
        ...prev.emprestimos,
      ],
    }));

  const devolverLivro = (emprestimoId: string) =>
    setState((prev) => ({ ...prev, emprestimos: prev.emprestimos.filter((l) => l.id !== emprestimoId) }));

  const publicarMaterial = (disciplineId: string, dados: { title: string; type: Material["type"] }) =>
    setState((prev) => ({
      ...prev,
      materiais: {
        ...prev.materiais,
        [disciplineId]: [...(prev.materiais[disciplineId] ?? []), { id: `pub-${Date.now()}`, ...dados, publishedAt: today(), downloads: 0 }],
      },
    }));

  const toggleEntrega = (disciplineId: string, activityId: string) =>
    setState((prev) => {
      const atuais = prev.entregas[disciplineId] ?? [];
      return {
        ...prev,
        entregas: {
          ...prev.entregas,
          [disciplineId]: atuais.includes(activityId) ? atuais.filter((a) => a !== activityId) : [...atuais, activityId],
        },
      };
    });

  const emitirDiploma = (studentName: string, course: string, institution: string) =>
    setState((prev) => ({
      ...prev,
      diplomas: [
        {
          id: `dp-${Date.now()}`,
          code: `GW-DIP-2026-${String(nextDiplomaSeq(prev.diplomas)).padStart(4, "0")}`,
          studentName,
          course,
          institution,
          issuedAt: today(),
          status: "Emitido",
          verifiedCount: 0,
        },
        ...prev.diplomas,
      ],
    }));

  const verificarDiploma = (id: string, holder: string) =>
    setState((prev) => ({
      ...prev,
      diplomas: prev.diplomas.map((d) =>
        d.id === id ? { ...d, verifiedCount: d.verifiedCount + 1, status: d.status === "Pendente" ? "Emitido" : "Verificado" } : d,
      ),
      log: [{ hash: randomHash(), date: today(), holder }, ...prev.log],
    }));

  const criarTurma = (dados: Omit<Turma, "id">) =>
    setState((prev) => ({ ...prev, turmas: [...prev.turmas, { ...dados, id: `t-${Date.now()}` }] }));

  const setConfig = (id: string, value: boolean) =>
    setState((prev) => ({ ...prev, config: { ...prev.config, [id]: value } }));

  const setAnoLetivo = (ano: string) => setState((prev) => ({ ...prev, anoLetivo: ano }));

  const setInstituicao = (id: string) => setState((prev) => ({ ...prev, instituicao: id }));

  const resetar = () => setState(initialState());

  const value: EducationContextValue = {
    state,
    alunoPorId,
    getNotas,
    getChamadas,
    addAluno,
    updateAluno,
    deleteAluno,
    aprovarMatricula,
    recusarMatricula,
    salvarNotas,
    salvarChamadas,
    registrarAula,
    registrarPagamento,
    reservarLivro,
    devolverLivro,
    publicarMaterial,
    toggleEntrega,
    emitirDiploma,
    verificarDiploma,
    criarTurma,
    setConfig,
    setAnoLetivo,
    setInstituicao,
    resetar,
  };

  return <EducationContext.Provider value={value}>{children}</EducationContext.Provider>;
}

export function useEducation(): EducationContextValue {
  const ctx = useContext(EducationContext);
  if (!ctx) throw new Error("useEducation deve ser usado dentro de <EducationProvider>.");
  return ctx;
}