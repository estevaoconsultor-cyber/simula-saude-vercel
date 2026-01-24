import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();

  const handleSimulate = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.navigate("/simulator" as any);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-5xl mb-2">🏥</Text>
          <Text className="text-3xl font-bold text-foreground text-center">
            Simulador de Planos
          </Text>
          <Text className="text-base text-muted text-center mt-2">
            Compare e encontre o plano de saúde ideal para você
          </Text>
        </View>

        {/* Card de Boas-vindas */}
        <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-2">
            Bem-vindo ao Simulador
          </Text>
          <Text className="text-sm text-muted leading-relaxed">
            Encontre o plano de saúde perfeito para suas necessidades. 
            Compare valores, coberturas e benefícios de diferentes operadoras 
            em poucos cliques.
          </Text>
        </View>

        {/* Botão CTA */}
        <TouchableOpacity
          onPress={handleSimulate}
          activeOpacity={0.8}
          style={[styles.ctaButton, { backgroundColor: colors.primary }]}
        >
          <Text className="text-white text-lg font-semibold">
            Simular Agora
          </Text>
        </TouchableOpacity>

        {/* Cards Informativos */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Como funciona
          </Text>

          <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
            <View className="flex-row items-center mb-2">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Text className="text-base font-bold" style={{ color: colors.primary }}>1</Text>
              </View>
              <Text className="text-base font-medium text-foreground flex-1">
                Informe seus dados
              </Text>
            </View>
            <Text className="text-sm text-muted ml-11">
              Selecione sua faixa etária, tipo de plano e cobertura desejada.
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
            <View className="flex-row items-center mb-2">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Text className="text-base font-bold" style={{ color: colors.primary }}>2</Text>
              </View>
              <Text className="text-base font-medium text-foreground flex-1">
                Compare opções
              </Text>
            </View>
            <Text className="text-sm text-muted ml-11">
              Visualize diferentes planos com valores calculados para seu perfil.
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
            <View className="flex-row items-center mb-2">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Text className="text-base font-bold" style={{ color: colors.primary }}>3</Text>
              </View>
              <Text className="text-base font-medium text-foreground flex-1">
                Escolha o melhor
              </Text>
            </View>
            <Text className="text-sm text-muted ml-11">
              Analise detalhes de cada plano e encontre o ideal para você.
            </Text>
          </View>
        </View>

        {/* Dica */}
        <View 
          className="mt-4 p-4 rounded-xl"
          style={{ backgroundColor: colors.warning + '15' }}
        >
          <Text className="text-sm font-medium mb-1" style={{ color: colors.warning }}>
            💡 Dica
          </Text>
          <Text className="text-sm text-muted">
            Planos com coparticipação costumam ter mensalidades menores, 
            mas você paga uma parte dos procedimentos quando utilizá-los.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  ctaButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
