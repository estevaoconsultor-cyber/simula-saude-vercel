import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useUser } from "@/contexts/UserContext";

// @ts-ignore
const logoIcon = require("@/assets/images/icon.png");

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useUser();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [corretora, setCorretora] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function formatWhatsApp(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!nome.trim()) newErrors.nome = "Informe seu nome";
    if (whatsapp.replace(/\D/g, "").length < 10) newErrors.whatsapp = "WhatsApp inválido";
    if (!email.trim() || !email.includes("@")) newErrors.email = "E-mail inválido";
    if (!corretora.trim()) newErrors.corretora = "Informe sua corretora";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleRegister() {
    if (!validate()) return;
    const userData = {
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim().toLowerCase(),
      corretora: corretora.trim(),
      registeredAt: new Date().toISOString(),
    };
    register(userData);
    // Enviar dados para Google Sheets via Apps Script
    try {
      fetch("https://script.google.com/macros/s/AKfycbyW-cYtem1GHZ3NUxtS7tU_7bJ2Kq4ttdvCuyyOsDIwNNfM70oEwz4fX6ehFFqTKB6N/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(userData),
      }).catch(() => {});
    } catch (_) {}
    router.replace("/(tabs)");
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 30,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Image
              source={logoIcon}
              style={{ width: 64, height: 64, borderRadius: 14 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#11181C", marginTop: 10 }}>
              Simula Saúde
            </Text>
            <Text style={{ fontSize: 14, color: "#687076", marginTop: 4, textAlign: "center" }}>
              Cadastre-se para acessar o simulador
            </Text>
          </View>

          {/* Formulário */}
          <View style={{ gap: 14 }}>
            {/* Nome */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 5 }}>
                Nome completo
              </Text>
              <TextInput
                value={nome}
                onChangeText={(t) => { setNome(t); setErrors((e) => ({ ...e, nome: "" })); }}
                placeholder="Seu nome"
                placeholderTextColor="#9BA1A6"
                autoCapitalize="words"
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  fontSize: 15,
                  color: "#11181C",
                  borderWidth: errors.nome ? 1.5 : 1,
                  borderColor: errors.nome ? "#EF4444" : "#E5E7EB",
                }}
              />
              {errors.nome ? (
                <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 3 }}>{errors.nome}</Text>
              ) : null}
            </View>

            {/* WhatsApp */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 5 }}>
                WhatsApp
              </Text>
              <TextInput
                value={whatsapp}
                onChangeText={(t) => { setWhatsapp(formatWhatsApp(t)); setErrors((e) => ({ ...e, whatsapp: "" })); }}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#9BA1A6"
                keyboardType="phone-pad"
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  fontSize: 15,
                  color: "#11181C",
                  borderWidth: errors.whatsapp ? 1.5 : 1,
                  borderColor: errors.whatsapp ? "#EF4444" : "#E5E7EB",
                }}
              />
              {errors.whatsapp ? (
                <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 3 }}>{errors.whatsapp}</Text>
              ) : null}
            </View>

            {/* E-mail */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 5 }}>
                E-mail
              </Text>
              <TextInput
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: "" })); }}
                placeholder="seu@email.com"
                placeholderTextColor="#9BA1A6"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  fontSize: 15,
                  color: "#11181C",
                  borderWidth: errors.email ? 1.5 : 1,
                  borderColor: errors.email ? "#EF4444" : "#E5E7EB",
                }}
              />
              {errors.email ? (
                <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 3 }}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Corretora */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 5 }}>
                Corretora
              </Text>
              <TextInput
                value={corretora}
                onChangeText={(t) => { setCorretora(t); setErrors((e) => ({ ...e, corretora: "" })); }}
                placeholder="Nome da sua corretora"
                placeholderTextColor="#9BA1A6"
                autoCapitalize="words"
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  fontSize: 15,
                  color: "#11181C",
                  borderWidth: errors.corretora ? 1.5 : 1,
                  borderColor: errors.corretora ? "#EF4444" : "#E5E7EB",
                }}
              />
              {errors.corretora ? (
                <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 3 }}>{errors.corretora}</Text>
              ) : null}
            </View>
          </View>

          {/* Botão */}
          <TouchableOpacity
            onPress={handleRegister}
            style={{
              backgroundColor: "#0a7ea4",
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: "center",
              marginTop: 24,
              shadowColor: "#0a7ea4",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Acessar Simulador
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 11,
              color: "#9BA1A6",
              textAlign: "center",
              marginTop: 14,
              lineHeight: 16,
            }}
          >
            Seus dados são usados apenas para identificação interna.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
