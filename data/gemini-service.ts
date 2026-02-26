// data/gemini-service.ts

// Usa variável de ambiente configurada no Vercel
const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Prompt base do comportamento do assistente
const SYSTEM_PROMPT = `
Você é a Dielly, assistente virtual especializada em planos de saúde.
Responda de forma clara, objetiva e amigável.
Sempre ajude o usuário com informações úteis e práticas.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function askDielly(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY não configurada");
  return "Assistente temporariamente indisponível.";
}

  try {
    // Converte histórico para formato do Gemini
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: SYSTEM_PROMPT,
                },
              ],
            },
            ...formattedHistory,
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro na resposta da API Gemini");
    }

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não consegui gerar uma resposta agora."
    );
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Estou com instabilidade no servidor agora. Tente novamente em alguns segundos.";
  }
}