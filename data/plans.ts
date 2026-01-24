// Dados mock de planos de saúde para simulação

export interface HealthPlan {
  id: string;
  name: string;
  operator: string;
  operatorLogo: string;
  basePrice: number;
  coverage: 'ambulatorial' | 'hospitalar' | 'completo';
  planType: 'individual' | 'familiar' | 'empresarial';
  hasCoparticipation: boolean;
  accommodation: 'enfermaria' | 'apartamento';
  rating: number;
  badge?: 'popular' | 'best-value' | 'premium';
  benefits: string[];
  waitingPeriods: {
    urgency: number;
    consultations: number;
    exams: number;
    hospitalization: number;
    surgeries: number;
  };
}

export const AGE_RANGES = [
  { id: '0-18', label: '0 a 18 anos', multiplier: 1.0 },
  { id: '19-23', label: '19 a 23 anos', multiplier: 1.1 },
  { id: '24-28', label: '24 a 28 anos', multiplier: 1.2 },
  { id: '29-33', label: '29 a 33 anos', multiplier: 1.4 },
  { id: '34-38', label: '34 a 38 anos', multiplier: 1.6 },
  { id: '39-43', label: '39 a 43 anos', multiplier: 1.9 },
  { id: '44-48', label: '44 a 48 anos', multiplier: 2.3 },
  { id: '49-53', label: '49 a 53 anos', multiplier: 2.8 },
  { id: '54-58', label: '54 a 58 anos', multiplier: 3.5 },
  { id: '59+', label: '59 anos ou mais', multiplier: 4.5 },
];

export const PLAN_TYPES = [
  { id: 'individual', label: 'Individual', multiplier: 1.0 },
  { id: 'familiar', label: 'Familiar', multiplier: 0.85 },
  { id: 'empresarial', label: 'Empresarial', multiplier: 0.7 },
];

export const COVERAGE_TYPES = [
  { id: 'ambulatorial', label: 'Ambulatorial', description: 'Consultas e exames', multiplier: 0.6 },
  { id: 'hospitalar', label: 'Hospitalar', description: 'Internações e cirurgias', multiplier: 0.8 },
  { id: 'completo', label: 'Completo', description: 'Ambulatorial + Hospitalar', multiplier: 1.0 },
];

export const ACCOMMODATION_TYPES = [
  { id: 'enfermaria', label: 'Enfermaria', multiplier: 1.0 },
  { id: 'apartamento', label: 'Apartamento', multiplier: 1.3 },
];

export const HEALTH_PLANS: HealthPlan[] = [
  {
    id: '1',
    name: 'Essencial Saúde',
    operator: 'Unimed',
    operatorLogo: '🏥',
    basePrice: 250,
    coverage: 'completo',
    planType: 'individual',
    hasCoparticipation: true,
    accommodation: 'enfermaria',
    rating: 4.2,
    badge: 'popular',
    benefits: [
      'Consultas ilimitadas',
      'Exames laboratoriais',
      'Pronto-socorro 24h',
      'Internação hospitalar',
      'Cirurgias cobertas',
    ],
    waitingPeriods: {
      urgency: 24,
      consultations: 30,
      exams: 60,
      hospitalization: 180,
      surgeries: 180,
    },
  },
  {
    id: '2',
    name: 'Premium Plus',
    operator: 'Bradesco Saúde',
    operatorLogo: '🏨',
    basePrice: 450,
    coverage: 'completo',
    planType: 'individual',
    hasCoparticipation: false,
    accommodation: 'apartamento',
    rating: 4.8,
    badge: 'premium',
    benefits: [
      'Consultas ilimitadas',
      'Exames de alta complexidade',
      'Pronto-socorro 24h',
      'Internação em apartamento',
      'Cirurgias cobertas',
      'Reembolso de consultas',
      'Rede nacional',
    ],
    waitingPeriods: {
      urgency: 24,
      consultations: 30,
      exams: 45,
      hospitalization: 120,
      surgeries: 150,
    },
  },
  {
    id: '3',
    name: 'Básico Econômico',
    operator: 'Hapvida',
    operatorLogo: '💚',
    basePrice: 180,
    coverage: 'ambulatorial',
    planType: 'individual',
    hasCoparticipation: true,
    accommodation: 'enfermaria',
    rating: 3.8,
    badge: 'best-value',
    benefits: [
      'Consultas básicas',
      'Exames simples',
      'Pronto-socorro 24h',
    ],
    waitingPeriods: {
      urgency: 24,
      consultations: 30,
      exams: 90,
      hospitalization: 0,
      surgeries: 0,
    },
  },
  {
    id: '4',
    name: 'Família Protegida',
    operator: 'SulAmérica',
    operatorLogo: '👨‍👩‍👧‍👦',
    basePrice: 380,
    coverage: 'completo',
    planType: 'familiar',
    hasCoparticipation: false,
    accommodation: 'apartamento',
    rating: 4.5,
    benefits: [
      'Consultas ilimitadas',
      'Exames completos',
      'Pronto-socorro 24h',
      'Internação em apartamento',
      'Cirurgias cobertas',
      'Cobertura nacional',
    ],
    waitingPeriods: {
      urgency: 24,
      consultations: 30,
      exams: 60,
      hospitalization: 150,
      surgeries: 180,
    },
  },
  {
    id: '5',
    name: 'Corporativo Gold',
    operator: 'Amil',
    operatorLogo: '🏢',
    basePrice: 320,
    coverage: 'completo',
    planType: 'empresarial',
    hasCoparticipation: true,
    accommodation: 'enfermaria',
    rating: 4.3,
    benefits: [
      'Consultas ilimitadas',
      'Exames laboratoriais',
      'Pronto-socorro 24h',
      'Internação hospitalar',
      'Cirurgias cobertas',
      'Desconto em farmácias',
    ],
    waitingPeriods: {
      urgency: 24,
      consultations: 15,
      exams: 30,
      hospitalization: 90,
      surgeries: 120,
    },
  },
  {
    id: '6',
    name: 'Hospitalar Básico',
    operator: 'NotreDame',
    operatorLogo: '🏥',
    basePrice: 220,
    coverage: 'hospitalar',
    planType: 'individual',
    hasCoparticipation: true,
    accommodation: 'enfermaria',
    rating: 4.0,
    benefits: [
      'Pronto-socorro 24h',
      'Internação hospitalar',
      'Cirurgias de urgência',
      'UTI quando necessário',
    ],
    waitingPeriods: {
      urgency: 24,
      consultations: 0,
      exams: 0,
      hospitalization: 180,
      surgeries: 180,
    },
  },
];

// Função para calcular o preço baseado nos critérios selecionados
export function calculatePrice(
  basePrice: number,
  ageRangeId: string,
  planTypeId: string,
  coverageId: string,
  accommodationId: string,
  hasCoparticipation: boolean
): number {
  const ageMultiplier = AGE_RANGES.find(a => a.id === ageRangeId)?.multiplier ?? 1;
  const planMultiplier = PLAN_TYPES.find(p => p.id === planTypeId)?.multiplier ?? 1;
  const coverageMultiplier = COVERAGE_TYPES.find(c => c.id === coverageId)?.multiplier ?? 1;
  const accommodationMultiplier = ACCOMMODATION_TYPES.find(a => a.id === accommodationId)?.multiplier ?? 1;
  const coparticipationMultiplier = hasCoparticipation ? 0.75 : 1;

  const finalPrice = basePrice * ageMultiplier * planMultiplier * coverageMultiplier * accommodationMultiplier * coparticipationMultiplier;
  
  return Math.round(finalPrice * 100) / 100;
}

// Função para filtrar planos baseado nos critérios
export function filterPlans(
  plans: HealthPlan[],
  coverageId: string,
  planTypeId: string
): HealthPlan[] {
  return plans.filter(plan => {
    const coverageMatch = plan.coverage === coverageId || coverageId === 'completo';
    const planTypeMatch = plan.planType === planTypeId;
    return coverageMatch && planTypeMatch;
  });
}
