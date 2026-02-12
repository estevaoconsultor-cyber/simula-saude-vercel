import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Linking, Alert, Platform, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { DOCUMENT_URLS } from "@/data/document-urls";

// Tipos para as seções
type ContentItem = string | { type: "list"; items: { name: string; ans?: string; convenio?: string }[] };

interface RuleSection {
  id: string;
  title: string;
  icon: string;
  content: ContentItem[];
  subsections?: RuleSection[];
  downloadable?: { name: string; filename: string; description: string }[];
}

// Lista de operadoras para aproveitamento de carência
const OPERADORAS_CARENCIA = [
  { name: "Alice", ans: "421928", convenio: "347" },
  { name: "Ameplan", ans: "394734", convenio: "346" },
  { name: "Amhemed", ans: "421731", convenio: "348" },
  { name: "Amil", ans: "-", convenio: "33" },
  { name: "Ana Costa Saúde", ans: "360244", convenio: "349" },
  { name: "Assim Saúde", ans: "309222", convenio: "350" },
  { name: "Ativia Saúde", ans: "320510", convenio: "351" },
  { name: "Biovida", ans: "415111", convenio: "352" },
  { name: "Blue Company", ans: "423173", convenio: "499" },
  { name: "Bradesco", ans: "-", convenio: "67" },
  { name: "Caberj", ans: "415774", convenio: "353" },
  { name: "Cabesp", ans: "352331", convenio: "354" },
  { name: "Care Plus", ans: "379956", convenio: "355" },
  { name: "Cemeru", ans: "401081", convenio: "356" },
  { name: "Climed-Atibaia", ans: "350699", convenio: "357" },
  { name: "Cruz Azul Saúde", ans: "411752", convenio: "633" },
  { name: "Dona Saúde", ans: "365645", convenio: "639" },
  { name: "GoCare", ans: "422681", convenio: "358" },
  { name: "Golden Cross", ans: "403911", convenio: "7" },
  { name: "HBC", ans: "414352", convenio: "363" },
  { name: "Klini Saúde", ans: "422029", convenio: "379" },
  { name: "Leve Saúde", ans: "422339", convenio: "378" },
  { name: "Med-Tour Saúde", ans: "328537", convenio: "714" },
  { name: "Mediservice", ans: "333689", convenio: "361" },
  { name: "Omint", ans: "359661", convenio: "362" },
  { name: "Plena Saúde", ans: "348830", convenio: "364" },
  { name: "Porto Seguro", ans: "582", convenio: "365" },
  { name: "Prevent Senior", ans: "302147", convenio: "366" },
  { name: "Proasa Saúde", ans: "406554", convenio: "393" },
  { name: "Sagrada Família", ans: "422371", convenio: "394" },
  { name: "Samaritano Saúde", ans: "411256", convenio: "367" },
  { name: "Sami", ans: "422398", convenio: "368" },
  { name: "Santa Casa de Mauá", ans: "421197", convenio: "369" },
  { name: "Santa Helena", ans: "355097", convenio: "370" },
  { name: "Saúde Beneficência", ans: "417530", convenio: "373" },
  { name: "Saúde Santa Tereza", ans: "414930", convenio: "374" },
  { name: "Sobam", ans: "326500", convenio: "375" },
  { name: "Sulamerica", ans: "-", convenio: "13" },
  { name: "São Cristóvão", ans: "314218", convenio: "371" },
  { name: "São Miguel Saúde", ans: "325236", convenio: "372" },
  { name: "Trasmontano", ans: "303623", convenio: "376" },
  { name: "Unihosp", ans: "385255", convenio: "270" },
  { name: "Unimed", ans: "-", convenio: "31" },
  { name: "Única", ans: "421944", convenio: "377" },
];

// Seções de regras organizadas
const RULES: RuleSection[] = [
  // NOVO: Aproveitamento de Carência
  {
    id: "aproveitamento-carencia",
    title: "Aproveitamento de Carência",
    icon: "🔄",
    content: [
      "**Simplificação Operacional** - Novas regras válidas para todas as operadoras do Grupo Hapvida.",
    ],
    subsections: [
      {
        id: "termo-aproveitamento",
        title: "Termo de Aproveitamento",
        icon: "📝",
        content: [
          "**Canais:** PF e Super Simples",
          "**Novidade:** Não é mais necessário carimbo nas cartas de Portabilidade.",
          "A **Cláusula 1.4 dos Termos de Aproveitamento** passa a assegurar, de forma suficiente, o aproveitamento de carências.",
          "Isso reduz etapas operacionais e agiliza a formalização das vendas.",
        ],
      },
      {
        id: "adm-vendas-pf",
        title: "ADM em Vendas PF",
        icon: "✅",
        content: [
          "**Canal:** PF",
          "**Não haverá aplicação de ADM** em casos de falha operacional relacionados a erros no aproveitamento de carências ou à ausência de sinalização de desconto familiar.",
          "Isso garante o **pagamento de comissão** para os parceiros.",
        ],
      },
      {
        id: "comprovacao-adimplencia",
        title: "Comprovação de Adimplência",
        icon: "📋",
        content: [
          "**Canais:** Super Simples e PME",
          "Passa a ser aceita a **Declaração de Permanência/Portabilidade** sem a exigência de comprovação de adimplência.",
          "**Não é necessário** enviar boletos ou comprovantes de pagamento das últimas faturas.",
          "⚠️ **Exceção:** Para Empresas MEI, permanece sendo obrigatória a comprovação de adimplência.",
        ],
      },
      {
        id: "operadoras-aproveitamento",
        title: "Operadoras para Aproveitamento",
        icon: "🏥",
        content: [
          "Lista de operadoras aceitas para aproveitamento de carências NDI SP/RJ:",
          { type: "list", items: OPERADORAS_CARENCIA },
        ],
      },
      {
        id: "regra-consanguineos",
        title: "Regra de Consanguíneos",
        icon: "👨‍👩‍👧",
        content: [
          "Campanha de Consanguíneos - Vigência: 01/02/2026 a 28/02/2026",
          "Canais: Super Simples (02 a 29 vidas) e PME (30 a 99 vidas)",
          "Familiares que podem ser incluídos no contrato:",
          "• Cônjuge ou companheiro do titular",
          "• Filhos do titular, até 53 anos de idade",
          "• Enteados do titular, até 53 anos de idade",
          "• Netos do titular, até 53 anos de idade",
          "• Irmãos do titular, até 53 anos de idade",
          "• Sobrinhos do titular, até 53 anos de idade",
          "• Gênros do titular, até 53 anos de idade",
          "• Pais do titular, até 53 anos de idade",
          "• Sogros do titular, até 53 anos de idade",
          "• Cunhados do titular, até 53 anos de idade",
          "• Tios do titular, até 53 anos de idade",
          "• Padrasto/madrasta do titular, até 53 anos de idade",
        ],
      },
      {
        id: "reducao-proporcional-carencia",
        title: "Redução Proporcional de Carência",
        icon: "📊",
        content: [
          "Sistema de Redução Proporcional de Carência",
          "A redução proporcional de carência é aplicada quando o beneficiário já possui histórico de cobertura em outra operadora.",
          "Como funciona:",
          "• O tempo de cobertura anterior é contabilizado",
          "• A carência é reduzida proporcionalmente ao tempo já coberto",
          "• Exemplo: Se o beneficiário já tinha 6 meses de cobertura em outra operadora, e a carência padrão é 12 meses, ele terá apenas 6 meses de carência",
          "Condições:",
          "• Válido apenas com comprovação de cobertura anterior",
          "• Aplicável em todos os canais (PF, Super Simples, PME)",
          "• Requer documentação da operadora anterior",
        ],
      },
    ],
  },
  // NOVO: Plano do Vendedor
  {
    id: "plano-vendedor",
    title: "Plano do Vendedor",
    icon: "🎁",
    content: [
      "**Atenção, vendedores Hapvida!** Temos uma super oportunidade para você!",
      "Ao fechar um contrato **Pessoa Física** com a gente, você garante **desconto direto na sua fatura** e o valor é conforme o seu desempenho nas vendas:",
    ],
    subsections: [
      {
        id: "descontos-fatura",
        title: "Tabela de Descontos",
        icon: "💰",
        content: [
          "🤝 **Contrato PF fechado?** Você já começa com **25% de desconto!**",
          "🥈 **Vendeu de 5 a 9 vidas?** Seu desconto sobe para **50%!**",
          "🥇 **Vendeu 10 vidas ou mais?** **100% de desconto** – sua fatura sai por nossa conta!",
          "📱 **Pagamento via Pix**, direto para você, com rapidez e praticidade.",
          "Aproveite essa chance de economizar mais enquanto vende mais!",
          "*Consulte seu executivo comercial Hapvida para mais informações.",
        ],
      },
    ],
  },
  // NOVO: Manuais Comerciais
  {
    id: "manuais",
    title: "Manuais Comerciais",
    icon: "📖",
    content: [
      "Baixe os manuais e guias para auxiliar suas vendas:",
    ],
    downloadable: [
      { name: "Manual APP do Beneficiário", filename: "0.ManualAPPdoBeneficiário.pdf", description: "Como usar o app do beneficiário" },
      { name: "Manual do Corretor Super Simples e PME", filename: "1.ManualdoCorretorSuperSimplesePME.pdf", description: "Guia completo para vendas SS e PME" },
      { name: "Guia Prático App Vendedor", filename: "2.GuiaPráticoAppVendedor(a).pdf", description: "Como usar o app do vendedor" },
      { name: "Manual Portal Web Vendedor", filename: "2.1ManualPortalWebVendedor.pdf", description: "Acesso e uso do portal web" },
      { name: "Manual Portal do Cliente", filename: "3.ManualPortaldoCliente.pdf", description: "Portal de atendimento ao cliente" },
      { name: "Portal Corretor CNPJ/PF", filename: "4.PortalCorretorCNPJPF.pdf", description: "Cadastro e gestão de corretores" },
      { name: "Manual App e Portal", filename: "5.ManualAppePortal.pdf", description: "Guia geral de apps e portais" },
      { name: "Manual de Movimentação PF", filename: "7.ManualdemovimentaçãoparacontratosPF.pdf", description: "Inclusões, exclusões e alterações PF" },
      { name: "Guia Trilha de Vendas Hapvida", filename: "8.GuiaTrilhadeVendasHapvida.pdf", description: "Passo a passo do processo de vendas" },
      { name: "Manual de Reembolso", filename: "9.ManualdeReembolso-APPePortal.pdf", description: "Como solicitar reembolso" },
    ],
  },
  // NOVO: Documentos Importantes
  {
    id: "documentos",
    title: "Documentos Importantes",
    icon: "📁",
    content: [
      "Baixe os documentos necessários para suas vendas:",
    ],
    downloadable: [
      { name: "Carta de Nomeação", filename: "carta-nomeacao.docx", description: "Modelo Hapvida para nomeação de corretor" },
      { name: "Contrato de Prestação de Serviço", filename: "contrato-prestacao-servico.docx", description: "Modelo de mercado para contrato" },
    ],
  },
  // Regras existentes
  {
    id: "produtos",
    title: "Diferença entre Produtos",
    icon: "📊",
    content: [
      "**Nosso Médico**: Rede própria Hapvida, sem rede credenciada. Plano completo Ambulatorial, Hospitalar com Obstetrícia e Odonto. Fluxo: Médico e Enfermeira da Família → Especialistas. Acesso direto: Urgência, Ginecologia, Pediatria, Oftalmologia.",
      "**Smart Ambulatorial**: Apenas consultas e exames, sem internação.",
      "**Smart 200 / 200 UP**: Rede própria + credenciada básica. Ambulatorial + Hospitalar.",
      "**Smart 300 / 500**: Rede própria + credenciada intermediária. Maior abrangência de rede.",
      "**Smart Prime / Advance 600**: Rede própria + ampla rede credenciada. Reembolso R$ 75 (consulta). Rede SP: Santa Paula, Nipo Brasileiro, São Luiz SBC, Christovão da Gama.",
      "**Advance 700**: Conforto e flexibilidade. Reembolso R$ 96 (consulta). Unidade Advance exclusiva (Paraíso-SP). Rede SP: São Camilo, Nipo Brasileiro, Leforte.",
      "**Premium 900.1**: Alta qualidade **COM Rede Dor**. Reembolso R$ 240 (consulta). Rede SP: São Luiz Morumbi/Itaim/Anália Franco, Santa Joana, Sabará.",
      "**Premium 900.1 Care**: Mesma qualidade **SEM Rede Dor**. Reembolso R$ 240 (consulta). Rede SP: Oswaldo Cruz, Santa Joana, Santa Catarina, 9 de Julho.",
      "**Infinity 1000.1**: Top de linha. Reembolso R$ 400 (consulta). Acesso a Einstein, Sírio Libanês, BP Mirante. Retaguarda hospitalar exclusiva.",
    ],
  },
  // NOVO: Benefícios PPO
  {
    id: "beneficios-ppo",
    title: "Benefícios PPO: Advance, Premium e Infinity",
    icon: "⭐",
    content: [
      "Comparativo de benefícios exclusivos dos produtos PPO (Advance, Premium e Infinity):",
    ],
    subsections: [
      {
        id: "ppo-abrangencia",
        title: "Abrangência e Acomodação",
        icon: "🏨",
        content: [
          "**Advance 600/700**: Abrangência Nacional. Acomodação Enfermaria ou Apartamento.",
          "**Premium 900**: Abrangência Nacional. Acomodação Apartamento.",
          "**Infinity 1000**: Abrangência Nacional. Acomodação Apartamento.",
        ],
      },
      {
        id: "ppo-viagem",
        title: "Assistência Viagem",
        icon: "✈️",
        content: [
          "**Advance 600/700**: Assistência viagem Nacional.",
          "**Premium 900**: Nacional + Internacional (€30.000 Europa, US$ 60.000 demais países).",
          "**Infinity 1000**: Nacional + Internacional (€40.000 Europa, US$ 100.000 demais países).",
        ],
      },
      {
        id: "ppo-terapias",
        title: "Terapias e Sessões Extras",
        icon: "🩺",
        content: [
          "**Nutricionista**: Advance = Min 6 / Max 18 sessões (DUT) | Premium = 20 sessões (independente DUT) | Infinity = 60 sessões (independente DUT)",
          "**RPG**: Advance = 12 sessões | Premium = 30 sessões | Infinity = 40 sessões",
          "**Hidroterapia**: Advance 600 = não | Advance 700 = 10 sessões | Premium = 30 sessões | Infinity = 40 sessões",
          "**Escleroterapia**: Advance = não | Premium = 18 sessões | Infinity = 25 sessões",
        ],
      },
      {
        id: "ppo-cirurgia",
        title: "Cirurgia Refrativa",
        icon: "👁️",
        content: [
          "**Miopia**: Advance = grau -5,0 a -10,0 | Premium = acima de -3,0 | Infinity = sem limite de grau",
          "**Hipermetropia**: Todos = até grau 6,0",
        ],
      },
      {
        id: "ppo-transplantes",
        title: "Transplantes",
        icon: "🫀",
        content: [
          "**Advance 600/700**: Rim, Córnea e Medula Óssea.",
          "**Premium 900**: + Coração e Pulmão.",
          "**Infinity 1000**: + Coração, Pâncreas, Fígado e Pulmão.",
        ],
      },
      {
        id: "ppo-exclusivos",
        title: "Benefícios Exclusivos",
        icon: "💎",
        content: [
          "**Vacinas**: Advance = não | Premium = Sim | Infinity = Sim",
          "**Coleta Domiciliar**: Advance = não | Premium = Sim | Infinity = Sim",
          "**Check-Up Titulares**: Advance = não | Premium = não | Infinity = Sim",
          "**Courrier (entrega de exames)**: Advance = não | Premium = não | Infinity = Sim",
          "**Teste Incompatibilidade Alimentar**: Apenas Infinity",
          "**Retaguarda Einstein/Sírio**: Apenas Infinity (PS e Honorários médicos de internação)",
        ],
      },
      {
        id: "ppo-reembolso-prazo",
        title: "Prazos de Reembolso",
        icon: "⏰",
        content: [
          "**Consultas e Exames**: Advance = 7 dias úteis | Premium = 5 dias úteis | Infinity = 3 dias úteis",
          "**Demais Procedimentos**: Advance = 30 dias | Premium = 10 dias úteis | Infinity = 10 dias úteis",
        ],
      },
      {
        id: "ppo-hospitais",
        title: "Hospitais de Referência SP",
        icon: "🏥",
        content: [
          "**Infinity**: BP Mirante, Albert Einstein, Sírio Libanês, Sabará, Pro Matre, São Luiz SCSul",
          "**Premium 900**: São Luiz Morumbi, São Luiz Itaim, São Luiz Anália Franco, São Luiz SCSul, Santa Joana, Sabará",
          "**Premium Care**: Oswaldo Cruz, Santa Joana, Santa Catarina, 9 de Julho, Delboni",
          "**Advance 700**: São Camilo, Nipo Brasileiro, Leforte",
          "**Advance 600**: Santa Paula, Nipo Brasileiro, São Luiz SBC (Assunção), Christovão da Gama",
        ],
      },
    ],
  },
  {
    id: "reembolso",
    title: "Regras de Reembolso",
    icon: "💰",
    content: [
      "**Produtos SEM reembolso**: Nosso Médico, Smart Ambulatorial, Smart 200/200UP, Smart 300/500.",
      "**Reembolso Advance 600 (Enfermaria)**: Consulta R$ 75 | Acupuntura R$ 67,87 | Psicoterapia R$ 59,38 | RM Crânio R$ 685,17",
      "**Reembolso Advance 700 (Apartamento)**: Consulta R$ 96 | Acupuntura R$ 67,87 | Psicoterapia R$ 59,38 | RM Crânio R$ 685,17",
      "**Reembolso Premium 900.1**: Consulta R$ 240 | Acupuntura R$ 106,46 | Psicoterapia R$ 190,02 | RM Crânio R$ 833,61",
      "**Reembolso Infinity 1000.1**: Consulta R$ 400 | Acupuntura R$ 151 | Psicoterapia R$ 316,70 | RM Crânio R$ 982,06",
      "**Parto Cesariana**: Advance 600 Enf R$ 1.180 | Advance 600 Apto R$ 2.360 | Premium R$ 5.900 | Infinity R$ 11.800",
      "**Prazo para solicitar**: Até 30 dias após o procedimento.",
      "**Documentos necessários**: Nota fiscal, relatório médico, guia de atendimento.",
    ],
  },
  {
    id: "idade",
    title: "Regras de Aceitação por Idade",
    icon: "👶",
    content: [
      "**Idade mínima**: Não há idade mínima. Recém-nascidos podem ser incluídos.",
      "**Faixas etárias ANS**: 10 faixas (0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+).",
      "**TITULARES - Sócio**: Smart/Advance/Premium Care/Premium 900.1/Infinity = até 74 anos.",
      "**TITULARES - Funcionário CLT**: Todos os produtos = até 74 anos.",
      "**TITULARES - Prestador de Serviço**: Smart/Advance/Premium Care = até 74 anos. Premium 900.1/Infinity = NÃO aceita.",
      "**DEPENDENTES - Cônjuge**: Todos os produtos = até 74 anos.",
      "**DEPENDENTES - Filhos/Adotivos/Enteados**: Todos os produtos = até 53 anos (solteiros).",
      "**AGREGADOS - Pai/Mãe/Sogros/Irmãos/Cunhados/Tios/Sobrinhos/Netos**: Smart/Advance/Premium Care = até 53 anos. Premium 900.1/Infinity = NÃO aceita.",
      "**Agregados/Prestadores**: Aceitos apenas na VENDA (Comercial). NÃO aceitos em inclusões pós-implantação (Pós Vendas).",
      "**Vindo de outra operadora**: Reduz aceitação até 64 anos.",
      "**Movimentação**: 5% aceitação entre 65-74 anos. 1% aceitação a partir de 75 anos.",
    ],
  },
  {
    id: "area",
    title: "Área Limítrofe e Abrangência",
    icon: "🗺️",
    content: [
      "**Abrangência Regional**: Atendimento na região contratada (grupo de municípios).",
      "**Abrangência Nacional**: Advance 600, Advance 700, Premium 900, Infinity 1000 - todos com abrangência nacional.",
      "**Nosso Médico SS/PME**: RMSP, Campinas, Jundiaí, Americana, Sorocaba.",
      "**Nosso Médico PF**: SP (Zona Leste, Norte, Sul), ABC, Mogi das Cruzes, Campinas, Jundiaí, Americana, Sorocaba, Guarulhos, Itapevi, Osasco, Taboão.",
      "**NotreLife SP**: Apenas São Paulo capital. Rede exclusivamente própria, acomodação enfermaria.",
      "**NotreLife RJ**: Apenas Rio de Janeiro. Rede exclusivamente própria, acomodação enfermaria.",
      "**Urgência/Emergência**: Atendimento garantido em todo território nacional.",
      "**Remoção**: Cobertura de remoção para hospital da rede em caso de urgência fora da área.",
      "**NÃO é possível** mesclar produtos regionais de filiais diferentes. Dependentes seguem mesmo plano do titular.",
    ],
  },
  {
    id: "pf",
    title: "Regras Pessoa Física (PF)",
    icon: "👤",
    content: [
      "**Produtos disponíveis**: NotreLife, Nosso Médico PF, Basic Referência.",
      "**Carência padrão**: 24h urgência/emergência, 30 dias consultas, 180 dias demais.",
      "**Carência reduzida**: Disponível para portabilidade de carências.",
      "**Documentação**: RG, CPF, comprovante de residência, CNS.",
      "**Dependentes**: Cônjuge, filhos até 24 anos (estudantes), pais (se dependentes).",
    ],
  },
  {
    id: "pme",
    title: "Regras PME (30-99 vidas)",
    icon: "🏢",
    content: [
      "**Livre Adesão**: Quando NÃO houver contratação de 100% dos sócios/funcionários.",
      "**Compulsória**: 100% sócios + 100% funcionários CLT ativos no e-Social.",
      "**Compulsória - Até 9 titulares**: Mínimo 80% do quadro.",
      "**Compulsória - 10+ titulares**: Mínimo 90% do quadro.",
      "**Mínimo de vidas**: 30 beneficiários para enquadramento PME. Carência zero.",
      "**Migração**: 100% das vidas, permanência mín 12 meses, sem acréscimos/exclusões, máx 30 dias entre rescisão e protocolo.",
      "**NÃO se enquadram como Encampação**: PF Individual/Familiar e Coletivos por Adesão.",
      "**Coligadas**: 2+ CNPJ coligados em uma proposta. Benefício: carência zerada +30 vidas e tabela PME. Requisitos: sócios em comum ou sociedade familiar.",
    ],
  },
  {
    id: "supersimples",
    title: "Regras Super Simples (1-29 vidas)",
    icon: "📋",
    content: [
      "**SS 1 Vida (sócio CNPJ)**: Linha Smart e Advance. Sem exigência de funcionários.",
      "**SS 2-15 vidas**: Tabela MEI (natureza jurídica 213-5) e Não MEI. Redução de carência.",
      "**SS 16-29 vidas**: Tabela MEI e Não MEI. Maior redução de carência.",
      "**Cada titular pode ter plano diferente**. Dependentes seguem mesmo plano do titular.",
      "**Vigência futura**: 5, 10, 15, 30 ou 60 dias.",
      "**Vencimento boletos**: 01-05→Dia 05, 06-10→Dia 10, 11-15→Dia 15, 16-20→Dia 20, 21-25→Dia 25, 26-31→Dia 30.",
      "**Documentação CNPJ**: Cartão CNPJ + Contrato Social/Req. Empresário/Cert. MEI + RG/CNH responsável + Vínculo das vidas.",
      "**Documentação CPF (2-29 vidas)**: RG/CNH + Vínculo com titular + Endereço + Celular e E-mail de cada titular.",
    ],
  },
  {
    id: "carencia",
    title: "Carências e Prazos",
    icon: "⏱️",
    content: [
      "**Urgência/Emergência**: 24 horas.",
      "**Consultas e Exames Simples**: 30 dias.",
      "**Exames Complexos**: 180 dias.",
      "**Internações**: 180 dias.",
      "**Cirurgias**: 180 dias.",
      "**Parto**: 300 dias.",
      "**Doenças Preexistentes (CPT)**: 24 meses de cobertura parcial temporária.",
      "**Portabilidade**: Carências podem ser aproveitadas do plano anterior.",
    ],
  },
];

export default function RulesScreen() {
  const colors = useColors();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedSubsection, setExpandedSubsection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [operadoraSearch, setOperadoraSearch] = useState("");

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    setExpandedSubsection(null);
  };

  const toggleSubsection = (subsectionId: string) => {
    setExpandedSubsection(expandedSubsection === subsectionId ? null : subsectionId);
  };

  // Filtrar operadoras
  const filteredOperadoras = operadoraSearch.length >= 2
    ? OPERADORAS_CARENCIA.filter(op => 
        op.name.toLowerCase().includes(operadoraSearch.toLowerCase()) ||
        op.ans.includes(operadoraSearch) ||
        op.convenio.includes(operadoraSearch)
      )
    : OPERADORAS_CARENCIA;

  // Filtrar seções pela busca
  const filteredRules = searchQuery.length >= 2
    ? RULES.filter(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.some(c => 
          typeof c === 'string' && c.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        section.subsections?.some(sub => 
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.content.some(c => 
            typeof c === 'string' && c.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      )
    : RULES;

  const renderContent = (content: string) => {
    const parts = content.split(/\*\*(.*?)\*\*/g);
    return (
      <Text className="text-sm text-muted leading-relaxed">
        {parts.map((part, index) =>
          index % 2 === 1 ? (
            <Text key={index} className="font-semibold text-foreground">
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // Mapeamento de nomes de arquivos para chaves do DOCUMENT_URLS
  const getDocumentKey = (filename: string): string => {
    const mapping: Record<string, string> = {
      "0.ManualAPPdoBeneficiário.pdf": "0.ManualAPPdoBeneficiario.pdf",
      "2.GuiaPráticoAppVendedor(a).pdf": "2.GuiaPraticoAppVendedor.pdf",
      "7.ManualdemovimentaçãoparacontratosPF.pdf": "7.ManualMovimentacaoPF.pdf",
      "9.ManualdeReembolso-APPePortal.pdf": "9.ManualdeReembolso.pdf",
    };
    return mapping[filename] || filename;
  };

  const handleDownload = async (filename: string, displayName: string) => {
    try {
      setDownloadingFile(filename);
      
      // Obter URL direta do CDN
      const docKey = getDocumentKey(filename);
      const doc = DOCUMENT_URLS[docKey];
      
      if (!doc) {
        Alert.alert("Erro", `Documento "${displayName}" não encontrado.`);
        setDownloadingFile(null);
        return;
      }
      
      const downloadUrl = doc.url;
      
      // Para web, abrir em nova aba
      if (Platform.OS === "web") {
        window.open(downloadUrl, "_blank");
        setDownloadingFile(null);
        return;
      }
      
      // Para mobile, baixar e compartilhar
      Alert.alert(
        "📥 Download",
        `Deseja baixar o documento "${displayName}"?`,
        [
          { text: "Cancelar", style: "cancel", onPress: () => setDownloadingFile(null) },
          { 
            text: "Baixar", 
            onPress: async () => {
              try {
                // Baixar arquivo para o dispositivo
                const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
                const fileUri = FileSystem.documentDirectory + safeFilename;
                const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri);
                
                if (downloadResult.status !== 200) {
                  throw new Error("Falha no download");
                }
                
                // Verificar se pode compartilhar
                const canShare = await Sharing.isAvailableAsync();
                if (canShare) {
                  await Sharing.shareAsync(downloadResult.uri, {
                    mimeType: filename.endsWith(".pdf") ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    dialogTitle: displayName,
                  });
                } else {
                  Alert.alert("✅ Sucesso", `Documento salvo em: ${downloadResult.uri}`);
                }
              } catch (error) {
                console.error("Erro no download:", error);
                Alert.alert("Erro", "Não foi possível baixar o documento. Tente novamente.");
              } finally {
                setDownloadingFile(null);
              }
            }
          },
        ]
      );
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Não foi possível baixar o documento.");
      setDownloadingFile(null);
    }
  };

  const renderOperadorasList = () => (
    <View className="mt-2">
      {/* Busca de operadoras */}
      <View className="bg-background rounded-lg border border-border flex-row items-center px-3 mb-3">
        <Text className="text-sm mr-2">🔍</Text>
        <TextInput
          placeholder="Buscar operadora..."
          placeholderTextColor={colors.muted}
          value={operadoraSearch}
          onChangeText={setOperadoraSearch}
          className="flex-1 py-2 text-sm text-foreground"
          style={{ color: colors.foreground }}
          returnKeyType="search"
        />
        {operadoraSearch.length > 0 && (
          <TouchableOpacity onPress={() => setOperadoraSearch("")}>
            <Text className="text-muted">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contador */}
      <Text className="text-xs text-muted mb-2">
        {filteredOperadoras.length} operadora(s) encontrada(s)
      </Text>

      {/* Lista de operadoras */}
      <View className="bg-background rounded-lg border border-border overflow-hidden">
        {/* Cabeçalho */}
        <View className="flex-row bg-primary/10 px-3 py-2">
          <Text className="flex-1 text-xs font-semibold text-primary">Operadora</Text>
          <Text className="w-16 text-xs font-semibold text-primary text-center">ANS</Text>
          <Text className="w-14 text-xs font-semibold text-primary text-center">Conv.</Text>
        </View>
        
        {/* Linhas */}
        {filteredOperadoras.slice(0, 15).map((op, index) => (
          <View 
            key={`${op.name}-${index}`}
            className={`flex-row px-3 py-2 ${index % 2 === 0 ? 'bg-background' : 'bg-surface/50'}`}
          >
            <Text className="flex-1 text-xs text-foreground">{op.name}</Text>
            <Text className="w-16 text-xs text-muted text-center">{op.ans}</Text>
            <Text className="w-14 text-xs text-muted text-center">{op.convenio}</Text>
          </View>
        ))}
        
        {filteredOperadoras.length > 15 && (
          <View className="px-3 py-2 bg-primary/5">
            <Text className="text-xs text-primary text-center">
              +{filteredOperadoras.length - 15} operadoras. Use a busca para filtrar.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderDownloadables = (downloadable: { name: string; filename: string; description: string }[]) => (
    <View className="mt-2">
      {downloadable.map((doc, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleDownload(doc.filename, doc.name)}
          className="bg-background rounded-lg border border-border p-3 mb-2 flex-row items-center"
          style={{ opacity: 1 }}
        >
          <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
            <Text className="text-lg">📄</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground">{doc.name}</Text>
            <Text className="text-xs text-muted">{doc.description}</Text>
          </View>
          <View className="bg-primary px-3 py-1.5 rounded-lg">
            <Text className="text-xs text-white font-medium">Baixar</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSubsection = (subsection: RuleSection) => {
    const isExpanded = expandedSubsection === subsection.id;
    
    return (
      <View key={subsection.id} className="mb-2">
        <TouchableOpacity
          onPress={() => toggleSubsection(subsection.id)}
          className={`bg-background rounded-lg p-3 border ${
            isExpanded ? "border-primary/50" : "border-border/50"
          }`}
          style={{ opacity: 1 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Text className="text-lg mr-2">{subsection.icon}</Text>
              <Text className="text-sm font-medium text-foreground flex-1">
                {subsection.title}
              </Text>
            </View>
            <Text className="text-muted text-sm">
              {isExpanded ? "▼" : "›"}
            </Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View className="bg-background/50 rounded-b-lg border-x border-b border-border/50 p-3 -mt-1">
            {subsection.content.map((item, index) => (
              <View key={index} className="mb-2 last:mb-0">
                {typeof item === 'string' ? (
                  renderContent(item)
                ) : item.type === 'list' ? (
                  renderOperadorasList()
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="p-4 pb-0">
        <Text className="text-2xl font-bold text-foreground mb-1">
          Regras Comerciais
        </Text>
        <Text className="text-sm text-muted mb-3">
          Consulte regras, documentos e informações importantes
        </Text>

        {/* Busca */}
        <View className="bg-surface rounded-xl border border-border flex-row items-center px-3 mb-4">
          <Text className="text-lg mr-2">🔍</Text>
          <TextInput
            placeholder="Buscar regras..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 py-3 text-foreground"
            style={{ color: colors.foreground }}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text className="text-muted text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Destaques rápidos */}
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity 
            onPress={() => {
              setExpandedSection("aproveitamento-carencia");
              setExpandedSubsection("operadoras-aproveitamento");
            }}
            className="flex-1 bg-success/10 rounded-xl p-3 border border-success/30"
          >
            <Text className="text-success text-center text-xs font-medium">🔄 Operadoras</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setExpandedSection("manuais")}
            className="flex-1 bg-primary/10 rounded-xl p-3 border border-primary/30"
          >
            <Text className="text-primary text-center text-xs font-medium">📖 Manuais</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setExpandedSection("plano-vendedor");
              setExpandedSubsection("descontos-fatura");
            }}
            className="flex-1 bg-warning/10 rounded-xl p-3 border border-warning/30"
          >
            <Text className="text-warning text-center text-xs font-medium">🎁 Descontos</Text>
          </TouchableOpacity>
        </View>

        {filteredRules.map((section) => (
          <View key={section.id} className="mb-3">
            <TouchableOpacity
              onPress={() => toggleSection(section.id)}
              className={`bg-surface rounded-xl p-4 border ${
                expandedSection === section.id
                  ? "border-primary"
                  : "border-border"
              }`}
              style={{ opacity: 1 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{section.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {section.title}
                    </Text>
                    {section.subsections && (
                      <Text className="text-xs text-muted">
                        {section.subsections.length} subtópico(s)
                      </Text>
                    )}
                  </View>
                </View>
                <Text className="text-muted text-lg">
                  {expandedSection === section.id ? "▼" : "›"}
                </Text>
              </View>
            </TouchableOpacity>

            {expandedSection === section.id && (
              <View className="bg-surface/50 rounded-b-xl border-x border-b border-border p-4 -mt-2">
                {/* Conteúdo principal */}
                {section.content.map((item, index) => (
                  <View key={index} className="mb-2">
                    {typeof item === 'string' && renderContent(item)}
                  </View>
                ))}

                {/* Subseções */}
                {section.subsections && section.subsections.length > 0 && (
                  <View className="mt-2">
                    {section.subsections.map(sub => renderSubsection(sub))}
                  </View>
                )}

                {/* Downloads */}
                {section.downloadable && renderDownloadables(section.downloadable)}
              </View>
            )}
          </View>
        ))}

        {/* Aviso */}
        <View className="bg-primary/10 rounded-xl p-4 mt-4">
          <Text className="text-sm font-semibold text-primary mb-1">
            ℹ️ Informação Importante
          </Text>
          <Text className="text-xs text-muted">
            As regras podem variar conforme a região e o produto. Em caso de
            dúvidas, consulte seu gestor comercial ou acesse a aba "Contato".
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
