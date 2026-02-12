import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSimulation } from "@/contexts/SimulationContext";
import { CITIES } from "@/data/hapvida-prices";
import { useColors } from "@/hooks/use-colors";

export default function SimulatorHomeScreen() {
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
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <Text style={{ fontSize: 18, color: colors.foreground }}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Selecione a Filial
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Escolha a filial de tabela para iniciar a simulação
          </Text>
        </View>

        {/* Instrução */}
        <View style={[styles.infoCard, { backgroundColor: "#FFF7ED", borderColor: "#FFEDD5" }]}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#EA580C", marginBottom: 6 }}>
            Como funciona?
          </Text>
          <Text style={{ fontSize: 13, color: "#9A3412", lineHeight: 20 }}>
            1. Selecione a filial de tabela{"\n"}
            2. Escolha o tipo de contrato{"\n"}
            3. Defina o tipo de coparticipação{"\n"}
            4. Informe a quantidade de vidas por faixa etária{"\n"}
            5. Compare os valores entre os produtos
          </Text>
        </View>

        {/* Filiais */}
        <View style={{ gap: 10, marginTop: 20 }}>
          {CITIES.map((city) => (
            <View key={city.id}>
              <TouchableOpacity
                onPress={() => toggleExpand(city.id)}
                activeOpacity={0.8}
                style={[
                  styles.cityCard,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: expandedCity === city.id ? "#FF6B00" : colors.border,
                    borderWidth: expandedCity === city.id ? 2 : 1,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={styles.cityIcon}>
                    <Text style={{ fontSize: 18 }}>📍</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cityName, { color: colors.foreground }]}>
                      {city.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }} numberOfLines={1}>
                      {city.commercializationArea.slice(0, 3).join(", ")}
                      {city.commercializationArea.length > 3 && "..."}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 20, color: colors.muted }}>
                  {expandedCity === city.id ? "▼" : "›"}
                </Text>
              </TouchableOpacity>

              {expandedCity === city.id && (
                <View style={[styles.expandedArea, { backgroundColor: colors.surface, borderColor: "#FF6B00" }]}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#FF6B00", marginBottom: 8 }}>
                    Cidades para comercializar:
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {city.commercializationArea.map((area, idx) => (
                      <View key={idx} style={styles.areaTag}>
                        <Text style={{ fontSize: 11, color: "#FF6B00" }}>{area}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleCitySelect(city.id)}
                    activeOpacity={0.85}
                    style={styles.selectButton}
                  >
                    <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15 }}>
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
          activeOpacity={0.85}
          style={styles.quizCard}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>🤔</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#B45309" }}>
                Não sabe qual tabela usar?
              </Text>
              <Text style={{ fontSize: 12, color: "#92400E", marginTop: 3 }}>
                Responda algumas perguntas e descubra a tabela ideal
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: "#B45309" }}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Info */}
        <View style={[styles.infoFooter, { backgroundColor: "#FFF7ED" }]}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#EA580C" }}>
            Tabelas Atualizadas
          </Text>
          <Text style={{ fontSize: 11, color: "#9A3412", marginTop: 4 }}>
            Valores válidos para contratos assinados a partir de 10/02/2026.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    marginBottom: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  cityCard: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,107,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cityName: {
    fontSize: 15,
    fontWeight: "700",
  },
  expandedArea: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    padding: 16,
    marginTop: -8,
  },
  areaTag: {
    backgroundColor: "rgba(255,107,0,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  selectButton: {
    backgroundColor: "#FF6B00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  quizCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  infoFooter: {
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
});
