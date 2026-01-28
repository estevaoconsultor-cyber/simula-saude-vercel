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

export default function CoparticipationScreen() {
  const router = useRouter();
  const { state, dispatch } = useSimulation();

  const selectedCity = CITIES.find((c) => c.id === state.city);
  const selectedContract = CONTRACT_TYPES.find((c) => c.id === state.contractType);

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

        {/* Explicação */}
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
