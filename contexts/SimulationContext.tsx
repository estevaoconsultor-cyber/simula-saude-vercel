import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  City,
  ContractType,
  CoparticipationType,
  AgeRange,
  AGE_RANGES,
  calculateSimulationTotal,
  getAvailableProducts,
  Product,
} from "@/data/hapvida-prices";

// Estado da simulação
interface SimulationState {
  // Seleções do usuário
  city: City | null;
  contractType: ContractType | null;
  coparticipation: CoparticipationType | null;
  
  // Distribuição de vidas por faixa etária
  lives: Record<AgeRange, number>;
  
  // Produtos selecionados para comparação
  selectedProducts: string[];
  
  // Etapa atual do fluxo
  step: "city" | "contract" | "coparticipation" | "simulation";
}

// Ações disponíveis
type SimulationAction =
  | { type: "SET_CITY"; payload: City }
  | { type: "SET_CONTRACT_TYPE"; payload: ContractType }
  | { type: "SET_COPARTICIPATION"; payload: CoparticipationType }
  | { type: "SET_LIVES"; payload: { ageRange: AgeRange; count: number } }
  | { type: "TOGGLE_PRODUCT"; payload: string }
  | { type: "SELECT_ALL_PRODUCTS" }
  | { type: "CLEAR_PRODUCTS" }
  | { type: "RESET" }
  | { type: "GO_TO_STEP"; payload: SimulationState["step"] };

// Estado inicial
const initialState: SimulationState = {
  city: null,
  contractType: null,
  coparticipation: null,
  lives: {
    "00-18": 0,
    "19-23": 0,
    "24-28": 0,
    "29-33": 0,
    "34-38": 0,
    "39-43": 0,
    "44-48": 0,
    "49-53": 0,
    "54-58": 0,
    "59+": 0,
  },
  selectedProducts: [],
  step: "city",
};

// Reducer
function simulationReducer(
  state: SimulationState,
  action: SimulationAction
): SimulationState {
  switch (action.type) {
    case "SET_CITY":
      return {
        ...state,
        city: action.payload,
        step: "contract",
      };
    
    case "SET_CONTRACT_TYPE":
      return {
        ...state,
        contractType: action.payload,
        step: "coparticipation",
      };
    
    case "SET_COPARTICIPATION":
      return {
        ...state,
        coparticipation: action.payload,
        step: "simulation",
      };
    
    case "SET_LIVES":
      return {
        ...state,
        lives: {
          ...state.lives,
          [action.payload.ageRange]: Math.max(0, action.payload.count),
        },
      };
    
    case "TOGGLE_PRODUCT":
      const isSelected = state.selectedProducts.includes(action.payload);
      return {
        ...state,
        selectedProducts: isSelected
          ? state.selectedProducts.filter((id) => id !== action.payload)
          : [...state.selectedProducts, action.payload],
      };
    
    case "SELECT_ALL_PRODUCTS":
      if (state.city && state.contractType && state.coparticipation) {
        const available = getAvailableProducts(
          state.city,
          state.contractType,
          state.coparticipation
        );
        return {
          ...state,
          selectedProducts: available.map((p) => p.id),
        };
      }
      return state;
    
    case "CLEAR_PRODUCTS":
      return {
        ...state,
        selectedProducts: [],
      };
    
    case "RESET":
      return initialState;
    
    case "GO_TO_STEP":
      return {
        ...state,
        step: action.payload,
      };
    
    default:
      return state;
  }
}

// Contexto
interface SimulationContextType {
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
  
  // Helpers
  totalLives: number;
  availableProducts: Product[];
  getProductTotal: (productId: string) => number;
  getAllProductTotals: () => { product: Product; total: number }[];
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined
);

// Provider
export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  
  // Calcular total de vidas
  const totalLives = AGE_RANGES.reduce(
    (sum, range) => sum + state.lives[range],
    0
  );
  
  // Obter produtos disponíveis
  const availableProducts =
    state.city && state.contractType && state.coparticipation
      ? getAvailableProducts(state.city, state.contractType, state.coparticipation)
      : [];
  
  // Calcular total para um produto
  const getProductTotal = (productId: string): number => {
    if (!state.city || !state.contractType || !state.coparticipation) {
      return 0;
    }
    return calculateSimulationTotal(
      state.city,
      state.contractType,
      state.coparticipation,
      productId,
      state.lives
    );
  };
  
  // Obter totais de todos os produtos selecionados
  const getAllProductTotals = (): { product: Product; total: number }[] => {
    return state.selectedProducts
      .map((id) => {
        const product = availableProducts.find((p) => p.id === id);
        if (!product) return null;
        return {
          product,
          total: getProductTotal(id),
        };
      })
      .filter((item): item is { product: Product; total: number } => item !== null)
      .sort((a, b) => a.total - b.total);
  };
  
  return (
    <SimulationContext.Provider
      value={{
        state,
        dispatch,
        totalLives,
        availableProducts,
        getProductTotal,
        getAllProductTotals,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

// Hook para usar o contexto
export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
