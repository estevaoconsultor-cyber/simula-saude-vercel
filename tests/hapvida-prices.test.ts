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

  describe("Premium 900 Care and Infinity Products", () => {
    it("should have Premium 900 Care products defined", () => {
      const careProducts = PRODUCTS.filter((p) => p.id.includes("premium-900-1-care"));
      expect(careProducts.length).toBeGreaterThanOrEqual(4);
      expect(careProducts.find((p) => p.id === "premium-900-1-care-enf-total")).toBeDefined();
      expect(careProducts.find((p) => p.id === "premium-900-1-care-apt-total")).toBeDefined();
      expect(careProducts.find((p) => p.id === "premium-900-1-care-enf-parcial")).toBeDefined();
      expect(careProducts.find((p) => p.id === "premium-900-1-care-apt-parcial")).toBeDefined();
    });

    it("should have Infinity 1000.1 products defined", () => {
      const infinityProducts = PRODUCTS.filter((p) => p.id.includes("infinity-1000-1"));
      expect(infinityProducts.length).toBeGreaterThanOrEqual(2);
      expect(infinityProducts.find((p) => p.id === "infinity-1000-1-total")).toBeDefined();
      expect(infinityProducts.find((p) => p.id === "infinity-1000-1-parcial")).toBeDefined();
    });

    it("should have Premium 900 Care prices in Super Simples MEI tables", () => {
      // Coparticipação Parcial
      const priceCareEnfParcial = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-mei",
        "parcial",
        "premium-900-1-care-enf-total",
        "00-18"
      );
      expect(priceCareEnfParcial).toBeDefined();
      expect(priceCareEnfParcial).toBeGreaterThan(0);

      // Coparticipação Total
      const priceCareEnfTotal = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-mei",
        "total",
        "premium-900-1-care-enf-total",
        "00-18"
      );
      expect(priceCareEnfTotal).toBeDefined();
      expect(priceCareEnfTotal).toBeGreaterThan(0);
    });

    it("should have Infinity prices in Super Simples Não MEI tables (not in MEI)", () => {
      // Infinity NÃO existe em MEI, apenas em Não MEI (Demais Empresas)
      const priceInfinityMEI = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-mei",
        "parcial",
        "infinity-1000-1-total",
        "00-18"
      );
      expect(priceInfinityMEI).toBeNull(); // Infinity não existe em MEI

      // Infinity existe em Não MEI (Demais Empresas)
      const priceInfinityNaoMEI = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-demais",
        "parcial",
        "infinity-1000-1-total",
        "00-18"
      );
      expect(priceInfinityNaoMEI).toBeDefined();
      expect(priceInfinityNaoMEI).toBeGreaterThan(0);
    });

    it("should include Premium 900 Care in Super Simples MEI available products", () => {
      const products = getAvailableProducts(
        "sao-paulo",
        "super-simples-2-29-mei",
        "parcial"
      );

      const careProduct = products.find((p) => p.id.includes("premium-900-1-care"));
      expect(careProduct).toBeDefined();
    });

    it("should NOT include Infinity in Super Simples MEI (only in Não MEI)", () => {
      // Infinity NÃO deve estar em MEI
      const productsMEI = getAvailableProducts(
        "sao-paulo",
        "super-simples-2-29-mei",
        "parcial"
      );
      const infinityInMEI = productsMEI.find((p) => p.id.includes("infinity-1000-1"));
      expect(infinityInMEI).toBeUndefined();

      // Infinity DEVE estar em Não MEI (Demais Empresas)
      const productsNaoMEI = getAvailableProducts(
        "sao-paulo",
        "super-simples-2-29-demais",
        "parcial"
      );
      const infinityInNaoMEI = productsNaoMEI.find((p) => p.id.includes("infinity-1000-1"));
      expect(infinityInNaoMEI).toBeDefined();
    });

    it("should have correct price ranges for Premium 900 Care", () => {
      const price0018 = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-mei",
        "parcial",
        "premium-900-1-care-apt-total",
        "00-18"
      );
      const price59plus = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-mei",
        "parcial",
        "premium-900-1-care-apt-total",
        "59+"
      );
      
      expect(price0018).toBeDefined();
      expect(price59plus).toBeDefined();
      expect(price59plus!).toBeGreaterThan(price0018!);
    });

    it("should have correct price ranges for Infinity in Não MEI", () => {
      const price0018 = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-demais",
        "total",
        "infinity-1000-1-total",
        "00-18"
      );
      const price59plus = getProductPrice(
        "sao-paulo",
        "super-simples-2-29-demais",
        "total",
        "infinity-1000-1-total",
        "59+"
      );
      
      expect(price0018).toBeDefined();
      expect(price59plus).toBeDefined();
      expect(price59plus!).toBeGreaterThan(price0018!);
    });
  });
});
