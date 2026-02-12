/**
 * BASE DE CONHECIMENTO - DIELLY (Assistente Virtual Simula Saúde)
 * Motor de busca semântico com sinônimos, análise contextual, preços reais e respostas conversacionais
 * Dados extraídos dos materiais oficiais: PPO Fev/2026 e Treinamento Comercial Hapvida ND 02/2026
 */

import {
  PRODUCTS,
  CITIES,
  AGE_RANGES,
  AGE_RANGE_LABELS,
  CONTRACT_TYPES,
  PRICES,
  getAvailableProducts,
  getPrice,
  type City,
  type ContractType,
  type CoparticipationType,
  type AgeRange,
} from "./hapvida-prices";

export interface KnowledgeEntry {
  id: string;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
  relatedIds?: string[];
  tags?: string[];
}

// ============================================
// SINÔNIMOS GLOBAIS
// ============================================
const GLOBAL_SYNONYMS: Record<string, string[]> = {
  barato: ["barato", "econômico", "acessível", "menor preço", "menor valor", "mais em conta", "custo baixo", "mais barato", "menor custo"],
  caro: ["caro", "premium", "alto padrão", "top", "melhor", "mais caro", "luxo"],
  completo: ["completo", "melhor", "top", "tudo", "cobertura total", "mais completo"],
  diferenca: ["diferença", "diferente", "comparar", "comparação", "versus", "vs", "x", "ou", "contra"],
  preco: ["preço", "valor", "custo", "quanto custa", "mensalidade", "quanto", "tabela", "quanto pago", "quanto é"],
  coparticipacao: ["coparticipação", "coparticipacao", "copay", "taxa uso", "pagar quando usa"],
  contrato: ["contrato", "tipo contrato", "modalidade", "adesão", "compulsório", "super simples", "pme"],
  filial: ["filial", "cidade", "região", "local", "onde", "praça", "unidade"],
  produto: ["produto", "plano", "convênio", "plano de saúde", "opção"],
  rede: ["rede", "hospital", "clínica", "atendimento", "credenciado", "própria"],
  reembolso: ["reembolso", "livre escolha", "qualquer médico", "devolver", "restituir"],
  internacao: ["internação", "internar", "hospital", "cirurgia", "hospitalar"],
  consulta: ["consulta", "médico", "doutor", "atendimento", "ambulatorial"],
  dependente: ["dependente", "filho", "esposa", "marido", "cônjuge", "família", "familiar", "pai", "mãe", "agregado"],
  empresa: ["empresa", "cnpj", "firma", "negócio", "companhia", "empregador"],
  funcionario: ["funcionário", "empregado", "colaborador", "trabalhador", "vida"],
  vender: ["vender", "venda", "oferecer", "propor", "apresentar", "argumento", "convencer"],
  documento: ["documento", "documentação", "papel", "papelada", "o que precisa", "requisito"],
  carencia: ["carência", "carencia", "espera", "prazo", "quando posso usar", "tempo"],
  idade: ["idade", "faixa etária", "faixa etaria", "anos", "idoso", "jovem", "criança", "bebê", "velho"],
  vigencia: ["vigência", "vigencia", "validade", "quando começa", "início", "data", "prazo"],
  boleto: ["boleto", "pagamento", "pagar", "vencimento", "parcela", "mensalidade"],
  crianca: ["criança", "bebê", "filho", "filha", "menor", "infantil", "pediatra", "0 a 18", "00-18"],
  gestante: ["gestante", "grávida", "gravidez", "parto", "obstetrícia", "maternidade"],
  odonto: ["odonto", "odontologia", "dentista", "dente", "dental", "odontológico"],
  terapia: ["terapia", "tea", "autismo", "aba", "fonoaudiologia", "psicologia", "terapias especiais"],
  promocao: ["promoção", "desconto", "oferta", "campanha"],
  clube: ["clube", "vantagens", "benefício", "desconto", "clube de vantagens"],
  portabilidade: ["portabilidade", "trocar", "migrar", "mudar", "vindo de outro"],
  verticalização: ["verticalização", "verticalizacao", "rede própria obrigatória", "convite"],
};

// ============================================
// BASE DE CONHECIMENTO COMPLETA
// ============================================
export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ===== INSTITUCIONAL =====
  {
    id: "institucional-hapvida",
    category: "Institucional",
    keywords: ["hapvida", "empresa", "quem é", "sobre", "institucional", "história", "tamanho"],
    tags: ["institucional", "geral"],
    question: "Quem é a Hapvida?",
    answer: "A **Hapvida** é a maior empresa de saúde do Brasil!\n\n**Números (2TRI/2025):**\n• **832 unidades** próprias e integradas nas 5 regiões do Brasil\n• **86 hospitais**, 80 prontos atendimentos, 365 clínicas, 301 unidades de diagnóstico\n• **+6.300 leitos** de internação\n• **+15,9 milhões** de clientes (+8,9 mi saúde, +7 mi odonto)\n• **+73 mil** colaboradores, +24 mil vendedores, +28 mil médicos\n\n**Ranking ANS (Set/2025):**\n• **1º lugar em Saúde** — 8.824.986 clientes (16,59% do mercado)\n• **2º lugar em Odontologia** — 7.067.983 clientes (18,35%)\n\n**Investimentos:** R$ 2 bilhões em expansão da rede, sendo R$ 1 bilhão só em São Paulo.",
    relatedIds: ["investimentos-sp", "investimentos-rj"],
  },
  {
    id: "investimentos-sp",
    category: "Institucional",
    keywords: ["investimento", "expansão", "novo hospital", "são paulo", "obras", "construção"],
    tags: ["institucional", "investimento", "sp"],
    question: "Quais são os novos investimentos em São Paulo?",
    answer: "**Investimentos em São Paulo — +R$ 1 bilhão:**\n\n**Novos Hospitais:**\n• **Hospital Ibirapuera** — 250 leitos, Av. Brigadeiro Luís Antônio (Paraíso). Materno Infantil, diagnóstico completo. R$ 405 milhões\n• **Hospital Antônio Prudente** — 250 leitos, Vila Clementino. Altíssima complexidade, oncologia, hotelaria alto padrão. R$ 473 milhões\n• **Hospital Atibaia** — 107 leitos. Alta complexidade, maternidade, UTI neonatal/pediátrica/adulto. R$ 90 milhões\n\n**Mega Unidades:**\n• **Adolfo Pinheiro** (Santo Amaro) — Ambulatório alta complexidade, diagnóstico. R$ 26,5 mi\n• **Celso Garcia** (Tatuapé) — Clínica e diagnóstico. R$ 11 mi\n• **Henrique Mazzei** (Tucuruvi) — Clínica e diagnóstico. R$ 12,9 mi\n\n**+3.700 empregos** gerados em SP e Região Metropolitana.",
    relatedIds: ["investimentos-rj", "institucional-hapvida"],
  },
  {
    id: "investimentos-rj",
    category: "Institucional",
    keywords: ["investimento", "rio de janeiro", "rj", "novo hospital rio", "expansão rio"],
    tags: ["institucional", "investimento", "rj"],
    question: "Quais são os novos investimentos no Rio de Janeiro?",
    answer: "**Investimentos no Rio de Janeiro — ~R$ 380 milhões:**\n\nAtualmente: 19 unidades próprias, +890 mil clientes, +2 mil colaboradores (04 Hospitais, 03 PAs, 06 Clínicas, 06 Diagnósticos).\n\n**Novos investimentos:**\n• **Hospital Visconde de Saboia** — 250 leitos, Cidade Nova. R$ 300 milhões\n• **Hospital no Méier** — 80 leitos, zona norte. R$ 5,3 milhões\n• **Barra da Tijuca** — Clínica e PA. R$ 48 milhões\n• **Penha** — Clínica e PA. R$ 10,3 milhões\n• **Botafogo** — PA. R$ 14,5 milhões\n• **Hospital Santa Martha** — Reforma. R$ 14,5 milhões\n• **Nova Iguaçu** — Clínica. R$ 1,8 milhão\n\n**+1.300 empregos** gerados.",
    relatedIds: ["investimentos-sp", "institucional-hapvida"],
  },
  // ===== PRODUTOS - VISÃO GERAL =====
  {
    id: "produtos-categorias",
    category: "Produtos",
    keywords: ["produto", "produtos", "categorias", "tipos", "planos", "quais planos", "lista", "opções", "todos", "disponíveis", "hierarquia"],
    tags: ["produto", "geral", "lista"],
    question: "Quais são os produtos Hapvida?",
    answer: "Os produtos Hapvida são divididos em 3 categorias:\n\n**🏥 HMO — Rede Própria (Entrada):**\n• **Nosso Médico** — Médico da família, o mais acessível (AMB+HOSP+OBST+Odonto)\n• **Smart Ambulatorial** — Apenas consultas e exames, sem internação\n• **Smart 150** — Rede própria básica (apenas Grande Rio)\n• **Smart 200** — Rede própria regional\n• **Smart 200 UP** — Rede própria ampliada (+40 cidades)\n\n**🏥 Intermediário — Rede Credenciada:**\n• **Smart 300** — Rede credenciada regional (SP, RJ, MG, PR)\n• **Smart 400** — Rede credenciada ampliada\n• **Smart 500** — Rede credenciada premium (SP, RJ, MG, DF, PR)\n• **Smart Prime** — Cobertura nacional, rede própria + credenciada\n• **Pleno** — Rede própria + credenciada regional\n• **Basic Referência** — Rede própria com referência\n\n**💎 PPO — Livre Escolha (Premium):**\n• **Advance 600** — Reembolso R$ 75 (7 dias)\n• **Advance 700** — Reembolso R$ 96 (7 dias)\n• **Premium 900 / 900.1** — Reembolso R$ 240 (5 dias), Rede D'Or\n• **Premium 900 Care** — Reembolso R$ 240 (5 dias), sem D'Or\n• **Infinity** — Reembolso R$ 400 (3 dias), Einstein, Sírio Libanês",
    relatedIds: ["rede-propria", "rede-credenciada", "rede-livre-escolha"],
  },
  // ===== PRODUTOS DETALHADOS =====
  {
    id: "nosso-medico-detalhes",
    category: "Produtos",
    keywords: ["nosso médico", "nosso medico", "médico da família", "medico familia", "mais barato", "entrada"],
    tags: ["produto", "nosso médico", "entrada", "barato"],
    question: "Como funciona o Nosso Médico?",
    answer: "**Nosso Médico — O plano mais acessível da Hapvida:**\n\n• **Cobertura:** AMB + HOSP + OBST + Odonto incluso\n• **Rede:** Própria Hapvida\n• **Acomodação:** Enfermaria\n• **Modelo:** Médico e Enfermeira da Família → Encaminhamento para especialistas\n• **Fluxo:** Beneficiário → Urgência/Emergência → Gineco/Obstetrícia → Pediatria → Oftalmologia → Especialistas → Exames/Internação\n\n**Disponível em:** RMSP, Campinas, Jundiaí, Americana, Sorocaba (SS/PME)\n\nÉ o plano ideal para quem busca o menor custo com cobertura completa. Inclui odontologia!",
    relatedIds: ["produtos-categorias", "faq-plano-mais-barato"],
  },
  {
    id: "smart-ambulatorial-detalhes",
    category: "Produtos",
    keywords: ["smart ambulatorial", "ambulatorial", "sem internação", "só consulta", "só exame"],
    tags: ["produto", "ambulatorial", "smart"],
    question: "Como funciona o Smart Ambulatorial?",
    answer: "**Smart Ambulatorial:**\n\n• **Cobertura:** Apenas ambulatorial (sem internação hospitalar)\n• **Inclui:** Urgência/Emergência 24h (até 12h de permanência), consultas em todas as especialidades, exames de rotina (média e alta complexidade), cirurgias ambulatoriais (verruga, unha encravada, pintas), terapias\n• **NÃO inclui:** Atendimento hospitalar. Após 12h ou necessidade de internação = particular ou transferência SUS\n• **Disponível em:** SP e RJ\n\n**Cidades SP:** Americana, Barueri, Campinas, Cotia, Diadema, Guarulhos, Hortolândia, Itu, Jundiaí, Mauá, Osasco, Santo André, Santos, São Bernardo, São Paulo, Sorocaba, entre outras\n**Cidades RJ:** Rio de Janeiro, Niterói, São Gonçalo, Duque de Caxias, Nova Iguaçu, entre outras",
    relatedIds: ["nosso-medico-detalhes", "produtos-categorias"],
  },
  {
    id: "smart-200-detalhes",
    category: "Produtos",
    keywords: ["smart 200", "200", "rede própria intermediário"],
    tags: ["produto", "smart 200", "rede própria"],
    question: "Como funciona o Smart 200?",
    answer: "**Smart 200:**\n\n• **Rede:** Própria Hapvida\n• **Acomodação:** Enfermaria\n• **Segmentação:** AMB+HOSP+OBST\n• **Abrangência:** Regional\n• **NÃO tem** abrangência no Rio de Janeiro\n\n**Versões regionais:** SP Capital, ABC+BS, Baixada, Americana, Campinas, Jundiaí, Alto Tietê\n\nÉ o produto intermediário de rede própria — um passo acima do Nosso Médico.",
    relatedIds: ["smart-200-up-detalhes", "diff-smart200-smart300"],
  },
  {
    id: "smart-200-up-detalhes",
    category: "Produtos",
    keywords: ["smart 200 up", "200 up", "up", "40 cidades"],
    tags: ["produto", "smart 200 up"],
    question: "Como funciona o Smart 200 UP?",
    answer: "**Smart 200 UP — Versão ampliada do Smart 200:**\n\n• **Rede:** Própria Hapvida\n• **Acomodação:** Enfermaria\n• **Abrangência:** Grupo de municípios (+40 cidades!)\n• **NÃO tem** abrangência no Rio de Janeiro\n\n**Cidades incluídas:** Americana, Arujá, Barueri, Campinas, Campo Limpo Paulista, Carapicuíba, Cotia, Cubatão, Diadema, Guarujá, Guarulhos, Hortolândia, Itapevi, Itu, Itupeva, Jundiaí, Louveira, Mauá, Mogi das Cruzes, Nova Odessa, Osasco, Ribeirão Pires, Santo André, Santos, São Bernardo, São Caetano, São Paulo, São Vicente, Sorocaba, Sumaré, Suzano, Taboão da Serra, Várzea Paulista, Vinhedo, Votorantim, entre outras.\n\nIdeal para empresas com funcionários espalhados pela Grande SP e interior.",
    relatedIds: ["smart-200-detalhes", "diff-smart200-smart300"],
  },
  {
    id: "smart-300-detalhes",
    category: "Produtos",
    keywords: ["smart 300", "300", "rede credenciada"],
    tags: ["produto", "smart 300", "credenciada"],
    question: "Como funciona o Smart 300?",
    answer: "**Smart 300:**\n\n• **Rede:** Própria + Credenciada (PS credenciado: horário diferenciado 18h-8h)\n• **Acomodação:** Enfermaria\n• **Abrangência:** SP, RJ, MG e PR\n• **Segmentação:** AMB+HOSP+OBST\n\nPrimeiro produto com acesso à rede credenciada. Boa opção intermediária.",
    relatedIds: ["smart-500-detalhes", "diff-smart200-smart300"],
  },
  {
    id: "smart-500-detalhes",
    category: "Produtos",
    keywords: ["smart 500", "500", "credenciada premium"],
    tags: ["produto", "smart 500", "credenciada"],
    question: "Como funciona o Smart 500?",
    answer: "**Smart 500:**\n\n• **Rede:** Própria + Credenciada (PS credenciado 24h!)\n• **Acomodação:** Enfermaria e Apartamento\n• **Abrangência:** SP, RJ, MG, DF e PR\n• **Segmentação:** AMB+HOSP+OBST\n\nDiferente do Smart 300, o PS credenciado funciona 24h e a abrangência inclui DF.",
    relatedIds: ["smart-300-detalhes", "smart-prime-detalhes"],
  },
  {
    id: "smart-prime-detalhes",
    category: "Produtos",
    keywords: ["smart prime", "prime", "nacional", "cobertura nacional"],
    tags: ["produto", "smart prime", "nacional"],
    question: "Como funciona o Smart Prime?",
    answer: "**Smart Prime — Cobertura Nacional:**\n\n• **Rede:** Própria + Credenciada\n• **Acomodação:** Enfermaria e Apartamento\n• **Abrangência:** Nacional! Presente nas 5 regiões do Brasil, 27 estados\n• **NÃO tem** reembolso\n\nIdeal para empresas com funcionários que viajam ou têm filiais em outros estados.",
    relatedIds: ["advance-600-detalhes", "smart-500-detalhes"],
  },
  {
    id: "pleno-detalhes",
    category: "Produtos",
    keywords: ["pleno", "pleno campinas", "pleno jundiaí", "pleno sorocaba", "pleno vale"],
    tags: ["produto", "pleno", "regional"],
    question: "Como funciona o Pleno?",
    answer: "**Pleno — Rede Própria + Credenciada Regional:**\n\n• **Rede:** Própria + Credenciada\n• **Acomodação:** Enfermaria e Apartamento\n\n**Versões regionais:**\n• **Pleno Campinas** — 38 municípios (Campinas, Americana, Piracicaba, Limeira, Indaiatuba...)\n• **Pleno Jundiaí** — 12 municípios (Jundiaí, Cabreúva, Cajamar, Valinhos, Vinhedo...)\n• **Pleno Sorocaba** — 18 municípios (Sorocaba, Votorantim, Itu, Salto, Porto Feliz...)\n• **Pleno Vale do Paraíba** — Caraguatatuba, Guararema, Lorena, Jacareí, São José dos Campos",
    relatedIds: ["produtos-categorias"],
  },
  {
    id: "advance-600-detalhes",
    category: "Produtos",
    keywords: ["advance 600", "600", "reembolso 75"],
    tags: ["produto", "advance", "reembolso", "premium"],
    question: "Como funciona o Advance 600?",
    answer: "**Advance 600:**\n\n• **Rede:** Própria + Credenciada + Livre Escolha\n• **Reembolso:** R$ 75,00 (prazo 7 dias)\n• **Acomodação:** Enfermaria e Apartamento\n• **Abrangência:** Nacional\n• **A partir de:** 1 vida\n• **Benefícios:** Aconselhamento Médico Telefônico, Clube de Vantagens, Odontologia (condições especiais)\n\n**Vantagens na Rede Própria (Internação):**\n• Ala Exclusiva\n• Upgrade de Acomodação para Apartamento\n• Estacionamento Grátis\n• Alimentação para Acompanhante\n• Concierge Digital\n\n**Rede credenciada:** Hospital Santa Paula, Hospital Nipo Brasileiro, Hospital São Luiz SBC, Hospital Christovão da Gama, Hospital Portinari, Hospital São Lucas (Rio), Lab Lavoisier, Lab Tecnolob\n\n**Verticalização:** Pode ocorrer convite para Rede Própria com benefícios adicionais (20,9% verticalização).",
    relatedIds: ["advance-700-detalhes", "diff-advance600-advance700"],
  },
  {
    id: "advance-700-detalhes",
    category: "Produtos",
    keywords: ["advance 700", "700", "reembolso 96"],
    tags: ["produto", "advance", "reembolso", "premium"],
    question: "Como funciona o Advance 700?",
    answer: "**Advance 700:**\n\n• **Rede:** Própria + Credenciada + Livre Escolha\n• **Reembolso:** R$ 96,00 (prazo 7 dias) — Novo valor desde 25/11/2025\n• **Acomodação:** Enfermaria e Apartamento\n• **Abrangência:** Nacional\n• **A partir de:** 1 vida\n• **Benefícios:** Coleta Domiciliar, Aconselhamento Médico, Clube de Vantagens, Odontologia (condições especiais)\n\n**Rede credenciada:** Hospital São Camilo, Hospital Nipo Brasileiro, Hospital Leforte, Hospital Ana Costa, Hospital Pasteur (Rio), Hospital Badim (Rio), Lab Lavoisier, Lab Sergio Franco\n\n**Verticalização:** Pode ocorrer convite para Rede Própria somente quando não há justificativa médica.",
    relatedIds: ["advance-600-detalhes", "premium-900-detalhes"],
  },
  {
    id: "premium-900-detalhes",
    category: "Produtos",
    keywords: ["premium 900", "900", "900.1", "rede dor", "d'or", "reembolso 240"],
    tags: ["produto", "premium", "reembolso", "dor"],
    question: "Como funciona o Premium 900?",
    answer: "**Premium 900 / 900.1 (com Rede D'Or):**\n\n• **Rede:** Própria + Credenciada + Livre Escolha + **Rede D'Or**\n• **Reembolso:** R$ 240,00 (prazo 5 dias)\n• **Acomodação:** Apartamento\n• **Abrangência:** Nacional\n• **A partir de:** 5 vidas (produtos mistos)\n• **Elegibilidade:** Restrita a sócios, cônjuges e descendentes\n• **Benefícios:** Coleta Domiciliar, Aconselhamento Médico, Programa de Imunização/Vacinas, Clube de Vantagens\n\n**Rede D'Or:** Hospital São Luiz Morumbi, Itaim, Anália Franco, Guarulhos, Alphaville, Hospital Brasil, Lab Delboni, Lab CDB\n\n**Sem verticalização.**",
    relatedIds: ["premium-care-detalhes", "infinity-detalhes"],
  },
  {
    id: "premium-care-detalhes",
    category: "Produtos",
    keywords: ["premium care", "900 care", "care", "sem dor", "oswaldo cruz", "santa joana"],
    tags: ["produto", "premium", "care", "reembolso"],
    question: "Como funciona o Premium 900 Care?",
    answer: "**Premium 900 Care (sem Rede D'Or):**\n\n• **Rede:** Própria + Credenciada + Livre Escolha (sem D'Or)\n• **Reembolso:** R$ 240,00 (prazo 5 dias)\n• **Acomodação:** Apartamento\n• **Abrangência:** Nacional\n• **A partir de:** 2 vidas\n• **Benefícios:** Coleta Domiciliar, Aconselhamento Médico, Programa de Imunização/Vacinas, Clube de Vantagens\n\n**Rede:** Hospital Oswaldo Cruz, Maternidade Santa Joana, Hospital 09 de Julho, Hospital Santa Catarina, Hospital Samaritano, Hospital Rios Dor, Lab Delboni, Lab CDB\n\n**Diferença do 900:** Não tem Rede D'Or, mas aceita a partir de 2 vidas (vs 5 do 900). Sem verticalização.",
    relatedIds: ["premium-900-detalhes", "infinity-detalhes"],
  },
  {
    id: "infinity-detalhes",
    category: "Produtos",
    keywords: ["infinity", "1000", "einstein", "sírio", "sirio libanes", "bp mirante", "melhor plano", "mais completo", "reembolso 400"],
    tags: ["produto", "infinity", "premium", "top"],
    question: "Como funciona o Infinity?",
    answer: "**Infinity 1.000 — O produto mais completo da Hapvida:**\n\n• **Rede:** Própria + Credenciada + Livre Escolha + **Einstein + Sírio Libanês**\n• **Reembolso:** R$ 400,00 (prazo 3 dias — o mais rápido!)\n• **Acomodação:** Apartamento\n• **Abrangência:** Nacional\n• **A partir de:** 5 vidas (produtos mistos)\n• **Elegibilidade:** Restrita a sócios, cônjuges e descendentes\n\n**Benefícios exclusivos:**\n• Coleta Domiciliar\n• Serviço Concierge\n• Vacinas a Domicílio\n• Assistência a Viagens\n• Check Up (apenas titulares)\n• Clube de Vantagens\n\n**Rede:** Hospital BP Mirante, Maternidade Pro Matre, Hospital Infantil Sabará, Hospital Albert Einstein, Hospital Sírio Libanês, Hospital Copa Star (Rio), Lab Alta, Lab Fleury\n\n**Retaguarda Einstein/Sírio:** Atendimento PS e cobertura de honorários médicos de internação quando utilizado médicos da retaguarda.\n\n**Concierge:** (11) 95649-0785 | Dúvidas/autorização: (11) 98515-5856\n\n**Sem verticalização.**",
    relatedIds: ["premium-900-detalhes", "venda-produto-premium"],
  },
  // ===== UNIDADE ADVANCE =====
  {
    id: "unidade-advance",
    category: "Produtos",
    keywords: ["unidade advance", "plataforma advance", "advance benefícios", "loja online", "pontos"],
    tags: ["produto", "advance", "benefício"],
    question: "O que é a Unidade Advance?",
    answer: "**Unidade Advance — Plataforma exclusiva para clientes Advance/Premium/Infinity:**\n\n8 vantagens:\n1. **Informação** — Conteúdo exclusivo\n2. **Rede de Contato** — Networking\n3. **Bench Market** — Dados de mercado\n4. **Materiais de venda** — Para corretores\n5. **Abertura de chamados** — Suporte direto\n6. **Cursos** — Capacitação\n7. **Clube de Vantagens** — Descontos\n8. **Loja Online** — Acumula pontos",
    relatedIds: ["advance-600-detalhes", "clube-vantagens"],
  },
  // ===== COMPARAÇÕES =====
  {
    id: "diff-smart200-smart300",
    category: "Comparação",
    keywords: ["diferença", "smart 200", "smart 300", "comparar", "200 vs 300", "200 x 300", "200 ou 300"],
    tags: ["comparação", "produto", "smart"],
    question: "Qual a diferença entre Smart 200 e Smart 300?",
    answer: "**Smart 200 vs Smart 300:**\n\n| Característica | Smart 200 | Smart 300 |\n|---|---|---|\n| Rede | Própria Hapvida | Própria + Credenciada |\n| Acomodação | Enfermaria | Enfermaria |\n| Abrangência | Regional | SP, RJ, MG, PR |\n| PS Credenciado | — | 18h-8h |\n| Preço | Mais barato | Mais caro |\n\nO Smart 200 usa apenas hospitais Hapvida. O Smart 300 dá acesso a hospitais credenciados parceiros.",
    relatedIds: ["diff-smart300-smart500", "smart-200-detalhes"],
  },
  {
    id: "diff-smart300-smart500",
    category: "Comparação",
    keywords: ["diferença", "smart 300", "smart 500", "comparar", "300 vs 500", "300 x 500", "smart 400", "400"],
    tags: ["comparação", "produto", "smart"],
    question: "Qual a diferença entre Smart 300, 400 e 500?",
    answer: "**Smart 300 vs 400 vs 500:**\n\n| Característica | Smart 300 | Smart 400 | Smart 500 |\n|---|---|---|---|\n| Rede | Própria + Credenciada | Própria + Credenciada | Própria + Credenciada |\n| PS Credenciado | 18h-8h | Horário ampliado | 24h |\n| Acomodação | Enfermaria | Enf + Apt | Enf + Apt |\n| Abrangência | SP, RJ, MG, PR | Ampliada | SP, RJ, MG, DF, PR |\n| Preço | Menor | Intermediário | Maior |",
    relatedIds: ["smart-prime-detalhes", "diff-smart200-smart300"],
  },
  {
    id: "diff-advance600-advance700",
    category: "Comparação",
    keywords: ["diferença", "advance 600", "advance 700", "comparar", "600 vs 700", "600 x 700"],
    tags: ["comparação", "advance", "premium"],
    question: "Qual a diferença entre Advance 600 e Advance 700?",
    answer: "**Advance 600 vs 700:**\n\n| Característica | Advance 600 | Advance 700 |\n|---|---|---|\n| Reembolso | R$ 75,00 | R$ 96,00 |\n| Prazo reembolso | 7 dias | 7 dias |\n| Coleta Domiciliar | Não | Sim |\n| Verticalização | 20,9% (com benefícios) | Somente sem justificativa médica |\n| Mínimo vidas | 1 | 1 |\n| Preço | Menor | Maior |\n\nAmbos são nacionais com livre escolha. O 700 tem reembolso maior e coleta domiciliar.",
    relatedIds: ["advance-600-detalhes", "advance-700-detalhes"],
  },
  {
    id: "diff-premium-infinity",
    category: "Comparação",
    keywords: ["diferença", "premium", "infinity", "900 vs infinity", "melhor premium"],
    tags: ["comparação", "premium", "infinity"],
    question: "Qual a diferença entre Premium 900 e Infinity?",
    answer: "**Premium 900 vs Infinity:**\n\n| Característica | Premium 900 | Infinity |\n|---|---|---|\n| Reembolso | R$ 240,00 | R$ 400,00 |\n| Prazo reembolso | 5 dias | 3 dias |\n| Rede D'Or | Sim (900.1) | Não |\n| Einstein/Sírio | Não | Sim |\n| Check Up | Não | Sim (titulares) |\n| Concierge | Não | Sim |\n| Vacinas domicílio | Não | Sim |\n| Assistência viagem | Não | Sim |\n| Mínimo vidas | 5 | 5 |\n\nO Infinity é o topo absoluto — Einstein, Sírio Libanês, reembolso mais alto e mais rápido, com serviços exclusivos.",
    relatedIds: ["infinity-detalhes", "premium-900-detalhes"],
  },
  {
    id: "diff-enfermaria-apartamento",
    category: "Comparação",
    keywords: ["enfermaria", "apartamento", "diferença", "acomodação", "enf", "apt", "apto", "quarto"],
    tags: ["comparação", "acomodação"],
    question: "Qual a diferença entre enfermaria e apartamento?",
    answer: "**Enfermaria vs Apartamento:**\n\n| | Enfermaria | Apartamento |\n|---|---|---|\n| Quarto | Compartilhado | Individual/Privativo |\n| Banheiro | Compartilhado | Privativo |\n| Acompanhante | Limitado | Pode ficar no quarto |\n| Preço | Mais baixo | 10-30% mais caro |\n\nDica: Para funcionários 49+ anos, apartamento faz mais diferença (internações mais frequentes).",
    relatedIds: ["produtos-categorias"],
  },
  {
    id: "diff-reembolso-total-parcial",
    category: "Comparação",
    keywords: ["reembolso total", "reembolso parcial", "diferença reembolso", "total vs parcial reembolso"],
    tags: ["comparação", "reembolso"],
    question: "Qual a diferença entre reembolso total e parcial?",
    answer: "**Reembolso Total vs Parcial:**\n\n• **Reembolso Parcial:** SOMENTE para consultas\n• **Reembolso Total:** TODOS os procedimentos\n\n**Tabelas com reembolso disponíveis em:** SP, RJ, Jundiaí, Mogi das Cruzes, Santos e SBC.\n\nO reembolso total tem mensalidade mais alta, mas cobre reembolso para exames, internações e cirurgias além de consultas.",
    relatedIds: ["advance-600-detalhes", "advance-700-detalhes"],
  },
  // ===== COPARTICIPAÇÃO =====
  {
    id: "copart-o-que-e",
    category: "Coparticipação",
    keywords: ["coparticipação", "coparticipacao", "o que é", "como funciona", "copay", "taxa", "pagar quando usa"],
    tags: ["coparticipação", "regra"],
    question: "O que é coparticipação?",
    answer: "**Coparticipação** é um valor que o beneficiário paga ao utilizar o plano, além da mensalidade.\n\n**Parcial:** Sem cobrança em consultas e exames. Cobrança apenas em terapias especiais e demais terapias.\n\n**Total:** Cobrança em consultas (30% com limite), exames (30% com limite), terapias e internações (valor fixo).\n\n**Importante:** Isento de copay em internação na Rede Própria em todas as modalidades!\n\nA total tem mensalidade menor, mas o beneficiário paga a cada uso.",
    relatedIds: ["copart-qual-escolher"],
  },
  {
    id: "copart-qual-escolher",
    category: "Coparticipação",
    keywords: ["qual coparticipação", "melhor coparticipação", "escolher", "parcial ou total", "recomendar"],
    tags: ["coparticipação", "dica"],
    question: "Qual coparticipação escolher: parcial ou total?",
    answer: "**Parcial se:** Cliente usa o plano com frequência, tem filhos pequenos, prefere previsibilidade.\n\n**Total se:** Cliente jovem e saudável, usa pouco, quer menor mensalidade.\n\n**Dica:** Empresas com funcionários jovens (média < 35 anos) → total compensa. Funcionários mais velhos ou com famílias → parcial compensa.\n\n**Lembre:** Isento de copay em internação na Rede Própria em ambas!",
    relatedIds: ["copart-o-que-e"],
  },
  // ===== CONTRATOS =====
  {
    id: "contratos-tipos",
    category: "Contratos",
    keywords: ["contrato", "tipos contrato", "modalidade", "super simples", "pme", "pj", "caepf"],
    tags: ["contrato", "geral"],
    question: "Quais são os tipos de contrato?",
    answer: "**Tipos de contrato Hapvida:**\n\n• **CAEPF** — Cadastro de Atividade Econômica da Pessoa Física\n• **Super Simples 1 Vida** — Sócio com CNPJ, linha Smart e Advance\n• **Super Simples 2-15 vidas** — Pequenas empresas\n• **Super Simples 16-29 vidas** — Maior redução de carência\n• **PME 30-99 vidas** — Carência zero!\n• **PJ a partir de 100 vidas** — Grandes empresas\n\n**Regras importantes:**\n• Cada titular pode ter um plano diferente\n• NÃO é possível mesclar produtos regionais de filiais diferentes\n• Dependentes seguem o mesmo plano do titular",
    relatedIds: ["contrato-compulsorio-adesao", "contrato-demais-pracas"],
  },
  {
    id: "contrato-compulsorio-adesao",
    category: "Contratos",
    keywords: ["compulsório", "compulsoria", "adesão", "livre adesão", "encampação", "obrigatório", "voluntário", "100%"],
    tags: ["contrato", "pme", "compulsório", "adesão"],
    question: "Qual a diferença entre Compulsório, Livre Adesão e Encampação?",
    answer: "**3 modalidades de contratação PME:**\n\n**COMPULSÓRIA:**\n• 100% dos sócios\n• 100% dos funcionários titulares com vínculo ativo (e-Social)\n• Mínimo 80% do quadro total (até 9 titulares)\n• Mínimo 90% do quadro total (10+ titulares)\n\n**ENCAMPAÇÃO (migração):**\n• 100% das vidas anteriormente vinculadas a outra operadora\n• Permanência mínima 12 meses no plano anterior\n• Sem acréscimos ou exclusões\n• Intervalo máximo 30 dias entre rescisão e protocolo\n• NÃO se enquadram: PF e Coletivos por Adesão\n\n**LIVRE ADESÃO:**\n• Quando NÃO houver contratação de 100% dos sócios/funcionários\n• Preço geralmente maior que compulsório",
    relatedIds: ["contratos-tipos", "contrato-demais-pracas"],
  },
  {
    id: "contrato-demais-pracas",
    category: "Contratos",
    keywords: ["demais praças", "campinas contrato", "americana contrato", "sorocaba contrato", "sjc contrato", "rio contrato"],
    tags: ["contrato", "demais praças"],
    question: "Como funciona nas Demais Praças?",
    answer: "**Demais Praças** = Campinas, Americana, Sorocaba, São José dos Campos e Rio de Janeiro.\n\n**Contratos disponíveis:**\n• Super Simples 1 Vida\n• Super Simples Demais Praças (2-29 vidas) — funciona como adesão\n• PME Demais Praças (30-99 vidas) — funciona como adesão\n\n**NÃO existe PME Compulsório** nessas filiais.",
    relatedIds: ["contratos-tipos", "filiais-lista"],
  },
  // ===== VIGÊNCIA E BOLETO =====
  {
    id: "vigencia-ss-pme",
    category: "Vigência",
    keywords: ["vigência", "vigencia", "quando começa", "início contrato", "data vigência", "vigência futura", "prazo"],
    tags: ["vigência", "regra", "contrato"],
    question: "Como funciona a vigência dos contratos SS/PME?",
    answer: "**Vigência SS/PME:**\n\n**Vigência Futura (data fixa):** 5 dias, 10 dias, 15 dias, 30 dias ou 60 dias.\n\n**Vencimento do 1º boleto:** 3 dias após a vigência.\n**Vencimento a partir do 2º boleto:** Conforme tabela padrão.\n\n⚠️ Se a vigência escolhida atrasar, será ajustada automaticamente conforme data da implantação (pode alterar o vencimento).\n\n**Vigência atual das tabelas:** 10/02/2026 a 31/03/2026.",
    relatedIds: ["vigencia-pf", "taxa-implantacao"],
  },
  {
    id: "vigencia-pf",
    category: "Vigência",
    keywords: ["vigência pf", "pessoa física", "pf", "prazo proposta"],
    tags: ["vigência", "pf"],
    question: "Como funciona a vigência PF?",
    answer: "**Vigência Pessoa Física:**\n\n• **1ª mensalidade:** Imediato\n• **Vencimento:** 3 dias\n• **Prazo da proposta PF:** 25 dias a partir da data da digitação\n• Boleto emitido no final do mês terá vencimento até o último dia do mês\n• **1º Boleto somente no Portal do Cliente**",
    relatedIds: ["vigencia-ss-pme"],
  },
  {
    id: "taxa-implantacao",
    category: "Regras",
    keywords: ["taxa", "implantação", "taxa implantação", "custo proposta", "r$ 25"],
    tags: ["regra", "taxa", "custo"],
    question: "Existe taxa de implantação?",
    answer: "**Taxa de implantação:**\n\n• **SS/PME:** R$ 25,00 por proposta\n• **PF:** Sem taxa de implantação",
    relatedIds: ["contratos-tipos"],
  },
  // ===== ACEITAÇÃO / TITULARES / DEPENDENTES =====
  {
    id: "aceitacao-titulares",
    category: "Regras",
    keywords: ["titular", "quem pode ser titular", "sócio", "funcionário", "clt", "prestador", "idade máxima", "74 anos", "aceitação"],
    tags: ["regra", "titular", "aceitação"],
    question: "Quem pode ser titular?",
    answer: "**Tabela de aceitação — Titulares:**\n\n| Tipo | Idade máxima | Produtos |\n|---|---|---|\n| Sócio | Até 74 anos | Todos |\n| Funcionário CLT | Até 74 anos | Todos |\n| Prestador de Serviço | Até 74 anos | Smart, Advance, Premium Care |\n\n⚠️ **Prestador de Serviço NÃO é aceito** em Premium 900 e Infinity.\n\n**Movimentação por idade:**\n• 5% de aceitação: 65 a 74 anos\n• 1% de aceitação: a partir de 75 anos\n• Vindo de outra operadora: reduz até 64 anos\n• Idades acima de 59 anos: não possui agravo",
    relatedIds: ["aceitacao-dependentes", "aceitacao-agregados"],
  },
  {
    id: "aceitacao-dependentes",
    category: "Regras",
    keywords: ["dependente", "cônjuge", "filho", "enteado", "quem pode ser dependente", "idade dependente", "53 anos"],
    tags: ["regra", "dependente", "aceitação"],
    question: "Quem pode ser dependente?",
    answer: "**Tabela de aceitação — Dependentes:**\n\n| Tipo | Idade máxima | Produtos |\n|---|---|---|\n| Cônjuge de Sócio | Até 74 anos | Todos |\n| Cônjuge de Titular | Até 74 anos | Todos |\n| Filhos Solteiros | Até 53 anos | Todos |\n| Filho Adotivo | Até 53 anos | Todos |\n| Enteado | Até 53 anos | Todos |\n\n**Dependentes seguem o mesmo plano do titular.**",
    relatedIds: ["aceitacao-titulares", "aceitacao-agregados"],
  },
  {
    id: "aceitacao-agregados",
    category: "Regras",
    keywords: ["agregado", "pai", "mãe", "irmão", "cunhado", "tio", "sogro", "sobrinho", "genro", "nora", "neto"],
    tags: ["regra", "agregado", "aceitação"],
    question: "Quem pode ser agregado?",
    answer: "**Tabela de aceitação — Agregados (até 53 anos):**\n\n| Tipo | Produtos aceitos |\n|---|---|\n| Pai/Mãe | Smart, Advance, Premium Care |\n| Padrasto/Madrasta | Smart, Advance, Premium Care |\n| Irmãos | Smart, Advance, Premium Care |\n| Cunhado(a) | Smart, Advance, Premium Care |\n| Tio(a) | Smart, Advance, Premium Care |\n| Sogro(a) | Smart, Advance, Premium Care |\n| Sobrinho(a) | Smart, Advance, Premium Care |\n| Genro/Nora | Smart, Advance, Premium Care |\n| Neto(a) | Smart, Advance, Premium Care |\n\n⚠️ **Agregados NÃO são aceitos** em Premium 900 e Infinity.\n\n**Comprovação de vínculo:** Assinatura pelo GOV, Digital, ou Reconhecimento de firma em cartório. Filhos em comum NÃO comprovam vínculo marital.",
    relatedIds: ["aceitacao-titulares", "aceitacao-dependentes"],
  },
  // ===== CARÊNCIA =====
  {
    id: "carencia-geral",
    category: "Carência",
    keywords: ["carência", "carencia", "prazo", "quando posso usar", "espera", "tempo", "quanto tempo"],
    tags: ["carência", "regra"],
    question: "Como funciona a carência?",
    answer: "**Carências padrão ANS:**\n\n| Procedimento | Carência |\n|---|---|\n| Urgência e emergência | 24 horas |\n| Consultas e exames simples | 30 dias |\n| Exames complexos | 180 dias |\n| Internações | 180 dias |\n| Cirurgias | 180 dias |\n| Parto | 300 dias |\n| Doenças preexistentes (CPT) | 24 meses |\n\n**Redução de carência:**\n• **SS 16-29 vidas:** Maior redução de carência\n• **PME 30+ vidas:** Carência ZERO!\n\n**Urgência e Emergência:** Todos os produtos têm atendimento nacional em hospitais da rede própria.",
    relatedIds: ["carencia-copia", "carencia-portabilidade"],
  },
  {
    id: "carencia-copia",
    category: "Carência",
    keywords: ["cópia carência", "copia carencia", "vindo hapvida", "aproveitamento", "carência anterior"],
    tags: ["carência", "cópia"],
    question: "Como funciona a cópia de carência?",
    answer: "**Cópia de carência — Vindo de outra operadora:**\n\n**Operadora de origem Hapvida:**\n• Todo tempo de carências cumprido no plano anterior Hapvida (regulamentado) será aproveitado, incluindo parto, CPT e terapias\n• Exceto de PF para PF\n\n**Outra operadora (redução):**\n• Redução até 65 anos no PF e 64 anos no SS\n• Exceto parto, CPT e terapias\n• Confirmar lista de operadoras congêneres\n• Não somamos tempo de 2 operadoras, apenas o último plano\n• Regra: aproveitamento até 30 dias após cancelado, cliente adimplente\n\n**Documentação necessária:**\n• OPÇÃO 1: Carta de Permanência ou Carteirinha ou Comprova ANS + 2 últimos boletos com comprovantes ou Carta de Adimplência\n• OPÇÃO 2: Carta de Portabilidade\n\n**PROMOÇÃO ATÉ 28/02/2026:** Cópia de Carência (exceto terapias), até 74 anos, comissão normal!",
    relatedIds: ["carencia-geral", "carencia-portabilidade"],
  },
  {
    id: "carencia-portabilidade",
    category: "Carência",
    keywords: ["portabilidade", "trocar plano", "migrar", "mudar", "vindo de outro", "outro plano"],
    tags: ["carência", "portabilidade"],
    question: "Como funciona a portabilidade?",
    answer: "**Portabilidade de plano de saúde:**\n\nO beneficiário que já tem plano pode migrar para Hapvida com aproveitamento de carências.\n\n**Requisitos:**\n• Estar em dia com mensalidades\n• Mínimo 2 anos no plano atual (ou 3 anos se declarou doença preexistente)\n• Novo plano de faixa de preço igual ou inferior\n• Aproveitamento até 30 dias após cancelado\n\n**Dica de venda:** Use a portabilidade como argumento — cliente não cumpre carência novamente!",
    relatedIds: ["carencia-copia", "carencia-geral"],
  },
  // ===== REPIQUE =====
  {
    id: "repique",
    category: "Regras",
    keywords: ["repique", "ex-beneficiário", "retornar", "voltar", "reativar", "ex cliente"],
    tags: ["regra", "repique"],
    question: "O que é repique?",
    answer: "**Repique** é quando um ex-beneficiário quer retornar à operadora Hapvida.\n\nExistem regras específicas para:\n• **1-29 vidas** — Regras de aceitação padrão\n• **30-99 vidas** — Regras específicas de PME\n\nConsulte as condições atuais com a equipe comercial.",
    relatedIds: ["contratos-tipos"],
  },
  // ===== ODONTO =====
  {
    id: "odonto-premium",
    category: "Produtos",
    keywords: ["odonto", "odontologia", "dentista", "dental", "prótese", "endodontia", "periodontia"],
    tags: ["odonto", "produto"],
    question: "Como funciona o Odonto Premium Nacional?",
    answer: "**Odonto Premium Nacional:**\n\n**Coberturas:** Diagnóstico (consultas), Urgência/Emergência, Radiologia, Prevenção, Odontopediatria, Dentística, Endodontia, Periodontia, Prótese (pino, coroa, bloco), Cirurgia.\n\n**Carências Odonto:**\n\n| Procedimento | Carência |\n|---|---|\n| Urgência e Emergência | 24h |\n| Diagnóstico, Prevenção, Dentística | 60 dias |\n| Cirurgias | 60 dias |\n| Radiologia | 60 dias |\n| Periodontia e Endodontia | 120 dias |\n| Prótese | 180 dias |\n\nO Nosso Médico já inclui odonto! Demais produtos podem ter condições especiais.",
    relatedIds: ["nosso-medico-detalhes"],
  },
  // ===== TERAPIAS ESPECIAIS =====
  {
    id: "terapias-especiais",
    category: "Regras",
    keywords: ["terapia", "tea", "autismo", "aba", "denver", "bobath", "equoterapia", "musicoterapia", "fonoaudiologia", "terapias especiais"],
    tags: ["terapia", "tea", "cobertura"],
    question: "Quais terapias especiais são cobertas?",
    answer: "**58 Terapias Especiais cobertas, incluindo:**\n\nABA, Denver, Bobath, Pediasuit, Therasuit, Equoterapia, Musicoterapia, Psicoterapia TEA, Fonoaudiologia TEA, Terapia Ocupacional TEA, Fisioterapia TEA, Psicopedagogia, Neuropsicologia, Integração Sensorial, entre outras.\n\n**Coparticipação:** Aplicável conforme tabela do plano contratado.\n\nTodas as terapias são cobertas em todos os produtos com segmentação AMB+HOSP+OBST.",
    relatedIds: ["copart-o-que-e"],
  },
  // ===== PROMOÇÃO =====
  {
    id: "promocao-atual",
    category: "Promoção",
    keywords: ["promoção", "desconto", "oferta", "50%", "primeira parcela", "campanha"],
    tags: ["promoção", "desconto"],
    question: "Tem alguma promoção vigente?",
    answer: "**Promoção vigente:**\n\n🎉 **50% de DESCONTO na 1ª parcela!**\n\nVálido para contratos SS/PME. Aproveite para fechar negócio!",
    relatedIds: ["contratos-tipos"],
  },
  // ===== CLUBE DE VANTAGENS =====
  {
    id: "clube-vantagens",
    category: "Benefícios",
    keywords: ["clube", "vantagens", "desconto", "benefício", "clube de vantagens", "parceiros"],
    tags: ["benefício", "clube"],
    question: "O que é o Clube de Vantagens?",
    answer: "**Clube de Vantagens Hapvida:**\n\nClube de descontos em diversas empresas parceiras, disponível para todos os beneficiários.\n\nInclui descontos em farmácias, academias, restaurantes, entretenimento e muito mais.\n\nDisponível em todos os produtos Advance, Premium e Infinity.",
    relatedIds: ["unidade-advance"],
  },
  // ===== PÓS VENDAS =====
  {
    id: "pos-vendas",
    category: "Suporte",
    keywords: ["pós vendas", "pos vendas", "whatsapp", "suporte", "atendimento", "canal"],
    tags: ["suporte", "pós vendas"],
    question: "Como funciona o pós vendas?",
    answer: "**Canal de pós vendas:** Via WhatsApp.\n\nPara dúvidas sobre propostas, implantação, carteirinhas e movimentações, utilize o canal de pós vendas via WhatsApp disponibilizado pela equipe comercial.",
    relatedIds: ["contratos-tipos"],
  },
  // ===== FILIAIS =====
  {
    id: "filiais-lista",
    category: "Filiais",
    keywords: ["filiais", "cidades", "regiões", "onde", "quais cidades", "abrangência", "atende", "área de vendas"],
    tags: ["filial", "cidade", "lista"],
    question: "Quais são as filiais disponíveis?",
    answer: "**Filiais Hapvida NDI:**\n\nSão Paulo, Campinas, Jundiaí, Mogi das Cruzes, Santos, São Bernardo do Campo, Sorocaba, Americana, Rio de Janeiro e São José dos Campos.\n\n**Regras importantes:**\n• Filial é criada quando há rede própria (hospital ou PA)\n• Área de vendas: municípios até 40km da filial\n• Área de venda baseada no **ENDEREÇO RESIDENCIAL** do beneficiário (não da empresa!)\n• Cada filial pode ter valor diferente\n\n**Grupo 1 (SP, Jundiaí, Mogi, Santos, SBC):** Todos os contratos disponíveis\n**Grupo 2 (Campinas, Americana, Sorocaba, SJC, Rio):** Apenas Demais Praças (sem Compulsório)",
    relatedIds: ["contrato-demais-pracas"],
  },
  // ===== FAIXAS ETÁRIAS =====
  {
    id: "faixas-etarias",
    category: "Faixas Etárias",
    keywords: ["faixa etária", "faixa etaria", "idade", "idades", "reajuste idade", "tabela idade", "ans"],
    tags: ["faixa etária", "preço", "regra"],
    question: "Quais são as faixas etárias?",
    answer: "**Faixas etárias (conforme ANS):**\n\n| Faixa | Idade |\n|---|---|\n| 1 | 0 a 18 anos |\n| 2 | 19 a 23 anos |\n| 3 | 24 a 28 anos |\n| 4 | 29 a 33 anos |\n| 5 | 34 a 38 anos |\n| 6 | 39 a 43 anos |\n| 7 | 44 a 48 anos |\n| 8 | 49 a 53 anos |\n| 9 | 54 a 58 anos |\n| 10 | 59 anos ou mais |\n\nA faixa 59+ pode custar até 6x mais que a 0-18 (regra ANS).",
    relatedIds: ["produtos-categorias"],
  },
  // ===== SEGMENTAÇÃO =====
  {
    id: "segmentacao-tipos",
    category: "Regras",
    keywords: ["segmentação", "amb", "hosp", "obst", "ambulatorial", "hospitalar", "obstetrícia", "cobertura"],
    tags: ["segmentação", "cobertura"],
    question: "O que significam AMB, HOSP, OBST?",
    answer: "**Segmentações:**\n\n• **AMB** — Ambulatorial: consultas, exames, procedimentos em consultório\n• **HOSP** — Hospitalar: internações e cirurgias\n• **OBST** — Obstetrícia: parto e procedimentos obstétricos\n\n**AMB+HOSP+OBST** = Cobertura completa (maioria dos produtos)\n**AMBULATORIAL** = Apenas consultas/exames (Smart Ambulatorial)",
    relatedIds: ["smart-ambulatorial-detalhes"],
  },
  // ===== VERTICALIZAÇÃO =====
  {
    id: "verticalizacao",
    category: "Regras",
    keywords: ["verticalização", "verticalizacao", "rede própria obrigatória", "convite rede própria"],
    tags: ["regra", "verticalização"],
    question: "O que é verticalização?",
    answer: "**Verticalização** é quando o plano convida o beneficiário a utilizar a Rede Própria Hapvida em vez da rede credenciada.\n\n**Por produto:**\n• **Advance 600:** Pode ocorrer convite com benefícios adicionais (20,9% verticalização)\n• **Advance 700:** Somente quando não há justificativa médica\n• **Premium 900, Premium Care, Infinity:** Sem verticalização\n\nNos produtos Advance, ao ser verticalizado, o beneficiário ganha benefícios como ala exclusiva, upgrade de acomodação e estacionamento grátis.",
    relatedIds: ["advance-600-detalhes", "advance-700-detalhes"],
  },
  // ===== VENDAS =====
  {
    id: "venda-empresa-pequena",
    category: "Vendas",
    keywords: ["vender", "argumento", "empresa pequena", "1 vida", "mei", "como vender", "dica venda", "convencer"],
    tags: ["venda", "argumento"],
    question: "Como vender para empresas pequenas?",
    answer: "**Argumentos para empresas pequenas (1-29 vidas):**\n\n**1 Vida:** \"Com CNPJ, o plano empresarial é mais barato que individual\", \"Dedutível no IR\"\n\n**MEI:** \"Tabela especial\", \"Inclui dependentes\", \"Ajuda a reter funcionários\"\n\n**2-29 vidas:** \"Quanto mais vidas, melhor negociação\", \"2º benefício mais valorizado\", \"Reduz absenteísmo\"\n\n**Dica:** Comece pelo Nosso Médico ou Smart 200 (mais acessíveis) e suba conforme interesse.\n\n**Promoção:** 50% de desconto na 1ª parcela!",
    relatedIds: ["venda-produto-premium", "promocao-atual"],
  },
  {
    id: "venda-produto-premium",
    category: "Vendas",
    keywords: ["vender premium", "advance", "premium 900", "infinity", "alto padrão", "executivo", "diretor"],
    tags: ["venda", "premium"],
    question: "Como vender produtos premium?",
    answer: "**Argumentos para produtos premium:**\n\n**Advance 600/700:** \"Qualquer médico/hospital com reembolso\", \"Ideal para diretores\", \"Vantagens exclusivas na rede própria\"\n\n**Premium 900:** \"Rede D'Or incluída\", \"Reembolso R$ 240 em 5 dias\", \"Melhor custo-benefício premium\"\n\n**Infinity:** \"Einstein e Sírio Libanês\", \"Reembolso R$ 400 em 3 dias\", \"Check-up, concierge, vacinas a domicílio\"\n\n**Dica:** Empresas costumam misturar: básico para operacional + premium para diretoria. O simulador permite isso!",
    relatedIds: ["infinity-detalhes", "premium-900-detalhes"],
  },
  // ===== RECOMENDAÇÕES =====
  {
    id: "recomendar-crianca",
    category: "Recomendação",
    keywords: ["criança", "bebê", "filho", "filha", "menor", "infantil", "pediatra", "0 a 18", "00-18", "recém nascido"],
    tags: ["recomendação", "criança", "preço"],
    question: "Quanto custa um plano para criança?",
    answer: "PRICE_LOOKUP:crianca",
    relatedIds: ["recomendar-familia", "faixas-etarias"],
  },
  {
    id: "recomendar-familia",
    category: "Recomendação",
    keywords: ["família", "filhos", "gestante", "grávida", "parto", "bebê", "maternidade"],
    tags: ["recomendação", "família"],
    question: "Qual plano para famílias com filhos?",
    answer: "**Para famílias com filhos:**\n\n**Econômico:** Smart 200 com coparticipação parcial — crianças vão muito ao médico, parcial compensa\n\n**Intermediário:** Smart 300 ou 400 com parcial — mais opções de pediatras na rede credenciada\n\n**Premium:** Advance 600+ — livre escolha de pediatra\n\n**Importante:** Todos os planos AMB+HOSP+OBST cobrem parto. Carência de 300 dias para parto (exceto isenção).\n\n**Nosso Médico** já inclui odonto, ótimo para crianças!",
    relatedIds: ["recomendar-crianca", "carencia-geral"],
  },
  {
    id: "recomendar-jovem",
    category: "Recomendação",
    keywords: ["jovem", "saudável", "20 anos", "25 anos", "estagiário", "primeiro emprego"],
    tags: ["recomendação", "jovem"],
    question: "Qual plano para funcionários jovens?",
    answer: "**Para jovens (18-30 anos):**\n\n**Orçamento apertado:** Nosso Médico ou Smart 200 com coparticipação total — menor mensalidade\n\n**Mais conforto:** Smart 300 Enfermaria — rede credenciada por valor intermediário\n\n**Dica:** Jovens priorizam preço. Comece pelo mais barato!",
    relatedIds: ["copart-qual-escolher", "faq-plano-mais-barato"],
  },
  {
    id: "recomendar-idoso",
    category: "Recomendação",
    keywords: ["idoso", "59 anos", "mais velho", "aposentado", "sênior", "terceira idade", "49"],
    tags: ["recomendação", "idoso"],
    question: "Qual plano para funcionários mais velhos?",
    answer: "**Para 49+ anos:**\n\nFaixas 49-53, 54-58 e 59+ são as mais caras (até 6x a faixa 0-18).\n\n**Econômico:** Nosso Médico ou Smart 200 com parcial (usam mais o plano)\n\n**Recomendado:** Smart 300/400 Apartamento com parcial — conforto na internação importa nessa faixa\n\n**Dica:** Mostre o impacto no custo total e sugira mix de produtos.",
    relatedIds: ["faixas-etarias", "diff-enfermaria-apartamento"],
  },
  // ===== FAQ =====
  {
    id: "faq-plano-mais-barato",
    category: "FAQ",
    keywords: ["mais barato", "menor preço", "econômico", "barato", "menor valor", "mais em conta"],
    tags: ["faq", "preço", "barato"],
    question: "Qual é o plano mais barato?",
    answer: "PRICE_LOOKUP:barato",
    relatedIds: ["nosso-medico-detalhes", "faq-plano-mais-completo"],
  },
  {
    id: "faq-plano-mais-completo",
    category: "FAQ",
    keywords: ["mais completo", "melhor plano", "top", "premium", "infinity", "o melhor"],
    tags: ["faq", "premium", "completo"],
    question: "Qual é o plano mais completo?",
    answer: "O mais completo é o **Infinity**: Einstein, Sírio Libanês, reembolso R$ 400 em 3 dias, check-up, concierge, vacinas a domicílio, assistência viagem.\n\nSeguido pelo **Premium 900** (Rede D'Or, reembolso R$ 240) e **Advance 700** (reembolso R$ 96).",
    relatedIds: ["infinity-detalhes", "premium-900-detalhes"],
  },
  {
    id: "faq-misturar-produtos",
    category: "FAQ",
    keywords: ["misturar", "produtos diferentes", "dois planos", "cada funcionário", "combinar"],
    tags: ["faq", "produto"],
    question: "Posso misturar produtos na mesma empresa?",
    answer: "**Sim!** Cada titular pode ter um plano diferente. Muito comum:\n\n• Básico para operacional (Smart 200)\n• Intermediário para gerentes (Smart 400)\n• Premium para diretores (Premium 900)\n\n**Regras:**\n• NÃO é possível mesclar produtos regionais de filiais diferentes\n• Dependentes seguem o mesmo plano do titular\n• Infinity e Premium 900: mínimo 5 vidas (produtos mistos)",
    relatedIds: ["contratos-tipos"],
  },
  {
    id: "faq-urgencia-emergencia",
    category: "FAQ",
    keywords: ["urgência", "emergência", "pronto socorro", "ps", "nacional", "atendimento urgente"],
    tags: ["faq", "urgência"],
    question: "Como funciona urgência e emergência?",
    answer: "**Todos os produtos:** Urgência e Emergência Nacional!\n\nAtendimento em hospitais da rede própria Hapvida em todo o Brasil, independente do produto contratado. Carência de apenas 24 horas.",
    relatedIds: ["carencia-geral"],
  },
  // ===== SIMULADOR =====
  {
    id: "simulador-como-usar",
    category: "Simulador",
    keywords: ["como usar", "simulador", "simular", "cotação", "proposta", "passo a passo"],
    tags: ["simulador", "tutorial"],
    question: "Como usar o simulador?",
    answer: "**Passo a passo:**\n\n1️⃣ Selecione a filial (baseada no endereço residencial do beneficiário)\n2️⃣ Escolha o tipo de contrato\n3️⃣ Defina a coparticipação (parcial ou total)\n4️⃣ Adicione as vidas por faixa etária\n5️⃣ Selecione o produto para cada vida\n6️⃣ Veja o resumo com valores\n7️⃣ Gere o PDF para enviar ao cliente\n\nAcesse a aba **Simulador** no menu principal!",
    relatedIds: ["simulador-pdf"],
  },
  {
    id: "simulador-pdf",
    category: "Simulador",
    keywords: ["pdf", "exportar", "imprimir", "enviar cotação", "proposta", "gerar pdf", "baixar"],
    tags: ["simulador", "pdf"],
    question: "Como gerar o PDF da cotação?",
    answer: "Após adicionar vidas e selecionar produtos, clique em **\"Gerar PDF\"** no resumo.\n\nO PDF inclui: filial, contrato, beneficiários por faixa, produto de cada vida, valor individual, total mensal e coparticipação.",
    relatedIds: ["simulador-como-usar"],
  },
];

export const SUGGESTED_QUESTIONS = [
  "Quais planos vocês têm?",
  "Quanto custa um plano para criança?",
  "Qual a diferença entre coparticipação parcial e total?",
  "Como funciona o Infinity?",
  "Qual plano indicar para uma empresa pequena?",
  "Tem alguma promoção vigente?",
];

// ============================================
// MOTOR DE BUSCA SEMÂNTICO AVANÇADO
// ============================================

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(w => w.length > 1);
}

function expandQuery(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const synonyms of Object.values(GLOBAL_SYNONYMS)) {
      const normalizedSynonyms = synonyms.map(s => normalize(s));
      if (normalizedSynonyms.some(s => s.includes(token) || token.includes(s))) {
        for (const syn of normalizedSynonyms) {
          for (const word of syn.split(" ")) {
            if (word.length > 2) expanded.add(word);
          }
        }
      }
    }
  }
  return Array.from(expanded);
}

type Intent = "comparison" | "recommendation" | "price" | "info" | "howto" | "list";

function detectIntent(query: string): Intent {
  const q = normalize(query);
  if (q.match(/diferenca|comparar|versus|vs\b|melhor entre|ou\b.*ou\b|\bx\b/)) return "comparison";
  if (q.match(/recomendar|indicar|sugerir|qual.*melhor|ideal para|bom para|empresa com/)) return "recommendation";
  if (q.match(/preco|valor|custo|quanto|mensalidade|barato|caro|orcamento|pago|custa/)) return "price";
  if (q.match(/como.*usar|como.*fazer|passo|tutorial|gerar|como funciona o simulador/)) return "howto";
  if (q.match(/quais|lista|todos|disponiveis/)) return "list";
  return "info";
}

function extractProducts(query: string): string[] {
  const q = normalize(query);
  const products: string[] = [];
  const patterns = [
    "nosso medico", "smart ambulatorial", "smart 150", "smart 200 up", "smart 200",
    "smart 300", "smart 400", "smart 500", "smart prime",
    "pleno", "basic referencia",
    "advance 600", "advance 700",
    "premium 900", "premium care", "infinity",
  ];
  for (const p of patterns) {
    if (q.includes(p)) products.push(p);
  }
  return products;
}

function extractCities(query: string): string[] {
  const q = normalize(query);
  const cities: string[] = [];
  const patterns: [string, string][] = [
    ["sao paulo", "sao-paulo"], ["sp capital", "sao-paulo"], ["campinas", "campinas"],
    ["jundiai", "jundiai"], ["mogi", "mogi-das-cruzes"], ["santos", "santos"],
    ["sao bernardo", "sao-bernardo"], ["sbc", "sao-bernardo"], ["sorocaba", "sorocaba"],
    ["americana", "americana"], ["sao jose", "sao-jose-dos-campos"], ["sjc", "sao-jose-dos-campos"],
    ["rio de janeiro", "rio-de-janeiro"], ["rio", "rio-de-janeiro"],
  ];
  for (const [pattern, cityId] of patterns) {
    if (q.includes(pattern) && !cities.includes(cityId)) cities.push(cityId);
  }
  return cities;
}

function extractAgeRange(query: string): AgeRange | null {
  const q = normalize(query);
  if (q.match(/crianca|bebe|recem nascido|infantil|0 a 18|00 18|menor/)) return "00-18";
  if (q.match(/19.*23|20 anos|21 anos|22 anos|23 anos/)) return "19-23";
  if (q.match(/24.*28|25 anos|26 anos|27 anos|28 anos/)) return "24-28";
  if (q.match(/29.*33|30 anos|31 anos|32 anos|33 anos/)) return "29-33";
  if (q.match(/34.*38|35 anos|36 anos|37 anos|38 anos/)) return "34-38";
  if (q.match(/39.*43|40 anos|41 anos|42 anos|43 anos/)) return "39-43";
  if (q.match(/44.*48|45 anos|46 anos|47 anos|48 anos/)) return "44-48";
  if (q.match(/49.*53|50 anos|51 anos|52 anos|53 anos/)) return "49-53";
  if (q.match(/54.*58|55 anos|56 anos|57 anos|58 anos/)) return "54-58";
  if (q.match(/59|60 anos|65 anos|70 anos|idoso|aposentado|senior/)) return "59+";
  // Try to extract a specific age number
  const ageMatch = q.match(/(\d{1,2})\s*anos/);
  if (ageMatch) {
    const age = parseInt(ageMatch[1]);
    if (age <= 18) return "00-18";
    if (age <= 23) return "19-23";
    if (age <= 28) return "24-28";
    if (age <= 33) return "29-33";
    if (age <= 38) return "34-38";
    if (age <= 43) return "39-43";
    if (age <= 48) return "44-48";
    if (age <= 53) return "49-53";
    if (age <= 58) return "54-58";
    return "59+";
  }
  return null;
}

export function searchKnowledge(query: string, maxResults: number = 3): KnowledgeEntry[] {
  const tokens = tokenize(query);
  const expandedTokens = expandQuery(tokens);
  const intent = detectIntent(query);
  const mentionedProducts = extractProducts(query);
  const mentionedCities = extractCities(query);
  const normalizedQuery = normalize(query);

  if (tokens.length === 0) return [];

  const scored = KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    const nkw = entry.keywords.map(k => normalize(k));
    const nq = normalize(entry.question);
    const na = normalize(entry.answer);
    const nt = (entry.tags || []).map(t => normalize(t));

    // Full phrase match in keywords
    for (const kw of nkw) {
      if (normalizedQuery.includes(kw) && kw.length > 3) score += 15;
      if (kw.includes(normalizedQuery) && normalizedQuery.length > 3) score += 12;
    }

    // Token matches in keywords
    for (const token of tokens) {
      for (const kw of nkw) {
        if (kw === token) score += 8;
        else if (kw.includes(token) && token.length > 2) score += 4;
        else if (token.includes(kw) && kw.length > 2) score += 3;
      }
    }

    // Synonym matches
    for (const token of expandedTokens) {
      if (tokens.includes(token)) continue;
      for (const kw of nkw) {
        if (kw.includes(token) || token.includes(kw)) score += 2;
      }
    }

    // Question match
    for (const token of tokens) {
      if (nq.includes(token) && token.length > 2) score += 3;
    }
    if (nq.includes(normalizedQuery) && normalizedQuery.length > 5) score += 10;

    // Tag match
    for (const token of tokens) {
      for (const tag of nt) {
        if (tag.includes(token) || token.includes(tag)) score += 2;
      }
    }

    // Answer match
    for (const token of tokens) {
      if (na.includes(token) && token.length > 3) score += 1;
    }

    // Intent boosting
    if (intent === "comparison" && entry.category === "Comparação") score += 5;
    if (intent === "recommendation" && entry.category === "Recomendação") score += 5;
    if (intent === "recommendation" && entry.category === "Vendas") score += 3;
    if (intent === "price" && (entry.tags || []).some(t => ["preço", "barato"].includes(t))) score += 6;
    if (intent === "price" && entry.answer.startsWith("PRICE_LOOKUP")) score += 10;
    if (intent === "howto" && entry.category === "Simulador") score += 4;
    if (intent === "list" && (entry.tags || []).includes("lista")) score += 3;

    // Product mention boosting
    for (const product of mentionedProducts) {
      if (nkw.some(kw => kw.includes(product))) score += 10;
      if (na.includes(product)) score += 3;
    }

    // City mention boosting
    for (const city of mentionedCities) {
      const cityName = normalize(city);
      if (nkw.some(kw => kw.includes(cityName))) score += 8;
      if (na.includes(cityName)) score += 2;
    }

    return { entry, score };
  });

  return scored
    .filter(s => s.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.entry);
}

// ============================================
// GERADOR DE PREÇOS DINÂMICOS
// ============================================

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function generatePriceResponse(query: string): string | null {
  const intent = detectIntent(query);
  if (intent !== "price" && !normalize(query).match(/crianca|bebe|infantil|quanto|preco|valor|custo|custa|barato|mais em conta/)) {
    return null;
  }

  const mentionedCities = extractCities(query);
  const mentionedProducts = extractProducts(query);
  const ageRange = extractAgeRange(query);

  // Default city: sao-paulo, default age: 29-33, default copart: parcial
  const city = (mentionedCities[0] || "sao-paulo") as City;
  const defaultAge: AgeRange = ageRange || "29-33";
  const copart: CoparticipationType = normalize(query).includes("total") ? "total" : "parcial";

  // Find the best contract type available for this city
  const cityData = PRICES[city];
  if (!cityData) return null;

  const contractOrder: ContractType[] = [
    "super-simples-1-vida",
    "super-simples-2-29-mei",
    "super-simples-2-29-demais",
    "super-simples-2-29-demais-pracas",
    "pme-30-99-compulsorio",
    "pme-30-99-adesao",
    "pme-30-99-demais-pracas",
  ];

  let bestContract: ContractType | null = null;
  for (const ct of contractOrder) {
    if (cityData[ct]?.[copart]) {
      bestContract = ct;
      break;
    }
  }
  if (!bestContract) return null;

  const products = getAvailableProducts(city, bestContract, copart);
  if (products.length === 0) return null;

  const cityInfo = CITIES.find(c => c.id === city);
  const cityName = cityInfo?.name || city;
  const ageLabel = AGE_RANGE_LABELS[defaultAge];
  const contractInfo = CONTRACT_TYPES.find(c => c.id === bestContract);

  // If specific product mentioned, show just that product's prices
  if (mentionedProducts.length > 0) {
    let response = `**Preços em ${cityName}** (${contractInfo?.name}, Copart. ${copart === "parcial" ? "Parcial" : "Total"}):\n\n`;

    for (const mp of mentionedProducts) {
      const matchingProducts = products.filter(p => normalize(p.name).includes(mp));
      for (const prod of matchingProducts) {
        const price = getPrice(city, bestContract, copart, prod.id, defaultAge);
        if (price) {
          response += `**${prod.name}** (${ageLabel}): **${formatCurrency(price)}/mês**\n`;

          // Show all age ranges for this product
          response += "\n| Faixa | Valor |\n|---|---|\n";
          for (const ar of AGE_RANGES) {
            const p = getPrice(city, bestContract, copart, prod.id, ar);
            if (p) {
              const marker = ar === defaultAge ? " ← " : "";
              response += `| ${AGE_RANGE_LABELS[ar]} | ${formatCurrency(p)}${marker} |\n`;
            }
          }
          response += "\n";
        }
      }
    }
    return response;
  }

  // General price query - show cheapest products for the age range
  let response = `**Preços em ${cityName}** (${ageLabel}, ${contractInfo?.name}, Copart. ${copart === "parcial" ? "Parcial" : "Total"}):\n\n`;

  const productPrices: { name: string; price: number; category: string }[] = [];
  for (const prod of products) {
    const price = getPrice(city, bestContract, copart, prod.id, defaultAge);
    if (price) {
      productPrices.push({ name: prod.name, price, category: prod.category });
    }
  }

  productPrices.sort((a, b) => a.price - b.price);

  // Show top products by category
  response += "| Produto | Valor/mês |\n|---|---|\n";
  for (const pp of productPrices.slice(0, 12)) {
    response += `| ${pp.name} | **${formatCurrency(pp.price)}** |\n`;
  }
  if (productPrices.length > 12) {
    response += `| ... e mais ${productPrices.length - 12} produtos | Use o simulador |\n`;
  }

  response += `\n⚠️ Valores para faixa ${ageLabel}. Outras faixas têm valores diferentes. Use o **Simulador** para cotação completa!`;

  return response;
}

// ============================================
// GERADOR DE RESPOSTA CONVERSACIONAL
// ============================================

export function generateDiellyResponse(query: string, results: KnowledgeEntry[]): string {
  // First, check if we should generate a price response
  const priceResponse = generatePriceResponse(query);

  if (results.length === 0 && !priceResponse) {
    return "Hmm, não encontrei informações específicas sobre isso. 🤔\n\nPosso te ajudar com:\n• **Produtos** (Smart 200, Advance, Premium, Infinity...)\n• **Preços** (\"quanto custa o Smart 200 para criança?\")\n• **Coparticipação** (parcial vs total)\n• **Contratos** (Super Simples, PME, Compulsório)\n• **Carência e portabilidade**\n• **Regras comerciais** (vigência, aceitação, dependentes)\n• **Dicas de venda**\n\nTenta reformular a pergunta! 😊";
  }

  const intent = detectIntent(query);
  let response = "";

  // Handle PRICE_LOOKUP entries - replace with real prices
  if (results.length > 0 && results[0].answer.startsWith("PRICE_LOOKUP")) {
    if (priceResponse) {
      response = priceResponse;
    } else {
      // Fallback: show general info
      const fallbackResults = results.filter(r => !r.answer.startsWith("PRICE_LOOKUP"));
      if (fallbackResults.length > 0) {
        response = fallbackResults[0].answer;
      } else {
        response = "Para ver preços específicos, me diga a **filial** e a **faixa etária**. Exemplo: \"Quanto custa o Smart 200 em Campinas para 30 anos?\"\n\nOu use o **Simulador** para cotação completa!";
      }
    }

    // Add non-price results as complement
    const extraResults = results.filter(r => !r.answer.startsWith("PRICE_LOOKUP"));
    if (extraResults.length > 0) {
      response += "\n\n---\n\n" + extraResults[0].answer;
    }

    return response;
  }

  // If we have price data AND knowledge results, combine them
  if (priceResponse && intent === "price") {
    response = priceResponse;
    if (results.length > 0) {
      response += "\n\n---\n\n" + results[0].answer;
    }
    return response;
  }

  // Standard knowledge response
  if (results.length === 1) {
    if (intent === "comparison") response += "Vou te mostrar a comparação:\n\n";
    else if (intent === "recommendation") response += "Aqui vão minhas sugestões:\n\n";
    else if (intent === "howto") response += "Te explico:\n\n";

    response += results[0].answer;
  } else {
    // Multiple results
    if (intent === "comparison") {
      response += results[0].answer;
      if (results[1]?.category === "Comparação") {
        response += "\n\n---\n\n" + results[1].answer;
      }
    } else if (intent === "recommendation") {
      response += results[0].answer;
      if (results.length > 1) {
        response += "\n\n---\n\n**Complementando:**\n" + results[1].answer;
      }
    } else {
      response += results[0].answer;
    }
  }

  // Append price info if relevant
  if (priceResponse && !response.includes("R$")) {
    response += "\n\n---\n\n**Valores de referência:**\n" + priceResponse;
  }

  return response;
}
