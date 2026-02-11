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

// Helper para obter a URL da API
function getApiUrl(): string {
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

function isProduction(): boolean {
  if (typeof window !== "undefined" && window.location) {
    const { hostname } = window.location;
    return !hostname.includes("manus.computer") && hostname !== "localhost";
  }
  return false;
}

type Step = "email" | "code" | "success";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRequestCode = async () => {
    setErrorMessage("");
    if (!email.trim()) {
      setErrorMessage("Informe seu e-mail");
      return;
    }

    setSubmitting(true);
    try {
      let success = false;

      if (isProduction()) {
        const response = await fetch(`/api/auth/password-reset-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        const data = await response.json();
        if (data.success) {
          success = true;
        } else {
          setErrorMessage(data.error || "Erro ao solicitar redefinição.");
        }
      } else {
        const response = await fetch(`${getApiUrl()}/api/trpc/passwordReset.request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: { email: email.trim().toLowerCase() } }),
        });
        const data = await response.json();
        const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
        if (result?.success) {
          success = true;
        } else {
          const errorData = Array.isArray(data) ? data[0]?.error : data?.error;
          setErrorMessage(errorData?.json?.message || "Erro ao solicitar redefinição.");
        }
      }

      if (success) {
        setSuccessMessage("Se o e-mail estiver cadastrado, você receberá um código de redefinição. Verifique seu e-mail ou entre em contato com o suporte.");
        setStep("code");
      }
    } catch (error) {
      setErrorMessage("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage("");

    if (!code.trim() || code.trim().length !== 6) {
      setErrorMessage("Informe o código de 6 dígitos");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    setSubmitting(true);
    try {
      let success = false;

      if (isProduction()) {
        const response = await fetch(`/api/auth/password-reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            code: code.trim(),
            newPassword,
          }),
        });
        const data = await response.json();
        if (data.success) {
          success = true;
        } else {
          setErrorMessage(data.error || "Código inválido ou expirado.");
        }
      } else {
        const response = await fetch(`${getApiUrl()}/api/trpc/passwordReset.reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            json: {
              email: email.trim().toLowerCase(),
              code: code.trim(),
              newPassword,
            },
          }),
        });
        const data = await response.json();
        const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
        if (result?.success) {
          success = true;
        } else {
          const errorData = Array.isArray(data) ? data[0]?.error : data?.error;
          setErrorMessage(errorData?.json?.message || "Código inválido ou expirado.");
        }
      }

      if (success) {
        setStep("success");
      }
    } catch (error) {
      setErrorMessage("Erro de conexão. Tente novamente.");
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
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔑</Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: colors.foreground,
                textAlign: "center",
              }}
            >
              {step === "email" && "Esqueceu sua senha?"}
              {step === "code" && "Redefinir Senha"}
              {step === "success" && "Senha Redefinida!"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
                textAlign: "center",
                marginTop: 8,
                paddingHorizontal: 20,
              }}
            >
              {step === "email" && "Informe seu e-mail cadastrado para receber um código de redefinição."}
              {step === "code" && "Digite o código de 6 dígitos que você recebeu e sua nova senha."}
              {step === "success" && "Sua senha foi alterada com sucesso. Faça login com sua nova senha."}
            </Text>
          </View>

          {/* Step: Email */}
          {step === "email" && (
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 6,
                  }}
                >
                  E-mail cadastrado
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
                  returnKeyType="done"
                  onSubmitEditing={handleRequestCode}
                />
              </View>

              {errorMessage ? (
                <View style={{ backgroundColor: `${colors.error}15`, borderRadius: 8, padding: 12 }}>
                  <Text style={{ color: colors.error, fontSize: 14, textAlign: "center" }}>
                    {errorMessage}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleRequestCode}
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
                    Enviar Código
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Step: Code + New Password */}
          {step === "code" && (
            <View style={{ gap: 16 }}>
              {successMessage ? (
                <View style={{ backgroundColor: `${colors.success}15`, borderRadius: 8, padding: 12 }}>
                  <Text style={{ color: colors.success, fontSize: 14, textAlign: "center" }}>
                    {successMessage}
                  </Text>
                </View>
              ) : null}

              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 6 }}
                >
                  Código de 6 dígitos
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 24,
                    color: colors.foreground,
                    textAlign: "center",
                    letterSpacing: 8,
                  }}
                  value={code}
                  onChangeText={(text) => {
                    setCode(text.replace(/[^0-9]/g, "").slice(0, 6));
                    setErrorMessage("");
                  }}
                  placeholder="000000"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 6 }}
                >
                  Nova Senha
                </Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      padding: 14,
                      paddingRight: 50,
                      fontSize: 16,
                      color: colors.foreground,
                    }}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
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

              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 6 }}
                >
                  Confirmar Nova Senha
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 16,
                    color: colors.foreground,
                  }}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrorMessage("");
                  }}
                  placeholder="Repita a nova senha"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPassword}
                />
              </View>

              {errorMessage ? (
                <View style={{ backgroundColor: `${colors.error}15`, borderRadius: 8, padding: 12 }}>
                  <Text style={{ color: colors.error, fontSize: 14, textAlign: "center" }}>
                    {errorMessage}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleResetPassword}
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
                    Redefinir Senha
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setStep("email");
                  setCode("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                style={{ alignItems: "center", marginTop: 8 }}
              >
                <Text style={{ color: colors.primary, fontSize: 14 }}>
                  ← Voltar para e-mail
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <View style={{ gap: 16 }}>
              <View style={{ backgroundColor: `${colors.success}15`, borderRadius: 12, padding: 16 }}>
                <Text style={{ color: colors.success, fontSize: 16, textAlign: "center", fontWeight: "600" }}>
                  ✅ Senha alterada com sucesso!
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.replace("/login" as any)}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>
                  Fazer Login
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Voltar ao login */}
          {step !== "success" && (
            <View style={{ alignItems: "center", marginTop: 24 }}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={{ color: colors.primary, fontSize: 14 }}>
                  ← Voltar ao login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
