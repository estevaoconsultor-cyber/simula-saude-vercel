import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSimulation } from "@/contexts/SimulationContext";
import { CITIES } from "@/data/hapvida-prices";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const { dispatch } = useSimulation();
  const colors = useColors();
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  const handleCitySelect = (cityId: string) => {
    dispatch({ type: "SET_CITY", payload: cityId as any });
    router.push("/contract-type" as any);
  };

  const toggleExpand = (cityId: string) => {
    setExpandedCity(expandedCity === cityId ? null : cityId);
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
            1. Selecione a filial de tabela{"\n"}
            2. Escolha o tipo de contrato{"\n"}
            3. Defina o tipo de coparticipação{"\n"}
            4. Informe a quantidade de vidas por faixa etária{"\n"}
            5. Compare os valores entre os produtos
          </Text>
        </View>

        {/* Seleção de Filial */}
        <Text className="text-lg font-bold text-foreground mb-3">
          Selecione a Filial de Tabela
        </Text>
        
        <View className="gap-2">
          {CITIES.map((city) => (
            <View key={city.id}>
              <TouchableOpacity
                onPress={() => toggleExpand(city.id)}
                className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
                style={{ opacity: 1 }}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                    <Text className="text-lg">📍</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {city.name}
                    </Text>
                    <Text className="text-xs text-muted mt-1" numberOfLines={1}>
                      {city.commercializationArea.slice(0, 3).join(", ")}
                      {city.commercializationArea.length > 3 && "..."}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl text-muted">
                  {expandedCity === city.id ? "▼" : "›"}
                </Text>
              </TouchableOpacity>

              {/* Área de Comercialização Expandida */}
              {expandedCity === city.id && (
                <View className="bg-surface/50 rounded-b-xl border-x border-b border-border p-4 -mt-2">
                  <Text className="text-xs font-medium text-primary mb-2">
                    Cidades para comercializar:
                  </Text>
                  <View className="flex-row flex-wrap gap-1 mb-4">
                    {city.commercializationArea.map((area, idx) => (
                      <View 
                        key={idx} 
                        className="bg-primary/10 px-2 py-1 rounded"
                      >
                        <Text className="text-xs text-primary">{area}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleCitySelect(city.id)}
                    className="bg-primary py-3 rounded-lg items-center"
                    style={{ opacity: 1 }}
                  >
                    <Text className="text-white font-semibold">
                      Usar esta Filial →
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Quiz Card */}
        <TouchableOpacity
          onPress={() => router.push("/table-quiz" as any)}
          className="bg-warning/10 rounded-xl p-4 mt-6 border border-warning/30"
          style={{ opacity: 1 }}
        >
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">🤔</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-warning">
                Não sabe qual tabela usar?
              </Text>
              <Text className="text-xs text-muted mt-1">
                Responda algumas perguntas e descubra a tabela ideal para seu cliente
              </Text>
            </View>
            <Text className="text-warning text-lg">›</Text>
          </View>
        </TouchableOpacity>

        {/* Info Card */}
        <View className="bg-primary/10 rounded-xl p-4 mt-4">
          <Text className="text-sm font-semibold text-primary mb-1">
            Tabelas Atualizadas
          </Text>
          <Text className="text-xs text-muted">
            Valores válidos para contratos assinados a partir de 01/02/2026.
            Super Simples e PME disponíveis.
          </Text>
        </View>

        {/* Versão do App */}
        <View className="mt-6 items-center">
          <Text className="text-xs text-muted/50">
            SimulaSaúde v2.0.2 • Build 20260202
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
