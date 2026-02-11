import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";

const BROKER_TOKEN_KEY = "@broker_session_token";

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
  isLoading: boolean;
}

interface BrokerAuthContextType extends BrokerAuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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

export function BrokerAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BrokerAuthState>({
    broker: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const initialCheckDone = useRef(false);

  // Carregar token salvo ao iniciar
  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;

    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(BROKER_TOKEN_KEY);
        if (savedToken) {
          _currentBrokerToken = savedToken;
          setState((prev) => ({ ...prev, token: savedToken }));

          // Verificar se o token ainda é válido
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
            // tRPC batch response format
            const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
            if (result) {
              setState({
                broker: result,
                token: savedToken,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          }

          // Token inválido, limpar
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
        isLoading: false,
      });
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/trpc/broker.login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          json: { email: email.toLowerCase(), password },
        }),
      });

      const data = await response.json();
      const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;

      if (result?.success) {
        _currentBrokerToken = result.token;
        await AsyncStorage.setItem(BROKER_TOKEN_KEY, result.token);

        setState({
          broker: result.broker,
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      }

      // Extrair mensagem de erro
      const errorData = Array.isArray(data) ? data[0]?.error : data?.error;
      const errorMessage =
        errorData?.json?.message ||
        errorData?.message ||
        "Erro ao fazer login. Tente novamente.";

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
      const response = await fetch(`${getApiUrl()}/api/trpc/broker.register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;

      if (result?.success) {
        _currentBrokerToken = result.token;
        await AsyncStorage.setItem(BROKER_TOKEN_KEY, result.token);

        setState({
          broker: result.broker,
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      }

      const errorData = Array.isArray(data) ? data[0]?.error : data?.error;
      const errorMessage =
        errorData?.json?.message ||
        errorData?.message ||
        "Erro ao cadastrar. Tente novamente.";

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
        await fetch(`${getApiUrl()}/api/trpc/broker.logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${_currentBrokerToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ json: {} }),
        });
      }
    } catch (error) {
      console.error("[BrokerAuth] Logout error:", error);
    }

    _currentBrokerToken = null;
    await AsyncStorage.removeItem(BROKER_TOKEN_KEY);

    setState({
      broker: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!_currentBrokerToken) return;

    try {
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
        const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
        if (result) {
          setState((prev) => ({
            ...prev,
            broker: result,
          }));
        }
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

// Helper para obter a URL da API
function getApiUrl(): string {
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    // Pattern: 8081-sandboxid.region.domain -> 3000-sandboxid.region.domain
    const apiHostname = hostname.replace(/^8081-/, "3000-");
    if (apiHostname !== hostname) {
      return `${protocol}//${apiHostname}`;
    }
    // Vercel deploy: same origin
    return `${protocol}//${hostname}`;
  }
  return "";
}
