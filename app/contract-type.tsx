import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSimulation } from "@/contexts/SimulationContext";
import { CONTRACT_TYPES, CITIES, ContractType, getAllowedOptions } from "@/data/hapvida-prices";

export default function ContractTypeScreen() {
  const router = useRouter();
  const { state, dispatch } = useSimulation();

  const selectedCity = CITIES.find((c) => c.id === state.city);

  // Filtrar tipos de contrato disponíveis para a cidade selecionada
  const allowedContractTypes = state.city ? getAllowedOptions({ city: state.city }).contractTypes : [];
  const availableTypes = CONTRACT_TYPES.filter((ct) => allowedContractTypes.includes(ct.id));

  const handleSelect = (contractType: ContractType) => {
    dispatch({ type: "SET_CONTRACT_TYPE", payload: contractType });
    router.push("/coparticipation" as any);
  };

  const handleBack = () => {
    dispatch({ type: "GO_TO_STEP", payload: "city" });
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
            Tipo de Contrato
          </Text>
          {selectedCity && (
            <View className="flex-row items-center mt-2">
              <Text className="text-base text-muted">📍 {selectedCity.name}</Text>
            </View>
          )}
        </View>

        {/* Opções de Contrato */}
        <View className="gap-3">
          {availableTypes.map((contract) => (
            <TouchableOpacity
              key={contract.id}
              onPress={() => handleSelect(contract.id)}
              className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-semibold text-foreground mb-1">
                    {contract.name}
                  </Text>
                  <Text className="text-sm text-muted mb-2">
                    {contract.description}
                  </Text>
                  <View className="bg-primary/10 self-start px-2 py-1 rounded">
                    <Text className="text-xs text-primary font-medium">
                      {contract.minLives === contract.maxLives
                        ? `${contract.minLives} vida`
                        : `${contract.minLives} a ${contract.maxLives} vidas`}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl text-muted">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View className="bg-warning/10 rounded-xl p-4 mt-6">
          <Text className="text-sm font-semibold text-warning mb-1">
            Importante
          </Text>
          <Text className="text-xs text-muted">
            A partir de 10/02/2026, novas modalidades de contratação para Super
            Simples (02 a 29 vidas) e PME (30 a 99 vidas) nas filiais São Paulo,
            Jundiaí, São Bernardo do Campo, Santos e Mogi das Cruzes.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
