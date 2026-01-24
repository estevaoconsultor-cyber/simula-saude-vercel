import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSimulation } from "@/contexts/SimulationContext";

export default function PlanDetailsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { state } = useSimulation();
  const plan = state.selectedPlan;

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleContact = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      'Solicitar Contato',
      'Em breve um consultor entrará em contato com você para mais informações sobre este plano.',
      [{ text: 'OK' }]
    );
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!plan) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Nenhum plano selecionado</Text>
        <TouchableOpacity onPress={handleBack} className="mt-4">
          <Text style={{ color: colors.primary }}>Voltar</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const calculatedPrice = 'calculatedPrice' in plan ? (plan as typeof plan & { calculatedPrice: number }).calculatedPrice : plan.basePrice;

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.backButton, { backgroundColor: colors.surface }]}
            >
              <Text className="text-lg">←</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-foreground ml-3">
              Detalhes do Plano
            </Text>
          </View>
        </View>

        {/* Card Principal */}
        <View className="px-4">
          <View 
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: colors.primary }}
          >
            <View className="flex-row items-center mb-4">
              <Text className="text-5xl mr-4">{plan.operatorLogo}</Text>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">
                  {plan.name}
                </Text>
                <Text className="text-white opacity-80">
                  {plan.operator}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-end">
              <Text className="text-white opacity-80 mr-2">a partir de</Text>
              <Text className="text-white text-3xl font-bold">
                {formatCurrency(calculatedPrice)}
              </Text>
              <Text className="text-white opacity-80 ml-1">/mês</Text>
            </View>

            <View className="flex-row items-center mt-3">
              <Text className="text-white">⭐ {plan.rating.toFixed(1)}</Text>
              <Text className="text-white opacity-60 mx-2">•</Text>
              <Text className="text-white opacity-80">
                {plan.coverage === 'completo' ? 'Cobertura Completa' : 
                 plan.coverage === 'ambulatorial' ? 'Ambulatorial' : 'Hospitalar'}
              </Text>
            </View>
          </View>

          {/* Características */}
          <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
            <Text className="text-base font-semibold text-foreground mb-3">
              Características
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View style={[styles.featureTag, { backgroundColor: colors.background }]}>
                <Text className="text-sm text-foreground">
                  {plan.accommodation === 'apartamento' ? '🏨 Apartamento' : '🛏️ Enfermaria'}
                </Text>
              </View>
              <View style={[styles.featureTag, { backgroundColor: colors.background }]}>
                <Text className="text-sm text-foreground">
                  {plan.planType === 'individual' ? '👤 Individual' : 
                   plan.planType === 'familiar' ? '👨‍👩‍👧 Familiar' : '🏢 Empresarial'}
                </Text>
              </View>
              {plan.hasCoparticipation && (
                <View style={[styles.featureTag, { backgroundColor: colors.warning + '20' }]}>
                  <Text className="text-sm" style={{ color: colors.warning }}>
                    💰 Com Coparticipação
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Benefícios */}
          <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
            <Text className="text-base font-semibold text-foreground mb-3">
              Benefícios Inclusos
            </Text>
            {plan.benefits.map((benefit, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Text style={{ color: colors.success }}>✓</Text>
                <Text className="text-sm text-foreground ml-2">{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Carências */}
          <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
            <Text className="text-base font-semibold text-foreground mb-3">
              Carências
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Urgência/Emergência</Text>
                <Text className="text-sm font-medium text-foreground">
                  {plan.waitingPeriods.urgency}h
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Consultas</Text>
                <Text className="text-sm font-medium text-foreground">
                  {plan.waitingPeriods.consultations > 0 ? `${plan.waitingPeriods.consultations} dias` : 'N/A'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Exames</Text>
                <Text className="text-sm font-medium text-foreground">
                  {plan.waitingPeriods.exams > 0 ? `${plan.waitingPeriods.exams} dias` : 'N/A'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Internação</Text>
                <Text className="text-sm font-medium text-foreground">
                  {plan.waitingPeriods.hospitalization > 0 ? `${plan.waitingPeriods.hospitalization} dias` : 'N/A'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Cirurgias</Text>
                <Text className="text-sm font-medium text-foreground">
                  {plan.waitingPeriods.surgeries > 0 ? `${plan.waitingPeriods.surgeries} dias` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Aviso */}
          <View 
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: colors.warning + '15' }}
          >
            <Text className="text-sm font-medium mb-1" style={{ color: colors.warning }}>
              ⚠️ Importante
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              Os valores apresentados são estimativas baseadas nos critérios informados. 
              O valor final pode variar de acordo com análise de perfil e região de atendimento. 
              Entre em contato para uma cotação personalizada.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão Fixo */}
      <View 
        className="px-4 py-4 border-t border-border"
        style={{ backgroundColor: colors.background }}
      >
        <TouchableOpacity
          onPress={handleContact}
          activeOpacity={0.8}
          style={[styles.contactButton, { backgroundColor: colors.primary }]}
        >
          <Text className="text-white text-lg font-semibold">
            Solicitar Contato
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  contactButton: {
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
