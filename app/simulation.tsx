import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
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

type LiveType = "titular" | "dependente";

interface LivesData {
  titular: number;
  dependente: number;
}

export default function SimulationScreen() {
  const router = useRouter();
  const colors = useColors();
  const {
    state,
    dispatch,
    totalLives,
    availableProducts,
    getAllProductTotals,
  } = useSimulation();

  const [showProducts, setShowProducts] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  
  // Estado para titular/dependente por faixa etária
  const [livesByType, setLivesByType] = useState<Record<AgeRange, LivesData>>(
    () => {
      const initial: Record<string, LivesData> = {};
      AGE_RANGES.forEach((ar) => {
        initial[ar] = { titular: 0, dependente: 0 };
      });
      return initial as Record<AgeRange, LivesData>;
    }
  );

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
    setLivesByType(() => {
      const initial: Record<string, LivesData> = {};
      AGE_RANGES.forEach((ar) => {
        initial[ar] = { titular: 0, dependente: 0 };
      });
      return initial as Record<AgeRange, LivesData>;
    });
    router.replace("/" as any);
  };

  const handleLivesChange = (ageRange: AgeRange, type: LiveType, value: string) => {
    const count = Math.max(0, parseInt(value) || 0);
    
    setLivesByType((prev) => {
      const newData = {
        ...prev,
        [ageRange]: {
          ...prev[ageRange],
          [type]: count,
        },
      };
      
      // Atualizar o total no contexto
      const totalForRange = newData[ageRange].titular + newData[ageRange].dependente;
      dispatch({ type: "SET_LIVES", payload: { ageRange, count: totalForRange } });
      
      return newData;
    });
  };

  const incrementLives = (ageRange: AgeRange, type: LiveType) => {
    handleLivesChange(ageRange, type, String(livesByType[ageRange][type] + 1));
  };

  const decrementLives = (ageRange: AgeRange, type: LiveType) => {
    handleLivesChange(ageRange, type, String(Math.max(0, livesByType[ageRange][type] - 1)));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const productTotals = getAllProductTotals();
  
  // Calcular totais de titulares e dependentes
  const totalTitulares = AGE_RANGES.reduce((sum, ar) => sum + livesByType[ar].titular, 0);
  const totalDependentes = AGE_RANGES.reduce((sum, ar) => sum + livesByType[ar].dependente, 0);

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

        {/* Distribuição de Vidas com Titular/Dependente */}
        <View className="px-4 mb-4">
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            <View className="bg-primary/10 p-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-semibold text-foreground">
                  Distribuição de Vidas
                </Text>
                <View className="bg-primary px-2 py-1 rounded">
                  <Text className="text-xs text-white font-bold">
                    Total: {totalLives} {totalLives === 1 ? "vida" : "vidas"}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="bg-success/20 px-2 py-1 rounded">
                  <Text className="text-xs text-success font-medium">
                    👤 {totalTitulares} Titular(es)
                  </Text>
                </View>
                <View className="bg-warning/20 px-2 py-1 rounded">
                  <Text className="text-xs text-warning font-medium">
                    👥 {totalDependentes} Dependente(s)
                  </Text>
                </View>
              </View>
            </View>

            {/* Cabeçalho da tabela */}
            <View className="flex-row items-center px-3 py-2 bg-background border-b border-border">
              <Text className="flex-1 text-xs font-semibold text-muted">
                Faixa Etária
              </Text>
              <Text className="w-24 text-xs font-semibold text-success text-center">
                Titular
              </Text>
              <Text className="w-24 text-xs font-semibold text-warning text-center">
                Dependente
              </Text>
            </View>

            <View className="p-2">
              {AGE_RANGES.map((ageRange) => (
                <View
                  key={ageRange}
                  className="flex-row items-center py-2 border-b border-border/50 last:border-b-0"
                >
                  <Text className="flex-1 text-sm text-foreground">
                    {AGE_RANGE_LABELS[ageRange]}
                  </Text>
                  
                  {/* Titular */}
                  <View className="w-24 flex-row items-center justify-center">
                    <TouchableOpacity
                      onPress={() => decrementLives(ageRange, "titular")}
                      className="w-7 h-7 bg-success/20 rounded items-center justify-center"
                      style={{ opacity: 1 }}
                    >
                      <Text className="text-success font-bold">-</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={String(livesByType[ageRange].titular)}
                      onChangeText={(v) => handleLivesChange(ageRange, "titular", v)}
                      keyboardType="numeric"
                      className="w-8 h-7 text-center text-foreground mx-1 text-sm"
                      style={{ color: colors.foreground }}
                    />
                    <TouchableOpacity
                      onPress={() => incrementLives(ageRange, "titular")}
                      className="w-7 h-7 bg-success rounded items-center justify-center"
                      style={{ opacity: 1 }}
                    >
                      <Text className="text-white font-bold">+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Dependente */}
                  <View className="w-24 flex-row items-center justify-center">
                    <TouchableOpacity
                      onPress={() => decrementLives(ageRange, "dependente")}
                      className="w-7 h-7 bg-warning/20 rounded items-center justify-center"
                      style={{ opacity: 1 }}
                    >
                      <Text className="text-warning font-bold">-</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={String(livesByType[ageRange].dependente)}
                      onChangeText={(v) => handleLivesChange(ageRange, "dependente", v)}
                      keyboardType="numeric"
                      className="w-8 h-7 text-center text-foreground mx-1 text-sm"
                      style={{ color: colors.foreground }}
                    />
                    <TouchableOpacity
                      onPress={() => incrementLives(ageRange, "dependente")}
                      className="w-7 h-7 bg-warning rounded items-center justify-center"
                      style={{ opacity: 1 }}
                    >
                      <Text className="text-white font-bold">+</Text>
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
            style={{ opacity: 1 }}
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
                  style={{ opacity: 1 }}
                >
                  <Text className="text-xs text-primary font-medium">
                    Selecionar Todos
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch({ type: "CLEAR_PRODUCTS" })}
                  className="bg-error/10 px-3 py-1 rounded"
                  style={{ opacity: 1 }}
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
                    style={{ opacity: 1 }}
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
                <View key={product.id}>
                  <TouchableOpacity
                    onPress={() => setExpandedProduct(
                      expandedProduct === product.id ? null : product.id
                    )}
                    className={`p-3 flex-row items-center ${
                      index === 0 ? "bg-success/10" : ""
                    } ${
                      index < productTotals.length - 1 && expandedProduct !== product.id
                        ? "border-b border-border"
                        : ""
                    }`}
                    style={{ opacity: 1 }}
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
                          : "Enfermaria"}{" "}
                        • Toque para detalhes
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text
                        className={`text-base font-bold ${
                          index === 0 ? "text-success" : "text-foreground"
                        }`}
                      >
                        {formatCurrency(total)}
                      </Text>
                      <Text className="text-muted ml-2">
                        {expandedProduct === product.id ? "▼" : "›"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Detalhamento expandido */}
                  {expandedProduct === product.id && (
                    <View className="bg-background p-3 border-b border-border">
                      <Text className="text-xs font-semibold text-muted mb-2">
                        Detalhamento por Faixa Etária
                      </Text>
                      {AGE_RANGES.filter((ar) => state.lives[ar] > 0).map((ageRange) => {
                        const price = getProductPrice(
                          state.city!,
                          state.contractType!,
                          state.coparticipation!,
                          product.id,
                          ageRange
                        );
                        const subtotal = (price || 0) * state.lives[ageRange];
                        const titulares = livesByType[ageRange].titular;
                        const dependentes = livesByType[ageRange].dependente;
                        
                        return (
                          <View
                            key={ageRange}
                            className="flex-row items-center justify-between py-1"
                          >
                            <View className="flex-1">
                              <Text className="text-xs text-foreground">
                                {AGE_RANGE_LABELS[ageRange]}
                              </Text>
                              <Text className="text-xs text-muted">
                                {titulares > 0 && `${titulares} tit.`}
                                {titulares > 0 && dependentes > 0 && " + "}
                                {dependentes > 0 && `${dependentes} dep.`}
                                {" × "}{formatCurrency(price || 0)}
                              </Text>
                            </View>
                            <Text className="text-xs font-medium text-foreground">
                              {formatCurrency(subtotal)}
                            </Text>
                          </View>
                        );
                      })}
                      <View className="flex-row items-center justify-between pt-2 mt-2 border-t border-border">
                        <Text className="text-xs font-semibold text-foreground">
                          Total {product.shortName}
                        </Text>
                        <Text className="text-sm font-bold text-primary">
                          {formatCurrency(total)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Resumo Geral */}
            <View className="bg-primary/10 rounded-xl p-4 mt-4">
              <Text className="text-sm font-semibold text-primary mb-2">
                📊 Resumo da Simulação
              </Text>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-muted">Total de Vidas:</Text>
                <Text className="text-xs font-medium text-foreground">
                  {totalLives} ({totalTitulares} tit. + {totalDependentes} dep.)
                </Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-muted">Produtos Comparados:</Text>
                <Text className="text-xs font-medium text-foreground">
                  {state.selectedProducts.length}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Menor Valor:</Text>
                <Text className="text-xs font-bold text-success">
                  {productTotals.length > 0 && formatCurrency(productTotals[0].total)}
                </Text>
              </View>
            </View>
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
