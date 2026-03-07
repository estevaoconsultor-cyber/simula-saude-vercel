// data/open-ia-dielly.ts
export async function askDielly(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, conversationHistory }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Erro na API:", err);
      return "Desculpe, não consegui responder agora. Tente novamente!";
    }

    const data = await response.json();
    return data?.reply || "Desculpe, não consegui responder agora.";
  } catch (error) {
    console.error("Erro ao chamar /api/ai/chat:", error);
    return "Desculpe, tive um problema ao processar sua pergunta. Tente novamente!";
  }
}