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
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { getBrokerToken } from "@/contexts/BrokerAuthContext";
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

// Contador de quantidade por produto no modal
interface ProductQuantity {
  productId: string;
  quantity: number;
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
  
  // Modal para selecionar produto com quantidade
  const [showProductModal, setShowProductModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<{
    type: LiveType;
    ageRange: AgeRange;
  } | null>(null);
  
  // Estado para quantidades no modal
  const [productQuantities, setProductQuantities] = useState<ProductQuantity[]>([]);

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
  
  // Estado de loading para PDF
  const [isExporting, setIsExporting] = useState(false);

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

  // Abrir modal com quantidades zeradas
  const handleAddLife = (ageRange: AgeRange, type: LiveType) => {
    setPendingEntry({ type, ageRange });
    // Inicializar quantidades zeradas para todos os produtos
    setProductQuantities(availableProducts.map(p => ({ productId: p.id, quantity: 0 })));
    setShowProductModal(true);
  };

  // Atualizar quantidade de um produto no modal
  const updateProductQuantity = (productId: string, delta: number) => {
    setProductQuantities(prev => prev.map(pq => {
      if (pq.productId === productId) {
        const newQty = Math.max(0, pq.quantity + delta);
        return { ...pq, quantity: newQty };
      }
      return pq;
    }));
  };

  // Obter quantidade de um produto
  const getProductQuantity = (productId: string) => {
    return productQuantities.find(pq => pq.productId === productId)?.quantity || 0;
  };

  // Total de vidas selecionadas no modal
  const getTotalSelectedInModal = () => {
    return productQuantities.reduce((sum, pq) => sum + pq.quantity, 0);
  };

  // Confirmar adição de múltiplas vidas
  const confirmAddLives = () => {
    if (!pendingEntry) return;
    
    const totalSelected = getTotalSelectedInModal();
    if (totalSelected === 0) {
      Alert.alert("Atenção", "Selecione pelo menos uma vida para adicionar.");
      return;
    }

    const newLives: LiveEntry[] = [];
    productQuantities.forEach(pq => {
      for (let i = 0; i < pq.quantity; i++) {
        newLives.push({
          id: `${Date.now()}-${Math.random()}-${i}`,
          type: pendingEntry.type,
          ageRange: pendingEntry.ageRange,
          productId: pq.productId,
        });
      }
    });

    setLives(prev => [...prev, ...newLives]);
    
    // Atualizar contagem total para a faixa
    const totalForRange = getLivesCount(pendingEntry.ageRange, "titular") + 
                         getLivesCount(pendingEntry.ageRange, "dependente") + totalSelected;
    dispatch({ type: "SET_LIVES", payload: { ageRange: pendingEntry.ageRange, count: totalForRange } });

    setShowProductModal(false);
    setPendingEntry(null);
    setProductQuantities([]);
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
      // Salvar localmente
      const updated = [...savedSimulations, newSimulation];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedSimulations(updated);

      // Salvar no servidor (se logado)
      const token = getBrokerToken();
      if (token) {
        try {
          await fetch(`${getSimApiUrl()}/api/trpc/quotes.save`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              json: {
                companyName: companyName.trim(),
                expectedDate: expectedDate.trim(),
                quoteData: newSimulation,
              },
            }),
          });
        } catch (e) {
          // Falha silenciosa no servidor, já salvou localmente
          console.warn("Erro ao salvar no servidor:", e);
        }
      }

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

  // Gerar conteúdo HTML para PDF
  const generatePDFContent = () => {
    const cityName = selectedCity?.name || "";
    const contractName = selectedContract?.name || "";
    const copartName = selectedCopart?.name || "";
    
    let productsHTML = "";
    productTotals.forEach(({ product, total, lives: productLives }) => {
      productsHTML += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${productLives.length}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">R$ ${total.toFixed(2).replace('.', ',')}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proposta Hapvida</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #333; font-size: 14px; }
          .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #FF6B00; padding-bottom: 15px; }
          .logo-text { font-size: 28px; font-weight: bold; color: #0066CC; margin-bottom: 5px; }
          .logo-sub { font-size: 12px; color: #666; }
          .tagline { background: linear-gradient(135deg, #FF6B00, #0066CC); color: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center; }
          .tagline h2 { margin: 0; font-size: 16px; font-weight: 600; }
          .tagline p { margin: 5px 0 0; font-size: 12px; opacity: 0.9; }
          .company-name { font-size: 18px; font-weight: bold; color: #333; margin: 15px 0 5px; }
          .date-info { font-size: 13px; color: #666; margin-bottom: 15px; }
          .info-box { background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #0066CC; }
          .info-row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px; }
          .info-label { color: #666; }
          .info-value { font-weight: 600; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #0066CC; color: white; padding: 12px 10px; text-align: left; font-size: 13px; }
          th:nth-child(2), th:nth-child(3) { text-align: center; }
          th:last-child { text-align: right; }
          .total-row { background: #FF6B00; color: white; font-weight: bold; }
          .total-row td { padding: 12px 10px; font-size: 14px; }
          .benefits { background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .benefits h3 { color: #0066CC; margin: 0 0 10px; font-size: 15px; }
          .benefits ul { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.8; }
          .benefits li { margin: 3px 0; }
          .footer { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #888; }
          @media print { 
            body { padding: 10px; } 
            .tagline { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .total-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-text">Hapvida</div>
          <div class="logo-sub">NotreDame Intermédica</div>
        </div>

        <div class="tagline">
          <h2>Cuide de quem você ama com a maior rede de saúde do Brasil!</h2>
          <p>Mais de 750 unidades próprias e milhares de prestadores credenciados.</p>
        </div>

        ${companyName ? `<div class="company-name">Proposta para: ${companyName}</div>` : ""}
        ${expectedDate ? `<div class="date-info">Data prevista: ${expectedDate}</div>` : ""}

        <div class="info-box">
          <div class="info-row"><span class="info-label">Filial:</span><span class="info-value">${cityName}</span></div>
          <div class="info-row"><span class="info-label">Tipo de Contrato:</span><span class="info-value">${contractName}</span></div>
          <div class="info-row"><span class="info-label">Coparticipação:</span><span class="info-value">${copartName}</span></div>
          <div class="info-row"><span class="info-label">Total de Vidas:</span><span class="info-value">${totalLives} (${totalTitulares} titulares + ${totalDependentes} dependentes)</span></div>
        </div>

        <h3 style="margin: 15px 0 10px; font-size: 15px; color: #333;">Detalhamento de Valores</h3>
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
              <td style="text-align: right;">R$ ${grandTotal.toFixed(2).replace('.', ',')}</td>
            </tr>
          </tbody>
        </table>

        <div class="benefits">
          <h3>Por que escolher a Hapvida?</h3>
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

  // Exportar PDF - funciona em iOS, Android e Web
  const handleExportPDF = async () => {
    if (totalLives === 0) {
      Alert.alert("Atenção", "Adicione pelo menos uma vida para exportar o PDF.");
      return;
    }

    setIsExporting(true);
    
    try {
      const htmlContent = generatePDFContent();
      
      if (Platform.OS === "web") {
        // Web: abre em nova aba para impressão
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          setTimeout(() => printWindow.print(), 500);
        }
      } else {
        // Mobile: usa expo-print e expo-sharing
        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          base64: false,
        });
        
        // Verificar se pode compartilhar
        const canShare = await Sharing.isAvailableAsync();
        
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Compartilhar Proposta Hapvida",
            UTI: "com.adobe.pdf",
          });
        } else {
          Alert.alert(
            "PDF Gerado",
            "O PDF foi gerado mas o compartilhamento não está disponível neste dispositivo.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      Alert.alert(
        "Erro",
        "Não foi possível gerar o PDF. Por favor, tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsExporting(false);
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
                          style={{ opacity: titularCount > 0 ? 1 : 0.3 }}
                        >
                          <Text className="text-success font-bold text-lg">−</Text>
                        </TouchableOpacity>
                        <Text className="w-8 text-center text-sm font-semibold text-foreground">
                          {titularCount}
                        </Text>
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
                          style={{ opacity: dependenteCount > 0 ? 1 : 0.3 }}
                        >
                          <Text className="text-warning font-bold text-lg">−</Text>
                        </TouchableOpacity>
                        <Text className="w-8 text-center text-sm font-semibold text-foreground">
                          {dependenteCount}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleAddLife(ageRange, "dependente")}
                          className="w-8 h-8 bg-warning rounded items-center justify-center"
                          style={{ opacity: 1 }}
                        >
                          <Text className="text-white font-bold text-lg">+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Resumo dos produtos selecionados */}
                    {(titularSummary.length > 0 || dependenteSummary.length > 0) && (
                      <View className="mt-2 ml-2">
                        {titularSummary.map(({ product, count, lives: summaryLives }) => (
                          <TouchableOpacity
                            key={`t-${product?.id}`}
                            onPress={() => summaryLives[0] && handleEditLife(summaryLives[0])}
                            className="flex-row items-center py-1"
                          >
                            <View className="w-2 h-2 bg-success rounded-full mr-2" />
                            <Text className="text-xs text-muted flex-1">
                              {count}x {product?.shortName || product?.name} (Tit.)
                            </Text>
                            <Text className="text-xs text-primary">✏️</Text>
                          </TouchableOpacity>
                        ))}
                        {dependenteSummary.map(({ product, count, lives: summaryLives }) => (
                          <TouchableOpacity
                            key={`d-${product?.id}`}
                            onPress={() => summaryLives[0] && handleEditLife(summaryLives[0])}
                            className="flex-row items-center py-1"
                          >
                            <View className="w-2 h-2 bg-warning rounded-full mr-2" />
                            <Text className="text-xs text-muted flex-1">
                              {count}x {product?.shortName || product?.name} (Dep.)
                            </Text>
                            <Text className="text-xs text-primary">✏️</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Resumo de Valores por Produto */}
        {productTotals.length > 0 && (
          <View className="px-4 mb-4">
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <View className="bg-primary/10 p-3">
                <Text className="text-base font-semibold text-foreground">
                  💰 Resumo de Valores
                </Text>
              </View>

              {/* Lista de produtos */}
              {productTotals.length > 0 ? (
                productTotals.map(({ product, total, lives: productLives }) => (
                  <View key={product.id} className="border-b border-border last:border-b-0">
                    <TouchableOpacity
                      onPress={() => setExpandedProduct(
                        expandedProduct === product.id ? null : product.id
                      )}
                      className="flex-row items-center p-3"
                      style={{ opacity: 1 }}
                    >
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {product.name}
                        </Text>
                        <Text className="text-xs text-muted">
                          {product.segmentation}
                        </Text>
                      </View>
                      <Text className="w-16 text-sm text-muted text-center">
                        {productLives.length} {productLives.length === 1 ? "vida" : "vidas"}
                      </Text>
                      <Text className="w-28 text-sm font-bold text-primary text-right">
                        {formatCurrency(total)}
                      </Text>
                      <Text className="ml-2 text-muted">
                        {expandedProduct === product.id ? "▲" : "▼"}
                      </Text>
                    </TouchableOpacity>

                    {/* Detalhamento expandido */}
                    {expandedProduct === product.id && (
                      <View className="px-3 pb-3 bg-background/50">
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
                disabled={isExporting}
                className="flex-1 bg-primary py-3 rounded-xl items-center"
                style={{ opacity: isExporting ? 0.6 : 1 }}
              >
                <Text className="text-white font-semibold">
                  {isExporting ? "⏳ Gerando..." : "📄 Exportar PDF"}
                </Text>
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

      {/* Modal de Seleção de Produto com Contador */}
      <Modal
        visible={showProductModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View 
            className="bg-background rounded-t-3xl max-h-[80%]"
            style={{ backgroundColor: colors.background }}
          >
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">
                  Selecione os Produtos
                </Text>
                <TouchableOpacity onPress={() => setShowProductModal(false)}>
                  <Text className="text-muted text-2xl">×</Text>
                </TouchableOpacity>
              </View>
              {pendingEntry && (
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-sm text-muted">
                    {pendingEntry.type === "titular" ? "👤 Titular" : "👥 Dependente"} • {AGE_RANGE_LABELS[pendingEntry.ageRange]}
                  </Text>
                  <View className="bg-primary/20 px-2 py-1 rounded">
                    <Text className="text-xs text-primary font-semibold">
                      Total: {getTotalSelectedInModal()}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            
            <ScrollView className="p-4">
              {availableProducts.map((product) => {
                const qty = getProductQuantity(product.id);
                const price = pendingEntry ? getProductPrice(
                  state.city!,
                  state.contractType!,
                  state.coparticipation!,
                  product.id,
                  pendingEntry.ageRange
                ) || 0 : 0;
                
                return (
                  <View
                    key={product.id}
                    className={`bg-surface rounded-xl p-4 mb-3 border ${qty > 0 ? 'border-primary' : 'border-border'}`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 mr-3">
                        <Text className="text-base font-semibold text-foreground">
                          {product.name}
                        </Text>
                        <Text className="text-sm text-muted">
                          {product.segmentation} • {product.accommodation === "APART" ? "Apartamento" : "Enfermaria"}
                        </Text>
                        <Text className="text-sm text-primary mt-1 font-medium">
                          {formatCurrency(price)}/mês por vida
                        </Text>
                      </View>
                      
                      {/* Contador +/- */}
                      <View className="flex-row items-center">
                        <TouchableOpacity
                          onPress={() => updateProductQuantity(product.id, -1)}
                          className="w-10 h-10 bg-error/20 rounded-lg items-center justify-center"
                          style={{ opacity: qty > 0 ? 1 : 0.3 }}
                        >
                          <Text className="text-error font-bold text-xl">−</Text>
                        </TouchableOpacity>
                        <View className="w-12 items-center">
                          <Text className="text-lg font-bold text-foreground">
                            {qty}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => updateProductQuantity(product.id, 1)}
                          className="w-10 h-10 bg-success rounded-lg items-center justify-center"
                          style={{ opacity: 1 }}
                        >
                          <Text className="text-white font-bold text-xl">+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {qty > 0 && (
                      <View className="mt-2 pt-2 border-t border-border/50">
                        <Text className="text-xs text-primary font-medium">
                          Subtotal: {formatCurrency(price * qty)}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
            
            {/* Botão Confirmar */}
            <View className="p-4 border-t border-border">
              <TouchableOpacity
                onPress={confirmAddLives}
                className="bg-primary py-4 rounded-xl items-center"
                style={{ opacity: getTotalSelectedInModal() > 0 ? 1 : 0.5 }}
              >
                <Text className="text-white font-bold text-base">
                  ✓ Adicionar {getTotalSelectedInModal()} {getTotalSelectedInModal() === 1 ? 'vida' : 'vidas'}
                </Text>
              </TouchableOpacity>
            </View>
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

function getSimApiUrl(): string {
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    const apiHostname = hostname.replace(/^8081-/, "3000-");
    if (apiHostname !== hostname) {
      return `${protocol}//${apiHostname}`;
    }
    return `${protocol}//${hostname}`;
  }
  return "";
}
