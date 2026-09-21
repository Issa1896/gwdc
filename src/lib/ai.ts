/**
 * MÓDULO 13 — INTELIGÊNCIA ARTIFICIAL (camada de demonstração)
 * ------------------------------------------------------------
 * Implementações determinísticas simulando serviços de IA que,
 * em produção, seriam providos por modelos (LLM, OCR, ML).
 * Interfaces estáveis: basta trocar a implementação interna.
 */

/** OCR simulado: extrai texto e metadados de uma "imagem de documento". */
export function mockOcr(imageName: string): { text: string; confidence: number; fields: Record<string, string> } {
  const fields =
    imageName.includes("certidao") || imageName.includes("cert")
      ? { Tipo: "Certidão de Nascimento", Número: "CN-2026-08421", Nome: "Mamadu Gomes", Data: "12/03/2026" }
      : { Tipo: "Documento genérico", Número: "DOC-" + Math.floor(Math.random() * 90000 + 10000), Nome: "—", Data: "—" };
  return {
    text: `Documento digitalizado: ${fields.Tipo} nº ${fields.Número} emitido para ${fields.Nome} em ${fields.Data}.`,
    confidence: 96.4,
    fields,
  };
}

/** Tradução automática simples PT ↔ Crioulo/Francês (dicionário de demonstração). */
export function translate(text: string, target: "pt" | "fr" | "crioulo"): string {
  const dictionary: Record<string, string> = {
    "bem-vindo": target === "crioulo" ? "ben-vindu" : "bienvenue",
    "bom dia": target === "crioulo" ? "bon dia" : "bonjour",
    "saúde": target === "crioulo" ? "salude" : "santé",
    "educação": target === "crioulo" ? "edukason" : "éducation",
    "cidadão": target === "crioulo" ? "sidadaun" : "citoyen",
  };
  let result = text;
  for (const [key, value] of Object.entries(dictionary)) {
    result = result.replace(new RegExp(key, "gi"), value);
  }
  return result;
}

/** Resumo automático: retorna as primeiras frases do texto com rótulo de IA. */
export function summarize(text: string, maxSentences = 2): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const summary = sentences.slice(0, maxSentences).join(" ");
  return summary.length < text.length ? `${summary} (resumo gerado por IA)` : summary;
}

/** Detecção de fraude (regras determinísticas simulando modelo). */
export function detectFraud(amount: number, hour: number, isForeign: boolean, attemptsInHour: number): { score: number; risk: "Baixo" | "Médio" | "Alto"; reasons: string[] } {
  let score = 10;
  const reasons: string[] = [];
  if (amount > 1_500_000) { score += 35; reasons.push("Valor acima do perfil habitual"); }
  if (hour < 4 || hour >= 23) { score += 15; reasons.push("Horário incomum"); }
  if (isForeign) { score += 15; reasons.push("Origem internacional não habitual"); }
  if (attemptsInHour >= 3) { score += 25; reasons.push("Múltiplas tentativas recentes"); }
  const risk = score >= 60 ? "Alto" : score >= 35 ? "Médio" : "Baixo";
  return { score, risk, reasons };
}

/** Predição de receita (projeção linear simples + sazonalidade). */
export function predictRevenue(history: number[], periods = 3): number[] {
  const n = history.length;
  if (n < 2) return history;
  const growth = (history[n - 1] - history[0]) / n;
  const last = history[n - 1];
  return Array.from({ length: periods }, (_, i) => Math.round(last + growth * (i + 1)));
}

/** Recomendações baseadas em perfil simples. */
export function recommend(profile: string[], catalog: { id: string; title: string; tags: string[] }[]): string[] {
  return catalog
    .map((item) => ({ item, score: item.tags.filter((t) => profile.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score > 0)
    .map((entry) => entry.item.id)
    .slice(0, 4);
}

/** Pesquisa semântica simulada: ranqueia por similaridade de palavras. */
export function semanticSearch(query: string, documents: string[]): { document: string; score: number }[] {
  const tokens = query.toLowerCase().split(/\W+/).filter(Boolean);
  return documents
    .map((document) => {
      const lower = document.toLowerCase();
      const score = tokens.filter((token) => lower.includes(token)).length / Math.max(tokens.length, 1);
      return { document, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}
