// data/open-ia-dielly.ts

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";

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

export async function askDielly(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return "Desculpe, não consegui responder agora. Tente novamente!";
    }

    const data = await response.json();
    return (
      data?.choices?.[0]?.message?.content ||
      "Desculpe, não consegui responder agora."
    );
  } catch (error) {
    console.error("Erro ao consultar OpenAI:", error);
    return "Desculpe, tive um problema ao processar sua pergunta. Tente novamente!";
  }
}
