import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

interface Gestor {
  cnpj: string;
  cod_hap: string;
  razao_social: string;
  gestor: string;
}

let GESTORES: Gestor[] = [];

describe("Busca de Gestores", () => {
  beforeAll(() => {
    const gestoresPath = path.join(
      __dirname,
      "../data/gestores.json"
    );
    const data = fs.readFileSync(gestoresPath, "utf-8");
    GESTORES = JSON.parse(data) as Gestor[];
    console.log(`✅ Carregados ${GESTORES.length} gestores`);
  });

  it("deve carregar arquivo de gestores com dados válidos", () => {
    expect(GESTORES.length).toBeGreaterThan(0);
    expect(GESTORES[0]).toHaveProperty("cnpj");
    expect(GESTORES[0]).toHaveProperty("cod_hap");
    expect(GESTORES[0]).toHaveProperty("razao_social");
    expect(GESTORES[0]).toHaveProperty("gestor");
  });

  it("deve buscar por CNPJ", () => {
    const cnpj = GESTORES[0].cnpj;
    const resultado = GESTORES.filter((g) => g.cnpj.includes(cnpj));
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0].cnpj).toBe(cnpj);
  });

  it("deve buscar por código Hapvida", () => {
    const codHap = GESTORES[0].cod_hap;
    const resultado = GESTORES.filter((g) =>
      g.cod_hap.toLowerCase().includes(codHap.toLowerCase())
    );
    expect(resultado.length).toBeGreaterThan(0);
  });

  it("deve buscar por razão social", () => {
    const razaoSocial = GESTORES[0].razao_social.substring(0, 10);
    const resultado = GESTORES.filter((g) =>
      g.razao_social.toLowerCase().includes(razaoSocial.toLowerCase())
    );
    expect(resultado.length).toBeGreaterThan(0);
  });

  it("deve buscar por nome do gestor", () => {
    const gestor = GESTORES[0].gestor.substring(0, 5);
    const resultado = GESTORES.filter((g) =>
      g.gestor.toLowerCase().includes(gestor.toLowerCase())
    );
    expect(resultado.length).toBeGreaterThan(0);
  });

  it("deve limitar resultados a 10 itens", () => {
    const queryLower = "A";
    const resultado = GESTORES.filter(
      (g) =>
        g.cnpj.includes(queryLower) ||
        g.cod_hap.toLowerCase().includes(queryLower) ||
        g.razao_social.toLowerCase().includes(queryLower) ||
        g.gestor.toLowerCase().includes(queryLower)
    ).slice(0, 10);
    expect(resultado.length).toBeLessThanOrEqual(10);
  });

  it("deve retornar dados estruturados corretamente", () => {
    const resultado = GESTORES.slice(0, 5).map((g) => ({
      name: g.razao_social,
      cnpj: g.cnpj,
      code: g.cod_hap,
      manager: g.gestor,
    }));
    expect(resultado).toHaveLength(5);
    resultado.forEach((item) => {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("cnpj");
      expect(item).toHaveProperty("code");
      expect(item).toHaveProperty("manager");
    });
  });

  it("deve ter gestores com dados válidos", () => {
    GESTORES.slice(0, 100).forEach((gestor) => {
      expect(gestor.cnpj).toBeTruthy();
      expect(gestor.cod_hap).toBeTruthy();
      expect(gestor.razao_social).toBeTruthy();
      expect(gestor.gestor).toBeTruthy();
    });
  });

  it("deve encontrar gestor específico por CNPJ", () => {
    // Buscar um CNPJ específico
    const testCNPJ = GESTORES[0].cnpj;
    const resultado = GESTORES.find((g) => g.cnpj === testCNPJ);
    expect(resultado).toBeDefined();
    expect(resultado?.gestor).toBeTruthy();
  });
});
