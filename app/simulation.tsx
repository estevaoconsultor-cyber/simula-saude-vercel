import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSimulation } from "@/contexts/SimulationContext";
import {
  CITIES,
  CONTRACT_TYPES,
  COPARTICIPATION_TYPES,
  AGE_RANGES,
  AGE_RANGE_LABELS,
  AgeRange,
  getProductPrice,
} from "@/data/hapvida-prices";
import { useColors } from "@/hooks/use-colors";

export default function SimulationScreen() {
  const router = useRouter();
  const colors = useColors();
  const {
    state,
    dispatch,
    totalLives,
    availableProducts,
    getProductTotal,
    getAllProductTotals,
  } = useSimulation();

  const [showProducts, setShowProducts] = useState(false);

  const selectedCity = CITIES.find((c) => c.id === state.city);
  const selectedContract = CONTRACT_TYPES.find((c) => c.id === state.contractType);
  const selectedCopart = COPARTICIPATION_TYPES.find(
    (c) => c.id === state.coparticipation
  );

  const handleBack = () => {
    dispatch({ type: "GO_TO_STEP", payload: "coparticipation" });
    router.back();
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    router.replace("/" as any);
  };

  const handleLivesChange = (ageRange: AgeRange, value: string) => {
    const count = parseInt(value) || 0;
    dispatch({ type: "SET_LIVES", payload: { ageRange, count } });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const productTotals = getAllProductTotals();

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="p-4 pb-0">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={handleBack}>
              <Text className="text-primary text-base">← Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReset}>
              <Text className="text-error text-sm">Nova Simulação</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold text-foreground mb-2">
            Simulação de Valores
          </Text>

          {/* Resumo das seleções */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {selectedCity && (
              <View className="bg-primary/10 px-2 py-1 rounded">
                <Text className="text-xs text-primary">📍 {selectedCity.name}</Text>
              </View>
            )}
            {selectedContract && (
              <View className="bg-primary/10 px-2 py-1 rounded">
                <Text className="text-xs text-primary">
                  📋 {selectedContract.name}
                </Text>
              </View>
            )}
            {selectedCopart && (
              <View className="bg-primary/10 px-2 py-1 rounded">
                <Text className="text-xs text-primary">
                  💳 {selectedCopart.name}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Distribuição de Vidas */}
        <View className="px-4 mb-4">
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            <View className="bg-primary/10 p-3 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-foreground">
                Distribuição de Vidas
              </Text>
              <View className="bg-primary px-2 py-1 rounded">
                <Text className="text-xs text-white font-bold">
                  Total: {totalLives} {totalLives === 1 ? "vida" : "vidas"}
                </Text>
              </View>
            </View>

            <View className="p-3">
              {AGE_RANGES.map((ageRange) => (
                <View
                  key={ageRange}
                  className="flex-row items-center justify-between py-2 border-b border-border last:border-b-0"
                >
                  <Text className="text-sm text-foreground flex-1">
                    {AGE_RANGE_LABELS[ageRange]}
                  </Text>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() =>
                        handleLivesChange(
                          ageRange,
                          String(Math.max(0, state.lives[ageRange] - 1))
                        )
                      }
                      className="w-8 h-8 bg-surface border border-border rounded items-center justify-center"
                    >
                      <Text className="text-lg text-foreground">-</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={String(state.lives[ageRange])}
                      onChangeText={(v) => handleLivesChange(ageRange, v)}
                      keyboardType="numeric"
                      className="w-12 h-8 text-center text-foreground mx-2 bg-background border border-border rounded"
                      style={{ color: colors.foreground }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        handleLivesChange(
                          ageRange,
                          String(state.lives[ageRange] + 1)
                        )
                      }
                      className="w-8 h-8 bg-primary rounded items-center justify-center"
                    >
                      <Text className="text-lg text-white">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Seleção de Produtos */}
        <View className="px-4 mb-4">
          <TouchableOpacity
            onPress={() => setShowProducts(!showProducts)}
            className="bg-surface rounded-xl border border-border p-3 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-base font-semibold text-foreground">
                Produtos para Comparar
              </Text>
              <Text className="text-sm text-muted">
                {state.selectedProducts.length} de {availableProducts.length}{" "}
                selecionados
              </Text>
            </View>
            <Text className="text-xl text-muted">
              {showProducts ? "▼" : "▶"}
            </Text>
          </TouchableOpacity>

          {showProducts && (
            <View className="bg-surface rounded-xl border border-border mt-2 p-3">
              <View className="flex-row justify-between mb-3">
                <TouchableOpacity
                  onPress={() => dispatch({ type: "SELECT_ALL_PRODUCTS" })}
                  className="bg-primary/10 px-3 py-1 rounded"
                >
                  <Text className="text-xs text-primary font-medium">
                    Selecionar Todos
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch({ type: "CLEAR_PRODUCTS" })}
                  className="bg-error/10 px-3 py-1 rounded"
                >
                  <Text className="text-xs text-error font-medium">Limpar</Text>
                </TouchableOpacity>
              </View>

              {availableProducts.map((product) => {
                const isSelected = state.selectedProducts.includes(product.id);
                return (
                  <TouchableOpacity
                    key={product.id}
                    onPress={() =>
                      dispatch({ type: "TOGGLE_PRODUCT", payload: product.id })
                    }
                    className={`flex-row items-center p-2 rounded mb-1 ${
                      isSelected ? "bg-primary/10" : "bg-background"
                    }`}
                  >
                    <View
                      className={`w-5 h-5 rounded border mr-2 items-center justify-center ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <Text className="text-white text-xs">✓</Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`text-sm ${
                          isSelected
                            ? "text-primary font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {product.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {product.segmentation} • {product.accommodation}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Resultados da Simulação */}
        {totalLives > 0 && state.selectedProducts.length > 0 && (
          <View className="px-4">
            <Text className="text-lg font-bold text-foreground mb-3">
              Comparativo de Valores
            </Text>

            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              {/* Header da tabela */}
              <View className="bg-primary/10 p-3 flex-row">
                <Text className="flex-1 text-sm font-semibold text-foreground">
                  Produto
                </Text>
                <Text className="w-28 text-sm font-semibold text-foreground text-right">
                  Valor Mensal
                </Text>
              </View>

              {/* Linhas */}
              {productTotals.map(({ product, total }, index) => (
                <View
                  key={product.id}
                  className={`p-3 flex-row items-center ${
                    index === 0 ? "bg-success/10" : ""
                  } ${
                    index < productTotals.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-medium ${
                        index === 0 ? "text-success" : "text-foreground"
                      }`}
                    >
                      {product.name}
                      {index === 0 && " 🏆"}
                    </Text>
                    <Text className="text-xs text-muted">
                      {product.accommodation === "APART"
                        ? "Apartamento"
                        : "Enfermaria"}
                    </Text>
                  </View>
                  <Text
                    className={`w-28 text-base font-bold text-right ${
                      index === 0 ? "text-success" : "text-foreground"
                    }`}
                  >
                    {formatCurrency(total)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Detalhamento por faixa */}
            {productTotals.length > 0 && (
              <View className="mt-4">
                <Text className="text-base font-semibold text-foreground mb-2">
                  Detalhamento - {productTotals[0].product.name}
                </Text>
                <View className="bg-surface rounded-xl border border-border p-3">
                  {AGE_RANGES.filter((ar) => state.lives[ar] > 0).map((ageRange) => {
                    const price = getProductPrice(
                      state.city!,
                      state.contractType!,
                      state.coparticipation!,
                      productTotals[0].product.id,
                      ageRange
                    );
                    const subtotal = (price || 0) * state.lives[ageRange];
                    return (
                      <View
                        key={ageRange}
                        className="flex-row items-center justify-between py-2 border-b border-border last:border-b-0"
                      >
                        <View className="flex-1">
                          <Text className="text-sm text-foreground">
                            {AGE_RANGE_LABELS[ageRange]}
                          </Text>
                          <Text className="text-xs text-muted">
                            {state.lives[ageRange]} x {formatCurrency(price || 0)}
                          </Text>
                        </View>
                        <Text className="text-sm font-medium text-foreground">
                          {formatCurrency(subtotal)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Mensagem quando não há dados */}
        {(totalLives === 0 || state.selectedProducts.length === 0) && (
          <View className="px-4">
            <View className="bg-warning/10 rounded-xl p-4">
              <Text className="text-sm text-warning text-center">
                {totalLives === 0
                  ? "Informe a quantidade de vidas por faixa etária para ver os valores."
                  : "Selecione pelo menos um produto para comparar."}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
