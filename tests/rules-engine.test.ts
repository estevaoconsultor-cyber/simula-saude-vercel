import { describe, expect, it } from "vitest";
import {
  getAllowedOptions,
  getProductPrice,
  getPricingLookup,
  validateSelection,
} from "../data/hapvida-prices";

describe("rules engine", () => {
  it("blocks forbidden table for branch", () => {
    const result = validateSelection({
      city: "sao-paulo",
      tableId: 6,
      contractCategory: "PJ",
    });
    expect(result.valid).toBe(false);
    expect(result.reasonCode).toBe("INVALID_BRANCH_TABLE");
  });

  it("allows only tables 6 and 9 in sao-jose-dos-campos", () => {
    const allowed = getAllowedOptions({ city: "sao-jose-dos-campos" }).tableIds;
    expect(allowed).toEqual([6, 9]);
  });

  it("validates contract type against table", () => {
    const result = validateSelection({
      city: "campinas",
      contractType: "pme-30-99-adesao",
      tableId: 6,
      contractCategory: "PJ",
      coparticipation: "parcial",
    });
    expect(result.valid).toBe(false);
    expect(result.reasonCode).toBe("INVALID_CONTRACT_FOR_TABLE");
  });

  it("rejects incompatible reimbursement for product", () => {
    const result = validateSelection({
      city: "sao-paulo",
      contractType: "super-simples-1-vida",
      tableId: 3,
      contractCategory: "PJ",
      coparticipation: "parcial",
      productId: "smart-200",
      reimbursement: "TOTAL",
    });
    expect(result.valid).toBe(false);
    expect(result.reasonCode).toBe("INVALID_REIMBURSEMENT_FOR_PRODUCT");
  });

  it("returns pricing lookup only for valid combinations", () => {
    const valid = getPricingLookup({
      city: "sao-paulo",
      contractType: "super-simples-1-vida",
      coparticipation: "parcial",
      productId: "smart-200",
      ageRange: "00-18",
    });
    expect(valid).not.toBeNull();

    const invalid = getPricingLookup({
      city: "sao-jose-dos-campos",
      contractType: "super-simples-1-vida",
      coparticipation: "parcial",
      productId: "smart-200",
      ageRange: "00-18",
    });
    expect(invalid).toBeNull();
  });

  it("applies consolidated price overrides", () => {
    const price = getProductPrice(
      "sao-paulo",
      "super-simples-2-29-mei",
      "parcial",
      "smart-ambulatorial",
      "19-23"
    );
    expect(price).toBe(121.49);
  });
});
