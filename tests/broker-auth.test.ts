import { describe, it, expect } from "vitest";

const API_URL = "http://127.0.0.1:3000";

// Helper para fazer requests tRPC
async function trpcQuery(path: string, input: any = {}, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(
    `${API_URL}/api/trpc/${path}?input=${encodeURIComponent(JSON.stringify(input))}`,
    { headers }
  );
  return response.json();
}

async function trpcMutation(path: string, input: any, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/api/trpc/${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ json: input }),
  });
  return response.json();
}

describe("Broker Authentication System", () => {
  const testEmail = `test-${Date.now()}@broker.com`;
  let authToken: string;

  it("should register a new broker", async () => {
    const result = await trpcMutation("broker.register", {
      firstName: "João",
      lastName: "Silva",
      email: testEmail,
      password: "senha123",
      profile: "vendedor",
      sellerCode: "V999",
      brokerageCode: "C999",
      brokerageName: "Corretora Teste Auto",
    });

    expect(result.result?.data?.json?.success).toBe(true);
    expect(result.result?.data?.json?.token).toBeTruthy();
    expect(result.result?.data?.json?.broker?.firstName).toBe("João");
    expect(result.result?.data?.json?.broker?.email).toBe(testEmail);
    authToken = result.result?.data?.json?.token;
  });

  it("should reject duplicate email registration", async () => {
    const result = await trpcMutation("broker.register", {
      firstName: "Outro",
      lastName: "Corretor",
      email: testEmail,
      password: "outrasenha",
      profile: "adm",
    });

    expect(result.error?.json?.data?.code).toBe("CONFLICT");
    expect(result.error?.json?.message).toContain("já está cadastrado");
  });

  it("should login with correct credentials", async () => {
    const result = await trpcMutation("broker.login", {
      email: testEmail,
      password: "senha123",
    });

    expect(result.result?.data?.json?.success).toBe(true);
    expect(result.result?.data?.json?.token).toBeTruthy();
    authToken = result.result?.data?.json?.token;
  });

  it("should reject login with wrong password", async () => {
    const result = await trpcMutation("broker.login", {
      email: testEmail,
      password: "senhaerrada",
    });

    expect(result.error?.json?.data?.code).toBe("UNAUTHORIZED");
  });

  it("should reject login with non-existent email", async () => {
    const result = await trpcMutation("broker.login", {
      email: "naoexiste@email.com",
      password: "qualquer",
    });

    expect(result.error?.json?.data?.code).toBe("NOT_FOUND");
  });

  it("should return broker info with valid token (me)", async () => {
    const result = await trpcQuery("broker.me", {}, authToken);

    expect(result.result?.data?.json?.email).toBe(testEmail);
    expect(result.result?.data?.json?.firstName).toBe("João");
    expect(result.result?.data?.json?.profile).toBe("vendedor");
    expect(result.result?.data?.json?.sellerCode).toBe("V999");
  });

  it("should return null for invalid token (me)", async () => {
    const result = await trpcQuery("broker.me", {}, "token-invalido");

    expect(result.result?.data?.json).toBeNull();
  });

  it("should list active sessions", async () => {
    const result = await trpcQuery("broker.sessions", {}, authToken);

    const sessions = result.result?.data?.json;
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBeGreaterThan(0);
    expect(sessions.some((s: any) => s.isCurrent)).toBe(true);
  });

  it("should save a quote", async () => {
    const result = await trpcMutation(
      "quotes.save",
      {
        companyName: "Empresa Auto Teste",
        expectedDate: "20/03/2026",
        quoteData: { city: "sp", total: 1000 },
      },
      authToken
    );

    expect(result.result?.data?.json?.success).toBe(true);
    expect(result.result?.data?.json?.id).toBeGreaterThan(0);
  });

  it("should list quotes for authenticated broker", async () => {
    const result = await trpcQuery("quotes.list", {}, authToken);

    const quotes = result.result?.data?.json;
    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes.length).toBeGreaterThan(0);
    expect(quotes[0].companyName).toBe("Empresa Auto Teste");
  });

  it("should reject saving quote without auth", async () => {
    const result = await trpcMutation("quotes.save", {
      companyName: "Sem Auth",
      quoteData: {},
    });

    expect(result.error?.json?.data?.code).toBe("UNAUTHORIZED");
  });

  it("should generate daily report", async () => {
    const result = await trpcQuery("report.daily");

    const report = result.result?.data?.json;
    expect(report).toBeTruthy();
    expect(report.date).toBeTruthy();
    expect(typeof report.totalBrokers).toBe("number");
    expect(typeof report.loginsToday).toBe("number");
    expect(typeof report.newBrokersToday).toBe("number");
  });

  it("should logout successfully", async () => {
    const result = await trpcMutation("broker.logout", {}, authToken);

    expect(result.result?.data?.json?.success).toBe(true);

    // Verificar que o token foi invalidado
    const meResult = await trpcQuery("broker.me", {}, authToken);
    expect(meResult.result?.data?.json).toBeNull();
  });
});

describe("Health Endpoints", () => {
  it("should return healthy status", async () => {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("should return daily report via REST", async () => {
    const response = await fetch(`${API_URL}/api/report/daily`);
    const data = await response.json();
    expect(data.ok).toBeDefined();
  });
});
