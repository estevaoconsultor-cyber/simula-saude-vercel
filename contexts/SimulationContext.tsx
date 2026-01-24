import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { HealthPlan, calculatePrice, HEALTH_PLANS } from '@/data/plans';

// Estado da simulação
interface SimulationState {
  ageRange: string;
  planType: string;
  coverage: string;
  accommodation: string;
  hasCoparticipation: boolean;
  dependents: number;
  selectedPlan: HealthPlan | null;
  results: Array<HealthPlan & { calculatedPrice: number }>;
}

// Ações disponíveis
type SimulationAction =
  | { type: 'SET_AGE_RANGE'; payload: string }
  | { type: 'SET_PLAN_TYPE'; payload: string }
  | { type: 'SET_COVERAGE'; payload: string }
  | { type: 'SET_ACCOMMODATION'; payload: string }
  | { type: 'SET_COPARTICIPATION'; payload: boolean }
  | { type: 'SET_DEPENDENTS'; payload: number }
  | { type: 'SET_SELECTED_PLAN'; payload: HealthPlan | null }
  | { type: 'CALCULATE_RESULTS' }
  | { type: 'RESET' };

// Estado inicial
const initialState: SimulationState = {
  ageRange: '29-33',
  planType: 'individual',
  coverage: 'completo',
  accommodation: 'enfermaria',
  hasCoparticipation: false,
  dependents: 0,
  selectedPlan: null,
  results: [],
};

// Reducer
function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'SET_AGE_RANGE':
      return { ...state, ageRange: action.payload };
    case 'SET_PLAN_TYPE':
      return { ...state, planType: action.payload };
    case 'SET_COVERAGE':
      return { ...state, coverage: action.payload };
    case 'SET_ACCOMMODATION':
      return { ...state, accommodation: action.payload };
    case 'SET_COPARTICIPATION':
      return { ...state, hasCoparticipation: action.payload };
    case 'SET_DEPENDENTS':
      return { ...state, dependents: action.payload };
    case 'SET_SELECTED_PLAN':
      return { ...state, selectedPlan: action.payload };
    case 'CALCULATE_RESULTS': {
      const filteredPlans = HEALTH_PLANS.map(plan => ({
        ...plan,
        calculatedPrice: calculatePrice(
          plan.basePrice,
          state.ageRange,
          state.planType,
          state.coverage,
          state.accommodation,
          state.hasCoparticipation
        ),
      })).sort((a, b) => a.calculatedPrice - b.calculatedPrice);
      return { ...state, results: filteredPlans };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Contexto
interface SimulationContextType {
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Provider
export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
}

// Hook personalizado
export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
