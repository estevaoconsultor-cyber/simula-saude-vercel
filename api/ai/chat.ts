// api/ai/chat.ts
export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `Você é a Dielly, assistente virtual especializada nos planos de saúde Hapvida para vendedores da equipe Hapvida SP.

Sua personalidade:
- Simpática, profissional e objetiva
- Fala em português brasileiro
- Usa linguagem acessível mas técnica quando necessário
- Sempre foca em ajudar o vendedor a fechar a venda

Você conhece profundamente:
- Produtos Hapvida: planos PME (2 a 99 vidas), SS1V, SS2A29, MEI
- Tipos de contrato: Adesão e Compulsório
- Coparticipação: Parcial significa que o beneficiário paga uma parte dos procedimentos no momento do uso. Total significa que o beneficiário paga o valor integral de alguns procedimentos conforme tabela.
- Cidades atendidas: São Paulo, Mogi das Cruzes, Americana e região
- Faixas etárias: 00-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+
- Regras de carência: urgência/emergência sem carência, demais procedimentos seguem ANS
- MEI: CNPJ com mínimo 6 meses, aceita titular + dependentes
- PME: 2 a 99 vidas, precisa de CNPJ ativo

Regras importantes:
- Para preços exatos, oriente o vendedor a usar a aba Simulador do app
- Se não souber algo específico, oriente consultar o material oficial
- Seja direta e prática
- Quando der argumentos de venda, seja persuasiva e motivadora
- Nunca invente informações`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  const OPENAI_API_KEY =
    process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    const { userMessage, conversationHistory = [] } = await req.json();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "userMessage is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("OpenAI error:", err);
      return new Response(
        JSON.stringify({ error: "OpenAI error", detail: err }),
        { status: openaiRes.status, headers: corsHeaders }
      );
    }

    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}