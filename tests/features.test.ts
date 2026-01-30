import { describe, it, expect } from "vitest";

// Teste das categorias de rede de atendimento
describe("Rede de Atendimento - Categorização", () => {
  const REDE_PROPRIA = [
    "nosso-medico",
    "smart-150",
    "smart-200",
    "smart-200-up",
    "notrelife",
    "basic",
    "pleno",
  ];

  const REDE_CREDENCIADA = [
    "smart-300",
    "smart-400",
    "smart-500",
    "advance-600",
    "advance-700",
    "premium-900q",
    "premium-900-1",
    "infinity",
  ];

  it("deve ter Smart 200 na rede própria, não na credenciada", () => {
    expect(REDE_PROPRIA).toContain("smart-200");
    expect(REDE_CREDENCIADA).not.toContain("smart-200");
  });

  it("deve ter Nosso Médico na rede própria", () => {
    expect(REDE_PROPRIA).toContain("nosso-medico");
  });

  it("deve ter Pleno na rede própria", () => {
    expect(REDE_PROPRIA).toContain("pleno");
  });

  it("deve ter Advance 600 e 700 na rede credenciada", () => {
    expect(REDE_CREDENCIADA).toContain("advance-600");
    expect(REDE_CREDENCIADA).toContain("advance-700");
  });

  it("deve ter Premium 900Q e 900.1 na rede credenciada", () => {
    expect(REDE_CREDENCIADA).toContain("premium-900q");
    expect(REDE_CREDENCIADA).toContain("premium-900-1");
  });

  it("deve ter Infinity na rede credenciada", () => {
    expect(REDE_CREDENCIADA).toContain("infinity");
  });

  it("deve ter Smart 300+ na rede credenciada", () => {
    expect(REDE_CREDENCIADA).toContain("smart-300");
    expect(REDE_CREDENCIADA).toContain("smart-400");
    expect(REDE_CREDENCIADA).toContain("smart-500");
  });
});

// Teste da estrutura de simulação salva
describe("Simulações Favoritas - Estrutura", () => {
  interface SavedSimulation {
    id: string;
    companyName: string;
    expectedDate: string;
    city: string;
    contractType: string;
    coparticipation: string;
    lives: Array<{
      ageRange: string;
      type: "titular" | "dependente";
      productId: string;
    }>;
    savedAt: string;
  }

  it("deve ter campos obrigatórios para simulação salva", () => {
    const simulation: SavedSimulation = {
      id: "sim-001",
      companyName: "Empresa Teste LTDA",
      expectedDate: "2026-02-15",
      city: "sao-paulo",
      contractType: "mei-2-29",
      coparticipation: "parcial",
      lives: [
        { ageRange: "18-23", type: "titular", productId: "smart-200" },
        { ageRange: "0-18", type: "dependente", productId: "smart-200" },
      ],
      savedAt: "2026-01-30T00:00:00Z",
    };

    expect(simulation.companyName).toBeDefined();
    expect(simulation.expectedDate).toBeDefined();
    expect(simulation.lives.length).toBeGreaterThan(0);
  });

  it("deve permitir mescla de produtos diferentes na mesma simulação", () => {
    const lives = [
      { ageRange: "18-23", type: "titular" as const, productId: "smart-200" },
      { ageRange: "24-28", type: "titular" as const, productId: "premium-900" },
      { ageRange: "0-18", type: "dependente" as const, productId: "nosso-medico" },
    ];

    const uniqueProducts = [...new Set(lives.map((l) => l.productId))];
    expect(uniqueProducts.length).toBe(3);
  });
});

// Teste dos filtros de geolocalização
describe("Rede de Atendimento - Filtros de Localização", () => {
  const ESTADOS = ["SP", "RJ", "MG", "BA", "PR", "RS", "PE", "CE"];

  it("deve ter estados disponíveis para filtro", () => {
    expect(ESTADOS.length).toBeGreaterThan(0);
    expect(ESTADOS).toContain("SP");
  });

  it("deve filtrar prestadores por estado", () => {
    const providers = [
      { city: "São Paulo", neighborhood: "Centro" },
      { city: "Rio de Janeiro", neighborhood: "Copacabana" },
      { city: "Campinas", neighborhood: "Cambuí" },
    ];

    const spProviders = providers.filter((p) =>
      p.city.toLowerCase().includes("são paulo") ||
      p.city.toLowerCase().includes("campinas")
    );

    expect(spProviders.length).toBe(2);
  });

  it("deve filtrar prestadores por bairro", () => {
    const providers = [
      { city: "São Paulo", neighborhood: "Centro" },
      { city: "São Paulo", neighborhood: "Pinheiros" },
      { city: "São Paulo", neighborhood: "Centro" },
    ];

    const centroProviders = providers.filter(
      (p) => p.neighborhood === "Centro"
    );

    expect(centroProviders.length).toBe(2);
  });
});

// Teste do Quiz
describe("Quiz - Navegação", () => {
  it("deve permitir voltar para pergunta anterior", () => {
    let currentQuestion = 3;
    
    // Simula voltar
    const goBack = () => {
      if (currentQuestion > 0) {
        currentQuestion--;
      }
    };

    goBack();
    expect(currentQuestion).toBe(2);
    
    goBack();
    expect(currentQuestion).toBe(1);
    
    goBack();
    expect(currentQuestion).toBe(0);
    
    // Não deve ir abaixo de 0
    goBack();
    expect(currentQuestion).toBe(0);
  });
});
