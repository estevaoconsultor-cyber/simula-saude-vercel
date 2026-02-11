import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useBrokerAuth } from "@/contexts/BrokerAuthContext";
import { getBrokerToken } from "@/contexts/BrokerAuthContext";

const PROFILE_LABELS: Record<string, string> = {
  vendedor: "Vendedor",
  dono_corretora: "Dono de Corretora",
  adm: "ADM",
  supervisor: "Supervisor",
};

interface DeviceSession {
  id: number;
  deviceName: string | null;
  lastIp: string | null;
  lastUsedAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export default function AccountScreen() {
  const colors = useColors();
  const { broker, logout, isAuthenticated } = useBrokerAuth();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const fetchSessions = useCallback(async () => {
    const token = getBrokerToken();
    if (!token) return;

    setLoadingSessions(true);
    try {
      const response = await fetch(
        `${getApiUrl()}/api/trpc/broker.sessions?input=${encodeURIComponent(JSON.stringify({}))}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
        if (Array.isArray(result)) {
          setSessions(result);
        }
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated, fetchSessions]);

  const handleRevokeSession = async (sessionId: number) => {
    const token = getBrokerToken();
    if (!token) return;

    Alert.alert(
      "Encerrar Sessão",
      "Deseja encerrar esta sessão? O dispositivo precisará fazer login novamente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Encerrar",
          style: "destructive",
          onPress: async () => {
            setRevokingId(sessionId);
            try {
              await fetch(`${getApiUrl()}/api/trpc/broker.revokeSession`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ json: { sessionId } }),
              });
              await fetchSessions();
            } catch (error) {
              console.error("Error revoking session:", error);
            } finally {
              setRevokingId(null);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (!broker) {
    return (
      <ScreenContainer className="p-4">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header do Perfil */}
        <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {broker.firstName[0]}{broker.lastName[0]}
            </Text>
          </View>
          <Text style={styles.profileName}>
            {broker.firstName} {broker.lastName}
          </Text>
          <Text style={styles.profileEmail}>{broker.email}</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>
              {PROFILE_LABELS[broker.profile] || broker.profile}
            </Text>
          </View>
        </View>

        {/* Informações do Perfil */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Informações do Perfil
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.muted }]}>Nome</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {broker.firstName} {broker.lastName}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.muted }]}>E-mail</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {broker.email}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.muted }]}>Perfil</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {PROFILE_LABELS[broker.profile] || broker.profile}
            </Text>
          </View>

          {broker.sellerCode && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>Cód. Vendedor</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {broker.sellerCode}
                </Text>
              </View>
            </>
          )}

          {broker.brokerageCode && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>Cód. Corretora</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {broker.brokerageCode}
                </Text>
              </View>
            </>
          )}

          {broker.brokerageName && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>Corretora</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {broker.brokerageName}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Dispositivos Conectados */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Dispositivos Conectados
            </Text>
            <Text style={[styles.deviceCount, { color: colors.muted }]}>
              {sessions.length}/3
            </Text>
          </View>

          {loadingSessions ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 12 }} />
          ) : sessions.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Nenhuma sessão ativa
            </Text>
          ) : (
            sessions.map((session, index) => (
              <View key={session.id}>
                {index > 0 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
                <View style={styles.sessionRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ fontSize: 18 }}>
                        {session.deviceName?.includes("iPhone") || session.deviceName?.includes("iPad")
                          ? "📱"
                          : session.deviceName?.includes("Android")
                          ? "📱"
                          : "💻"}
                      </Text>
                      <Text style={[styles.sessionDevice, { color: colors.foreground }]}>
                        {session.deviceName || "Dispositivo desconhecido"}
                      </Text>
                      {session.isCurrent && (
                        <View style={[styles.currentBadge, { backgroundColor: colors.success }]}>
                          <Text style={styles.currentBadgeText}>Atual</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.sessionInfo, { color: colors.muted }]}>
                      Último acesso: {formatDate(session.lastUsedAt)}
                    </Text>
                    {session.lastIp && (
                      <Text style={[styles.sessionInfo, { color: colors.muted }]}>
                        IP: {session.lastIp}
                      </Text>
                    )}
                  </View>
                  {!session.isCurrent && (
                    <TouchableOpacity
                      onPress={() => handleRevokeSession(session.id)}
                      disabled={revokingId === session.id}
                      style={[styles.revokeButton, { borderColor: colors.error }]}
                    >
                      {revokingId === session.id ? (
                        <ActivityIndicator size="small" color={colors.error} />
                      ) : (
                        <Text style={[styles.revokeText, { color: colors.error }]}>
                          Encerrar
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: colors.error }]}
        >
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Sair da Conta
          </Text>
        </TouchableOpacity>

        {/* Versão */}
        <Text style={[styles.versionText, { color: colors.muted }]}>
          Simulador Hapvida v2.1.0
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

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

const styles = StyleSheet.create({
  profileHeader: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  profileBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  profileBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  deviceCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  sessionDevice: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionInfo: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 26,
  },
  currentBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currentBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  revokeButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  revokeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  logoutButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  versionText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
});
