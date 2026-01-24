import { describe, it, expect } from 'vitest';
import { 
  calculatePrice, 
  AGE_RANGES, 
  PLAN_TYPES, 
  COVERAGE_TYPES, 
  ACCOMMODATION_TYPES,
  HEALTH_PLANS 
} from '../data/plans';

describe('Health Plan Data', () => {
  describe('AGE_RANGES', () => {
    it('should have 10 age ranges', () => {
      expect(AGE_RANGES).toHaveLength(10);
    });

    it('should have valid multipliers (>= 1.0)', () => {
      AGE_RANGES.forEach(range => {
        expect(range.multiplier).toBeGreaterThanOrEqual(1.0);
      });
    });

    it('should have increasing multipliers by age', () => {
      for (let i = 1; i < AGE_RANGES.length; i++) {
        expect(AGE_RANGES[i].multiplier).toBeGreaterThanOrEqual(AGE_RANGES[i - 1].multiplier);
      }
    });
  });

  describe('PLAN_TYPES', () => {
    it('should have 3 plan types', () => {
      expect(PLAN_TYPES).toHaveLength(3);
    });

    it('should include individual, familiar, and empresarial', () => {
      const ids = PLAN_TYPES.map(p => p.id);
      expect(ids).toContain('individual');
      expect(ids).toContain('familiar');
      expect(ids).toContain('empresarial');
    });

    it('should have empresarial with lowest multiplier (discount)', () => {
      const empresarial = PLAN_TYPES.find(p => p.id === 'empresarial');
      const individual = PLAN_TYPES.find(p => p.id === 'individual');
      expect(empresarial!.multiplier).toBeLessThan(individual!.multiplier);
    });
  });

  describe('COVERAGE_TYPES', () => {
    it('should have 3 coverage types', () => {
      expect(COVERAGE_TYPES).toHaveLength(3);
    });

    it('should have completo with highest multiplier', () => {
      const completo = COVERAGE_TYPES.find(c => c.id === 'completo');
      expect(completo!.multiplier).toBe(1.0);
    });

    it('should have ambulatorial with lowest multiplier', () => {
      const ambulatorial = COVERAGE_TYPES.find(c => c.id === 'ambulatorial');
      COVERAGE_TYPES.forEach(coverage => {
        expect(ambulatorial!.multiplier).toBeLessThanOrEqual(coverage.multiplier);
      });
    });
  });

  describe('HEALTH_PLANS', () => {
    it('should have at least 5 plans', () => {
      expect(HEALTH_PLANS.length).toBeGreaterThanOrEqual(5);
    });

    it('should have valid base prices (> 0)', () => {
      HEALTH_PLANS.forEach(plan => {
        expect(plan.basePrice).toBeGreaterThan(0);
      });
    });

    it('should have valid ratings (1-5)', () => {
      HEALTH_PLANS.forEach(plan => {
        expect(plan.rating).toBeGreaterThanOrEqual(1);
        expect(plan.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have at least one benefit per plan', () => {
      HEALTH_PLANS.forEach(plan => {
        expect(plan.benefits.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('calculatePrice', () => {
  const basePrice = 100;

  it('should return base price for default multipliers', () => {
    const price = calculatePrice(basePrice, '0-18', 'individual', 'completo', 'enfermaria', false);
    // 100 * 1.0 * 1.0 * 1.0 * 1.0 * 1.0 = 100
    expect(price).toBe(100);
  });

  it('should apply age multiplier correctly', () => {
    const priceYoung = calculatePrice(basePrice, '0-18', 'individual', 'completo', 'enfermaria', false);
    const priceOld = calculatePrice(basePrice, '59+', 'individual', 'completo', 'enfermaria', false);
    
    // Older age should have higher price
    expect(priceOld).toBeGreaterThan(priceYoung);
  });

  it('should apply plan type multiplier correctly', () => {
    const priceIndividual = calculatePrice(basePrice, '29-33', 'individual', 'completo', 'enfermaria', false);
    const priceEmpresarial = calculatePrice(basePrice, '29-33', 'empresarial', 'completo', 'enfermaria', false);
    
    // Empresarial should be cheaper
    expect(priceEmpresarial).toBeLessThan(priceIndividual);
  });

  it('should apply coverage multiplier correctly', () => {
    const priceCompleto = calculatePrice(basePrice, '29-33', 'individual', 'completo', 'enfermaria', false);
    const priceAmbulatorial = calculatePrice(basePrice, '29-33', 'individual', 'ambulatorial', 'enfermaria', false);
    
    // Ambulatorial should be cheaper
    expect(priceAmbulatorial).toBeLessThan(priceCompleto);
  });

  it('should apply accommodation multiplier correctly', () => {
    const priceEnfermaria = calculatePrice(basePrice, '29-33', 'individual', 'completo', 'enfermaria', false);
    const priceApartamento = calculatePrice(basePrice, '29-33', 'individual', 'completo', 'apartamento', false);
    
    // Apartamento should be more expensive
    expect(priceApartamento).toBeGreaterThan(priceEnfermaria);
  });

  it('should apply coparticipation discount correctly', () => {
    const priceWithout = calculatePrice(basePrice, '29-33', 'individual', 'completo', 'enfermaria', false);
    const priceWith = calculatePrice(basePrice, '29-33', 'individual', 'completo', 'enfermaria', true);
    
    // With coparticipation should be cheaper (25% discount)
    expect(priceWith).toBeLessThan(priceWithout);
    expect(priceWith).toBe(priceWithout * 0.75);
  });

  it('should calculate complex scenario correctly', () => {
    // 29-33 (1.4) * individual (1.0) * completo (1.0) * apartamento (1.3) * no coparticipation (1.0)
    const price = calculatePrice(250, '29-33', 'individual', 'completo', 'apartamento', false);
    const expected = 250 * 1.4 * 1.0 * 1.0 * 1.3 * 1.0;
    expect(price).toBe(Math.round(expected * 100) / 100);
  });

  it('should return rounded values to 2 decimal places', () => {
    const price = calculatePrice(100, '29-33', 'individual', 'completo', 'enfermaria', true);
    const decimalPlaces = (price.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});
