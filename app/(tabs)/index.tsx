import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSimulation } from "@/contexts/SimulationContext";
import { CITIES } from "@/data/hapvida-prices";
import { useColors } from "@/hooks/use-colors";
import { useUser } from "@/contexts/UserContext";

export default function HomeScreen() {
  const router = useRouter();
  const { dispatch } = useSimulation();
  const colors = useColors();
  const { isRegistered } = useUser();
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [loading] = useState(false);

  // Redirecionar para cadastro se não registrado
  useEffect(() => {
    if (!isRegistered) {
      router.replace("/register" as any);
    }
  }, [isRegistered]);

  const handleCitySelect = (cityId: string) => {
    dispatch({ type: "SET_CITY", payload: cityId as any });
    router.push("/contract-type" as any);
  };

  const toggleExpand = (cityId: string) => {
    setExpandedCity(expandedCity === cityId ? null : cityId);
  };

  if (loading) return null;

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/assets/images/icon.96ff965fc2f200e0a4d0f6b3836a1ca7.png")}
            style={styles.logoSmall}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.foreground }]}>
            Simula Saúde
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Tabelas de Planos de Saúde
          </Text>
        </View>

        {/* Instrução */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary, marginBottom: 6 }}>
            Como funciona?
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 20 }}>
            1. Selecione a filial de tabela{"\n"}
            2. Escolha o tipo de contrato{"\n"}
            3. Defina o tipo de coparticipação{"\n"}
            4. Informe a quantidade de vidas por faixa etária{"\n"}
            5. Compare os valores entre os produtos
          </Text>
        </View>

        {/* Quiz Card */}
        <TouchableOpacity
          onPress={() => router.push("/table-quiz" as any)}
          activeOpacity={0.85}
          style={[styles.quizCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>🤔</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
                Não sabe qual tabela usar?
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 3 }}>
                Responda algumas perguntas e descubra a tabela ideal para seu cliente
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: colors.muted }}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Título Filiais */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Selecione a Filial de Tabela
        </Text>

        {/* Filiais */}
        <View style={{ gap: 10 }}>
          {CITIES.map((city) => (
            <View key={city.id}>
              <TouchableOpacity
                onPress={() => toggleExpand(city.id)}
                activeOpacity={0.8}
                style={[
                  styles.cityCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: expandedCity === city.id ? colors.primary : colors.border,
                    borderWidth: expandedCity === city.id ? 2 : 1,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={[styles.cityIcon, { backgroundColor: `${colors.primary}15` }]}>
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
                <View style={[styles.expandedArea, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary, marginBottom: 8 }}>
                    Cidades para comercializar:
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {city.commercializationArea.map((area, idx) => (
                      <View key={idx} style={[styles.areaTag, { backgroundColor: `${colors.primary}15` }]}>
                        <Text style={{ fontSize: 11, color: colors.primary }}>{area}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleCitySelect(city.id)}
                    activeOpacity={0.85}
                    style={[styles.selectButton, { backgroundColor: colors.primary }]}
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

        {/* Footer */}
        <View style={[styles.infoFooter, { backgroundColor: colors.surface }]}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
            Tabelas Atualizadas
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
            Vigência: 10/02/2026 a 31/03/2026
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
            Valores vigentes conforme tabelas oficiais Hapvida NDI
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={{ fontSize: 11, color: colors.muted }}>
            SimulaSaúde v2.0.5 • Build 20260211
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formHeader: {
    alignItems: "center",
    paddingTop: 24,
    marginBottom: 12,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 10,
    borderRadius: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 20,
  },
  logoSmall: {
    width: 56,
    height: 56,
    marginBottom: 10,
    borderRadius: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  quizCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
  },
  infoFooter: {
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
  },
});
