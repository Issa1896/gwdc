import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Bus,
  CloudSun,
  GraduationCap,
  HeartPulse,
  Landmark,
  Scale,
  TrendingUp,
} from "lucide-react";

export interface Solution {
  slug: string;
  title: string;
  icon: LucideIcon;
  color: string;
  headline: string;
  problem: string[];
  transformation: string[];
  benefits: string[];
  products: string[];
  stats: { value: string; label: string }[];
}

/** MÓDULO 2/6-11 — Verticais do website (narrativa: problema → transformação → solução → benefícios). */
export const SOLUTIONS: Solution[] = [
  {
    slug: "governo-digital",
    title: "Governo Digital",
    icon: Landmark,
    color: "#0B9E8A",
    headline: "Um Estado que funciona para todos, em um toque.",
    problem: [
      "Documentos e processos 100% em papel, perdidos ou adulterados",
      "Cidadãos que perdem dias em filas para certidões e atestados",
      "Ministérios sem comunicação entre si, dados duplicados",
      "Ausência de identidade digital confiável e soberana",
    ],
    transformation: [
      "Cadastro Nacional Único com identidade digital verificável",
      "Protocolo eletrônico interministerial com trilha completa",
      "Portal do Cidadão com mais de 40 serviços digitais",
      "Barramento de integração conectando todos os órgãos",
    ],
    benefits: [
      "Tempo de atendimento reduzido em até 78%",
      "Transparência radical e combate à corrupção",
      "Dados únicos e confiáveis para políticas públicas",
      "Base nacional pronta para escala na CEDEAO",
    ],
    products: ["gw-government", "gw-citizen", "gw-identity", "gw-open-data"],
    stats: [
      { value: "42", label: "Serviços digitalizados" },
      { value: "14", label: "Órgãos integrados" },
      { value: "-78%", label: "Tempo de atendimento" },
    ],
  },
  {
    slug: "educacao",
    title: "Educação",
    icon: GraduationCap,
    color: "#16A34A",
    headline: "Do recenseamento ao diploma, tudo digital.",
    problem: [
      "Matrículas manuais, notas perdidas e diplomas falsificados",
      "Sem dados confiáveis sobre quantos alunos existem no país",
      "Professores e alunos sem ferramentas digitais de ensino",
      "Falsificação de diplomas prejudicando a credibilidade nacional",
    ],
    transformation: [
      "GW Education com portais de aluno, professor e gestor",
      "Ambiente virtual de aprendizagem para todo o país",
      "Diplomas digitais com verificação por QR Code",
      "Censo educacional em tempo real, escola a escola",
    ],
    benefits: [
      "Educação a distância para o interior do país",
      "Fim da falsificação de diplomas e certificados",
      "Políticas educacionais baseadas em dados",
      "Integração nacional do ensino básico à universidade",
    ],
    products: ["gw-education", "gw-campus", "gw-school"],
    stats: [
      { value: "48 mil", label: "Estudantes conectados" },
      { value: "312", label: "Escolas na rede" },
      { value: "100%", label: "Documentos digitais" },
    ],
  },
  {
    slug: "saude",
    title: "Saúde",
    icon: HeartPulse,
    color: "#E11D48",
    headline: "Um prontuário nacional, uma vida protegida.",
    problem: [
      "Prontuários em papel que não viajam com o paciente",
      "População do interior sem acesso a especialistas",
      "Estoque de medicamentos sem controle",
      "Resposta lenta a surtos e epidemias",
    ],
    transformation: [
      "Prontuário eletrônico único conectando toda a rede",
      "Telemedicina levando especialistas ao interior",
      "Carteira digital de vacinação e alertas",
      "IA monitorando surtos em tempo real",
    ],
    benefits: [
      "Histórico clínico completo em qualquer unidade",
      "Menos mortes evitáveis com alerta precoce",
      "Medicamentos sem desperdício e sem falta",
      "Dados sanitários para o Ministério e OMS",
    ],
    products: ["gw-health", "gw-citizen", "gw-identity"],
    stats: [
      { value: "96 mil", label: "Prontuários digitais" },
      { value: "2.3 mil", label: "Teleconsultas" },
      { value: "24/7", label: "Monitoramento" },
    ],
  },
  {
    slug: "justica",
    title: "Justiça",
    icon: Scale,
    color: "#6B4FA8",
    headline: "Justiça mais rápida, transparente e acessível.",
    problem: [
      "Processos físicos que levam anos para tramitar",
      "Distribuição de processos sujeita a interferência",
      "Cidadãos do interior sem acesso ao judiciário",
      "Ausência de estatísticas confiáveis da justiça",
    ],
    transformation: [
      "Processo judicial eletrônico com distribuição automática",
      "Peticionamento e intimações 100% digitais",
      "Audiências por videoconferência em todo o país",
      "Painel público de acompanhamento processual",
    ],
    benefits: [
      "Redução de até 62% no tempo de julgamento",
      "Imparcialidade garantida por algoritmos auditáveis",
      "Justiça presente em todas as regiões",
      "Transparência que reforça o estado de direito",
    ],
    products: ["gw-justice", "gw-identity", "gw-security"],
    stats: [
      { value: "2.4 mil", label: "Processos digitais" },
      { value: "-62%", label: "Tempo de julgamento" },
      { value: "180", label: "Audiências virtuais" },
    ],
  },
  {
    slug: "banco-digital",
    title: "Banco Digital",
    icon: Building2,
    color: "#0EA5E9",
    headline: "Inclusão financeira para milhões de guineenses.",
    problem: [
      "Mais de 60% dos adultos sem conta bancária",
      "Dependência total de dinheiro físico",
      "Crédito inacessível para PMEs e famílias",
      "Sistema financeiro sem dados em tempo real",
    ],
    transformation: [
      "GW Bank: conta digital aberta em 4 minutos",
      "GW Pay: pagamentos instantâneos com QR Code",
      "Open Finance em padrão BCEAO",
      "Antifraude com IA em tempo real",
    ],
    benefits: [
      "Primeira conta bancária para milhões",
      "Economia digital com custo quase zero",
      "Crédito via score alternativo inclusivo",
      "Supervisão regulatória em tempo real",
    ],
    products: ["gw-bank", "gw-pay", "gw-identity", "gw-analytics"],
    stats: [
      { value: "12.4 mil", label: "Contas no piloto" },
      { value: "4 min", label: "Para abrir conta" },
      { value: "99,9%", label: "Disponibilidade" },
    ],
  },
  {
    slug: "empresas",
    title: "Empresas",
    icon: TrendingUp,
    color: "#EA580C",
    headline: "O ERP que coloca as empresas guineenses no mapa.",
    problem: [
      "Gestão em planilhas desconectadas e inseguras",
      "Estoque, caixa e vendas sem visão única",
      "ERPs importados caros e sem localização",
      "Falta de dados para crédito e investimento",
    ],
    transformation: [
      "GW ERP completo: financeiro, estoque, RH e produção",
      "GW Business: CRM com funil e previsão por IA",
      "GW POS: varejo rápido, offline-first",
      "GW Analytics: BI embutido para decisões",
    ],
    benefits: [
      "Visão 360° do negócio em tempo real",
      "Custo total até 60% menor que importados",
      "Prontidão fiscal e financeira",
      "Dados que destravam crédito bancário",
    ],
    products: ["gw-erp", "gw-business", "gw-pos", "gw-analytics"],
    stats: [
      { value: "38", label: "Empresas piloto" },
      { value: "+34%", label: "Conversão de vendas" },
      { value: "12", label: "Módulos do ERP" },
    ],
  },
  {
    slug: "transporte",
    title: "Transporte",
    icon: Bus,
    color: "#F59E0B",
    headline: "Mobilidade digital entre estradas, rios e ilhas.",
    problem: [
      "Filas e caos nos terminais rodoviários",
      "Bilhetes sem controle e receita extraviada",
      "Embarcações sem rastreamento nem segurança",
      "Sem dados de mobilidade para planejar o país",
    ],
    transformation: [
      "Venda de passagens online e nos terminais",
      "Bilhete digital com QR Code e check-in",
      "Rastreamento GPS de ônibus e barcos",
      "Gestão de rotas com dados em tempo real",
    ],
    benefits: [
      "Fim das filas e dos calotes de bilheteria",
      "Viagens mais seguras e pontuais",
      "Receita auditável para operadores e Estado",
      "Dados para planejar estradas e rotas",
    ],
    products: ["gw-transport", "gw-pay", "gw-analytics"],
    stats: [
      { value: "3.400", label: "Passagens/dia" },
      { value: "58", label: "Rotas ativas" },
      { value: "GPS", label: "Rastreio total" },
    ],
  },
  {
    slug: "meio-ambiente",
    title: "Meio Ambiente",
    icon: CloudSun,
    color: "#10B981",
    headline: "Antecipar o clima é proteger vidas e colheitas.",
    problem: [
      "Chuvas imprevisíveis destruindo colheitas",
      "Inundações e secas sem alerta prévio",
      "Manguezais e florestas sem monitoramento",
      "Agricultura e pesca no escuro meteorológico",
    ],
    transformation: [
      "Rede nacional de sensores e estações",
      "Previsão localizada por IA (7 dias)",
      "Alertas por SMS em crioulo",
      "Monitoramento por satélite de florestas e água",
    ],
    benefits: [
      "Alertas precoces salvam vidas e safras",
      "Agricultores plantam na hora certa",
      "Dados para financiamento climático global",
      "Proteção dos ecossistemas da Guiné-Bissau",
    ],
    products: ["gw-climate", "gw-open-data", "gw-analytics"],
    stats: [
      { value: "214", label: "Sensores ativos" },
      { value: "87%", label: "Precisão de previsão" },
      { value: "7 dias", label: "Previsão localizada" },
    ],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
