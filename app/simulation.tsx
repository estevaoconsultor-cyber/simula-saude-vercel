import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

interface SavedSimulation {
  id: string;
  companyName: string;
  expectedDate: string;
  createdAt: string;
  city: string;
  contractType: string;
  coparticipation: string;
  lives: LiveEntry[];
  grandTotal: number;
}

const STORAGE_KEY = "@hapvida_saved_simulations";

export default function SimulationScreen() {
  const router = useRouter();
  const colors = useColors();
  const {
    state,
    dispatch,
    availableProducts,
  } = useSimulation();

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  
  // Estado para vidas com produto específico
  const [lives, setLives] = useState<LiveEntry[]>([]);
  
  // Modal para selecionar produto
  const [showProductModal, setShowProductModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<{
    type: LiveType;
    ageRange: AgeRange;
  } | null>(null);

  // Modal para editar vida específica
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLife, setEditingLife] = useState<LiveEntry | null>(null);

  // Modal para salvar simulação
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [expectedDate, setExpectedDate] = useState("");

  // Modal para ver simulações salvas
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);

  const selectedCity = CITIES.find((c) => c.id === state.city);
  const selectedContract = CONTRACT_TYPES.find((c) => c.id === state.contractType);
  const selectedCopart = COPARTICIPATION_TYPES.find(
    (c) => c.id === state.coparticipation
  );

  // Carregar simulações salvas
  useEffect(() => {
    loadSavedSimulations();
  }, []);

  const loadSavedSimulations = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedSimulations(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erro ao carregar simulações:", error);
    }
  };

  const handleBack = () => {
    dispatch({ type: "GO_TO_STEP", payload: "coparticipation" });
    router.back();
  };

  // Nova Simulação - zera tudo mas permanece na tela
  const handleReset = () => {
    setLives([]);
    setExpandedProduct(null);
    setCompanyName("");
    setExpectedDate("");
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
      
      const totalForRange = getLivesCount(ageRange, "titular") + 
                           getLivesCount(ageRange, "dependente") - 1;
      dispatch({ type: "SET_LIVES", payload: { ageRange, count: Math.max(0, totalForRange) } });
    }
  };

  // Editar vida específica
  const handleEditLife = (life: LiveEntry) => {
    setEditingLife(life);
    setShowEditModal(true);
  };

  // Confirmar edição de vida
  const confirmEditLife = (newProductId: string) => {
    if (editingLife) {
      setLives(prev => prev.map(l => 
        l.id === editingLife.id ? { ...l, productId: newProductId } : l
      ));
    }
    setShowEditModal(false);
    setEditingLife(null);
  };

  // Remover vida específica
  const handleDeleteLife = (lifeId: string) => {
    const life = lives.find(l => l.id === lifeId);
    if (life) {
      setLives(prev => prev.filter(l => l.id !== lifeId));
      const totalForRange = getLivesCount(life.ageRange, "titular") + 
                           getLivesCount(life.ageRange, "dependente") - 1;
      dispatch({ type: "SET_LIVES", payload: { ageRange: life.ageRange, count: Math.max(0, totalForRange) } });
    }
    setShowEditModal(false);
    setEditingLife(null);
  };

  // Salvar simulação
  const handleSaveSimulation = async () => {
    if (!companyName.trim()) {
      Alert.alert("Atenção", "Por favor, informe o nome da empresa.");
      return;
    }
    if (!expectedDate.trim()) {
      Alert.alert("Atenção", "Por favor, informe a data prevista.");
      return;
    }

    const newSimulation: SavedSimulation = {
      id: `${Date.now()}`,
      companyName: companyName.trim(),
      expectedDate: expectedDate.trim(),
      createdAt: new Date().toISOString(),
      city: state.city!,
      contractType: state.contractType!,
      coparticipation: state.coparticipation!,
      lives: [...lives],
      grandTotal,
    };

    try {
      const updated = [...savedSimulations, newSimulation];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedSimulations(updated);
      setShowSaveModal(false);
      setCompanyName("");
      setExpectedDate("");
      Alert.alert("Sucesso", "Simulação salva com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a simulação.");
    }
  };

  // Carregar simulação salva
  const loadSimulation = (sim: SavedSimulation) => {
    dispatch({ type: "SET_CITY", payload: sim.city as any });
    dispatch({ type: "SET_CONTRACT_TYPE", payload: sim.contractType as any });
    dispatch({ type: "SET_COPARTICIPATION", payload: sim.coparticipation as any });
    setLives(sim.lives);
    setCompanyName(sim.companyName);
    setExpectedDate(sim.expectedDate);
    setShowSavedModal(false);
  };

  // Excluir simulação salva
  const deleteSimulation = async (simId: string) => {
    try {
      const updated = savedSimulations.filter(s => s.id !== simId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedSimulations(updated);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a simulação.");
    }
  };

  // Exportar PDF (abre compartilhamento)
  const handleExportPDF = () => {
    // Gerar conteúdo HTML para PDF
    const htmlContent = generatePDFContent();
    
    // Em ambiente web, abre em nova aba para impressão
    if (Platform.OS === "web") {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      Alert.alert(
        "Exportar PDF",
        "Para exportar o PDF, use a opção de compartilhamento do seu dispositivo.",
        [{ text: "OK" }]
      );
    }
  };

  const generatePDFContent = () => {
    const cityName = selectedCity?.name || "";
    const contractName = selectedContract?.name || "";
    const copartName = selectedCopart?.name || "";
    
    let productsHTML = "";
    productTotals.forEach(({ product, total, lives: productLives }) => {
      productsHTML += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${product.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${productLives.length}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${formatCurrency(total)}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Proposta Hapvida - ${companyName || "Cliente"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #FF6B00; padding-bottom: 20px; }
          .logo { max-width: 250px; margin-bottom: 15px; }
          .tagline { background: linear-gradient(135deg, #FF6B00, #0066CC); color: white; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center; }
          .tagline h2 { margin: 0; font-size: 18px; }
          .tagline p { margin: 5px 0 0; font-size: 14px; }
          .info-box { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #0066CC; color: white; padding: 10px; text-align: left; }
          .total-row { background: #FF6B00; color: white; font-weight: bold; }
          .total-row td { padding: 12px 8px; }
          .benefits { background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .benefits h3 { color: #0066CC; margin-top: 0; }
          .benefits ul { margin: 0; padding-left: 20px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Hapvida_logo.svg/1200px-Hapvida_logo.svg.png" alt="Hapvida" class="logo" onerror="this.style.display='none'">
          <h1 style="color: #0066CC; margin: 10px 0;">Hapvida NotreDame Intermédica</h1>
          <p style="color: #666;">Proposta Comercial de Plano de Saúde</p>
        </div>

        <div class="tagline">
          <h2>🏥 Cuide de quem você ama com a maior rede de saúde do Brasil!</h2>
          <p>Mais de 750 unidades próprias e milhares de prestadores credenciados à sua disposição.</p>
        </div>

        ${companyName ? `<h3>📋 Proposta para: ${companyName}</h3>` : ""}
        ${expectedDate ? `<p><strong>Data prevista:</strong> ${expectedDate}</p>` : ""}

        <div class="info-box">
          <div class="info-row"><span>📍 Filial:</span><span><strong>${cityName}</strong></span></div>
          <div class="info-row"><span>📋 Tipo de Contrato:</span><span><strong>${contractName}</strong></span></div>
          <div class="info-row"><span>💳 Coparticipação:</span><span><strong>${copartName}</strong></span></div>
          <div class="info-row"><span>👥 Total de Vidas:</span><span><strong>${totalLives} (${totalTitulares} titulares + ${totalDependentes} dependentes)</strong></span></div>
        </div>

        <h3>💰 Detalhamento de Valores</h3>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th style="text-align: center;">Vidas</th>
              <th style="text-align: right;">Valor Mensal</th>
            </tr>
          </thead>
          <tbody>
            ${productsHTML}
            <tr class="total-row">
              <td>TOTAL GERAL</td>
              <td style="text-align: center;">${totalLives}</td>
              <td style="text-align: right;">${formatCurrency(grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        <div class="benefits">
          <h3>✅ Por que escolher a Hapvida?</h3>
          <ul>
            <li><strong>Maior rede própria do Brasil</strong> - Hospitais, clínicas e laboratórios próprios</li>
            <li><strong>Atendimento humanizado</strong> - Profissionais qualificados e dedicados</li>
            <li><strong>Tecnologia de ponta</strong> - Equipamentos modernos e telemedicina</li>
            <li><strong>Cobertura nacional</strong> - Presente em todas as regiões do país</li>
            <li><strong>Melhor custo-benefício</strong> - Qualidade premium com preços acessíveis</li>
          </ul>
        </div>

        <div class="footer">
          <p><strong>Hapvida NotreDame Intermédica</strong></p>
          <p>Esta proposta tem validade de 30 dias. Valores sujeitos a alteração conforme análise cadastral.</p>
          <p>Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
        </div>
      </body>
      </html>
    `;
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
      return { product, count, lives: filtered.filter(l => l.productId === productId) };
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
            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={() => setShowSavedModal(true)}
                className="bg-primary/10 px-3 py-1 rounded"
              >
                <Text className="text-primary text-sm">📂 Salvos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReset}>
                <Text className="text-error text-sm">Nova Simulação</Text>
              </TouchableOpacity>
            </View>
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

                    {/* Resumo de produtos por faixa - clicável para editar */}
                    {(titularSummary.length > 0 || dependenteSummary.length > 0) && (
                      <View className="flex-row mt-1 pl-2">
                        <View className="flex-1" />
                        <View className="w-28 px-1">
                          {titularSummary.map(({ product, count, lives: summaryLives }) => (
                            <TouchableOpacity 
                              key={product?.id} 
                              onPress={() => summaryLives[0] && handleEditLife(summaryLives[0])}
                              className="flex-row items-center"
                            >
                              <Text className="text-xs text-success/70">
                                {count}x {product?.shortName || "?"} ✏️
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View className="w-28 px-1">
                          {dependenteSummary.map(({ product, count, lives: summaryLives }) => (
                            <TouchableOpacity 
                              key={product?.id}
                              onPress={() => summaryLives[0] && handleEditLife(summaryLives[0])}
                              className="flex-row items-center"
                            >
                              <Text className="text-xs text-warning/70">
                                {count}x {product?.shortName || "?"} ✏️
                              </Text>
                            </TouchableOpacity>
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

            {/* Botões de Ação */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                onPress={() => setShowSaveModal(true)}
                className="flex-1 bg-success py-3 rounded-xl items-center"
                style={{ opacity: 1 }}
              >
                <Text className="text-white font-semibold">💾 Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExportPDF}
                className="flex-1 bg-primary py-3 rounded-xl items-center"
                style={{ opacity: 1 }}
              >
                <Text className="text-white font-semibold">📄 Exportar PDF</Text>
              </TouchableOpacity>
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

      {/* Modal de Editar/Remover Vida */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View 
            className="bg-background rounded-t-3xl max-h-[80%]"
            style={{ backgroundColor: colors.background }}
          >
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">
                  Editar Vida
                </Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Text className="text-muted text-2xl">×</Text>
                </TouchableOpacity>
              </View>
              {editingLife && (
                <Text className="text-sm text-muted mt-1">
                  {editingLife.type === "titular" ? "👤 Titular" : "👥 Dependente"} • {AGE_RANGE_LABELS[editingLife.ageRange]}
                </Text>
              )}
            </View>
            
            {/* Botão Excluir */}
            <View className="p-4 border-b border-border">
              <TouchableOpacity
                onPress={() => editingLife && handleDeleteLife(editingLife.id)}
                className="bg-error/10 py-3 rounded-xl items-center"
                style={{ opacity: 1 }}
              >
                <Text className="text-error font-semibold">🗑️ Excluir esta vida</Text>
              </TouchableOpacity>
            </View>
            
            <Text className="px-4 pt-4 text-sm font-semibold text-muted">
              Ou trocar para outro produto:
            </Text>
            
            <ScrollView className="p-4">
              {availableProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => confirmEditLife(product.id)}
                  className={`bg-surface rounded-xl p-4 mb-2 border ${
                    editingLife?.productId === product.id ? "border-primary" : "border-border"
                  } active:bg-primary/10`}
                  style={{ opacity: 1 }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {product.name}
                      </Text>
                      <Text className="text-sm text-muted">
                        {product.segmentation} • {product.accommodation === "APART" ? "Apartamento" : "Enfermaria"}
                      </Text>
                      {editingLife && (
                        <Text className="text-sm text-primary mt-1 font-medium">
                          {formatCurrency(
                            getProductPrice(
                              state.city!,
                              state.contractType!,
                              state.coparticipation!,
                              product.id,
                              editingLife.ageRange
                            ) || 0
                          )}/mês
                        </Text>
                      )}
                    </View>
                    {editingLife?.productId === product.id && (
                      <Text className="text-primary text-lg">✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Salvar Simulação */}
      <Modal
        visible={showSaveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View 
            className="bg-background rounded-2xl w-full max-w-md"
            style={{ backgroundColor: colors.background }}
          >
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">
                  💾 Salvar Simulação
                </Text>
                <TouchableOpacity onPress={() => setShowSaveModal(false)}>
                  <Text className="text-muted text-2xl">×</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View className="p-4">
              <Text className="text-sm font-medium text-foreground mb-2">
                Nome da Empresa *
              </Text>
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Ex: Empresa ABC Ltda"
                placeholderTextColor={colors.muted}
                className="bg-surface border border-border rounded-xl p-3 text-foreground mb-4"
                style={{ color: colors.foreground }}
              />
              
              <Text className="text-sm font-medium text-foreground mb-2">
                Data Prevista para Uso *
              </Text>
              <TextInput
                value={expectedDate}
                onChangeText={setExpectedDate}
                placeholder="Ex: 15/02/2026"
                placeholderTextColor={colors.muted}
                className="bg-surface border border-border rounded-xl p-3 text-foreground mb-4"
                style={{ color: colors.foreground }}
              />
              
              <View className="bg-primary/10 rounded-xl p-3 mb-4">
                <Text className="text-xs text-muted">Valor Total:</Text>
                <Text className="text-lg font-bold text-primary">
                  {formatCurrency(grandTotal)}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={handleSaveSimulation}
                className="bg-success py-3 rounded-xl items-center"
                style={{ opacity: 1 }}
              >
                <Text className="text-white font-semibold">Salvar Simulação</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Simulações Salvas */}
      <Modal
        visible={showSavedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSavedModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View 
            className="bg-background rounded-t-3xl max-h-[80%]"
            style={{ backgroundColor: colors.background }}
          >
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">
                  📂 Simulações Salvas
                </Text>
                <TouchableOpacity onPress={() => setShowSavedModal(false)}>
                  <Text className="text-muted text-2xl">×</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="p-4">
              {savedSimulations.length === 0 ? (
                <View className="py-8">
                  <Text className="text-muted text-center">
                    Nenhuma simulação salva ainda.
                  </Text>
                </View>
              ) : (
                savedSimulations.map((sim) => (
                  <View
                    key={sim.id}
                    className="bg-surface rounded-xl p-4 mb-3 border border-border"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          {sim.companyName}
                        </Text>
                        <Text className="text-xs text-muted">
                          📅 Previsão: {sim.expectedDate}
                        </Text>
                        <Text className="text-xs text-muted">
                          Criado: {new Date(sim.createdAt).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>
                      <Text className="text-base font-bold text-primary">
                        {formatCurrency(sim.grandTotal)}
                      </Text>
                    </View>
                    <Text className="text-xs text-muted mb-3">
                      {sim.lives.length} vidas • {CITIES.find(c => c.id === sim.city)?.name}
                    </Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => loadSimulation(sim)}
                        className="flex-1 bg-primary py-2 rounded-lg items-center"
                        style={{ opacity: 1 }}
                      >
                        <Text className="text-white text-sm font-medium">Carregar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteSimulation(sim.id)}
                        className="bg-error/10 px-4 py-2 rounded-lg items-center"
                        style={{ opacity: 1 }}
                      >
                        <Text className="text-error text-sm font-medium">🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
