import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSimulation } from "@/contexts/SimulationContext";
import { CITIES } from "@/data/hapvida-prices";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const { dispatch } = useSimulation();
  const colors = useColors();

  const handleCitySelect = (cityId: string) => {
    dispatch({ type: "SET_CITY", payload: cityId as any });
    router.push("/contract-type" as any);
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-3">
            <Text className="text-4xl">🏥</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground text-center">
            Simulador Hapvida
          </Text>
          <Text className="text-base text-muted text-center mt-1">
            Tabelas de Planos de Saúde
          </Text>
        </View>

        {/* Instrução */}
        <View className="bg-surface rounded-xl p-4 mb-6 border border-border">
          <Text className="text-base font-semibold text-foreground mb-2">
            Como funciona?
          </Text>
          <Text className="text-sm text-muted leading-relaxed">
            1. Selecione a cidade de atendimento{"\n"}
            2. Escolha o tipo de contrato{"\n"}
            3. Defina o tipo de coparticipação{"\n"}
            4. Informe a quantidade de vidas por faixa etária{"\n"}
            5. Compare os valores entre os produtos
          </Text>
        </View>

        {/* Seleção de Cidade */}
        <Text className="text-lg font-bold text-foreground mb-3">
          Selecione a Cidade
        </Text>
        
        <View className="gap-2">
          {CITIES.map((city) => (
            <TouchableOpacity
              key={city.id}
              onPress={() => handleCitySelect(city.id)}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between active:opacity-70"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                  <Text className="text-lg">📍</Text>
                </View>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    {city.name}
                  </Text>
                  <Text className="text-sm text-muted">{city.state}</Text>
                </View>
              </View>
              <Text className="text-xl text-muted">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Card */}
        <View className="bg-primary/10 rounded-xl p-4 mt-6">
          <Text className="text-sm font-semibold text-primary mb-1">
            Tabelas Atualizadas
          </Text>
          <Text className="text-xs text-muted">
            Valores válidos para contratos assinados de 23/01/2026 a 31/03/2026.
            Super Simples e PME disponíveis.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
