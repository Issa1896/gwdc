import type { LucideIcon } from "lucide-react";
import { Award, Building2, Globe2, Landmark, Sparkles, TreePalm } from "lucide-react";

export interface Partner {
  name: string;
  category: string;
  type: "governo" | "financeiro" | "educacao" | "internacional" | "tecnologia";
  icon: LucideIcon;
  status: "Parceria ativa" | "Acordo de intenção" | "Em negociação";
}

/** MÓDULO 2 — Parceiros institucionais e estratégicos (referências ilustrativas). */
export const PARTNERS: Partner[] = [
  { name: "Ministério da Modernização do Estado", category: "Governo", type: "governo", icon: Landmark, status: "Parceria ativa" },
  { name: "Banco Central da Guiné-Bissau (BCEAO)", category: "Finanças", type: "financeiro", icon: Building2, status: "Parceria ativa" },
  { name: "Universidade Amílcar Cabral", category: "Educação", type: "educacao", icon: Award, status: "Parceria ativa" },
  { name: "CEDEAO", category: "Regional", type: "internacional", icon: Globe2, status: "Acordo de intenção" },
  { name: "União Africana", category: "Continental", type: "internacional", icon: Globe2, status: "Em negociação" },
  { name: "Banco Mundial", category: "Multilateral", type: "internacional", icon: Landmark, status: "Em negociação" },
  { name: "Banco Africano de Desenvolvimento", category: "Multilateral", type: "internacional", icon: TreePalm, status: "Acordo de intenção" },
  { name: "PNUD Guiné-Bissau", category: "ONU", type: "internacional", icon: Globe2, status: "Parceria ativa" },
  { name: "Aliança GovTech África", category: "Tecnologia", type: "tecnologia", icon: Sparkles, status: "Acordo de intenção" },
  { name: "Centro de Inovação de Bissau", category: "Inovação", type: "tecnologia", icon: Sparkles, status: "Parceria ativa" },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/** Depoimentos institucionais (fictícios e realistas). */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Pela primeira vez, o cidadão não precisa conhecer ninguém para resolver um serviço público. O portal é transparente, rápido e funciona.",
    name: "Dra. Fatumata Camará",
    role: "Secretária de Estado da Modernização Administrativa",
  },
  {
    quote:
      "A conta digital da GW Bank mudou a relação da nossa cooperativa com o banco. Crédito, pagamentos e prestações em um só lugar.",
    name: "Sr. Mamadu Sissé",
    role: "Presidente, Cooperativa Agro-Comercial de Bafatá",
  },
  {
    quote:
      "Com os alertas climáticos em crioulo, os agricultores de Cacheu plantaram na hora certa pela primeira vez em anos.",
    name: "Eng.ª N'Faly Correia",
    role: "Diretora Regional de Agricultura",
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  content: { heading: string; paragraphs: string[] }[];
}

/** MÓDULO 2 — Blog institucional GWDC. */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "transformacao-digital-guine-bissau",
    title: "A transformação digital da Guiné-Bissau começa pela identidade",
    excerpt:
      "Sem identidade digital confiável não há governo digital, banco digital nem educação digital. Entenda por que a GWDC começou por aqui.",
    category: "Estratégia",
    date: "2026-06-18",
    author: "Direção Executiva GWDC",
    authorRole: "GW Digital Company",
    readTime: "6 min",
    content: [
      {
        heading: "O problema da identidade",
        paragraphs: [
          "Na Guiné-Bissau, milhões de cidadãos não possuem documento de identificação verificável digitalmente. Isso os exclui de serviços bancários, da escola digital, da saúde e até do voto informado.",
          "Uma identidade digital soberana — baseada em biometria, assinatura qualificada e consentimento do cidadão — é a fundação de tudo: é ela que permite ao Estado saber quem é quem, sem criar exclusão.",
        ],
      },
      {
        heading: "A resposta GWDC",
        paragraphs: [
          "O GW Identity foi desenhado com padrões internacionais (OpenID Connect, WebAuthn, ISO/ICAO) e soberania total de dados no país. Cada guineense terá um único documento digital, reutilizável em todos os serviços.",
          "O piloto já conecta 23 serviços, do portal do cidadão à abertura de conta bancária em 4 minutos. O próximo passo é a escala nacional e regional.",
        ],
      },
    ],
  },
  {
    slug: "pix-guine-bissau-gw-pay",
    title: "GW Pay: o caminho para pagamentos instantâneos na Guiné-Bissau",
    excerpt:
      "Inspirado no PIX brasileiro, o GW Pay quer levar pagamentos instantâneos e gratuitos a um país onde 60% dos adultos não têm conta bancária.",
    category: "FinTech",
    date: "2026-05-30",
    author: "Unidade FinTech",
    authorRole: "GW Digital Company",
    readTime: "5 min",
    content: [
      {
        heading: "Do dinheiro físico ao QR Code",
        paragraphs: [
          "O dinheiro físico domina a economia guineense, mas é caro, inseguro e invisível. O GW Pay cria a infraestrutura nacional de pagamentos instantâneos: QR Code, transferências 24/7 e liquidação em tempo real.",
          "Com APIs abertas, bancos, fintechs e o comércio integram-se em dias — não em anos. O piloto já processa mais de 4.800 transações por segundo em pico.",
        ],
      },
      {
        heading: "Inclusão financeira de verdade",
        paragraphs: [
          "Uma conta digital no GW Bank abre em 4 minutos com biometria. O crédito passa a usar score alternativo: quem paga contas, envia remessas e mantém histórico ganha acesso a crédito justo.",
          "Este é o círculo virtuoso que queremos: identidade → conta → pagamentos → crédito → crescimento.",
        ],
      },
    ],
  },
  {
    slug: "ia-agricultura-clima",
    title: "IA e sensores: antecipando as chuvas que alimentam o país",
    excerpt:
      "Sensores no solo, satélites em órbita e modelos de IA: como o GW Climate está dando previsibilidade à agricultura guineense.",
    category: "IA & Clima",
    date: "2026-04-12",
    author: "Unidade de Inteligência Artificial",
    authorRole: "GW Digital Company",
    readTime: "7 min",
    content: [
      {
        heading: "Dados onde antes só havia sorte",
        paragraphs: [
          "O agricultor guineense sempre dependeu de conhecimento ancestral e do céu. O GW Climate adiciona a isso dados: 214 sensores, imagens de satélite e modelos de previsão com 87% de acerto em 7 dias.",
          "Os alertas chegam por SMS em crioulo, português e francês — inclusive para quem não tem smartphone.",
        ],
      },
      {
        heading: "Protegendo o manguezal e o futuro",
        paragraphs: [
          "Além da agricultura, o GW Climate monitora manguezais, florestas e zonas costeiras. Os dados alimentam relatórios que o país pode usar para acessar financiamento climático internacional.",
          "Proteger o clima é proteger a economia — e a IA dá ao país a vantagem de agir antes, não depois.",
        ],
      },
    ],
  },
  {
    slug: "governo-digital-cidadao",
    title: "Governo digital: o fim das filas começa com um protocolo",
    excerpt:
      "Protocolo eletrônico, gestão documental e portal do cidadão: o retrato de um Estado que aprendeu a responder em dias, não meses.",
    category: "GovTech",
    date: "2026-03-02",
    author: "Unidade GovTech",
    authorRole: "GW Digital Company",
    readTime: "5 min",
    content: [
      {
        heading: "O protocolo que acabou com a senha",
        paragraphs: [
          "No modelo antigo, pedir um atestado era uma epopeia: fila, papel, carimbo e meses de espera. Com o protocolo eletrônico da GWDC, cada pedido ganha número único, prazo e trilha de auditoria.",
          "O cidadão acompanha tudo pelo GW Citizen e recebe o documento digital assinado, com QR Code de verificação.",
        ],
      },
      {
        heading: "Integração entre ministérios",
        paragraphs: [
          "O barramento de integração conecta 14 órgãos: o registro civil conversa com a saúde, a educação e a fazenda. Dados únicos, decisões melhores e menos burocracia.",
          "Este é o padrão GOV.GW que a Guiné-Bissau merece — e que já está em andamento.",
        ],
      },
    ],
  },
];

export interface Job {
  title: string;
  department: string;
  location: string;
  type: "Tempo integral" | "Meio período" | "Remoto" | "Híbrido";
  description: string;
  requirements: string[];
}

/** MÓDULO 2 — Vagas (Carreiras). */
export const JOBS: Job[] = [
  {
    title: "Engenheiro(a) de Software Full Stack",
    department: "Produto",
    location: "Bissau / Híbrido",
    type: "Tempo integral",
    description: "Desenvolver os produtos da família GW com Next.js, TypeScript e Node.js em arquitetura enterprise.",
    requirements: ["TypeScript avançado", "React/Next.js", "Node.js e APIs REST", "PostgreSQL ou MongoDB", "Inglês técnico"],
  },
  {
    title: "Engenheiro(a) de Dados e IA",
    department: "Inteligência Artificial",
    location: "Bissau / Remoto",
    type: "Tempo integral",
    description: "Construir pipelines de dados, modelos preditivos e o assistente virtual da GWDC.",
    requirements: ["Python e SQL", "ML (scikit-learn/PyTorch)", "ETL e data warehousing", "AWS/GCP"],
  },
  {
    title: "Especialista em Segurança da Informação",
    department: "GW Security",
    location: "Bissau",
    type: "Tempo integral",
    description: "Liderar o SOC nacional: monitoramento, resposta a incidentes e conformidade.",
    requirements: ["Segurança ofensiva e defensiva", "SIEM (Elastic/Wazuh)", "Conformidade (LGPD/CEPD)", "Certificação (CISSP/OSCP)"],
  },
  {
    title: "Designer de Produto (UX/UI)",
    department: "Design",
    location: "Bissau / Híbrido",
    type: "Tempo integral",
    description: "Cuidar do Design System GWDC e das experiências dos 18 produtos.",
    requirements: ["Figma avançado", "Design Systems", "WCAG 2.2", "Portfólio GovTech/FinTech"],
  },
  {
    title: "Analista de Negócios GovTech",
    department: "Governo",
    location: "Bissau",
    type: "Tempo integral",
    description: "Traduzir as necessidades do Estado em requisitos de produto e conduzir pilotos ministeriais.",
    requirements: ["Experiência com setor público", "Análise de requisitos", "Português e crioulo", "Comunicação executiva"],
  },
  {
    title: "Estagiário(a) de Desenvolvimento",
    department: "Academia GW",
    location: "Bissau",
    type: "Meio período",
    description: "Programa de formação prática em engenharia de software com mentoria GWDC.",
    requirements: ["Lógica de programação", "JavaScript básico", "Interesse em GovTech/FinTech", "Ensino superior em curso"],
  },
];
