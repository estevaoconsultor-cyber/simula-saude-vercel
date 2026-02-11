import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Redirect } from "expo-router";
import { useBrokerAuth } from "@/contexts/BrokerAuthContext";
import { useColors } from "@/hooks/use-colors";

/**
 * Componente que protege o acesso ao conteúdo.
 * Se o usuário não está autenticado, redireciona para /login.
 * Se está carregando, mostra um spinner.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useBrokerAuth();
  const colors = useColors();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.muted, marginTop: 12, fontSize: 14 }}>
          Verificando acesso...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}
