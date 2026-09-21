/**
 * MÓDULO 1 — BRANDING E IDENTIDADE GWDC
 * ------------------------------------------------------------
 * Fonte única de verdade da marca: missão, visão, valores,
 * manifesto, história, posicionamento, tom de voz e tokens
 * de identidade visual.
 */

export const branding = {
  /** Nome legal da empresa. */
  company: "GW Digital Company",
  shortName: "GWDC",
  /** Slogan oficial da marca. */
  slogan: "Tecnologia que transforma a Guiné-Bissau e conecta o futuro da África Ocidental.",
  sloganShort: "O futuro digital da Guiné-Bissau",
  founded: 2022,
  headquarters: "Bissau, Guiné-Bissau",
  language: "Português",
  website: "https://gwdigital.company",

  /** Missão. */
  mission:
    "Transformar a Guiné-Bissau por meio da tecnologia, criando plataformas digitais seguras, acessíveis e escaláveis que conectam o Estado, as empresas e os cidadãos ao futuro da África Ocidental.",

  /** Visão. */
  vision:
    "Ser até 2030 a principal empresa de transformação digital da Guiné-Bissau e uma referência em GovTech e FinTech na África Ocidental, impulsionando o desenvolvimento socioeconômico do país.",

  /** Valores corporativos. */
  values: [
    {
      title: "Impacto Nacional",
      description: "Cada produto deve melhorar a vida de milhões de guineenses, do interior ao litoral.",
      icon: "globe",
    },
    {
      title: "Confiança e Segurança",
      description: "Dados protegidos por padrão. Privacidade como direito fundamental, não como opção.",
      icon: "shield",
    },
    {
      title: "Excelência Técnica",
      description: "Código limpo, arquiteturas enterprise e padrões comparáveis aos maiores do mundo.",
      icon: "code",
    },
    {
      title: "Inovação Africana",
      description: "Soluções desenhadas no continente, para o continente — com visão global.",
      icon: "lightbulb",
    },
    {
      title: "Inclusão Digital",
      description: "Tecnologia acessível a todos: multilíngue, multicanal e offline-first.",
      icon: "users",
    },
    {
      title: "Integridade",
      description: "Transparência total com o Estado, o mercado e a sociedade civil.",
      icon: "scale",
    },
  ] as const,

  /** Manifesto da empresa. */
  manifesto: [
    "A Guiné-Bissau é um país de coragem, história e potencial ilimitado. Entre o Atlântico e o interior, vivem pessoas que esperam há demasiado tempo por um Estado que funcione, por serviços que cheguem e por oportunidades que não dependam de quem se conhece.",
    "Acreditamos que a tecnologia é o caminho mais curto para a justiça, a saúde, a educação e a prosperidade. Um cidadão com identidade digital é um cidadão com direitos. Um aluno com acesso à educação é um país com futuro. Uma empresa digitalizada é um país competitivo.",
    "A GW Digital Company nasceu com um compromisso: construir a infraestrutura digital da Guiné-Bissau — e depois da África Ocidental — com os mesmos padrões das maiores empresas de tecnologia do mundo, mas com o coração e o propósito africanos.",
    "Não esperamos. Construímos. Não prometemos. Entregamos. O futuro digital da Guiné-Bissau começa hoje, aqui, agora.",
  ],

  /** Posicionamento estratégico. */
  positioning: {
    category: "Plataforma nacional de transformação digital",
    audience: [
      "Estado e Governo (Presidência, Ministérios, autarquias)",
      "Instituições financeiras e Banco Central",
      "Empresas públicas e privadas",
      "Instituições de ensino e universidades",
      "Cidadãos e comunidades",
    ],
    differentiators: [
      "Única plataforma end-to-end desenhada especificamente para a Guiné-Bissau",
      "Padrões enterprise globais com foco local",
      "Ecossistema integrado de 18 produtos em uma única identidade",
      "Segurança e soberania de dados no país",
    ],
  },

  /** Tom de voz — guia de comunicação. */
  toneOfVoice: {
    personality: "Confiante, clara, humana e inspiradora.",
    principles: [
      "Clareza antes de elegância: linguagem simples, sem jargões desnecessários.",
      "Otimismo realista: falamos de resultados, não de promessas vazias.",
      "Respeito profundo: o cidadão guineense é o centro de tudo.",
      "Orgulho africano: celebramos o que é nosso e o que construímos.",
    ],
    avoid: [
      "Linguagem corporativa vazia",
      "Jargões técnicos sem explicação",
      "Comparações que diminuam a realidade local",
      "Promessas sem dados",
    ],
  },

  /** Naming dos produtos — família GW. */
  productNaming: {
    rule: "Prefixo GW + nome curto do domínio em inglês (reconhecível globalmente), com descrição em português.",
    examples: ["GW Citizen", "GW Bank", "GW Education", "GW Climate", "GW Open Data"],
  },

  /** Guia de identidade visual. */
  visualIdentity: {
    logoConcept:
      "Logotipo tipográfico 'GW' em fonte display Sora Bold, com o 'G' finalizado por um ponto conectado — símbolo de conexão, continente e infinito. Acompanhado pelo logotipo completo 'GW DIGITAL COMPANY' e o slogan opcional.",
    /** Paleta de cores oficial. */
    palette: {
      primary: {
        name: "Verde GW",
        hex: "#0B9E8A",
        usage: "Ação, marca, destaque — cor da prosperidade e do oceano atlântico guineense.",
      },
      navy: {
        name: "Azul Noturno",
        hex: "#0B1B34",
        usage: "Fundo principal, credibilidade, Estado e confiança.",
      },
      gold: {
        name: "Ouro Sahel",
        hex: "#D79114",
        usage: "Destaques, prêmios, chamadas especiais — cor da riqueza do Sahel.",
      },
      supporting: ["#5FD4BC", "#94B6DA", "#EDC653"],
    },
    /** Tipografia da marca. */
    typography: {
      display: "Sora — títulos e grandes comunicações",
      body: "Inter — textos, interfaces e documentos",
      rules: "Escala tipográfica 1.25; títulos em Sora Semibold/Bold; corpo em Inter Regular.",
    },
    iconography:
      "Ícones lineares consistentes (família Lucide), traço 2px, cantos arredondados — clareza e simplicidade.",
  },

  /** Linha do tempo da história da empresa. */
  history: [
    {
      year: "2022",
      title: "Fundação",
      description:
        "A GW Digital Company nasce em Bissau com a missão de digitalizar os serviços públicos da Guiné-Bissau.",
    },
    {
      year: "2023",
      title: "Primeiros projetos GovTech",
      description:
        "Parcerias com ministérios para gestão documental eletrônica e protocolo digital piloto.",
    },
    {
      year: "2024",
      title: "Ecossistema de produtos",
      description:
        "Lançamento da família GW: 18 produtos integrados, do GW Government ao GW Climate.",
    },
    {
      year: "2025",
      title: "MVPs e demonstrações",
      description:
        "MVPs navegáveis de todas as soluções com dados fictícios realistas para captação de investidores e parceiros.",
    },
    {
      year: "2026",
      title: "Expansão regional",
      description:
        "Preparação para escalar para a África Ocidental: CEDEAO, União Africana e bancos multilaterais.",
    },
  ] as const,

  /** Estatísticas institucionais usadas no site. */
  stats: [
    { value: 18, label: "Produtos integrados" },
    { value: 9, label: "Setores transformados" },
    { value: 1.9, label: "Milhões de cidadãos alcançados (meta)" },
    { value: 100, label: "% Soberania de dados no país" },
  ] as const,
} as const;

export type BrandValue = (typeof branding.values)[number];
