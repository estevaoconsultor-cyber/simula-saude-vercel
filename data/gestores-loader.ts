import { Platform } from "react-native";

export interface Gestor {
  cnpj: string;
  cod_hap: string;
  razao_social: string;
  gestor: string;
}

let cachedGestores: Gestor[] | null = null;

export async function loadGestores(): Promise<Gestor[]> {
  // Se já estiver em cache, retorna
  if (cachedGestores) {
    return cachedGestores;
  }

  try {
    // Para web, carrega o JSON diretamente
    if (Platform.OS === "web") {
      const response = await fetch("/data/gestores.json");
      if (!response.ok) {
        throw new Error(`Failed to load gestores: ${response.statusText}`);
      }
      const data: Gestor[] = await response.json();
      cachedGestores = data;
      return data;
    } else {
      // Para mobile, importa o arquivo TypeScript
      const { GESTORES_DATA } = await import("./gestores");
      cachedGestores = GESTORES_DATA;
      return GESTORES_DATA;
    }
  } catch (error) {
    console.error("Erro ao carregar gestores:", error);
    return [];
  }
}

// Função auxiliar para buscar um gestor por CNPJ
export async function searchGestorByCNPJ(cnpj: string): Promise<Gestor | null> {
  const gestores = await loadGestores();
  const cleaned = cnpj.replace(/\D/g, "");
  return gestores.find((g) => g.cnpj === cleaned) || null;
}

// Função para buscar gestores com filtro
export async function searchGestores(query: string): Promise<Gestor[]> {
  const gestores = await loadGestores();
  if (query.length < 3) return [];

  const queryLower = query.toLowerCase();
  return gestores
    .filter(
      (g) =>
        g.cnpj.includes(query) ||
        g.cod_hap.toLowerCase().includes(queryLower) ||
        g.razao_social.toLowerCase().includes(queryLower) ||
        g.gestor.toLowerCase().includes(queryLower)
    )
    .slice(0, 10);
}
