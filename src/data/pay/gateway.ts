import { getProvider, PROVIDERS } from "./providers";
import type { ProviderId } from "./types";

/**
 * Camada de integração GW Pay — simula as API REST dos provedores
 * (Orange Money, MTN MoMo e GW PIX) com latência e taxa de falha
 * determinísticas por conector. O contrato real de cada API está
 * documentado em `providers.ts` e é exibido na página de provedores.
 */

/** Hash determinístico a partir de string (para latência/falhas estáveis). */
export function hashStr(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface ApiResponse {
  ok: boolean;
  /** Latência reportada pelo provedor (simulação). */
  latencyMs: number;
  /** Referência de liquidação atribuída pelo provedor. */
  providerRef: string;
  message: string;
}

function buildProviderRef(providerId: ProviderId, seed: string): string {
  const body = hashStr(`${providerId}:${seed}`).toString(36).toUpperCase().slice(0, 10);
  const prefix = providerId === "gw-pix" ? "PIX" : providerId === "momo" ? "MTN" : "OMB";
  return `${prefix}-${body}-GW`;
}

/**
 * Executa uma chamada ao conector (ex.: cobrança/consulta).
 * Resolve após a latência simulada, com taxa de falha própria do provedor.
 */
export async function providerRequest(
  providerId: ProviderId,
  operation: string,
  seed: string,
): Promise<ApiResponse> {
  const provider = getProvider(providerId);
  if (provider.future) {
    return { ok: false, latencyMs: 0, providerRef: "", message: "Conector IBAN ainda não integrado (2027)." };
  }
  const latency = Math.min(provider.gatewayDelayMs + (hashStr(`${seed}:${operation}`) % 260), 1400);
  const ok = hashStr(`${seed}:${operation}:out`) % 1000 >= Math.round(provider.failRate * 1000);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok,
        latencyMs: latency,
        providerRef: buildProviderRef(providerId, seed),
        message: ok
          ? `Liquidação aceite pelo ${provider.operator} — referência registada no barramento.`
          : `O conector ${provider.short} recusou a operação (${hashStr(`${seed}:${operation}:err`) % 100}): falha de liquidação simulada pelo sandbox.`,
      });
    }, Math.min(latency, 1100));
  });
}

/** Teste de conectividade (ping) — sempre responde, com latência estável. */
export async function providerPing(providerId: ProviderId): Promise<ApiResponse> {
  const provider = getProvider(providerId);
  const latency = Math.min(provider.gatewayDelayMs + (hashStr(`ping:${providerId}`) % 180), 1200);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: !provider.future,
        latencyMs: latency,
        providerRef: "",
        message: provider.future
          ? "Conector não disponível (futuro)."
          : `${provider.short} respondeu em ${latency} ms — handshake OK.`,
      });
    }, Math.min(latency, 800));
  });
}

/** Latência estável exibida nos cards de saúde (sem chamada real). */
export function stableLatency(providerId: ProviderId): number {
  const provider = getProvider(providerId);
  return Math.min(provider.gatewayDelayMs + (hashStr(`health:${providerId}`) % 160), 1400);
}

/** Disponibilidade percentual ponderada (conectados / habilitáveis). */
export function uptimePercent(states: Record<ProviderId, "connected" | "degraded" | "disabled" | "future">): number {
  const habilitable = PROVIDERS.filter((p) => p.id !== "iban");
  const connected = habilitable.filter((p) => states[p.id] === "connected").length;
  const degraded = habilitable.filter((p) => states[p.id] === "degraded").length;
  return Math.round(((connected + degraded * 0.5) / habilitable.length) * 100);
}

/** Hash de referência legível usado em recibos/QR (12 hex). */
export function receiptHash(seed: string): string {
  return hashStr(seed).toString(16).slice(0, 12).toUpperCase().padStart(12, "0");
}