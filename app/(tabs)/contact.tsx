import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Linking,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  MANAGERS,
  searchBroker,
  getManagerContact,
  type Broker,
  type Manager,
} from "@/data/brokers-data";

type TabType = "team" | "search";

export default function ContactScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>("team");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Broker[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      const results = searchBroker(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setSelectedBroker(null);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `Olá ${name}, sou corretor Hapvida e gostaria de falar com você.`
    );
    Linking.openURL(`https://wa.me/${phone}?text=${message}`);
  };

  const openEmail = (email: string, name: string) => {
    const subject = encodeURIComponent("Contato Corretor Hapvida");
    Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  const renderManagerCard = (manager: Manager, index: number) => (
    <View
      key={manager.name}
      className="bg-surface rounded-xl border border-border p-4 mb-3"
    >
      <View className="flex-row items-center mb-3">
        <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center mr-3">
          <Text className="text-2xl">👤</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {manager.name}
          </Text>
          <Text className="text-sm text-primary">{manager.role}</Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => openWhatsApp(manager.whatsapp, manager.name)}
          className="flex-1 bg-success py-3 rounded-lg flex-row items-center justify-center"
          style={{ opacity: 1 }}
        >
          <Text className="text-white font-medium">📱 WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openEmail(manager.email, manager.name)}
          className="flex-1 bg-primary py-3 rounded-lg flex-row items-center justify-center"
          style={{ opacity: 1 }}
        >
          <Text className="text-white font-medium">✉️ E-mail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchTab = () => (
    <View className="flex-1">
      <View className="bg-primary/10 rounded-xl p-4 mb-4">
        <Text className="text-base font-semibold text-primary mb-2">
          🔍 Descubra seu Gestor Hapvida
        </Text>
        <Text className="text-sm text-muted">
          Busque pelo CNPJ, código Hapvida ou razão social da sua corretora para
          encontrar seu gestor comercial.
        </Text>
      </View>

      <View className="bg-surface rounded-xl border border-border flex-row items-center px-3 mb-4">
        <Text className="text-lg mr-2">🔍</Text>
        <TextInput
          placeholder="Digite CNPJ, código ou razão social..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={handleSearch}
          className="flex-1 py-3 text-foreground"
          style={{ color: colors.foreground }}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Text className="text-muted text-lg">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 && searchQuery.length < 3 && (
        <Text className="text-muted text-center mb-4">
          Digite pelo menos 3 caracteres para buscar
        </Text>
      )}

      {searchResults.length > 0 && !selectedBroker && (
        <View className="mb-4">
          <Text className="text-sm text-muted mb-2">
            {searchResults.length} resultado(s) encontrado(s)
          </Text>
          {searchResults.map((broker, index) => (
            <TouchableOpacity
              key={`${broker.cnpj}-${index}`}
              onPress={() => setSelectedBroker(broker)}
              className="bg-surface rounded-lg border border-border p-3 mb-2"
              style={{ opacity: 1 }}
            >
              <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                {broker.name}
              </Text>
              <Text className="text-xs text-muted">
                CNPJ: {broker.cnpj} | Código: {broker.code}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedBroker && (
        <View className="bg-surface rounded-xl border-2 border-primary p-4">
          <View className="mb-4">
            <Text className="text-xs text-muted mb-1">Corretora</Text>
            <Text className="text-base font-semibold text-foreground">
              {selectedBroker.name}
            </Text>
            <Text className="text-sm text-muted mt-1">
              CNPJ: {selectedBroker.cnpj}
            </Text>
            <Text className="text-sm text-muted">
              Código Hapvida: {selectedBroker.code}
            </Text>
          </View>

          <View className="border-t border-border pt-4">
            <Text className="text-xs text-muted mb-2">Seu Gestor Comercial</Text>
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
                <Text className="text-xl">👤</Text>
              </View>
              <View>
                <Text className="text-base font-semibold text-foreground">
                  {selectedBroker.manager}
                </Text>
                {getManagerContact(selectedBroker.manager) && (
                  <Text className="text-sm text-primary">
                    {getManagerContact(selectedBroker.manager)?.role}
                  </Text>
                )}
              </View>
            </View>

            {getManagerContact(selectedBroker.manager) ? (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    const manager = getManagerContact(selectedBroker.manager);
                    if (manager) openWhatsApp(manager.whatsapp, manager.name);
                  }}
                  className="flex-1 bg-success py-3 rounded-lg flex-row items-center justify-center"
                  style={{ opacity: 1 }}
                >
                  <Text className="text-white font-medium">📱 WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const manager = getManagerContact(selectedBroker.manager);
                    if (manager) openEmail(manager.email, manager.name);
                  }}
                  className="flex-1 bg-primary py-3 rounded-lg flex-row items-center justify-center"
                  style={{ opacity: 1 }}
                >
                  <Text className="text-white font-medium">✉️ E-mail</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-warning/10 rounded-lg p-3">
                <Text className="text-sm text-warning text-center">
                  Entre em contato com a equipe comercial para obter os dados de
                  contato do seu gestor.
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setSelectedBroker(null)}
            className="mt-4"
          >
            <Text className="text-primary text-center text-sm">
              ← Voltar aos resultados
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {searchQuery.length >= 3 && searchResults.length === 0 && (
        <View className="items-center py-8">
          <Text className="text-4xl mb-2">🔍</Text>
          <Text className="text-muted text-center">
            Nenhuma corretora encontrada.{"\n"}
            Verifique os dados e tente novamente.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="p-4 pb-0">
        <Text className="text-2xl font-bold text-foreground mb-1">
          Falar com o Gestor
        </Text>
        <Text className="text-sm text-muted mb-4">
          Entre em contato com a equipe comercial Hapvida
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row mx-4 mb-4 bg-surface rounded-xl p-1">
        <TouchableOpacity
          onPress={() => setActiveTab("team")}
          className={`flex-1 py-2 rounded-lg ${
            activeTab === "team" ? "bg-primary" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "team" ? "text-white" : "text-muted"
            }`}
          >
            Equipe Comercial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("search")}
          className={`flex-1 py-2 rounded-lg ${
            activeTab === "search" ? "bg-primary" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "search" ? "text-white" : "text-muted"
            }`}
          >
            Descubra seu Gestor
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "team" ? (
          <>
            {/* Gerente Sênior */}
            <Text className="text-sm font-medium text-muted mb-2 mt-2">
              Gerência
            </Text>
            {MANAGERS.filter((m) => m.role.includes("Gerente")).map(
              (manager, index) => renderManagerCard(manager, index)
            )}

            {/* Executivos */}
            <Text className="text-sm font-medium text-muted mb-2 mt-4">
              Executivos Comerciais
            </Text>
            {MANAGERS.filter((m) => m.role.includes("Executiv")).map(
              (manager, index) => renderManagerCard(manager, index)
            )}
          </>
        ) : (
          renderSearchTab()
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
