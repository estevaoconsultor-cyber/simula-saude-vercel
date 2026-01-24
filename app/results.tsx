import { FlatList, Text, View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSimulation } from "@/contexts/SimulationContext";
import { HealthPlan, AGE_RANGES, PLAN_TYPES, COVERAGE_TYPES, ACCOMMODATION_TYPES } from "@/data/plans";

export default function ResultsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { state, dispatch } = useSimulation();

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleSelectPlan = (plan: HealthPlan & { calculatedPrice: number }) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch({ type: 'SET_SELECTED_PLAN', payload: plan });
    router.push("/plan-details" as any);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'popular':
        return { backgroundColor: colors.primary + '20', color: colors.primary, label: 'Mais Popular' };
      case 'best-value':
        return { backgroundColor: colors.success + '20', color: colors.success, label: 'Melhor Custo-Benefício' };
      case 'premium':
        return { backgroundColor: '#AF52DE20', color: '#AF52DE', label: 'Premium' };
      default:
        return null;
    }
  };

  const selectedAge = AGE_RANGES.find(a => a.id === state.ageRange);
  const selectedPlanType = PLAN_TYPES.find(p => p.id === state.planType);
  const selectedCoverage = COVERAGE_TYPES.find(c => c.id === state.coverage);

  const renderPlanCard = ({ item }: { item: HealthPlan & { calculatedPrice: number } }) => {
    const badgeStyle = getBadgeStyle(item.badge);
    
    return (
      <TouchableOpacity
        onPress={() => handleSelectPlan(item)}
        activeOpacity={0.7}
        style={[styles.planCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {badgeStyle && (
          <View 
            style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}
          >
            <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
              {badgeStyle.label}
            </Text>
          </View>
        )}
        
        <View className="flex-row items-center mb-3">
          <Text className="text-3xl mr-3">{item.operatorLogo}</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {item.name}
            </Text>
            <Text className="text-sm text-muted">
              {item.operator}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-muted">a partir de</Text>
            <Text className="text-xl font-bold" style={{ color: colors.primary }}>
              {formatCurrency(item.calculatedPrice)}
            </Text>
            <Text className="text-xs text-muted">/mês</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-3">
          <View style={[styles.tag, { backgroundColor: colors.background }]}>
            <Text className="text-xs text-muted">
              {item.coverage === 'completo' ? 'Completo' : item.coverage === 'ambulatorial' ? 'Ambulatorial' : 'Hospitalar'}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.background }]}>
            <Text className="text-xs text-muted">
              {item.accommodation === 'apartamento' ? 'Apartamento' : 'Enfermaria'}
            </Text>
          </View>
          {item.hasCoparticipation && (
            <View style={[styles.tag, { backgroundColor: colors.warning + '20' }]}>
              <Text className="text-xs" style={{ color: colors.warning }}>
                Coparticipação
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-muted">Avaliação: </Text>
            <Text className="text-sm font-medium text-foreground">
              ⭐ {item.rating.toFixed(1)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm text-primary font-medium">Ver detalhes</Text>
            <Text className="text-primary ml-1">›</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View className="px-4 pt-2 pb-4 border-b border-border">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <Text className="text-lg">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground ml-3">
            Resultados
          </Text>
        </View>
        
        {/* Resumo dos critérios */}
        <View className="bg-surface rounded-lg p-3">
          <Text className="text-xs text-muted">
            {selectedAge?.label} • {selectedPlanType?.label} • {selectedCoverage?.label}
            {state.hasCoparticipation ? ' • Com coparticipação' : ''}
          </Text>
        </View>
      </View>

      {/* Lista de Planos */}
      <FlatList
        data={state.results}
        renderItem={renderPlanCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="text-sm text-muted mb-3">
            {state.results.length} planos encontrados
          </Text>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-muted text-center">
              Nenhum plano encontrado para os critérios selecionados.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  planCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
