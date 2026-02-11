import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Redirect } from "expo-router";
import { useBrokerAuth } from "@/contexts/BrokerAuthContext";
import { useColors } from "@/hooks/use-colors";

/**
 * Componente que protege o acesso ao conteúdo.
 * Permite acesso se autenticado OU em modo guest (visitante).
 * Se nenhum dos dois, redireciona para /login.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isGuest, isLoading } = useBrokerAuth();
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

  if (!isAuthenticated && !isGuest) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}
