import { useState } from "react";
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

// Dados da rede de atendimento (resumo)
const NETWORK_CATEGORIES = [
  {
    id: "propria",
    name: "Rede Própria Hapvida",
    description: "Hospitais, clínicas e laboratórios próprios",
    icon: "🏥",
    products: ["Nosso Médico", "Smart 200", "Smart 200 UP", "Smart 300", "Notre Life"],
  },
  {
    id: "credenciada",
    name: "Rede Credenciada",
    description: "Prestadores parceiros em toda região",
    icon: "🏨",
    products: ["Smart 400", "Smart 500", "Advance 600", "Advance 700", "Premium 900", "Infinity"],
  },
];

const FACILITIES = [
  {
    id: "1",
    name: "Hospital e Maternidade São Luiz",
    type: "Hospital",
    address: "R. Haddock Lobo, 585 - Cerqueira César",
    city: "São Paulo",
    phone: "(11) 3394-0000",
    category: "propria",
    services: ["Pronto Socorro", "Internação", "Maternidade", "UTI"],
  },
  {
    id: "2",
    name: "Clínica Hapvida Tatuapé",
    type: "Clínica",
    address: "R. Apucarana, 428 - Tatuapé",
    city: "São Paulo",
    phone: "(11) 2227-0383",
    category: "propria",
    services: ["Consultas", "Exames", "Terapias"],
  },
  {
    id: "3",
    name: "Laboratório Hapvida Santana",
    type: "Laboratório",
    address: "R. Banco das Palmas, 298 - Santana",
    city: "São Paulo",
    phone: "(11) 2959-5449",
    category: "propria",
    services: ["Exames Laboratoriais", "Coleta"],
  },
  {
    id: "4",
    name: "Hospital São Camilo",
    type: "Hospital",
    address: "Av. Pompeia, 1178 - Pompeia",
    city: "São Paulo",
    phone: "(11) 3677-4444",
    category: "credenciada",
    services: ["Pronto Socorro", "Internação", "Cirurgias"],
  },
  {
    id: "5",
    name: "Hospital Sírio-Libanês",
    type: "Hospital",
    address: "R. Dona Adma Jafet, 91 - Bela Vista",
    city: "São Paulo",
    phone: "(11) 3155-0200",
    category: "credenciada",
    services: ["Pronto Socorro", "Internação", "Oncologia", "Cardiologia"],
  },
  {
    id: "6",
    name: "DASA - Diagnósticos da América",
    type: "Laboratório",
    address: "Av. Paulista, 2073 - Bela Vista",
    city: "São Paulo",
    phone: "(11) 3191-0114",
    category: "credenciada",
    services: ["Exames de Imagem", "Laboratoriais"],
  },
];

export default function NetworkScreen() {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFacilities = FACILITIES.filter((f) => {
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="p-4 pb-0">
          <Text className="text-2xl font-bold text-foreground mb-1">
            Rede de Atendimento
          </Text>
          <Text className="text-sm text-muted mb-4">
            Hospitais, clínicas e laboratórios disponíveis
          </Text>

          {/* Busca */}
          <View className="bg-surface rounded-xl border border-border flex-row items-center px-3 mb-4">
            <Text className="text-lg mr-2">🔍</Text>
            <TextInput
              placeholder="Buscar por nome, tipo ou cidade..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 py-3 text-foreground"
              style={{ color: colors.foreground }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text className="text-muted">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categorias */}
        <View className="px-4 mb-4">
          <Text className="text-base font-semibold text-foreground mb-3">
            Tipo de Rede
          </Text>
          <View className="gap-2">
            {NETWORK_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id
                  )
                }
                className={`rounded-xl p-4 border ${
                  selectedCategory === cat.id
                    ? "bg-primary/10 border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3">{cat.icon}</Text>
                  <View className="flex-1">
                    <Text
                      className={`text-base font-semibold ${
                        selectedCategory === cat.id
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {cat.name}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      {cat.description}
                    </Text>
                    <View className="flex-row flex-wrap mt-2 gap-1">
                      {cat.products.slice(0, 3).map((prod) => (
                        <View
                          key={prod}
                          className="bg-background px-2 py-0.5 rounded"
                        >
                          <Text className="text-xs text-muted">{prod}</Text>
                        </View>
                      ))}
                      {cat.products.length > 3 && (
                        <View className="bg-background px-2 py-0.5 rounded">
                          <Text className="text-xs text-muted">
                            +{cat.products.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lista de Estabelecimentos */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-foreground">
              Estabelecimentos
            </Text>
            <Text className="text-sm text-muted">
              {filteredFacilities.length} encontrados
            </Text>
          </View>

          <View className="gap-3">
            {filteredFacilities.map((facility) => (
              <View
                key={facility.id}
                className="bg-surface rounded-xl border border-border p-4"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {facility.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View
                        className={`px-2 py-0.5 rounded mr-2 ${
                          facility.category === "propria"
                            ? "bg-primary/10"
                            : "bg-success/10"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            facility.category === "propria"
                              ? "text-primary"
                              : "text-success"
                          }`}
                        >
                          {facility.category === "propria"
                            ? "Rede Própria"
                            : "Credenciado"}
                        </Text>
                      </View>
                      <Text className="text-xs text-muted">{facility.type}</Text>
                    </View>
                  </View>
                </View>

                <View className="mb-2">
                  <Text className="text-sm text-muted">📍 {facility.address}</Text>
                  <Text className="text-sm text-muted">🏙️ {facility.city}</Text>
                  <Text className="text-sm text-primary">📞 {facility.phone}</Text>
                </View>

                <View className="flex-row flex-wrap gap-1">
                  {facility.services.map((service) => (
                    <View
                      key={service}
                      className="bg-background px-2 py-1 rounded"
                    >
                      <Text className="text-xs text-muted">{service}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View className="px-4 mt-6">
          <View className="bg-primary/10 rounded-xl p-4">
            <Text className="text-sm font-semibold text-primary mb-1">
              Rede Completa
            </Text>
            <Text className="text-xs text-muted">
              A rede de atendimento varia de acordo com o produto contratado.
              Planos Advance e Premium têm acesso à rede credenciada completa,
              incluindo hospitais de referência.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
