import { describe, it, expect } from "vitest";
import {
  CITIES,
  CONTRACT_TYPES,
  COPARTICIPATION_TYPES,
  PRODUCTS,
  AGE_RANGES,
  AGE_RANGE_LABELS,
  getProductPrice,
  getAvailableProducts,
} from "../data/hapvida-prices";
import { MANAGERS, searchBroker } from "../data/brokers-data";

describe("Hapvida Simulator Data", () => {
  describe("Cities (Filiais)", () => {
    it("should have at least 5 cities/filiais", () => {
      expect(CITIES.length).toBeGreaterThanOrEqual(5);
    });

    it("each city should have id, name, and commercializationArea", () => {
      CITIES.forEach((city) => {
        expect(city.id).toBeDefined();
        expect(city.name).toBeDefined();
        expect(city.commercializationArea).toBeDefined();
        expect(city.commercializationArea.length).toBeGreaterThan(0);
      });
    });

    it("should include São Paulo as a city", () => {
      const sp = CITIES.find((c) => c.id === "sao-paulo");
      expect(sp).toBeDefined();
      expect(sp?.name).toBe("Filial São Paulo");
    });
  });

  describe("Contract Types", () => {
    it("should have at least 4 contract types", () => {
      expect(CONTRACT_TYPES.length).toBeGreaterThanOrEqual(4);
    });

    it("should include Super Simples and PME types", () => {
      const superSimples = CONTRACT_TYPES.find((c) => c.id.includes("super-simples"));
      const pme = CONTRACT_TYPES.find((c) => c.id.includes("pme"));
      expect(superSimples).toBeDefined();
      expect(pme).toBeDefined();
    });
  });

  describe("Coparticipation Types", () => {
    it("should have at least 2 coparticipation types", () => {
      expect(COPARTICIPATION_TYPES.length).toBeGreaterThanOrEqual(2);
    });

    it("should include parcial and total types", () => {
      const parcial = COPARTICIPATION_TYPES.find((c) => c.id === "parcial");
      const total = COPARTICIPATION_TYPES.find((c) => c.id === "total");
      expect(parcial).toBeDefined();
      expect(total).toBeDefined();
    });
  });

  describe("Products", () => {
    it("should have at least 10 products", () => {
      expect(PRODUCTS.length).toBeGreaterThanOrEqual(10);
    });

    it("each product should have required fields", () => {
      PRODUCTS.forEach((product) => {
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.shortName).toBeDefined();
        expect(product.segmentation).toBeDefined();
        expect(product.accommodation).toBeDefined();
      });
    });

    it("should include key products like Smart and Nosso Médico", () => {
      const smart200 = PRODUCTS.find((p) => p.id.includes("smart-200"));
      const nossoMedico = PRODUCTS.find((p) => p.id.includes("nosso-medico"));
      expect(smart200).toBeDefined();
      expect(nossoMedico).toBeDefined();
    });
  });

  describe("Age Ranges", () => {
    it("should have 10 age ranges as per ANS", () => {
      expect(AGE_RANGES.length).toBe(10);
    });

    it("should have labels for all age ranges", () => {
      AGE_RANGES.forEach((range) => {
        expect(AGE_RANGE_LABELS[range]).toBeDefined();
        expect(AGE_RANGE_LABELS[range].length).toBeGreaterThan(0);
      });
    });
  });

  describe("Price Calculation", () => {
    it("should return a price for valid parameters", () => {
      const price = getProductPrice(
        "sao-paulo",
        "super-simples-1-vida",
        "parcial",
        "smart-200",
        "00-18"
      );
      expect(price).not.toBeNull();
      expect(price!).toBeGreaterThan(0);
    });

    it("should return different prices for different age ranges", () => {
      const price1 = getProductPrice(
        "sao-paulo",
        "super-simples-1-vida",
        "parcial",
        "smart-200",
        "00-18"
      );
      const price2 = getProductPrice(
        "sao-paulo",
        "super-simples-1-vida",
        "parcial",
        "smart-200",
        "59+"
      );
      expect(price1).not.toBeNull();
      expect(price2).not.toBeNull();
      // Older age range should be more expensive
      expect(price2!).toBeGreaterThan(price1!);
    });

    it("should return different prices for different products", () => {
      const priceSmart = getProductPrice(
        "sao-paulo",
        "super-simples-1-vida",
        "parcial",
        "smart-200",
        "29-33"
      );
      const priceAdvance = getProductPrice(
        "sao-paulo",
        "super-simples-1-vida",
        "parcial",
        "advance-600-enf",
        "29-33"
      );
      expect(priceSmart).not.toBeNull();
      expect(priceAdvance).not.toBeNull();
      // Advance should be more expensive than Smart
      expect(priceAdvance!).toBeGreaterThan(priceSmart!);
    });
  });

  describe("Available Products", () => {
    it("should return products for valid city and contract", () => {
      const products = getAvailableProducts(
        "sao-paulo",
        "super-simples-1-vida",
        "parcial"
      );
      expect(products.length).toBeGreaterThan(0);
    });

    it("should return products with all required fields", () => {
      const products = getAvailableProducts(
        "sao-paulo",
        "super-simples-1-vida",
        "parcial"
      );
      products.forEach((product) => {
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
      });
    });
  });
});

describe("Broker/Manager Data", () => {
  it("should have manager contact information", () => {
    expect(MANAGERS).toBeDefined();
    expect(MANAGERS.length).toBeGreaterThanOrEqual(5);
    
    MANAGERS.forEach((manager) => {
      expect(manager.name).toBeDefined();
      expect(manager.role).toBeDefined();
      expect(manager.whatsapp).toBeDefined();
      expect(manager.email).toBeDefined();
    });
  });

  it("should include specific managers", () => {
    const estevao = MANAGERS.find((m) => m.name === "Estevão Cardoso");
    const lais = MANAGERS.find((m) => m.name === "Laís Martins");
    const pablo = MANAGERS.find((m) => m.name === "Pablo Amora");
    
    expect(estevao).toBeDefined();
    expect(estevao?.role).toBe("Gerente Sênior");
    expect(lais).toBeDefined();
    expect(pablo).toBeDefined();
  });

  it("should be able to search brokers", () => {
    // Test that searchBroker function exists and works
    expect(typeof searchBroker).toBe("function");
    
    // Search should return an array
    const results = searchBroker("teste");
    expect(Array.isArray(results)).toBe(true);
  });
});
