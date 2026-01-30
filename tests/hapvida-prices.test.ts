import { describe, it, expect } from "vitest";
import {
  getProductPrice,
  calculateSimulationTotal,
  getAvailableProducts,
  AGE_RANGES,
  CITIES,
  CONTRACT_TYPES,
  COPARTICIPATION_TYPES,
  PRODUCTS,
  AgeRange,
} from "../data/hapvida-prices";

describe("Hapvida Prices Data", () => {
  describe("Data Structure", () => {
    it("should have all age ranges defined", () => {
      expect(AGE_RANGES).toHaveLength(10);
      expect(AGE_RANGES).toContain("00-18");
      expect(AGE_RANGES).toContain("59+");
    });

    it("should have cities defined", () => {
      expect(CITIES.length).toBeGreaterThan(0);
      expect(CITIES.find((c) => c.id === "sao-paulo")).toBeDefined();
    });

    it("should have contract types defined", () => {
      expect(CONTRACT_TYPES.length).toBeGreaterThan(0);
      expect(CONTRACT_TYPES.find((c) => c.id === "pme-30-99-adesao")).toBeDefined();
    });

    it("should have coparticipation types defined", () => {
      expect(COPARTICIPATION_TYPES).toHaveLength(2);
      expect(COPARTICIPATION_TYPES.find((c) => c.id === "parcial")).toBeDefined();
      expect(COPARTICIPATION_TYPES.find((c) => c.id === "total")).toBeDefined();
    });

    it("should have products defined", () => {
      expect(PRODUCTS.length).toBeGreaterThan(0);
      expect(PRODUCTS.find((p) => p.id === "smart-200")).toBeDefined();
      expect(PRODUCTS.find((p) => p.id === "infinity-1000-1-total")).toBeDefined();
    });
  });

  describe("getProductPrice", () => {
    it("should return price for valid combination", () => {
      const price = getProductPrice(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        "00-18"
      );
      expect(price).toBeDefined();
      expect(price).toBeGreaterThan(0);
    });

    it("should return null for invalid city", () => {
      const price = getProductPrice(
        "invalid-city" as any,
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        "00-18"
      );
      expect(price).toBeNull();
    });

    it("should return null for invalid product", () => {
      const price = getProductPrice(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "invalid-product",
        "00-18"
      );
      expect(price).toBeNull();
    });

    it("should have higher prices for older age ranges", () => {
      const price0018 = getProductPrice(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        "00-18"
      );
      const price59plus = getProductPrice(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        "59+"
      );
      
      expect(price0018).toBeDefined();
      expect(price59plus).toBeDefined();
      expect(price59plus!).toBeGreaterThan(price0018!);
    });

    it("should have lower prices for total coparticipation", () => {
      const priceParcial = getProductPrice(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        "29-33"
      );
      const priceTotal = getProductPrice(
        "sao-paulo",
        "pme-30-99-adesao",
        "total",
        "smart-200",
        "29-33"
      );
      
      expect(priceParcial).toBeDefined();
      expect(priceTotal).toBeDefined();
      expect(priceTotal!).toBeLessThan(priceParcial!);
    });
  });

  describe("calculateSimulationTotal", () => {
    it("should calculate total correctly for single life", () => {
      const lives: Record<AgeRange, number> = {
        "00-18": 1,
        "19-23": 0,
        "24-28": 0,
        "29-33": 0,
        "34-38": 0,
        "39-43": 0,
        "44-48": 0,
        "49-53": 0,
        "54-58": 0,
        "59+": 0,
      };

      const total = calculateSimulationTotal(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        lives
      );

      const expectedPrice = getProductPrice(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        "00-18"
      );

      expect(total).toBe(expectedPrice);
    });

    it("should calculate total correctly for multiple lives", () => {
      const lives: Record<AgeRange, number> = {
        "00-18": 2,
        "19-23": 0,
        "24-28": 0,
        "29-33": 1,
        "34-38": 0,
        "39-43": 0,
        "44-48": 0,
        "49-53": 0,
        "54-58": 0,
        "59+": 1,
      };

      const total = calculateSimulationTotal(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        lives
      );

      const price0018 = getProductPrice("sao-paulo", "pme-30-99-adesao", "parcial", "smart-200", "00-18")!;
      const price2933 = getProductPrice("sao-paulo", "pme-30-99-adesao", "parcial", "smart-200", "29-33")!;
      const price59plus = getProductPrice("sao-paulo", "pme-30-99-adesao", "parcial", "smart-200", "59+")!;

      const expectedTotal = (price0018 * 2) + price2933 + price59plus;
      expect(total).toBeCloseTo(expectedTotal, 2);
    });

    it("should return 0 for empty lives", () => {
      const lives: Record<AgeRange, number> = {
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
      };

      const total = calculateSimulationTotal(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial",
        "smart-200",
        lives
      );

      expect(total).toBe(0);
    });
  });

  describe("getAvailableProducts", () => {
    it("should return products for valid configuration", () => {
      const products = getAvailableProducts(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial"
      );

      expect(products.length).toBeGreaterThan(0);
    });

    it("should return empty array for invalid city", () => {
      const products = getAvailableProducts(
        "invalid-city" as any,
        "pme-30-99-adesao",
        "parcial"
      );

      expect(products).toEqual([]);
    });

    it("should include Smart 200 in available products", () => {
      const products = getAvailableProducts(
        "sao-paulo",
        "pme-30-99-adesao",
        "parcial"
      );

      const smart200 = products.find((p) => p.id === "smart-200");
      expect(smart200).toBeDefined();
    });
  });
});
