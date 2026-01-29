import { useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
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

// Produtos separados por tipo de rede
const REDE_PROPRIA = [
  { id: "nosso-medico", name: "Nosso Médico", description: "Rede própria Hapvida" },
  { id: "notrelife", name: "NotreLife", description: "Rede própria integrada" },
  { id: "basic", name: "Basic Referência", description: "Rede própria básica" },
];

const REDE_CREDENCIADA = [
  { id: "smart-200", name: "Smart 200", description: "Rede credenciada regional" },
  { id: "smart-300", name: "Smart 300", description: "Rede credenciada ampliada" },
  { id: "smart-400", name: "Smart 400", description: "Rede credenciada plus" },
  { id: "smart-500", name: "Smart 500", description: "Rede credenciada premium" },
  { id: "pleno", name: "Pleno", description: "Rede credenciada completa" },
  { id: "premium-900", name: "Premium 900", description: "Rede nacional premium" },
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

  const products = networkType === "propria" ? REDE_PROPRIA : REDE_CREDENCIADA;

  // Obter prestadores filtrados
  const providers = useMemo(() => {
    if (!selectedProduct) return [];
    return searchProviders(selectedProduct, searchQuery, {
      type: selectedType || undefined,
    });
  }, [selectedProduct, searchQuery, selectedType]);

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
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setSearchQuery("");
    setSelectedType(null);
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
              ? "Hospitais, clínicas e laboratórios próprios da Hapvida. Atendimento exclusivo com estrutura integrada."
              : "Prestadores parceiros credenciados. Ampla cobertura com hospitais e clínicas de referência."}
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
        <View className="bg-surface rounded-xl border border-border flex-row items-center px-3">
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
    </ScreenContainer>
  );
}
