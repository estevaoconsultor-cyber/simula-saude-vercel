import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { PhotoEditor } from "@/components/photo-editor";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Chave para armazenar dados locais do perfil
const LOCAL_PROFILE_KEY = "@executive_profile";
const REGISTERED_EXECUTIVES_KEY = "@registered_executives";

interface LocalProfile {
  name: string;
  role: string;
  whatsapp: string;
  email: string;
  photoUrl: string;
  brokerCode: string;
}

export default function AccountScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // Estados do formulário
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [brokerCode, setBrokerCode] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  
  // Estados de UI
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasLocalProfile, setHasLocalProfile] = useState(false);
  
  // Carregar perfil local ao iniciar
  useEffect(() => {
    loadLocalProfile();
  }, []);
  
  const loadLocalProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCAL_PROFILE_KEY);
      if (stored) {
        const profile: LocalProfile = JSON.parse(stored);
        setName(profile.name || "");
        setRole(profile.role || "");
        setWhatsapp(profile.whatsapp || "");
        setEmail(profile.email || "");
        setBrokerCode(profile.brokerCode || "");
        setPhotoUrl(profile.photoUrl || "");
        setHasLocalProfile(true);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil local:", error);
    }
  };
  
  const saveLocalProfile = async () => {
    try {
      const profile: LocalProfile = {
        name,
        role,
        whatsapp,
        email,
        brokerCode,
        photoUrl,
      };
      await AsyncStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
      
      // Salvar também na lista de executivos cadastrados
      await saveToRegisteredExecutives(profile);
      
      setHasLocalProfile(true);
      return true;
    } catch (error) {
      console.error("Erro ao salvar perfil local:", error);
      return false;
    }
  };
  
  const saveToRegisteredExecutives = async (profile: LocalProfile) => {
    try {
      const stored = await AsyncStorage.getItem(REGISTERED_EXECUTIVES_KEY);
      let executives = stored ? JSON.parse(stored) : [];
      
      // Verificar se já existe pelo email ou código
      const existingIndex = executives.findIndex(
        (e: any) => e.email === profile.email || e.brokerCode === profile.brokerCode
      );
      
      const executiveData = {
        id: existingIndex >= 0 ? executives[existingIndex].id : Date.now().toString(),
        name: profile.name,
        role: profile.role,
        whatsapp: profile.whatsapp,
        email: profile.email,
        photoUrl: profile.photoUrl,
        brokerCode: profile.brokerCode,
        createdAt: existingIndex >= 0 ? executives[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        executives[existingIndex] = executiveData;
      } else {
        executives.push(executiveData);
      }
      
      await AsyncStorage.setItem(REGISTERED_EXECUTIVES_KEY, JSON.stringify(executives));
    } catch (error) {
      console.error("Erro ao salvar na lista de executivos:", error);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return;
    }
    
    setSaving(true);
    try {
      const success = await saveLocalProfile();
      if (success) {
        setIsEditing(false);
        Alert.alert("Sucesso", "Perfil salvo com sucesso!");
      } else {
        Alert.alert("Erro", "Não foi possível salvar o perfil");
      }
    } finally {
      setSaving(false);
    }
  };
  
  const handlePhotoSave = async (uri: string) => {
    setPhotoUrl(uri);
    // Salvar automaticamente quando a foto é alterada
    const profile: LocalProfile = {
      name,
      role,
      whatsapp,
      email,
      brokerCode,
      photoUrl: uri,
    };
    await AsyncStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  };
  
  const handleClearProfile = () => {
    Alert.alert(
      "Limpar Perfil",
      "Tem certeza que deseja limpar todos os dados do perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(LOCAL_PROFILE_KEY);
            setName("");
            setRole("");
            setWhatsapp("");
            setEmail("");
            setBrokerCode("");
            setPhotoUrl("");
            setHasLocalProfile(false);
            setIsEditing(false);
          },
        },
      ]
    );
  };
  
  const openWhatsApp = () => {
    if (whatsapp) {
      const cleanNumber = whatsapp.replace(/\D/g, "");
      const url = `https://wa.me/55${cleanNumber}`;
      Linking.openURL(url);
    }
  };
  
  const openEmail = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  // Renderizar formulário de cadastro/edição
  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Foto de Perfil */}
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={() => setShowPhotoEditor(true)}
      >
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={styles.profilePhoto}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.photoPlaceholder, { backgroundColor: colors.surface }]}>
            <Text style={[styles.photoPlaceholderText, { color: colors.muted }]}>
              Adicionar{"\n"}Foto
            </Text>
          </View>
        )}
        <View style={[styles.editPhotoButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.editPhotoText}>✎</Text>
        </View>
      </TouchableOpacity>
      
      {/* Campos do formulário */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Nome *</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome completo"
          placeholderTextColor={colors.muted}
          editable={isEditing || !hasLocalProfile}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Cargo</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border },
          ]}
          value={role}
          onChangeText={setRole}
          placeholder="Ex: Executivo Comercial"
          placeholderTextColor={colors.muted}
          editable={isEditing || !hasLocalProfile}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>WhatsApp</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border },
          ]}
          value={whatsapp}
          onChangeText={setWhatsapp}
          placeholder="(11) 99999-9999"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          editable={isEditing || !hasLocalProfile}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>E-mail</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={isEditing || !hasLocalProfile}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.foreground }]}>Código Hapvida</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border },
          ]}
          value={brokerCode}
          onChangeText={setBrokerCode}
          placeholder="Código do corretor"
          placeholderTextColor={colors.muted}
          editable={isEditing || !hasLocalProfile}
        />
      </View>
      
      {/* Botões de ação */}
      {(isEditing || !hasLocalProfile) ? (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {hasLocalProfile ? "Salvar Alterações" : "Criar Perfil"}
              </Text>
            )}
          </TouchableOpacity>
          
          {hasLocalProfile && (
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => {
                loadLocalProfile();
                setIsEditing(false);
              }}
            >
              <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          
          {/* Botões de contato rápido */}
          <View style={styles.quickActions}>
            {whatsapp && (
              <TouchableOpacity
                style={[styles.quickButton, { backgroundColor: "#25D366" }]}
                onPress={openWhatsApp}
              >
                <Text style={styles.quickButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            )}
            {email && (
              <TouchableOpacity
                style={[styles.quickButton, { backgroundColor: colors.primary }]}
                onPress={openEmail}
              >
                <Text style={styles.quickButtonText}>E-mail</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: colors.error }]}
            onPress={handleClearProfile}
          >
            <Text style={[styles.clearButtonText, { color: colors.error }]}>
              Limpar Perfil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Minha Conta
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {hasLocalProfile
              ? "Gerencie seu perfil de executivo"
              : "Crie seu perfil para aparecer na busca"}
          </Text>
        </View>
        
        {/* Formulário */}
        {renderForm()}
        
        {/* Informação */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.foreground }]}>
            ℹ️ Como funciona
          </Text>
          <Text style={[styles.infoText, { color: colors.muted }]}>
            Ao criar seu perfil, outros usuários poderão encontrar você na busca
            de executivos. Mantenha seus dados de contato atualizados para
            facilitar a comunicação com clientes e parceiros.
          </Text>
        </View>
      </ScrollView>
      
      {/* Editor de Foto */}
      <PhotoEditor
        visible={showPhotoEditor}
        onClose={() => setShowPhotoEditor(false)}
        onSave={handlePhotoSave}
        currentPhoto={photoUrl}
        executiveName={name || "executive"}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    gap: 16,
  },
  photoContainer: {
    alignSelf: "center",
    marginBottom: 16,
    position: "relative",
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: {
    fontSize: 14,
    textAlign: "center",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  editPhotoText: {
    color: "#FFF",
    fontSize: 18,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  editButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  quickButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  clearButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
