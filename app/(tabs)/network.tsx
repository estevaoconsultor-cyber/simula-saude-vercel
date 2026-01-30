import { useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  getProvidersByProduct,
  searchProviders,
  getUniqueTypes,
  getProviderCount,
  NetworkProvider,
} from "@/data/network-data";

type NetworkType = "propria" | "credenciada";

// Produtos REDE PRÓPRIA: Nosso Médico, Smart 150, 200, 200 UP, Notre Life, Basic, Pleno
const REDE_PROPRIA = [
  { id: "nosso-medico", name: "Nosso Médico", description: "Rede própria Hapvida - Clínicas regionais" },
  { id: "smart-150", name: "Smart 150", description: "Rede própria - Ambulatorial" },
  { id: "smart-200", name: "Smart 200", description: "Rede própria - Enfermaria" },
  { id: "smart-200-up", name: "Smart 200 UP", description: "Rede própria - Enfermaria ampliada" },
  { id: "notrelife", name: "NotreLife", description: "Rede própria integrada" },
  { id: "basic", name: "Basic Referência", description: "Rede própria básica" },
  { id: "pleno", name: "Pleno", description: "Rede própria completa" },
];

// Produtos REDE CREDENCIADA: Smart 300+, Advance, Premium, Infinity
const REDE_CREDENCIADA = [
  { id: "smart-300", name: "Smart 300", description: "Rede credenciada regional" },
  { id: "smart-400", name: "Smart 400", description: "Rede credenciada ampliada" },
  { id: "smart-500", name: "Smart 500", description: "Rede credenciada premium" },
  { id: "advance-600", name: "Advance 600", description: "Rede credenciada executiva" },
  { id: "advance-700", name: "Advance 700", description: "Rede credenciada executiva plus" },
  { id: "premium-900q", name: "Premium 900Q", description: "Rede nacional premium com rede DO" },
  { id: "premium-900-1", name: "Premium 900.1", description: "Rede nacional premium sem rede DO" },
  { id: "infinity", name: "Infinity", description: "Rede nacional completa - Todos os hospitais" },
];

// Estados disponíveis
const ESTADOS = [
  { id: "SP", name: "São Paulo" },
  { id: "RJ", name: "Rio de Janeiro" },
  { id: "MG", name: "Minas Gerais" },
  { id: "BA", name: "Bahia" },
  { id: "PR", name: "Paraná" },
  { id: "RS", name: "Rio Grande do Sul" },
  { id: "PE", name: "Pernambuco" },
  { id: "CE", name: "Ceará" },
];

// Serviços disponíveis por tipo de estabelecimento
const SERVICES_BY_TYPE: Record<string, string[]> = {
  "HOSPITAL": ["Pronto-Socorro", "Internação", "Cirurgia", "UTI", "Maternidade"],
  "CLINICA": ["Consultas", "Exames Simples", "Procedimentos Ambulatoriais"],
  "LABORATORIO": ["Exames de Sangue", "Exames de Imagem", "Análises Clínicas"],
  "SERVICO": ["Terapias", "Fisioterapia", "Fonoaudiologia", "Psicologia"],
};

export default function NetworkScreen() {
  const colors = useColors();
  const [networkType, setNetworkType] = useState<NetworkType>("propria");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros de geolocalização
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);
  const [selectedBairro, setSelectedBairro] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const products = networkType === "propria" ? REDE_PROPRIA : REDE_CREDENCIADA;

  // Obter prestadores filtrados
  const providers = useMemo(() => {
    if (!selectedProduct) return [];
    let results = searchProviders(selectedProduct, searchQuery, {
      type: selectedType || undefined,
    });
    
    // Aplicar filtros de localização
    if (selectedEstado) {
      results = results.filter(p => {
        // Assumindo que cidade contém o estado ou podemos inferir
        const cityLower = p.city.toLowerCase();
        if (selectedEstado === "SP") {
          return cityLower.includes("são paulo") || cityLower.includes("sao paulo") || 
                 cityLower.includes("campinas") || cityLower.includes("santos") ||
                 cityLower.includes("guarulhos") || cityLower.includes("osasco") ||
                 cityLower.includes("santo andré") || cityLower.includes("são bernardo") ||
                 cityLower.includes("jundiaí") || cityLower.includes("mogi");
        }
        return true;
      });
    }
    
    if (selectedCidade) {
      results = results.filter(p => 
        p.city.toLowerCase().includes(selectedCidade.toLowerCase())
      );
    }
    
    if (selectedBairro) {
      results = results.filter(p => 
        p.neighborhood?.toLowerCase().includes(selectedBairro.toLowerCase())
      );
    }
    
    return results;
  }, [selectedProduct, searchQuery, selectedType, selectedEstado, selectedCidade, selectedBairro]);

  // Cidades disponíveis baseado nos prestadores
  const availableCities = useMemo(() => {
    if (!selectedProduct) return [];
    const allProviders = getProvidersByProduct(selectedProduct);
    const cities = [...new Set(allProviders.map(p => p.city))].filter(Boolean).sort();
    return cities;
  }, [selectedProduct]);

  // Bairros disponíveis baseado na cidade selecionada
  const availableBairros = useMemo(() => {
    if (!selectedProduct || !selectedCidade) return [];
    const allProviders = getProvidersByProduct(selectedProduct);
    const bairros = [...new Set(
      allProviders
        .filter(p => p.city.toLowerCase().includes(selectedCidade.toLowerCase()))
        .map(p => p.neighborhood)
    )].filter(Boolean).sort();
    return bairros as string[];
  }, [selectedProduct, selectedCidade]);

  // Tipos disponíveis para o produto selecionado
  const availableTypes = useMemo(() => {
    if (!selectedProduct) return [];
    return getUniqueTypes(selectedProduct);
  }, [selectedProduct]);

  const formatPhone = (phone: string) => {
    if (!phone) return "Não informado";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getTypeIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("hospital")) return "🏥";
    if (typeLower.includes("laborat")) return "🔬";
    if (typeLower.includes("clinica") || typeLower.includes("consult")) return "🏨";
    if (typeLower.includes("servico") || typeLower.includes("terapia")) return "💊";
    return "📍";
  };

  const getServicesForType = (type: string): string[] => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("hospital")) return SERVICES_BY_TYPE["HOSPITAL"];
    if (typeLower.includes("laborat")) return SERVICES_BY_TYPE["LABORATORIO"];
    if (typeLower.includes("clinica") || typeLower.includes("consult")) return SERVICES_BY_TYPE["CLINICA"];
    if (typeLower.includes("servico") || typeLower.includes("terapia")) return SERVICES_BY_TYPE["SERVICO"];
    return [];
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
    setSearchQuery("");
    setSelectedType(null);
    setSelectedEstado(null);
    setSelectedCidade(null);
    setSelectedBairro(null);
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setSearchQuery("");
    setSelectedType(null);
    setSelectedEstado(null);
    setSelectedCidade(null);
    setSelectedBairro(null);
  };

  const clearLocationFilters = () => {
    setSelectedEstado(null);
    setSelectedCidade(null);
    setSelectedBairro(null);
  };

  const renderProvider = ({ item }: { item: NetworkProvider }) => {
    const services = getServicesForType(item.type);
    
    return (
      <View className="bg-surface rounded-xl border border-border p-4 mb-3">
        <View className="flex-row items-start mb-2">
          <Text className="text-2xl mr-3">{getTypeIcon(item.type)}</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground" numberOfLines={2}>
              {item.name}
            </Text>
            <Text className="text-xs text-muted mt-1" numberOfLines={1}>
              {item.type || "Estabelecimento"}
            </Text>
          </View>
        </View>

        <View className="mb-2">
          <Text className="text-sm text-muted" numberOfLines={2}>
            📍 {item.address}
            {item.neighborhood ? `, ${item.neighborhood}` : ""}
          </Text>
          <Text className="text-sm text-muted">🏙️ {item.city}</Text>
          <Text className="text-sm text-primary">📞 {formatPhone(item.phone)}</Text>
        </View>

        {/* Serviços disponíveis */}
        {services.length > 0 && (
          <View className="mt-2 pt-2 border-t border-border">
            <Text className="text-xs font-medium text-muted mb-1">
              Serviços disponíveis:
            </Text>
            <View className="flex-row flex-wrap gap-1">
              {services.map((service, idx) => (
                <View key={idx} className="bg-success/10 px-2 py-1 rounded">
                  <Text className="text-xs text-success">{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Especialidades */}
        {item.specialties.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mt-2 pt-2 border-t border-border">
            <Text className="text-xs text-muted w-full mb-1">Especialidades:</Text>
            {item.specialties.slice(0, 4).map((spec, idx) => (
              <View key={idx} className="bg-primary/10 px-2 py-1 rounded">
                <Text className="text-xs text-primary" numberOfLines={1}>
                  {spec}
                </Text>
              </View>
            ))}
            {item.specialties.length > 4 && (
              <View className="bg-muted/20 px-2 py-1 rounded">
                <Text className="text-xs text-muted">
                  +{item.specialties.length - 4}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // Tela de seleção de produto
  if (!selectedProduct) {
    return (
      <ScreenContainer className="flex-1">
        <View className="p-4 pb-0">
          <Text className="text-2xl font-bold text-foreground mb-1">
            Rede de Atendimento
          </Text>
          <Text className="text-sm text-muted mb-4">
            Selecione o tipo de rede e o produto
          </Text>
        </View>

        {/* Tabs Própria/Credenciada */}
        <View className="flex-row mx-4 mb-4 bg-surface rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setNetworkType("propria")}
            className={`flex-1 py-3 rounded-lg ${
              networkType === "propria" ? "bg-primary" : ""
            }`}
            style={{ opacity: 1 }}
          >
            <Text
              className={`text-center font-medium ${
                networkType === "propria" ? "text-white" : "text-muted"
              }`}
            >
              🏥 Rede Própria
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNetworkType("credenciada")}
            className={`flex-1 py-3 rounded-lg ${
              networkType === "credenciada" ? "bg-primary" : ""
            }`}
            style={{ opacity: 1 }}
          >
            <Text
              className={`text-center font-medium ${
                networkType === "credenciada" ? "text-white" : "text-muted"
              }`}
            >
              🤝 Rede Credenciada
            </Text>
          </TouchableOpacity>
        </View>

        {/* Descrição */}
        <View className="mx-4 mb-4 bg-primary/10 rounded-xl p-4">
          <Text className="text-sm text-primary font-medium mb-1">
            {networkType === "propria" ? "Rede Própria Hapvida" : "Rede Credenciada"}
          </Text>
          <Text className="text-xs text-muted">
            {networkType === "propria"
              ? "Nosso Médico, Smart 150, 200, 200 UP, NotreLife, Basic e Pleno. Hospitais, clínicas e laboratórios próprios da Hapvida."
              : "Smart 300, 400, 500, Advance 600/700, Premium 900Q/900.1 e Infinity. Prestadores parceiros credenciados de referência."}
          </Text>
        </View>

        {/* Lista de Produtos */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Text className="text-base font-semibold text-foreground mb-3">
            Selecione o Produto
          </Text>

          {products.map((product) => {
            const count = getProviderCount(product.id);
            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => handleSelectProduct(product.id)}
                className="bg-surface rounded-xl border border-border p-4 mb-3 flex-row items-center justify-between"
                style={{ opacity: 1 }}
              >
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {product.name}
                  </Text>
                  <Text className="text-sm text-muted">{product.description}</Text>
                  {count > 0 && (
                    <Text className="text-xs text-primary mt-1">
                      {count} prestadores disponíveis
                    </Text>
                  )}
                </View>
                <Text className="text-xl text-muted">›</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Tela de prestadores
  const selectedProductInfo = [...REDE_PROPRIA, ...REDE_CREDENCIADA].find(
    (p) => p.id === selectedProduct
  );

  const hasLocationFilter = selectedEstado || selectedCidade || selectedBairro;

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="p-4 pb-0">
        <TouchableOpacity onPress={handleBack} className="mb-2">
          <Text className="text-primary">← Voltar</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground mb-1">
          {selectedProductInfo?.name}
        </Text>
        <Text className="text-sm text-muted mb-4">
          {providers.length} prestadores encontrados
        </Text>
      </View>

      {/* Busca */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-surface rounded-xl border border-border px-4">
          <Text className="text-lg mr-2">🔍</Text>
          <TextInput
            placeholder="Buscar por nome, bairro ou especialidade..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 py-3 text-foreground"
            style={{ color: colors.foreground }}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text className="text-muted text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botão de Filtro de Localização */}
        <TouchableOpacity
          onPress={() => setShowLocationModal(true)}
          className={`mt-2 flex-row items-center justify-between bg-surface rounded-lg border ${hasLocationFilter ? "border-primary" : "border-border"} p-3`}
          style={{ opacity: 1 }}
        >
          <View className="flex-row items-center flex-1">
            <Text className="text-lg mr-2">📍</Text>
            <Text className={`text-sm ${hasLocationFilter ? "text-primary font-medium" : "text-foreground"}`}>
              {hasLocationFilter 
                ? `${selectedEstado || ""} ${selectedCidade ? `> ${selectedCidade}` : ""} ${selectedBairro ? `> ${selectedBairro}` : ""}`.trim()
                : "Filtrar por localização"
              }
            </Text>
          </View>
          {hasLocationFilter && (
            <TouchableOpacity onPress={clearLocationFilters} className="ml-2">
              <Text className="text-error text-sm">Limpar</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Filtro por tipo */}
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="mt-2 flex-row items-center justify-between bg-surface rounded-lg border border-border p-3"
          style={{ opacity: 1 }}
        >
          <Text className="text-sm text-foreground">
            {selectedType || "Filtrar por tipo de estabelecimento"}
          </Text>
          <Text className="text-muted">{showFilters ? "▼" : "▶"}</Text>
        </TouchableOpacity>

        {showFilters && (
          <View className="mt-2 bg-surface rounded-lg border border-border p-3">
            <TouchableOpacity
              onPress={() => {
                setSelectedType(null);
                setShowFilters(false);
              }}
              className={`p-2 rounded ${!selectedType ? "bg-primary/10" : ""}`}
              style={{ opacity: 1 }}
            >
              <Text
                className={`text-sm ${
                  !selectedType ? "text-primary font-medium" : "text-foreground"
                }`}
              >
                Todos os tipos
              </Text>
            </TouchableOpacity>
            {availableTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setSelectedType(type);
                  setShowFilters(false);
                }}
                className={`p-2 rounded ${
                  selectedType === type ? "bg-primary/10" : ""
                }`}
                style={{ opacity: 1 }}
              >
                <Text
                  className={`text-sm ${
                    selectedType === type
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  {getTypeIcon(type)} {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Lista de Prestadores */}
      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text className="text-4xl mb-2">🔍</Text>
            <Text className="text-muted text-center">
              Nenhum prestador encontrado.{"\n"}
              Tente ajustar os filtros.
            </Text>
          </View>
        }
      />

      {/* Modal de Filtro de Localização */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View 
            className="bg-background rounded-t-3xl max-h-[80%]"
            style={{ backgroundColor: colors.background }}
          >
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">
                  📍 Filtrar por Localização
                </Text>
                <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                  <Text className="text-muted text-2xl">×</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="p-4">
              {/* Estado */}
              <Text className="text-sm font-semibold text-foreground mb-2">
                Estado
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                <TouchableOpacity
                  onPress={() => {
                    setSelectedEstado(null);
                    setSelectedCidade(null);
                    setSelectedBairro(null);
                  }}
                  className={`px-3 py-2 rounded-lg ${!selectedEstado ? "bg-primary" : "bg-surface border border-border"}`}
                  style={{ opacity: 1 }}
                >
                  <Text className={`text-sm ${!selectedEstado ? "text-white font-medium" : "text-foreground"}`}>
                    Todos
                  </Text>
                </TouchableOpacity>
                {ESTADOS.map((estado) => (
                  <TouchableOpacity
                    key={estado.id}
                    onPress={() => {
                      setSelectedEstado(estado.id);
                      setSelectedCidade(null);
                      setSelectedBairro(null);
                    }}
                    className={`px-3 py-2 rounded-lg ${selectedEstado === estado.id ? "bg-primary" : "bg-surface border border-border"}`}
                    style={{ opacity: 1 }}
                  >
                    <Text className={`text-sm ${selectedEstado === estado.id ? "text-white font-medium" : "text-foreground"}`}>
                      {estado.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cidade */}
              <Text className="text-sm font-semibold text-foreground mb-2">
                Cidade
              </Text>
              {availableCities.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCidade(null);
                        setSelectedBairro(null);
                      }}
                      className={`px-3 py-2 rounded-lg ${!selectedCidade ? "bg-primary" : "bg-surface border border-border"}`}
                      style={{ opacity: 1 }}
                    >
                      <Text className={`text-sm ${!selectedCidade ? "text-white font-medium" : "text-foreground"}`}>
                        Todas
                      </Text>
                    </TouchableOpacity>
                    {availableCities.slice(0, 20).map((cidade) => (
                      <TouchableOpacity
                        key={cidade}
                        onPress={() => {
                          setSelectedCidade(cidade);
                          setSelectedBairro(null);
                        }}
                        className={`px-3 py-2 rounded-lg ${selectedCidade === cidade ? "bg-primary" : "bg-surface border border-border"}`}
                        style={{ opacity: 1 }}
                      >
                        <Text className={`text-sm ${selectedCidade === cidade ? "text-white font-medium" : "text-foreground"}`}>
                          {cidade}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text className="text-sm text-muted mb-4">
                  Selecione um produto para ver as cidades disponíveis
                </Text>
              )}

              {/* Bairro */}
              <Text className="text-sm font-semibold text-foreground mb-2">
                Bairro
              </Text>
              {selectedCidade && availableBairros.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => setSelectedBairro(null)}
                      className={`px-3 py-2 rounded-lg ${!selectedBairro ? "bg-primary" : "bg-surface border border-border"}`}
                      style={{ opacity: 1 }}
                    >
                      <Text className={`text-sm ${!selectedBairro ? "text-white font-medium" : "text-foreground"}`}>
                        Todos
                      </Text>
                    </TouchableOpacity>
                    {availableBairros.slice(0, 30).map((bairro) => (
                      <TouchableOpacity
                        key={bairro}
                        onPress={() => setSelectedBairro(bairro)}
                        className={`px-3 py-2 rounded-lg ${selectedBairro === bairro ? "bg-primary" : "bg-surface border border-border"}`}
                        style={{ opacity: 1 }}
                      >
                        <Text className={`text-sm ${selectedBairro === bairro ? "text-white font-medium" : "text-foreground"}`}>
                          {bairro}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text className="text-sm text-muted mb-4">
                  {selectedCidade ? "Nenhum bairro disponível" : "Selecione uma cidade para ver os bairros"}
                </Text>
              )}

              {/* Botão Aplicar */}
              <TouchableOpacity
                onPress={() => setShowLocationModal(false)}
                className="bg-primary py-3 rounded-xl items-center mt-4"
                style={{ opacity: 1 }}
              >
                <Text className="text-white font-semibold">Aplicar Filtros</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
