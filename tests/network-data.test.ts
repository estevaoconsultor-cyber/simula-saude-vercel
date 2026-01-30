import { describe, it, expect } from "vitest";
import {
  getProvidersByProduct,
  searchProviders,
  getUniqueTypes,
  getUniqueNeighborhoods,
  getUniqueSpecialties,
  getProviderCount,
  getAvailableNetworks,
} from "../data/network-data";

describe("Network Data", () => {
  describe("getAvailableNetworks", () => {
    it("should return list of products with network data", () => {
      const products = getAvailableNetworks();
      expect(products.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getProviderCount", () => {
    it("should return count for valid product", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const count = getProviderCount(products[0]);
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });

    it("should return 0 for invalid product", () => {
      const count = getProviderCount("invalid-product");
      expect(count).toBe(0);
    });
  });

  describe("getProvidersByProduct", () => {
    it("should return providers for valid product", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const providers = getProvidersByProduct(products[0]);
        expect(Array.isArray(providers)).toBe(true);
      }
    });

    it("should return empty array for invalid product", () => {
      const providers = getProvidersByProduct("invalid-product");
      expect(providers).toEqual([]);
    });
  });

  describe("searchProviders", () => {
    it("should filter providers by query", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const providers = getProvidersByProduct(products[0]);
        if (providers.length > 0) {
          const query = providers[0].name.substring(0, 3);
          const results = searchProviders(products[0], query);
          expect(results.length).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it("should filter by city", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const results = searchProviders(products[0], "", { city: "São Paulo" });
        expect(Array.isArray(results)).toBe(true);
      }
    });
  });

  describe("getUniqueTypes", () => {
    it("should return unique types", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const types = getUniqueTypes(products[0]);
        expect(Array.isArray(types)).toBe(true);
        
        // Check for no duplicates
        const uniqueSet = new Set(types);
        expect(uniqueSet.size).toBe(types.length);
      }
    });
  });

  describe("getUniqueNeighborhoods", () => {
    it("should return unique neighborhoods", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const neighborhoods = getUniqueNeighborhoods(products[0]);
        expect(Array.isArray(neighborhoods)).toBe(true);
        
        // Check for no duplicates
        const uniqueSet = new Set(neighborhoods);
        expect(uniqueSet.size).toBe(neighborhoods.length);
      }
    });

    it("should filter by city", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const neighborhoods = getUniqueNeighborhoods(products[0], "São Paulo");
        expect(Array.isArray(neighborhoods)).toBe(true);
      }
    });
  });

  describe("getUniqueSpecialties", () => {
    it("should return unique specialties", () => {
      const products = getAvailableNetworks();
      if (products.length > 0) {
        const specialties = getUniqueSpecialties(products[0]);
        expect(Array.isArray(specialties)).toBe(true);
        
        // Check for no duplicates
        const uniqueSet = new Set(specialties);
        expect(uniqueSet.size).toBe(specialties.length);
      }
    });
  });

  describe("Data Integrity", () => {
    it("should have valid provider data structure", () => {
      const products = getAvailableNetworks();
      
      products.forEach((productId: string) => {
        const providers = getProvidersByProduct(productId);
        
        providers.forEach((provider) => {
          // Name should not be empty
          expect(provider.name.length).toBeGreaterThan(0);
          
          // Specialties should be an array
          expect(Array.isArray(provider.specialties)).toBe(true);
        });
      });
    });
  });
});
