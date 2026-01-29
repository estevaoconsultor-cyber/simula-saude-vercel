import { useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  getProvidersByProduct,
  searchProviders,
  getUniqueTypes,
  getUniqueNeighborhoods,
  getProviderCount,
  NetworkProvider,
} from "@/data/network-data";
import { PRODUCTS } from "@/data/hapvida-prices";

// Produtos com rede disponível
const PRODUCTS_WITH_NETWORK = [
  { id: "smart-200", name: "Smart 200", color: "#0066CC" },
  { id: "smart-300", name: "Smart 300", color: "#0077DD" },
  { id: "smart-400", name: "Smart 400", color: "#0088EE" },
  { id: "smart-500", name: "Smart 500", color: "#0099FF" },
  { id: "nosso-medico", name: "Nosso Médico", color: "#00AA66" },
  { id: "premium-900", name: "Premium 900", color: "#9933CC" },
  { id: "basic", name: "Basic Referência", color: "#666666" },
  { id: "pleno", name: "Pleno", color: "#FF6600" },
  { id: "notrelife", name: "NotreLife", color: "#CC3366" },
];

export default function NetworkScreen() {
  const colors = useColors();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
    // Formatar telefone brasileiro
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

  const renderProvider = ({ item }: { item: NetworkProvider }) => (
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

      {item.specialties.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mt-2">
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

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="p-4 pb-0">
        <Text className="text-2xl font-bold text-foreground mb-1">
          Rede de Atendimento
        </Text>
        <Text className="text-sm text-muted mb-4">
          Selecione um produto para ver os prestadores disponíveis
        </Text>
      </View>

      {/* Seleção de Produto */}
      <View className="px-4 mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {PRODUCTS_WITH_NETWORK.map((product) => {
            const count = getProviderCount(product.id);
            const isSelected = selectedProduct === product.id;
            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => {
                  setSelectedProduct(isSelected ? null : product.id);
                  setSearchQuery("");
                  setSelectedType(null);
                }}
                className={`px-4 py-2 rounded-full border ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? "text-white" : "text-foreground"
                  }`}
                >
                  {product.name}
                </Text>
                {count > 0 && (
                  <Text
                    className={`text-xs ${
                      isSelected ? "text-white/80" : "text-muted"
                    }`}
                  >
                    {count} prestadores
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {selectedProduct ? (
        <>
          {/* Busca e Filtros */}
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

          {/* Resultados */}
          <View className="px-4 mb-2 flex-row items-center justify-between">
            <Text className="text-sm text-muted">
              {providers.length} prestadores encontrados
            </Text>
          </View>

          <FlatList
            data={providers}
            renderItem={renderProvider}
            keyExtractor={(item, index) => `${item.name}-${item.address}-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center py-8">
                <Text className="text-4xl mb-2">🔍</Text>
                <Text className="text-muted text-center">
                  Nenhum prestador encontrado.{"\n"}
                  Tente ajustar os filtros ou busca.
                </Text>
              </View>
            }
          />
        </>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Informações sobre a rede */}
          <View className="bg-primary/10 rounded-xl p-4 mb-4">
            <Text className="text-base font-semibold text-primary mb-2">
              Rede Própria Hapvida
            </Text>
            <Text className="text-sm text-muted">
              Hospitais, clínicas e laboratórios próprios da Hapvida NotreDame
              Intermédica. Disponível para todos os produtos.
            </Text>
          </View>

          <View className="bg-success/10 rounded-xl p-4 mb-4">
            <Text className="text-base font-semibold text-success mb-2">
              Rede Credenciada
            </Text>
            <Text className="text-sm text-muted">
              Prestadores parceiros em toda região. Disponível para planos
              Advance, Premium e Infinity.
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-base font-semibold text-foreground mb-3">
              Produtos Disponíveis
            </Text>
            {PRODUCTS_WITH_NETWORK.map((product) => {
              const count = getProviderCount(product.id);
              return (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => setSelectedProduct(product.id)}
                  className="flex-row items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <Text className="text-sm text-foreground">{product.name}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-muted mr-2">
                      {count} prestadores
                    </Text>
                    <Text className="text-muted">›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
