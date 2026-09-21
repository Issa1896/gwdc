export type DocumentoTipo = "bi" | "carta_conducao" | "cartao_vacina" | "passe_transporte";

export interface DocumentoDigital {
  id: string;
  tipo: DocumentoTipo;
  titulo: string;
  numero: string;
  titularNome: string;
  dataEmissao: string;
  validade: string;
  orgaoEmissor: string;
  codigoQR: string;
  dadosExtras: Record<string, string>;
}

export type PedidoCidadaoStatus = "em_analise" | "pronto_para_retirada" | "concluido" | "pendente_documento";

export interface PedidoCidadao {
  id: string;
  codigoAcompanhamento: string;
  servicoNome: string;
  categoria: "Identidade & Civil" | "Saúde" | "Educação" | "Transportes" | "Finanças & Impostos";
  orgaoResponsavel: string;
  dataSolicitacao: string;
  status: PedidoCidadaoStatus;
  prazoDiasUteis: number;
  taxaFCFA: number;
}

export interface ServicoPublicoDisponivel {
  id: string;
  nome: string;
  categoria: PedidoCidadao["categoria"];
  descricao: string;
  orgao: string;
  prazoMedio: string;
  taxaFCFA: number;
  digitalDisponivel: boolean;
}

export interface UssdSessionState {
  menuAtual: "raiz" | "certidoes" | "vacinas" | "transportes" | "resultado";
  historicoMensagem: string;
  respostaTela: string;
}

export interface CitizenState {
  documentos: DocumentoDigital[];
  pedidos: PedidoCidadao[];
  servicos: ServicoPublicoDisponivel[];
  ussd: UssdSessionState;
}
