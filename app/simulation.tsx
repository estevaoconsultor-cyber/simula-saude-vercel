import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
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

interface LiveEntry {
  id: string;
  type: LiveType;
  ageRange: AgeRange;
  productId: string;
}

export default function SimulationScreen() {
  const router = useRouter();
  const colors = useColors();
  const {
    state,
    dispatch,
    availableProducts,
  } = useSimulation();

  const [showProducts, setShowProducts] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  
  // Estado para vidas com produto específico
  const [lives, setLives] = useState<LiveEntry[]>([]);
  
  // Modal para selecionar produto
  const [showProductModal, setShowProductModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<{
    type: LiveType;
    ageRange: AgeRange;
  } | null>(null);

  const selectedCity = CITIES.find((c) => c.id === state.city);
  const selectedContract = CONTRACT_TYPES.find((c) => c.id === state.contractType);
  const selectedCopart = COPARTICIPATION_TYPES.find(
    (c) => c.id === state.coparticipation
  );

  const handleBack = () => {
    dispatch({ type: "GO_TO_STEP", payload: "coparticipation" });
    router.back();
  };

  // Nova Simulação - zera tudo mas permanece na tela
  const handleReset = () => {
    setLives([]);
    setExpandedProduct(null);
    setShowProducts(false);
    // Não navega para lugar nenhum, apenas limpa os dados locais
  };

  // Contagem de vidas por faixa etária e tipo
  const getLivesCount = (ageRange: AgeRange, type: LiveType) => {
    return lives.filter(l => l.ageRange === ageRange && l.type === type).length;
  };

  // Adicionar vida com seleção de produto
  const handleAddLife = (ageRange: AgeRange, type: LiveType) => {
    setPendingEntry({ type, ageRange });
    setShowProductModal(true);
  };

  // Confirmar adição com produto selecionado
  const confirmAddLife = (productId: string) => {
    if (pendingEntry) {
      const newEntry: LiveEntry = {
        id: `${Date.now()}-${Math.random()}`,
        type: pendingEntry.type,
        ageRange: pendingEntry.ageRange,
        productId,
      };
      setLives(prev => [...prev, newEntry]);
      
      // Atualizar contexto
      const totalForRange = getLivesCount(pendingEntry.ageRange, "titular") + 
                           getLivesCount(pendingEntry.ageRange, "dependente") + 1;
      dispatch({ type: "SET_LIVES", payload: { ageRange: pendingEntry.ageRange, count: totalForRange } });
    }
    setShowProductModal(false);
    setPendingEntry(null);
  };

  // Remover última vida de uma faixa/tipo
  const handleRemoveLife = (ageRange: AgeRange, type: LiveType) => {
    const livesToRemove = lives.filter(l => l.ageRange === ageRange && l.type === type);
    if (livesToRemove.length > 0) {
      const lastLife = livesToRemove[livesToRemove.length - 1];
      setLives(prev => prev.filter(l => l.id !== lastLife.id));
      
      // Atualizar contexto
      const totalForRange = getLivesCount(ageRange, "titular") + 
                           getLivesCount(ageRange, "dependente") - 1;
      dispatch({ type: "SET_LIVES", payload: { ageRange, count: Math.max(0, totalForRange) } });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Calcular totais por produto
  const getProductTotals = () => {
    const productMap = new Map<string, number>();
    
    lives.forEach(life => {
      const price = getProductPrice(
        state.city!,
        state.contractType!,
        state.coparticipation!,
        life.productId,
        life.ageRange
      ) || 0;
      
      const current = productMap.get(life.productId) || 0;
      productMap.set(life.productId, current + price);
    });

    return Array.from(productMap.entries())
      .map(([productId, total]) => ({
        product: availableProducts.find(p => p.id === productId)!,
        total,
        lives: lives.filter(l => l.productId === productId),
      }))
      .filter(item => item.product)
      .sort((a, b) => b.total - a.total);
  };

  const productTotals = getProductTotals();
  const grandTotal = productTotals.reduce((sum, pt) => sum + pt.total, 0);
  
  // Calcular totais de titulares e dependentes
  const totalTitulares = lives.filter(l => l.type === "titular").length;
  const totalDependentes = lives.filter(l => l.type === "dependente").length;
  const totalLives = lives.length;

  // Obter resumo de produtos por faixa
  const getProductSummary = (ageRange: AgeRange, type: LiveType) => {
    const filtered = lives.filter(l => l.ageRange === ageRange && l.type === type);
    const productCounts = new Map<string, number>();
    
    filtered.forEach(l => {
      const count = productCounts.get(l.productId) || 0;
      productCounts.set(l.productId, count + 1);
    });

    return Array.from(productCounts.entries()).map(([productId, count]) => {
      const product = availableProducts.find(p => p.id === productId);
      return { product, count };
    });
  };

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
              <Text className="w-28 text-xs font-semibold text-success text-center">
                Titular
              </Text>
              <Text className="w-28 text-xs font-semibold text-warning text-center">
                Dependente
              </Text>
            </View>

            <View className="p-2">
              {AGE_RANGES.map((ageRange) => {
                const titularCount = getLivesCount(ageRange, "titular");
                const dependenteCount = getLivesCount(ageRange, "dependente");
                const titularSummary = getProductSummary(ageRange, "titular");
                const dependenteSummary = getProductSummary(ageRange, "dependente");

                return (
                  <View
                    key={ageRange}
                    className="py-2 border-b border-border/50 last:border-b-0"
                  >
                    <View className="flex-row items-center">
                      <Text className="flex-1 text-sm text-foreground">
                        {AGE_RANGE_LABELS[ageRange]}
                      </Text>
                      
                      {/* Titular */}
                      <View className="w-28 flex-row items-center justify-center">
                        <TouchableOpacity
                          onPress={() => handleRemoveLife(ageRange, "titular")}
                          className="w-8 h-8 bg-success/20 rounded items-center justify-center"
                          style={{ opacity: titularCount > 0 ? 1 : 0.4 }}
                          disabled={titularCount === 0}
                        >
                          <Text className="text-success font-bold text-lg">-</Text>
                        </TouchableOpacity>
                        <View className="w-10 h-8 items-center justify-center mx-1">
                          <Text className="text-foreground font-semibold text-base">
                            {titularCount}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleAddLife(ageRange, "titular")}
                          className="w-8 h-8 bg-success rounded items-center justify-center"
                          style={{ opacity: 1 }}
                        >
                          <Text className="text-white font-bold text-lg">+</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Dependente */}
                      <View className="w-28 flex-row items-center justify-center">
                        <TouchableOpacity
                          onPress={() => handleRemoveLife(ageRange, "dependente")}
                          className="w-8 h-8 bg-warning/20 rounded items-center justify-center"
                          style={{ opacity: dependenteCount > 0 ? 1 : 0.4 }}
                          disabled={dependenteCount === 0}
                        >
                          <Text className="text-warning font-bold text-lg">-</Text>
                        </TouchableOpacity>
                        <View className="w-10 h-8 items-center justify-center mx-1">
                          <Text className="text-foreground font-semibold text-base">
                            {dependenteCount}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleAddLife(ageRange, "dependente")}
                          className="w-8 h-8 bg-warning rounded items-center justify-center"
                          style={{ opacity: 1 }}
                        >
                          <Text className="text-white font-bold text-lg">+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Resumo de produtos por faixa */}
                    {(titularSummary.length > 0 || dependenteSummary.length > 0) && (
                      <View className="flex-row mt-1 pl-2">
                        <View className="flex-1" />
                        <View className="w-28 px-1">
                          {titularSummary.map(({ product, count }) => (
                            <Text key={product?.id} className="text-xs text-success/70">
                              {count}x {product?.shortName || "?"}
                            </Text>
                          ))}
                        </View>
                        <View className="w-28 px-1">
                          {dependenteSummary.map(({ product, count }) => (
                            <Text key={product?.id} className="text-xs text-warning/70">
                              {count}x {product?.shortName || "?"}
                            </Text>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Resultados da Simulação */}
        {totalLives > 0 && (
          <View className="px-4">
            <Text className="text-lg font-bold text-foreground mb-3">
              Resumo por Produto
            </Text>

            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              {/* Header da tabela */}
              <View className="bg-primary/10 p-3 flex-row">
                <Text className="flex-1 text-sm font-semibold text-foreground">
                  Produto
                </Text>
                <Text className="w-16 text-sm font-semibold text-foreground text-center">
                  Vidas
                </Text>
                <Text className="w-28 text-sm font-semibold text-foreground text-right">
                  Valor Mensal
                </Text>
              </View>

              {/* Linhas */}
              {productTotals.length > 0 ? (
                productTotals.map(({ product, total, lives: productLives }, index) => (
                  <View key={product.id}>
                    <TouchableOpacity
                      onPress={() => setExpandedProduct(
                        expandedProduct === product.id ? null : product.id
                      )}
                      className={`p-3 flex-row items-center ${
                        index < productTotals.length - 1 && expandedProduct !== product.id
                          ? "border-b border-border"
                          : ""
                      }`}
                      style={{ opacity: 1 }}
                    >
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-foreground">
                          {product.name}
                        </Text>
                        <Text className="text-xs text-muted">
                          {product.accommodation === "APART"
                            ? "Apartamento"
                            : "Enfermaria"}{" "}
                          • Toque para detalhes
                        </Text>
                      </View>
                      <Text className="w-16 text-sm font-medium text-foreground text-center">
                        {productLives.length}
                      </Text>
                      <View className="w-28 flex-row items-center justify-end">
                        <Text className="text-base font-bold text-foreground">
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
                        {AGE_RANGES.filter((ar) => 
                          productLives.some(l => l.ageRange === ar)
                        ).map((ageRange) => {
                          const price = getProductPrice(
                            state.city!,
                            state.contractType!,
                            state.coparticipation!,
                            product.id,
                            ageRange
                          );
                          const livesInRange = productLives.filter(l => l.ageRange === ageRange);
                          const titulares = livesInRange.filter(l => l.type === "titular").length;
                          const dependentes = livesInRange.filter(l => l.type === "dependente").length;
                          const subtotal = (price || 0) * livesInRange.length;
                          
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
                ))
              ) : (
                <View className="p-4">
                  <Text className="text-sm text-muted text-center">
                    Adicione vidas para ver o resumo
                  </Text>
                </View>
              )}

              {/* Total Geral */}
              {productTotals.length > 0 && (
                <View className="bg-primary/10 p-3 flex-row items-center">
                  <Text className="flex-1 text-sm font-bold text-primary">
                    TOTAL GERAL
                  </Text>
                  <Text className="w-16 text-sm font-bold text-primary text-center">
                    {totalLives}
                  </Text>
                  <Text className="w-28 text-base font-bold text-primary text-right">
                    {formatCurrency(grandTotal)}
                  </Text>
                </View>
              )}
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
                <Text className="text-xs text-muted">Produtos Utilizados:</Text>
                <Text className="text-xs font-medium text-foreground">
                  {productTotals.length}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Valor Total Mensal:</Text>
                <Text className="text-xs font-bold text-success">
                  {formatCurrency(grandTotal)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Mensagem quando não há dados */}
        {totalLives === 0 && (
          <View className="px-4">
            <View className="bg-warning/10 rounded-xl p-4">
              <Text className="text-sm text-warning text-center">
                Clique em + para adicionar vidas e selecionar o produto para cada uma.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal de Seleção de Produto */}
      <Modal
        visible={showProductModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View 
            className="bg-background rounded-t-3xl max-h-[70%]"
            style={{ backgroundColor: colors.background }}
          >
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">
                  Selecione o Produto
                </Text>
                <TouchableOpacity onPress={() => setShowProductModal(false)}>
                  <Text className="text-muted text-2xl">×</Text>
                </TouchableOpacity>
              </View>
              {pendingEntry && (
                <Text className="text-sm text-muted mt-1">
                  {pendingEntry.type === "titular" ? "👤 Titular" : "👥 Dependente"} • {AGE_RANGE_LABELS[pendingEntry.ageRange]}
                </Text>
              )}
            </View>
            
            <ScrollView className="p-4">
              {availableProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => confirmAddLife(product.id)}
                  className="bg-surface rounded-xl p-4 mb-2 border border-border active:bg-primary/10"
                  style={{ opacity: 1 }}
                >
                  <Text className="text-base font-semibold text-foreground">
                    {product.name}
                  </Text>
                  <Text className="text-sm text-muted">
                    {product.segmentation} • {product.accommodation === "APART" ? "Apartamento" : "Enfermaria"}
                  </Text>
                  {pendingEntry && (
                    <Text className="text-sm text-primary mt-1 font-medium">
                      {formatCurrency(
                        getProductPrice(
                          state.city!,
                          state.contractType!,
                          state.coparticipation!,
                          product.id,
                          pendingEntry.ageRange
                        ) || 0
                      )}/mês
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
