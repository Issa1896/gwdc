export type ModalidadeTransporte = "rodoviario" | "maritimo";
export type BilheteStatus = "confirmado" | "embarque_aberto" | "validado" | "cancelado";
export type VeiculoStatus = "em_transito" | "parado_estacao" | "manutencao";

export interface Rota {
  id: string;
  origem: string;
  destino: string;
  modalidade: ModalidadeTransporte;
  operadora: string;
  distanciaKm: number;
  duracaoEstimada: string;
  precoFCFA: number;
  horarios: string[];
}

export interface VeiculoFrota {
  id: string;
  identificador: string;
  nome: string;
  tipo: "Ônibus Interurbano" | "Navio de Passageiros" | "Ferryboat" | "Micro-ônibus (Toca-Toca)";
  rotaId: string;
  rotaNome: string;
  velocidadeAtual: string;
  proximaParada: string;
  eta: string;
  capacidadeTotal: number;
  assentosOcupados: number;
  status: VeiculoStatus;
}

export interface BilheteDigital {
  id: string;
  numeroBilhete: string;
  passageiroNome: string;
  passageiroBI: string;
  passageiroTelefone: string;
  rotaId: string;
  rotaNome: string;
  modalidade: ModalidadeTransporte;
  dataViagem: string;
  horarioPartida: string;
  assento: string;
  precoPagoFCFA: number;
  codigoValidacao: string;
  status: BilheteStatus;
  dataEmissao: string;
}

export interface TransportState {
  rotas: Rota[];
  frota: VeiculoFrota[];
  bilhetes: BilheteDigital[];
}
