import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TEAMS,
  MANAGERS,
  searchBroker,
  getManagerContact,
  type Broker,
  type Manager,
  type Team,
} from "@/data/brokers-data";
import { loadGestores, searchGestores as searchGestoresAsync, type Gestor } from "@/data/gestores-loader";

// Fotos dos gestores removidas - todos usam ícone padrão para uniformidade
const MANAGER_PHOTOS: Record<string, any> = {};

// Chave para armazenar executivos cadastrados localmente
const REGISTERED_EXECUTIVES_KEY = "@registered_executives";

// Funcao para formatar CNPJ
const formatCNPJ = (cnpj: string): string => {
  if (!cnpj) return "";
  const cleaned = cnpj.replace(/\D/g, "");
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

interface RegisteredExecutive {
  id: string;
  name: string;
  role: string;
  whatsapp: string;
  email: string;
  photoUrl: string;
  brokerCode: string;
  createdAt: string;
}

type TabType = "team" | "search" | "executives";

export default function ContactScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>("team");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Broker[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  
  // Estado para expandir/colapsar equipes
  const [expandedTeams, setExpandedTeams] = useState<string[]>(["camila-foiadelli"]);
  
  // Estados para executivos cadastrados
  const [executiveSearchQuery, setExecutiveSearchQuery] = useState("");
  const [registeredExecutives, setRegisteredExecutives] = useState<RegisteredExecutive[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<RegisteredExecutive[]>([]);

  // Carregar executivos cadastrados
  useEffect(() => {
    loadRegisteredExecutives();
  }, []);

  // Filtrar executivos quando a busca mudar
  useEffect(() => {
    if (executiveSearchQuery.length >= 2) {
      const query = executiveSearchQuery.toLowerCase();
      const filtered = registeredExecutives.filter(
        (exec) =>
          exec.name.toLowerCase().includes(query) ||
          exec.email?.toLowerCase().includes(query) ||
          exec.brokerCode?.toLowerCase().includes(query)
      );
      setFilteredExecutives(filtered);
    } else {
      setFilteredExecutives(registeredExecutives);
    }
  }, [executiveSearchQuery, registeredExecutives]);

  const loadRegisteredExecutives = async () => {
    try {
      const stored = await AsyncStorage.getItem(REGISTERED_EXECUTIVES_KEY);
      if (stored) {
        setRegisteredExecutives(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar executivos:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      try {
        const gestorResults = await searchGestoresAsync(query);
        const brokerResults = gestorResults.map((g) => ({
          name: g.razao_social,
          cnpj: g.cnpj,
          code: g.cod_hap,
          manager: g.gestor,
        })) as Broker[];
        setSearchResults(brokerResults);
      } catch (error) {
        console.error("Erro ao buscar gestores:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
    setSelectedBroker(null);
  };

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    const message = encodeURIComponent(
      `Olá ${name}, sou corretor Hapvida e gostaria de falar com você.`
    );
    Linking.openURL(`https://wa.me/${formattedPhone}?text=${message}`);
  };

  const openEmail = (email: string, name: string) => {
    const subject = encodeURIComponent("Contato Corretor Hapvida");
    Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  // Renderizar card de membro da equipe (compacto)
  const renderMemberCard = (member: Manager) => (
    <View
      key={member.name}
      className="bg-background rounded-lg border border-border/50 p-3 mb-2"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3 overflow-hidden">
<Text className="text-lg">👤</Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-foreground">
            {member.name}
          </Text>
          <Text className="text-xs text-muted">{member.role}</Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => openWhatsApp(member.whatsapp, member.name)}
            style={{ width: 36, height: 36, backgroundColor: '#EBF5FB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
          >
            <Text style={{ color: '#0a7ea4', fontSize: 14 }}>📱</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openEmail(member.email, member.name)}
            style={{ width: 36, height: 36, backgroundColor: '#EBF5FB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
          >
            <Text style={{ color: '#0a7ea4', fontSize: 14 }}>✉️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Renderizar card de equipe com hierarquia
  const renderTeamCard = (team: Team) => {
    const isExpanded = expandedTeams.includes(team.id);
    
    return (
      <View
        key={team.id}
        className="bg-surface rounded-xl border border-border mb-4 overflow-hidden"
      >
        {/* Header da equipe - Gerente Sênior */}
        <TouchableOpacity
          onPress={() => toggleTeam(team.id)}
          className="p-4"
          style={{ opacity: 1 }}
        >
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center mr-3 overflow-hidden">
  <Text className="text-2xl">👑</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-base font-bold text-foreground">
                  {team.senior.name}
                </Text>
                <View className="ml-2 bg-primary/20 px-2 py-0.5 rounded">
                  <Text className="text-xs text-primary font-medium">
                    {team.senior.role}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-muted mt-1">
                {team.members.length} membro(s) na equipe
              </Text>
            </View>
            <Text className="text-muted text-lg">
              {isExpanded ? "▲" : "▼"}
            </Text>
          </View>
          
          {/* Botões de contato do gerente sênior */}
          <View className="flex-row gap-2 mt-3">
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                openWhatsApp(team.senior.whatsapp, team.senior.name);
              }}
              style={{ flex: 1, backgroundColor: '#EBF5FB', paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
            >
              <Text style={{ color: '#0a7ea4', fontWeight: '600', fontSize: 14 }}>📱 WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                openEmail(team.senior.email, team.senior.name);
              }}
              style={{ flex: 1, backgroundColor: '#EBF5FB', paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
            >
              <Text style={{ color: '#0a7ea4', fontWeight: '600', fontSize: 14 }}>✉️ E-mail</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Membros da equipe (expandível) */}
        {isExpanded && team.members.length > 0 && (
          <View className="px-4 pb-4 pt-2 border-t border-border/50 bg-background/50">
            <Text className="text-xs font-medium text-muted mb-2">
              Equipe ({team.members.length})
            </Text>
            {team.members.map(member => renderMemberCard(member))}
          </View>
        )}
      </View>
    );
  };

  const renderExecutiveCard = (executive: RegisteredExecutive) => (
    <View
      key={executive.id}
      className="bg-surface rounded-xl border border-border p-4 mb-3"
    >
      <View className="flex-row items-center mb-3">
        <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center mr-3 overflow-hidden">
  <Text className="text-2xl">👤</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {executive.name}
          </Text>
          {executive.role && (
            <Text className="text-sm text-primary">{executive.role}</Text>
          )}
          {executive.brokerCode && (
            <Text className="text-xs text-muted">Código: {executive.brokerCode}</Text>
          )}
        </View>
      </View>

      <View className="flex-row gap-2">
        {executive.whatsapp && (
          <TouchableOpacity
            onPress={() => openWhatsApp(executive.whatsapp, executive.name)}
            style={{ flex: 1, backgroundColor: '#EBF5FB', paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
          >
            <Text style={{ color: '#0a7ea4', fontWeight: '600' }}>📱 WhatsApp</Text>
          </TouchableOpacity>
        )}

        {executive.email && (
          <TouchableOpacity
            onPress={() => openEmail(executive.email, executive.name)}
            style={{ flex: 1, backgroundColor: '#EBF5FB', paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
          >
            <Text style={{ color: '#0a7ea4', fontWeight: '600' }}>✉️ E-mail</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderExecutivesTab = () => (
    <View className="flex-1">
      <View className="bg-primary/10 rounded-xl p-4 mb-4">
        <Text className="text-base font-semibold text-primary mb-2">
          👥 Executivos Cadastrados
        </Text>
        <Text className="text-sm text-muted">
          Busque executivos e corretores que se cadastraram no app.
        </Text>
      </View>

      <View className="bg-surface rounded-xl border border-border flex-row items-center px-3 mb-4">
        <Text className="text-lg mr-2">🔍</Text>
        <TextInput
          placeholder="Buscar por nome, e-mail ou código..."
          placeholderTextColor={colors.muted}
          value={executiveSearchQuery}
          onChangeText={setExecutiveSearchQuery}
          className="flex-1 py-3 text-foreground"
          style={{ color: colors.foreground }}
          returnKeyType="search"
        />
        {executiveSearchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setExecutiveSearchQuery("")}>
            <Text className="text-muted text-lg">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredExecutives.length > 0 ? (
        <>
          <Text className="text-sm text-muted mb-2">
            {filteredExecutives.length} executivo(s) encontrado(s)
          </Text>
          {filteredExecutives.map((executive) => renderExecutiveCard(executive))}
        </>
      ) : registeredExecutives.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-4xl mb-2">👥</Text>
          <Text className="text-muted text-center">
            Nenhum executivo cadastrado ainda.{"\n"}
            Cadastre-se na aba "Conta" para aparecer aqui.
          </Text>
        </View>
      ) : (
        <View className="items-center py-8">
          <Text className="text-4xl mb-2">🔍</Text>
          <Text className="text-muted text-center">
            Nenhum executivo encontrado com essa busca.
          </Text>
        </View>
      )}
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
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3 overflow-hidden">
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
                  style={{ flex: 1, backgroundColor: '#EBF5FB', paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
                >
                  <Text style={{ color: '#0a7ea4', fontWeight: '600' }}>📱 WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const manager = getManagerContact(selectedBroker.manager);
                    if (manager) openEmail(manager.email, manager.name);
                  }}
                  style={{ flex: 1, backgroundColor: '#EBF5FB', paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4E8F2' }}
                >
                  <Text style={{ color: '#0a7ea4', fontWeight: '600' }}>✉️ E-mail</Text>
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
            className={`text-center font-medium text-xs ${
              activeTab === "team" ? "text-white" : "text-muted"
            }`}
          >
            Equipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("search")}
          className={`flex-1 py-2 rounded-lg ${
            activeTab === "search" ? "bg-primary" : ""
          }`}
        >
          <Text
            className={`text-center font-medium text-xs ${
              activeTab === "search" ? "text-white" : "text-muted"
            }`}
          >
            Meu Gestor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("executives")}
          className={`flex-1 py-2 rounded-lg ${
            activeTab === "executives" ? "bg-primary" : ""
          }`}
        >
          <Text
            className={`text-center font-medium text-xs ${
              activeTab === "executives" ? "text-white" : "text-muted"
            }`}
          >
            Executivos
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
            <View className="bg-primary/10 rounded-xl p-4 mb-4">
              <Text className="text-base font-semibold text-primary mb-1">
                👥 Equipes Comerciais Hapvida
              </Text>
              <Text className="text-xs text-muted">
                Clique em uma equipe para ver os membros. Cada equipe é liderada por um Gerente Sênior.
              </Text>
            </View>
            
            {/* Renderizar todas as equipes */}
            {TEAMS.map(team => renderTeamCard(team))}
          </>
        ) : activeTab === "search" ? (
          renderSearchTab()
        ) : (
          renderExecutivesTab()
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
