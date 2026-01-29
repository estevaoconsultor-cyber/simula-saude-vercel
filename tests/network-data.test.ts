import { describe, it, expect } from "vitest";
import {
  getProvidersByProduct,
  searchProviders,
  getUniqueTypes,
  getUniqueNeighborhoods,
  getUniqueSpecialties,
  getProviderCount,
  getProductsWithNetwork,
} from "../data/network-data";

describe("Network Data", () => {
  describe("getProductsWithNetwork", () => {
    it("should return list of products with network data", () => {
      const products = getProductsWithNetwork();
      expect(products.length).toBeGreaterThan(0);
      expect(products).toContain("smart-200");
    });
  });

  describe("getProviderCount", () => {
    it("should return count for valid product", () => {
      const count = getProviderCount("smart-200");
      expect(count).toBeGreaterThan(0);
    });

    it("should return 0 for invalid product", () => {
      const count = getProviderCount("invalid-product");
      expect(count).toBe(0);
    });
  });

  describe("getProvidersByProduct", () => {
    it("should return providers for smart-200", () => {
      const providers = getProvidersByProduct("smart-200");
      expect(providers.length).toBeGreaterThan(0);
    });

    it("should return providers with required fields", () => {
      const providers = getProvidersByProduct("smart-200");
      const provider = providers[0];
      
      expect(provider).toHaveProperty("name");
      expect(provider).toHaveProperty("type");
      expect(provider).toHaveProperty("address");
      expect(provider).toHaveProperty("neighborhood");
      expect(provider).toHaveProperty("city");
      expect(provider).toHaveProperty("phone");
      expect(provider).toHaveProperty("specialties");
    });

    it("should return empty array for invalid product", () => {
      const providers = getProvidersByProduct("invalid-product");
      expect(providers).toEqual([]);
    });
  });

  describe("searchProviders", () => {
    it("should filter by search query", () => {
      const allProviders = getProvidersByProduct("smart-200");
      const filtered = searchProviders("smart-200", "CLINICA");
      
      expect(filtered.length).toBeLessThanOrEqual(allProviders.length);
    });

    it("should filter by type", () => {
      const filtered = searchProviders("smart-200", "", {
        type: "CONSULTORIOS",
      });
      
      filtered.forEach((provider) => {
        expect(provider.type.toLowerCase()).toContain("consultorios");
      });
    });

    it("should return empty for non-matching query", () => {
      const filtered = searchProviders("smart-200", "XYZNONEXISTENT123");
      expect(filtered).toEqual([]);
    });
  });

  describe("getUniqueTypes", () => {
    it("should return unique establishment types", () => {
      const types = getUniqueTypes("smart-200");
      expect(types.length).toBeGreaterThan(0);
      
      // Check for no duplicates
      const uniqueSet = new Set(types);
      expect(uniqueSet.size).toBe(types.length);
    });
  });

  describe("getUniqueNeighborhoods", () => {
    it("should return unique neighborhoods", () => {
      const neighborhoods = getUniqueNeighborhoods("smart-200");
      expect(neighborhoods.length).toBeGreaterThan(0);
      
      // Check for no duplicates
      const uniqueSet = new Set(neighborhoods);
      expect(uniqueSet.size).toBe(neighborhoods.length);
    });
  });

  describe("getUniqueSpecialties", () => {
    it("should return unique specialties", () => {
      const specialties = getUniqueSpecialties("smart-200");
      expect(specialties.length).toBeGreaterThan(0);
      
      // Check for no duplicates
      const uniqueSet = new Set(specialties);
      expect(uniqueSet.size).toBe(specialties.length);
    });
  });

  describe("Data Integrity", () => {
    it("should have valid provider data structure", () => {
      const products = getProductsWithNetwork();
      
      products.forEach((productId) => {
        const providers = getProvidersByProduct(productId);
        
        providers.forEach((provider) => {
          // Name should not be empty
          expect(provider.name.length).toBeGreaterThan(0);
          
          // Specialties should be an array
          expect(Array.isArray(provider.specialties)).toBe(true);
        });
      });
    });

    it("should have multiple products with data", () => {
      const products = getProductsWithNetwork();
      expect(products.length).toBeGreaterThanOrEqual(5);
    });
  });
});
