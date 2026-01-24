import { ScrollView, Text, View, TouchableOpacity, Switch, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSimulation } from "@/contexts/SimulationContext";
import { AGE_RANGES, PLAN_TYPES, COVERAGE_TYPES, ACCOMMODATION_TYPES } from "@/data/plans";

export default function SimulatorScreen() {
  const router = useRouter();
  const colors = useColors();
  const { state, dispatch } = useSimulation();
  const [showAgePicker, setShowAgePicker] = useState(false);

  const handleCalculate = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    dispatch({ type: 'CALCULATE_RESULTS' });
    router.push("/results" as any);
  };

  const selectedAge = AGE_RANGES.find(a => a.id === state.ageRange);

  return (
    <ScreenContainer className="p-4">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            Simular Plano
          </Text>
          <Text className="text-sm text-muted mt-1">
            Preencha os dados para ver os valores
          </Text>
        </View>

        {/* Seção: Faixa Etária */}
        <View className="mb-5">
          <Text className="text-base font-semibold text-foreground mb-3">
            Faixa Etária
          </Text>
          <TouchableOpacity
            onPress={() => setShowAgePicker(!showAgePicker)}
            activeOpacity={0.7}
            style={[styles.pickerButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Text className="text-base text-foreground">
              {selectedAge?.label || 'Selecione'}
            </Text>
            <Text className="text-muted">{showAgePicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          
          {showAgePicker && (
            <View className="bg-surface rounded-xl mt-2 border border-border overflow-hidden">
              {AGE_RANGES.map((age) => (
                <TouchableOpacity
                  key={age.id}
                  onPress={() => {
                    dispatch({ type: 'SET_AGE_RANGE', payload: age.id });
                    setShowAgePicker(false);
                    if (Platform.OS !== "web") {
                      Haptics.selectionAsync();
                    }
                  }}
                  style={[
                    styles.pickerOption,
                    state.ageRange === age.id && { backgroundColor: colors.primary + '15' }
                  ]}
                >
                  <Text 
                    className="text-base"
                    style={{ color: state.ageRange === age.id ? colors.primary : colors.foreground }}
                  >
                    {age.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Seção: Tipo de Plano */}
        <View className="mb-5">
          <Text className="text-base font-semibold text-foreground mb-3">
            Tipo de Plano
          </Text>
          <View className="flex-row bg-surface rounded-xl p-1 border border-border">
            {PLAN_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => {
                  dispatch({ type: 'SET_PLAN_TYPE', payload: type.id });
                  if (Platform.OS !== "web") {
                    Haptics.selectionAsync();
                  }
                }}
                style={[
                  styles.segmentButton,
                  state.planType === type.id && { backgroundColor: colors.primary }
                ]}
              >
                <Text 
                  className="text-sm font-medium"
                  style={{ color: state.planType === type.id ? '#FFFFFF' : colors.muted }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seção: Cobertura */}
        <View className="mb-5">
          <Text className="text-base font-semibold text-foreground mb-3">
            Tipo de Cobertura
          </Text>
          <View className="gap-2">
            {COVERAGE_TYPES.map((coverage) => (
              <TouchableOpacity
                key={coverage.id}
                onPress={() => {
                  dispatch({ type: 'SET_COVERAGE', payload: coverage.id });
                  if (Platform.OS !== "web") {
                    Haptics.selectionAsync();
                  }
                }}
                style={[
                  styles.coverageCard,
                  { 
                    borderColor: state.coverage === coverage.id ? colors.primary : colors.border,
                    backgroundColor: state.coverage === coverage.id ? colors.primary + '10' : colors.surface
                  }
                ]}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text 
                      className="text-base font-medium"
                      style={{ color: state.coverage === coverage.id ? colors.primary : colors.foreground }}
                    >
                      {coverage.label}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {coverage.description}
                    </Text>
                  </View>
                  <View 
                    className="w-6 h-6 rounded-full border-2 items-center justify-center"
                    style={{ borderColor: state.coverage === coverage.id ? colors.primary : colors.border }}
                  >
                    {state.coverage === coverage.id && (
                      <View 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seção: Acomodação */}
        <View className="mb-5">
          <Text className="text-base font-semibold text-foreground mb-3">
            Acomodação
          </Text>
          <View className="flex-row bg-surface rounded-xl p-1 border border-border">
            {ACCOMMODATION_TYPES.map((acc) => (
              <TouchableOpacity
                key={acc.id}
                onPress={() => {
                  dispatch({ type: 'SET_ACCOMMODATION', payload: acc.id });
                  if (Platform.OS !== "web") {
                    Haptics.selectionAsync();
                  }
                }}
                style={[
                  styles.segmentButton,
                  state.accommodation === acc.id && { backgroundColor: colors.primary }
                ]}
              >
                <Text 
                  className="text-sm font-medium"
                  style={{ color: state.accommodation === acc.id ? '#FFFFFF' : colors.muted }}
                >
                  {acc.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seção: Coparticipação */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between bg-surface rounded-xl p-4 border border-border">
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-foreground">
                Coparticipação
              </Text>
              <Text className="text-xs text-muted mt-1">
                Reduz o valor mensal, mas você paga parte dos procedimentos
              </Text>
            </View>
            <Switch
              value={state.hasCoparticipation}
              onValueChange={(value) => {
                dispatch({ type: 'SET_COPARTICIPATION', payload: value });
                if (Platform.OS !== "web") {
                  Haptics.selectionAsync();
                }
              }}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={state.hasCoparticipation ? colors.primary : colors.muted}
            />
          </View>
        </View>

        {/* Botão Ver Valores */}
        <TouchableOpacity
          onPress={handleCalculate}
          activeOpacity={0.8}
          style={[styles.calculateButton, { backgroundColor: colors.primary }]}
        >
          <Text className="text-white text-lg font-semibold">
            Ver Valores
          </Text>
        </TouchableOpacity>

        {/* Resumo */}
        <View className="mt-4 p-4 bg-surface rounded-xl border border-border">
          <Text className="text-sm font-medium text-foreground mb-2">
            Resumo da simulação
          </Text>
          <Text className="text-xs text-muted">
            {selectedAge?.label} • {PLAN_TYPES.find(p => p.id === state.planType)?.label} • {COVERAGE_TYPES.find(c => c.id === state.coverage)?.label} • {ACCOMMODATION_TYPES.find(a => a.id === state.accommodation)?.label}
            {state.hasCoparticipation ? ' • Com coparticipação' : ''}
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
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerOption: {
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  coverageCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  calculateButton: {
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
