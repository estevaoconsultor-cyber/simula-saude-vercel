import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface RuleSection {
  id: string;
  title: string;
  icon: string;
  content: string[];
}

const RULES: RuleSection[] = [
  {
    id: "produtos",
    title: "Diferença entre Produtos",
    icon: "📊",
    content: [
      "**Nosso Médico**: Rede própria Hapvida, sem rede credenciada. Ideal para quem busca economia. Atendimento em clínicas e hospitais Hapvida.",
      "**Smart (200, 300, 400, 500)**: Rede própria + rede credenciada limitada. Quanto maior o número, maior a rede credenciada disponível.",
      "**Advance (600, 700)**: Rede própria + ampla rede credenciada. Inclui reembolso parcial. Ideal para quem precisa de mais opções.",
      "**Premium (900, 900 Care)**: Rede própria + rede credenciada premium. Reembolso total. Hospitais de referência inclusos.",
      "**Infinity**: Produto top de linha. Rede nacional, reembolso total, sem limites. Atendimento VIP.",
    ],
  },
  {
    id: "reembolso",
    title: "Regras de Reembolso",
    icon: "💰",
    content: [
      "**Produtos SEM reembolso**: Nosso Médico, Smart 200, Smart 300, Smart 400, Smart 500.",
      "**Reembolso PARCIAL**: Advance 600, Advance 700. Limite de R$ 150 a R$ 300 por procedimento.",
      "**Reembolso TOTAL**: Premium 900, Premium 900 Care, Infinity. Valores de tabela AMB/CBHPM.",
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
      "**Idade máxima para adesão**: Sem limite de idade para novos beneficiários.",
      "**Faixas etárias ANS**: 10 faixas de 0-18 até 59+. Preços variam conforme a faixa.",
      "**Reajuste por idade**: Ocorre automaticamente ao mudar de faixa etária.",
      "**Carência especial**: Beneficiários acima de 59 anos podem ter carência estendida para procedimentos de alta complexidade.",
    ],
  },
  {
    id: "area",
    title: "Área Limítrofe e Abrangência",
    icon: "🗺️",
    content: [
      "**Abrangência Regional**: Atendimento na região contratada (ex: Grande São Paulo).",
      "**Abrangência Nacional**: Disponível em produtos Premium e Infinity.",
      "**Área Limítrofe**: Cidades vizinhas à região contratada podem ter atendimento limitado.",
      "**Urgência/Emergência**: Atendimento garantido em todo território nacional, independente da abrangência.",
      "**Remoção**: Cobertura de remoção para hospital da rede em caso de urgência fora da área.",
    ],
  },
  {
    id: "pf",
    title: "Regras Pessoa Física (PF)",
    icon: "👤",
    content: [
      "**Produtos disponíveis**: NotreLife, Nosso Médico PF, Basic Referência.",
      "**Carência padrão**: 24h urgência/emergência, 30 dias consultas, 180 dias demais procedimentos.",
      "**Carência reduzida**: Disponível para portabilidade de carências.",
      "**Documentação**: RG, CPF, comprovante de residência, CNS.",
      "**Dependentes**: Cônjuge, filhos até 24 anos (estudantes), pais (se dependentes financeiros).",
    ],
  },
  {
    id: "pme",
    title: "Regras PME (30-99 vidas)",
    icon: "🏢",
    content: [
      "**Compulsório**: Contratação obrigatória para percentual mínimo de funcionários CLT.",
      "**Adesão**: Contratação voluntária, aceita sócios e prestadores de serviço.",
      "**Mínimo de vidas**: 30 beneficiários para enquadramento PME.",
      "**E-social**: Obrigatório para modalidade Compulsória. GFIP atualizada.",
      "**Carência**: Pode ser isenta para grupos acima de 30 vidas com 100% de adesão.",
      "**Reajuste**: Anual, baseado no sinistro do grupo + VCMH.",
    ],
  },
  {
    id: "supersimples",
    title: "Regras Super Simples (1-29 vidas)",
    icon: "📋",
    content: [
      "**1 Vida**: Empresário individual ou MEI. Sem exigência de funcionários.",
      "**2-29 vidas MEI**: Exclusivo para natureza jurídica 213-5. Tabela diferenciada.",
      "**2-29 vidas Demais**: ME, LTDA, S/A e outras naturezas jurídicas.",
      "**Composição**: Pode incluir sócios, funcionários e dependentes.",
      "**Carência**: Padrão ANS. Redução disponível para portabilidade.",
      "**Documentação MEI**: CCMEI obrigatório. Cartão CNPJ atualizado.",
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

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const renderContent = (content: string) => {
    // Renderizar texto com negrito
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

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="p-4 pb-0">
        <Text className="text-2xl font-bold text-foreground mb-1">
          Regras Comerciais
        </Text>
        <Text className="text-sm text-muted mb-4">
          Consulte as regras e políticas dos produtos Hapvida
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {RULES.map((section) => (
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
                  <Text className="text-base font-semibold text-foreground flex-1">
                    {section.title}
                  </Text>
                </View>
                <Text className="text-muted text-lg">
                  {expandedSection === section.id ? "▼" : "›"}
                </Text>
              </View>
            </TouchableOpacity>

            {expandedSection === section.id && (
              <View className="bg-surface/50 rounded-b-xl border-x border-b border-border p-4 -mt-2">
                {section.content.map((item, index) => (
                  <View key={index} className="mb-3 last:mb-0">
                    {renderContent(item)}
                  </View>
                ))}
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
