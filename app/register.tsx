import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useBrokerAuth, RegisterData } from "@/contexts/BrokerAuthContext";

const PROFILES = [
  { value: "vendedor" as const, label: "Vendedor" },
  { value: "dono_corretora" as const, label: "Dono de Corretora" },
  { value: "adm" as const, label: "ADM" },
  { value: "supervisor" as const, label: "Supervisor" },
];

export default function RegisterScreen() {
  const router = useRouter();
  const colors = useColors();
  const { register } = useBrokerAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState<RegisterData["profile"] | null>(null);
  const [sellerCode, setSellerCode] = useState("");
  const [brokerageCode, setBrokerageCode] = useState("");
  const [brokerageName, setBrokerageName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleRegister = async () => {
    setErrorMessage("");

    // Validações
    if (!firstName.trim()) {
      setErrorMessage("Informe seu nome");
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage("Informe seu sobrenome");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Informe seu e-mail");
      return;
    }
    if (!email.includes("@")) {
      setErrorMessage("E-mail inválido");
      return;
    }
    if (!password) {
      setErrorMessage("Crie uma senha");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }
    if (!profile) {
      setErrorMessage("Selecione seu perfil");
      return;
    }

    setSubmitting(true);
    try {
      const result = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        profile,
        sellerCode: sellerCode.trim() || undefined,
        brokerageCode: brokerageCode.trim() || undefined,
        brokerageName: brokerageName.trim() || undefined,
      });

      if (result.success) {
        router.replace("/(tabs)");
      } else {
        setErrorMessage(result.error || "Erro ao cadastrar");
      }
    } catch (error) {
      setErrorMessage("Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (hasError?: boolean) => ({
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: hasError ? colors.error : colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.foreground,
  });

  const labelStyle = {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.foreground,
    marginBottom: 6,
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>📋</Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: colors.foreground,
                textAlign: "center",
              }}
            >
              Criar Conta
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Cadastre-se para acessar o simulador
            </Text>
          </View>

          {/* Formulário */}
          <View style={{ gap: 14 }}>
            {/* Nome e Sobrenome */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Nome *</Text>
                <TextInput
                  style={inputStyle()}
                  value={firstName}
                  onChangeText={(t) => {
                    setFirstName(t);
                    setErrorMessage("");
                  }}
                  placeholder="Nome"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="words"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Sobrenome *</Text>
                <TextInput
                  style={inputStyle()}
                  value={lastName}
                  onChangeText={(t) => {
                    setLastName(t);
                    setErrorMessage("");
                  }}
                  placeholder="Sobrenome"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* E-mail */}
            <View>
              <Text style={labelStyle}>E-mail *</Text>
              <TextInput
                style={inputStyle()}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErrorMessage("");
                }}
                placeholder="seu@email.com"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Senha */}
            <View>
              <Text style={labelStyle}>Senha *</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{ ...inputStyle(), paddingRight: 50 }}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setErrorMessage("");
                  }}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar Senha */}
            <View>
              <Text style={labelStyle}>Confirmar Senha *</Text>
              <TextInput
                style={inputStyle()}
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  setErrorMessage("");
                }}
                placeholder="Repita a senha"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
              />
            </View>

            {/* Perfil (Dropdown) */}
            <View>
              <Text style={labelStyle}>Perfil *</Text>
              <TouchableOpacity
                onPress={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{
                  ...inputStyle(),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: profile
                      ? colors.foreground
                      : colors.muted,
                  }}
                >
                  {profile
                    ? PROFILES.find((p) => p.value === profile)?.label
                    : "Selecione seu perfil"}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>
                  {showProfileDropdown ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>

              {showProfileDropdown && (
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    marginTop: 4,
                    overflow: "hidden",
                  }}
                >
                  {PROFILES.map((p, index) => (
                    <TouchableOpacity
                      key={p.value}
                      onPress={() => {
                        setProfile(p.value);
                        setShowProfileDropdown(false);
                        setErrorMessage("");
                      }}
                      style={{
                        padding: 14,
                        borderBottomWidth: index < PROFILES.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                        backgroundColor:
                          profile === p.value
                            ? `${colors.primary}15`
                            : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color:
                            profile === p.value
                              ? colors.primary
                              : colors.foreground,
                          fontWeight: profile === p.value ? "600" : "400",
                        }}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Código de Vendedor (condicional) */}
            {profile === "vendedor" && (
              <View>
                <Text style={labelStyle}>
                  Código de Vendedor Hapvida
                </Text>
                <TextInput
                  style={inputStyle()}
                  value={sellerCode}
                  onChangeText={setSellerCode}
                  placeholder="Código ou e-mail se não souber"
                  placeholderTextColor={colors.muted}
                />
              </View>
            )}

            {/* Código da Corretora */}
            <View>
              <Text style={labelStyle}>Código da Corretora</Text>
              <TextInput
                style={inputStyle()}
                value={brokerageCode}
                onChangeText={setBrokerageCode}
                placeholder="Código da corretora"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Nome/Razão Social da Corretora */}
            <View>
              <Text style={labelStyle}>
                Razão Social / Nome da Corretora
              </Text>
              <TextInput
                style={inputStyle()}
                value={brokerageName}
                onChangeText={setBrokerageName}
                placeholder="Se não souber o código, informe o nome"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Mensagem de erro */}
            {errorMessage ? (
              <View
                style={{
                  backgroundColor: `${colors.error}15`,
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    color: colors.error,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Botão Cadastrar */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={submitting}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                opacity: submitting ? 0.7 : 1,
                marginTop: 8,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Criar Conta
                </Text>
              )}
            </TouchableOpacity>

            {/* Link para login */}
            <View style={{ alignItems: "center", marginTop: 12 }}>
              <Text style={{ color: colors.muted, fontSize: 14 }}>
                Já tem conta?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/login" as any)}
                style={{ marginTop: 4 }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Fazer login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
