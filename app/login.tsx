import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useBrokerAuth } from "@/contexts/BrokerAuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const { login, enterGuestMode, isLoading } = useBrokerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Informe seu e-mail");
      return;
    }
    if (!password) {
      setErrorMessage("Informe sua senha");
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        router.replace("/(tabs)");
      } else {
        setErrorMessage(result.error || "Erro ao fazer login");
      }
    } catch (error) {
      setErrorMessage("Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo e Título */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text style={{ fontSize: 56, marginBottom: 12 }}>🏥</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: colors.foreground,
                textAlign: "center",
              }}
            >
              Simulador Hapvida
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Acesso exclusivo para corretores
            </Text>
          </View>

          {/* Formulário */}
          <View style={{ gap: 16 }}>
            {/* E-mail */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.foreground,
                  marginBottom: 6,
                }}
              >
                E-mail
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: errorMessage && !email ? colors.error : colors.border,
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 16,
                  color: colors.foreground,
                }}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessage("");
                }}
                placeholder="seu@email.com"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* Senha */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.foreground,
                  marginBottom: 6,
                }}
              >
                Senha
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: errorMessage && !password ? colors.error : colors.border,
                    borderRadius: 12,
                    padding: 14,
                    paddingRight: 50,
                    fontSize: 16,
                    color: colors.foreground,
                  }}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMessage("");
                  }}
                  placeholder="Sua senha"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
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

            {/* Mensagem de erro */}
            {errorMessage ? (
              <View
                style={{
                  backgroundColor: `${colors.error}15`,
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text style={{ color: colors.error, fontSize: 14, textAlign: "center" }}>
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Botão Login */}
            <TouchableOpacity
              onPress={handleLogin}
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
                <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            {/* Link Esqueci minha senha */}
            <View style={{ alignItems: "center", marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/forgot-password" as any)}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </View>

            {/* Separador */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text style={{ color: colors.muted, fontSize: 13, marginHorizontal: 12 }}>ou</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            {/* Botão Acessar sem cadastro */}
            <TouchableOpacity
              onPress={async () => {
                await enterGuestMode();
                router.replace("/(tabs)");
              }}
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}>
                Acessar sem cadastro
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                Orçamentos salvos apenas neste dispositivo
              </Text>
            </TouchableOpacity>

            {/* Link para cadastro */}
            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text style={{ color: colors.muted, fontSize: 14 }}>
                Quer salvar orçamentos na nuvem?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/register" as any)}
                style={{ marginTop: 4 }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Criar conta gratuita
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
