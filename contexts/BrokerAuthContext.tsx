import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BROKER_TOKEN_KEY = "@broker_session_token";
const GUEST_MODE_KEY = "@broker_guest_mode";

export interface BrokerUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile: "vendedor" | "dono_corretora" | "adm" | "supervisor";
  sellerCode?: string | null;
  brokerageCode?: string | null;
  brokerageName?: string | null;
  createdAt?: Date;
}

interface BrokerAuthState {
  broker: BrokerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
}

interface BrokerAuthContextType extends BrokerAuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile: "vendedor" | "dono_corretora" | "adm" | "supervisor";
  sellerCode?: string;
  brokerageCode?: string;
  brokerageName?: string;
}

const BrokerAuthContext = createContext<BrokerAuthContextType | undefined>(undefined);

// Variável global para o token (acessível pelo trpc client)
let _currentBrokerToken: string | null = null;

export function getBrokerToken(): string | null {
  return _currentBrokerToken;
}

// Helper para obter a URL base da API
function getApiUrl(): string {
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    // Dev sandbox: 8081-xxx -> 3000-xxx (para tRPC legado)
    const apiHostname = hostname.replace(/^8081-/, "3000-");
    if (apiHostname !== hostname) {
      return `${protocol}//${apiHostname}`;
    }
    // Produção no Vercel: same origin (usa /api/auth/* serverless functions)
    return "";
  }
  return "";
}

// Detectar se estamos em produção (Vercel) ou dev (sandbox)
function isProduction(): boolean {
  if (typeof window !== "undefined" && window.location) {
    const { hostname } = window.location;
    return !hostname.includes("manus.computer") && hostname !== "localhost";
  }
  return false;
}

export function BrokerAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BrokerAuthState>({
    broker: null,
    token: null,
    isAuthenticated: false,
    isGuest: false,
    isLoading: true,
  });

  const initialCheckDone = useRef(false);

  // Carregar token salvo ou modo guest ao iniciar
  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;

    (async () => {
      try {
        // Verificar modo guest primeiro
        const guestMode = await AsyncStorage.getItem(GUEST_MODE_KEY);
        if (guestMode === "true") {
          setState({
            broker: null,
            token: null,
            isAuthenticated: false,
            isGuest: true,
            isLoading: false,
          });
          return;
        }

        const savedToken = await AsyncStorage.getItem(BROKER_TOKEN_KEY);
        if (savedToken) {
          _currentBrokerToken = savedToken;
          setState((prev) => ({ ...prev, token: savedToken }));

          // Verificar se o token ainda é válido
          try {
            let brokerData: BrokerUser | null = null;

            if (isProduction()) {
              // Produção: usar Vercel serverless function
              const response = await fetch(`/api/auth/me`, {
                headers: {
                  Authorization: `Bearer ${savedToken}`,
                  "Content-Type": "application/json",
                },
              });
              if (response.ok) {
                const data = await response.json();
                brokerData = data.broker || null;
              }
            } else {
              // Dev: usar tRPC
              const response = await fetch(
                `${getApiUrl()}/api/trpc/broker.me?input=${encodeURIComponent(JSON.stringify({}))}`,
                {
                  headers: {
                    Authorization: `Bearer ${savedToken}`,
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );
              if (response.ok) {
                const data = await response.json();
                brokerData = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
              }
            }

            if (brokerData) {
              setState({
                broker: brokerData,
                token: savedToken,
                isAuthenticated: true,
                isGuest: false,
                isLoading: false,
              });
              return;
            }
          } catch {
            console.warn("[BrokerAuth] Backend indisponível, entrando como visitante");
          }

          // Token inválido ou backend offline, limpar
          await AsyncStorage.removeItem(BROKER_TOKEN_KEY);
          _currentBrokerToken = null;
        }
      } catch (error) {
        console.error("[BrokerAuth] Error loading saved session:", error);
      }

      setState({
        broker: null,
        token: null,
        isAuthenticated: false,
        isGuest: false,
        isLoading: false,
      });
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      let result: any = null;
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (isProduction()) {
        // Produção: usar Vercel serverless function
        const response = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.toLowerCase(), password }),
        });

        const data = await response.json();
        if (data.success) {
          result = data;
        } else {
          errorMessage = data.error || errorMessage;
        }
      } else {
        // Dev: usar tRPC
        const response = await fetch(`${getApiUrl()}/api/trpc/broker.login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            json: { email: email.toLowerCase(), password },
          }),
        });

        const data = await response.json();
        const trpcResult = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
        if (trpcResult?.success) {
          result = trpcResult;
        } else {
          const errorData = Array.isArray(data) ? data[0]?.error : data?.error;
          errorMessage = errorData?.json?.message || errorData?.message || errorMessage;
        }
      }

      if (result?.success) {
        _currentBrokerToken = result.token;
        await AsyncStorage.setItem(BROKER_TOKEN_KEY, result.token);
        await AsyncStorage.removeItem(GUEST_MODE_KEY);

        setState({
          broker: result.broker,
          token: result.token,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
        });

        return { success: true };
      }

      return { success: false, error: errorMessage };
    } catch (error: any) {
      console.error("[BrokerAuth] Login error:", error);
      return {
        success: false,
        error: "Erro de conexão. Verifique sua internet.",
      };
    }
  }, []);

  const register = useCallback(async (registerData: RegisterData) => {
    try {
      let result: any = null;
      let errorMessage = "Erro ao cadastrar. Tente novamente.";

      if (isProduction()) {
        // Produção: usar Vercel serverless function
        const response = await fetch(`/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            email: registerData.email.toLowerCase(),
            password: registerData.password,
            profile: registerData.profile,
            sellerCode: registerData.sellerCode || null,
            brokerageCode: registerData.brokerageCode || null,
            brokerageName: registerData.brokerageName || null,
          }),
        });

        const data = await response.json();
        if (data.success) {
          result = data;
        } else {
          errorMessage = data.error || errorMessage;
        }
      } else {
        // Dev: usar tRPC
        const response = await fetch(`${getApiUrl()}/api/trpc/broker.register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            json: {
              firstName: registerData.firstName,
              lastName: registerData.lastName,
              email: registerData.email.toLowerCase(),
              password: registerData.password,
              profile: registerData.profile,
              sellerCode: registerData.sellerCode || null,
              brokerageCode: registerData.brokerageCode || null,
              brokerageName: registerData.brokerageName || null,
            },
          }),
        });

        const data = await response.json();
        const trpcResult = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
        if (trpcResult?.success) {
          result = trpcResult;
        } else {
          const errorData = Array.isArray(data) ? data[0]?.error : data?.error;
          errorMessage = errorData?.json?.message || errorData?.message || errorMessage;
        }
      }

      if (result?.success) {
        _currentBrokerToken = result.token;
        await AsyncStorage.setItem(BROKER_TOKEN_KEY, result.token);
        await AsyncStorage.removeItem(GUEST_MODE_KEY);

        setState({
          broker: result.broker,
          token: result.token,
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
        });

        return { success: true };
      }

      return { success: false, error: errorMessage };
    } catch (error: any) {
      console.error("[BrokerAuth] Register error:", error);
      return {
        success: false,
        error: "Erro de conexão. Verifique sua internet.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (_currentBrokerToken) {
        if (isProduction()) {
          await fetch(`/api/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${_currentBrokerToken}`,
              "Content-Type": "application/json",
            },
          }).catch(() => {});
        } else {
          await fetch(`${getApiUrl()}/api/trpc/broker.logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${_currentBrokerToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ json: {} }),
          }).catch(() => {});
        }
      }
    } catch (error) {
      console.error("[BrokerAuth] Logout error:", error);
    }

    _currentBrokerToken = null;
    await AsyncStorage.removeItem(BROKER_TOKEN_KEY);
    await AsyncStorage.removeItem(GUEST_MODE_KEY);

    setState({
      broker: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
    });
  }, []);

  const enterGuestMode = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_MODE_KEY, "true");
    await AsyncStorage.removeItem(BROKER_TOKEN_KEY);
    _currentBrokerToken = null;

    setState({
      broker: null,
      token: null,
      isAuthenticated: false,
      isGuest: true,
      isLoading: false,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!_currentBrokerToken) return;

    try {
      let brokerData: BrokerUser | null = null;

      if (isProduction()) {
        const response = await fetch(`/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${_currentBrokerToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          brokerData = data.broker || null;
        }
      } else {
        const response = await fetch(
          `${getApiUrl()}/api/trpc/broker.me?input=${encodeURIComponent(JSON.stringify({}))}`,
          {
            headers: {
              Authorization: `Bearer ${_currentBrokerToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          brokerData = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
        }
      }

      if (brokerData) {
        setState((prev) => ({
          ...prev,
          broker: brokerData,
        }));
      }
    } catch (error) {
      console.error("[BrokerAuth] Refresh error:", error);
    }
  }, []);

  return (
    <BrokerAuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
        enterGuestMode,
      }}
    >
      {children}
    </BrokerAuthContext.Provider>
  );
}

export function useBrokerAuth() {
  const context = useContext(BrokerAuthContext);
  if (context === undefined) {
    throw new Error("useBrokerAuth must be used within a BrokerAuthProvider");
  }
  return context;
}
