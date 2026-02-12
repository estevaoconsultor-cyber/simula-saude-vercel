import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Platform } from "react-native";

export interface UserProfile {
  nome: string;
  whatsapp: string;
  email: string;
  corretora: string;
  registeredAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  isRegistered: boolean;
  register: (profile: UserProfile) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isRegistered: false,
  register: () => {},
  logout: () => {},
});

const STORAGE_KEY = "simula_saude_user";

function getStoredUser(): UserProfile | null {
  if (Platform.OS !== "web") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function storeUser(user: UserProfile | null) {
  if (Platform.OS !== "web") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setLoaded(true);
  }, []);

  const register = (profile: UserProfile) => {
    setUser(profile);
    storeUser(profile);
  };

  const logout = () => {
    setUser(null);
    storeUser(null);
  };

  if (!loaded) return null;

  return (
    <UserContext.Provider value={{ user, isRegistered: !!user, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
