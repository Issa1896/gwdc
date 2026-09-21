export type ProcessoPrioridade = "normal" | "urgente" | "muito_urgente";
export type ProcessoStatus = "recebido" | "em_analise" | "despachado" | "concluido" | "indeferido";
export type DespachoDecisao = "favoravel" | "desfavoravel" | "encaminhamento" | "solicitacao_documentos";

export interface Despacho {
  id: string;
  autor: string;
  cargo: string;
  orgao: string;
  data: string;
  texto: string;
  decisao: DespachoDecisao;
}

export interface ProcessoProtocolo {
  id: string;
  numeroProtocolo: string;
  requerenteNome: string;
  requerenteBI: string;
  requerenteTelefone: string;
  ministerioDestino: string;
  assunto: string;
  categoria: "Certidões & Registos" | "Alvará Comercial" | "Bolsas de Estudo" | "Saúde Pública" | "Obras Públicas" | "Assuntos Fiscais";
  descricao: string;
  prioridade: ProcessoPrioridade;
  status: ProcessoStatus;
  dataAbertura: string;
  dataAtualizacao: string;
  despachos: Despacho[];
  anexos: string[];
}

export interface CidadaoGW {
  id: string;
  numeroBI: string;
  nif: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: "M" | "F";
  naturalidade: string;
  regiao: "Bissau" | "Biombo" | "Bafatá" | "Gabú" | "Cacheu" | "Oio" | "Quinara" | "Tombali" | "Bolama/Bijagós";
  filiacaoPai: string;
  filiacaoMae: string;
  estadoCivil: "Solteiro(a)" | "Casado(a)" | "Divorciado(a)" | "Viúvo(a)";
  dataEmissao: string;
  validade: string;
  biometriaStatus: "validada" | "pendente";
}

export type CertidaoTipo = "nascimento" | "casamento" | "registo_criminal" | "residencia" | "obito";

export interface CertidaoEmitida {
  id: string;
  tipo: CertidaoTipo;
  numeroCertidao: string;
  titularNome: string;
  numeroBI: string;
  dataEmissao: string;
  orgaoEmissor: string;
  codigoValidacao: string;
  hashAutenticidade: string;
  status: "valida" | "revogada";
}

export interface Ministerio {
  id: string;
  sigla: string;
  nome: string;
  ministro: string;
  servicosAtivos: number;
  processosPendentes: number;
  contatoEmail: string;
}

export interface GovernmentConfig {
  notificacoesSms: boolean;
  auditoriaBlocos: boolean;
  integracaoUssd: boolean;
  despachoAutomatico: boolean;
}

export interface GovernmentState {
  processos: ProcessoProtocolo[];
  cidadaos: CidadaoGW[];
  certidoes: CertidaoEmitida[];
  ministerios: Ministerio[];
  config: GovernmentConfig;
}
