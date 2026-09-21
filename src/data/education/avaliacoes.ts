import type { OnlineExam } from "./types";

/** GW Education — Avaliações online com anti-cópia (demonstração). */
export const EXAMS: OnlineExam[] = [
  {
    id: "x1",
    disciplineId: "d2",
    title: "Mini-teste 3 — Autenticação e Sessões",
    attempts: 148,
    duration: "60 min",
    window: "21/08 · 09h00 – 11h00",
    status: "Agendada",
    antiFraud: ["Monitoramento de câmera", "Detecção de múltiplos dispositivos", "Banco de questões aleatório"],
    questions: [
      {
        id: "q1",
        question: "Qual mecanismo torna as sessões HTTP seguras contra roubo de cookies?",
        options: ["HttpOnly + Secure", "Controle de acesso por IP", "Minificação de JavaScript", "Prefetch de recursos"],
        answer: 0,
      },
      {
        id: "q2",
        question: "O que caracteriza um token JWT?",
        options: ["Válido por tempo indeterminado", "Assinado e autocontido", "Sempre criptografado", "Armazenado apenas no servidor"],
        answer: 1,
      },
      {
        id: "q3",
        question: "Qual prática é recomendada ao autenticar APIs REST?",
        options: ["Enviar senha em cada requisição", "Usar tokens de acesso com expiração", "Confiar no 'Referer' da requisição", "Desabilitar HTTPS em testes"],
        answer: 1,
      },
    ],
  },
  {
    id: "x2",
    disciplineId: "d3",
    title: "Mini-teste 3 — Transações e Concorrência",
    attempts: 121,
    duration: "50 min",
    window: "08/08 · 14h00 – 15h30",
    status: "Disponível",
    antiFraud: ["Monitoramento de câmera", "Análise de padrão de digitação"],
    questions: [
      {
        id: "q4",
        question: "Qual propriedade garante que uma transação seja executada como uma unidade indivisível?",
        options: ["Durabilidade", "Atomização", "Consistência", "Isolamento"],
        answer: 1,
      },
      {
        id: "q5",
        question: "Em SQL, qual comando desfaz as alterações de uma transação em aberto?",
        options: ["ROLLBACK", "UNDO", "REVERT", "ABORT"],
        answer: 0,
      },
    ],
  },
  {
    id: "x3",
    disciplineId: "d1",
    title: "Mini-teste 3 — Grafos e Percursos",
    attempts: 96,
    duration: "45 min",
    window: "19/08 · 10h00 – 11h30",
    status: "Disponível",
    antiFraud: ["Monitoramento de câmera", "Dispositivo único (para webcam)"],
    questions: [
      {
        id: "q6",
        question: "Um grafo com n vértices e n−1 arestas, conexo, é chamado de:",
        options: ["Circuito", "Árvore", "Multigrafo", "Grafo completo"],
        answer: 1,
      },
      {
        id: "q7",
        question: "O grau de um vértice em um grafo não orientado é:",
        options: ["O número de arestas incidentes", "O dobro do número de arestas", "A distância ao vértice mais próximo", "O número de circuitos que o contêm"],
        answer: 0,
      },
    ],
  },
  {
    id: "x4",
    disciplineId: "d4",
    title: "Mini-teste 2 — Finanças Digitais",
    attempts: 171,
    duration: "50 min",
    window: "26/08 · 09h00 – 11h00",
    status: "Agendada",
    antiFraud: ["Monitoramento de câmera", "Banco de questões aleatório", "Análise de padrão de digitação"],
    questions: [
      {
        id: "q8",
        question: "Qual a principal vantagem dos pagamentos instantâneos para a inclusão financeira?",
        options: ["Aumento de taxas bancárias", "Acesso 24/7 a custo quase zero", "Necessidade de cartão físico", "Exclusividade para grandes bancos"],
        answer: 1,
      },
      {
        id: "q9",
        question: "O que é o eKYC?",
        options: ["Imposto sobre criptomoedas", "Cadastro eletrônico de clientes", "Entidade reguladora do BCEAO", "Protocolo de transferência"],
        answer: 1,
      },
    ],
  },
];

export function getExam(id: string): OnlineExam | undefined {
  return EXAMS.find((e) => e.id === id);
}