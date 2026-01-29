import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSimulation } from "@/contexts/SimulationContext";
import {
  COPARTICIPATION_TYPES,
  CITIES,
  CONTRACT_TYPES,
  CoparticipationType,
} from "@/data/hapvida-prices";

// Documentações por tipo de contrato
const DOCUMENTATIONS: Record<string, { cnpj: string[]; vidas: string[] }> = {
  "super-simples-1-vida": {
    cnpj: [
      "Contrato Social ou Requerimento de Empresário",
      "Cartão CNPJ atualizado",
      "Comprovante de endereço da empresa",
    ],
    vidas: [
      "RG e CPF do titular",
      "Comprovante de residência",
      "Cartão Nacional de Saúde (CNS)",
    ],
  },
  "super-simples-2-29-mei": {
    cnpj: [
      "Certificado de Condição de MEI (CCMEI)",
      "Cartão CNPJ atualizado",
      "Comprovante de endereço da empresa",
    ],
    vidas: [
      "RG e CPF de todos os beneficiários",
      "Comprovante de residência",
      "Cartão Nacional de Saúde (CNS)",
      "Declaração de vínculo (para dependentes)",
    ],
  },
  "super-simples-2-29-demais": {
    cnpj: [
      "Contrato Social atualizado",
      "Cartão CNPJ atualizado",
      "Comprovante de endereço da empresa",
      "Última alteração contratual (se houver)",
    ],
    vidas: [
      "RG e CPF de todos os beneficiários",
      "Comprovante de residência",
      "Cartão Nacional de Saúde (CNS)",
      "Comprovante de vínculo (CTPS, contrato, pró-labore)",
    ],
  },
  "pme-30-99-compulsorio": {
    cnpj: [
      "Contrato Social atualizado",
      "Cartão CNPJ atualizado",
      "Comprovante de endereço da empresa",
      "Última alteração contratual",
      "E-social atualizado (GFIP/eSocial)",
      "Relação de funcionários com CPF",
    ],
    vidas: [
      "RG e CPF de todos os beneficiários",
      "Comprovante de residência",
      "Cartão Nacional de Saúde (CNS)",
      "CTPS ou contrato de trabalho",
      "Certidão de casamento/nascimento (dependentes)",
    ],
  },
  "pme-30-99-adesao": {
    cnpj: [
      "Contrato Social atualizado",
      "Cartão CNPJ atualizado",
      "Comprovante de endereço da empresa",
      "Última alteração contratual",
      "Relação de funcionários interessados",
    ],
    vidas: [
      "RG e CPF de todos os beneficiários",
      "Comprovante de residência",
      "Cartão Nacional de Saúde (CNS)",
      "Comprovante de vínculo (CTPS, contrato, pró-labore)",
      "Declaração de adesão assinada",
      "Certidão de casamento/nascimento (dependentes)",
    ],
  },
};

export default function CoparticipationScreen() {
  const router = useRouter();
  const { state, dispatch } = useSimulation();
  const [showDocs, setShowDocs] = useState(false);

  const selectedCity = CITIES.find((c) => c.id === state.city);
  const selectedContract = CONTRACT_TYPES.find((c) => c.id === state.contractType);
  const docs = state.contractType ? DOCUMENTATIONS[state.contractType] : null;

  const handleSelect = (coparticipation: CoparticipationType) => {
    dispatch({ type: "SET_COPARTICIPATION", payload: coparticipation });
    router.push("/simulation" as any);
  };

  const handleBack = () => {
    dispatch({ type: "GO_TO_STEP", payload: "contract" });
    router.back();
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <TouchableOpacity onPress={handleBack} className="mb-4">
          <Text className="text-primary text-base">← Voltar</Text>
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            Tipo de Coparticipação
          </Text>
          <View className="flex-row flex-wrap items-center mt-2 gap-2">
            {selectedCity && (
              <View className="bg-surface px-2 py-1 rounded border border-border">
                <Text className="text-sm text-muted">📍 {selectedCity.name}</Text>
              </View>
            )}
            {selectedContract && (
              <View className="bg-surface px-2 py-1 rounded border border-border">
                <Text className="text-sm text-muted">📋 {selectedContract.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Opções de Coparticipação */}
        <View className="gap-4">
          {COPARTICIPATION_TYPES.map((copart) => (
            <TouchableOpacity
              key={copart.id}
              onPress={() => handleSelect(copart.id)}
              className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
              style={{ opacity: 1 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-semibold text-foreground mb-1">
                    {copart.name}
                  </Text>
                  <Text className="text-sm text-muted">
                    {copart.description}
                  </Text>
                </View>
                <Text className="text-xl text-muted">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Documentações */}
        {docs && (
          <View className="mt-6">
            <TouchableOpacity
              onPress={() => setShowDocs(!showDocs)}
              className="bg-warning/10 rounded-xl p-4 border border-warning/30 flex-row items-center justify-between"
              style={{ opacity: 1 }}
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">📄</Text>
                <View>
                  <Text className="text-base font-semibold text-warning">
                    Documentações Necessárias
                  </Text>
                  <Text className="text-xs text-muted">
                    Toque para ver os documentos exigidos
                  </Text>
                </View>
              </View>
              <Text className="text-warning text-lg">
                {showDocs ? "▼" : "›"}
              </Text>
            </TouchableOpacity>

            {showDocs && (
              <View className="mt-3 gap-3">
                {/* Documentos do CNPJ */}
                <View className="bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    📋 Documentação do CNPJ
                  </Text>
                  {docs.cnpj.map((doc, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <Text className="text-primary mr-2">•</Text>
                      <Text className="text-sm text-muted flex-1">{doc}</Text>
                    </View>
                  ))}
                </View>

                {/* Documentos das Vidas */}
                <View className="bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-sm font-semibold text-foreground mb-3">
                    👥 Documentação das Vidas
                  </Text>
                  {docs.vidas.map((doc, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <Text className="text-primary mr-2">•</Text>
                      <Text className="text-sm text-muted flex-1">{doc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Explicação Coparticipação */}
        <View className="mt-6 gap-4">
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Coparticipação Parcial
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              • Consultas Eletivas: Sem coparticipação{"\n"}
              • Consultas de Urgência: Sem coparticipação{"\n"}
              • Exames: Sem coparticipação{"\n"}
              • Terapias Especiais: Valor fixo R$ 70,00{"\n"}
              • Demais Terapias: 40% limitado a R$ 60,00{"\n"}
              • Internações: Sem coparticipação
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Coparticipação Total
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              • Consultas Eletivas: 30% limitado a R$ 30,00{"\n"}
              • Consultas de Urgência: 40% limitado a R$ 80,00{"\n"}
              • Exames Simples: 30% limitado a R$ 20,00{"\n"}
              • Exames Complexos: 30% limitado a R$ 100,00{"\n"}
              • Terapias Especiais: Valor fixo R$ 70,00{"\n"}
              • Demais Terapias: 40% limitado a R$ 60,00{"\n"}
              • Internações: R$ 180,00 a R$ 320,00
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
