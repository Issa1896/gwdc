import type { PayProvider } from "./types";

/**
 * Conectores do GW Pay — integrações de pagamento.
 * Cada conector descreve o contrato REST do seu provedor (documentação
 * realista para simulação): endpoints, autenticação e características
 * de liquidação. O estado operacional ao vivo fica no pay-store.
 */
export const PROVIDERS: PayProvider[] = [
  {
    id: "orange-money",
    name: "Orange Money Guiné-Bissau",
    short: "Orange Money",
    operator: "Orange Guiné-Bissau",
    kind: "mobile-money",
    feeRate: 0.012,
    baseUrl: "https://api.orange-bissau.gw/om/v1/",
    apiVersion: "v1 (REST)",
    auth: "OAuth2 · client_credentials + assinatura HMAC-SHA256",
    settlement: "Em tempo real",
    gatewayDelayMs: 900,
    failRate: 0.03,
    channel: "USSD *245# · App Orange Money",
    since: "2025-11-10",
    endpoints: [
      { method: "POST", path: "payments/collections", description: "Cobrança P2P — debita a carteira do emitente" },
      { method: "GET", path: "payments/transactions/{ref}", description: "Consulta do estado da liquidação" },
      { method: "POST", path: "payments/disbursements", description: "Envio P2P — credita a carteira do destinatário" },
      { method: "GET", path: "wallet/balance", description: "Saldo da carteira de liquidação" },
      { method: "POST", path: "notifications/callback", description: "Webhook de liquidação (assinado)" },
    ],
  },
  {
    id: "momo",
    name: "MTN Mobile Money",
    short: "MoMo",
    operator: "MTN Guiné-Bissau",
    kind: "mobile-money",
    feeRate: 0.015,
    baseUrl: "https://api-momo.mtn.com/gw/collection/v1/",
    apiVersion: "v1 (MoMo API)",
    auth: "API Key · X-Target-Environment sandbox/prod",
    settlement: "Em tempo real",
    gatewayDelayMs: 1200,
    failRate: 0.05,
    channel: "USSD *133# · App MTN MoMo",
    since: "2025-12-02",
    endpoints: [
      { method: "POST", path: "requesttopay", description: "Pedido de pagamento da carteira MoMo" },
      { method: "GET", path: "requesttopay/{ref}", description: "Estado da transação (PENDING/SUCCESSFUL/FAILED)" },
      { method: "POST", path: "transfer", description: "Transferência de dinheiro móvel" },
      { method: "GET", path: "account/balance", description: "Consulta de saldo da conta de liquidação" },
      { method: "POST", path: "callback", description: "Callback de liquidação assíncrona" },
    ],
  },
  {
    id: "gw-pix",
    name: "GW PIX — Pagamentos Instantâneos",
    short: "GW PIX",
    operator: "Banco Central — Barramento GWDC",
    kind: "instant",
    feeRate: 0,
    baseUrl: "https://api.gwpay.gw/pix/v1/",
    apiVersion: "v1 (Open Payments)",
    auth: "mTLS · certificado GWDC + chave de assinatura",
    settlement: "Instantâneo · 24/7 · 365 dias",
    gatewayDelayMs: 350,
    failRate: 0.01,
    channel: "Chave PIX · QR Code · P2P · P2M",
    since: "2026-01-15",
    endpoints: [
      { method: "POST", path: "pix/instant-transfer", description: "Transferência instantânea entre participantes" },
      { method: "POST", path: "pix/qrcode", description: "Emissão de QR Code estático ou dinâmico" },
      { method: "GET", path: "pix/payments/{id}", description: "Consulta de pagamento instantâneo" },
      { method: "POST", path: "pix/callback", description: "Notificação de liquidação (webhook FSP)" },
      { method: "GET", path: "participants", description: "Diretório de participantes e chaves" },
    ],
  },
  {
    id: "iban",
    name: "Transferências IBAN (BCEAO)",
    short: "IBAN",
    operator: "Banco Central dos Estados da África Ocidental",
    kind: "iban",
    feeRate: 0,
    baseUrl: "https://api.bceao.gw/iban/v1/",
    apiVersion: "v1 (esperado)",
    auth: "TBD · interoperabilidade SEPA-like",
    settlement: "T+1 (esperado)",
    gatewayDelayMs: 0,
    failRate: 0,
    channel: "SWIFT · SEPA",
    since: "2027-01-01",
    future: "Integração prevista para 2027 — em fase de homologação com o BCEAO.",
    endpoints: [
      { method: "POST", path: "transfers/iban", description: "Transferência SEPA-like internacional" },
      { method: "GET", path: "transfers/{id}", description: "Estado de liquidação T+1" },
    ],
  },
];

export function getProvider(id: string): PayProvider {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}