const GEMINI_API_KEY = “AIzaSyADzhoefLXmbYSffjUxj3ARD6dP67uK3_o”;
const GEMINI_API_URL =
“https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent”;

const SYSTEM_PROMPT = `Você é a Dielly, assistente virtual especializada nos planos de saúde Hapvida para vendedores da equipe Hapvida SP.

Sua personalidade:

- Simpática, profissional e objetiva
- Fala em português brasileiro
- Usa linguagem acessível mas técnica quando necessário
- Sempre foca em ajudar o vendedor a fechar a venda

Você conhece profundamente:

- Produtos Hapvida: planos PME (2 a 99 vidas), SS1V, SS2A29, MEI
- Tipos de contrato: Adesão e Compulsório
- Coparticipação: Parcial e Total
- Cidades atendidas: São Paulo, Mogi das Cruzes, Americana e região
- Faixas etárias: 00-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+
- Regras de carência, vigência e elegibilidade
- Rede credenciada e hospitais parceiros
- Argumentos e técnicas de venda

Regras importantes:

- Nunca invente preços — diga que os valores exatos estão na aba Simulador
- Se não souber algo específico, oriente o vendedor a consultar o material oficial
- Seja direta e prática nas respostas
- Quando der argumentos de venda, seja persuasiva e motivadora

Responda sempre de forma clara e útil para o vendedor.`;

export async function askDielly(
userMessage: string,
conversationHistory: { role: string; text: string }[] = []
): Promise<string> {
try {
// Monta o histórico de conversa
const contents = [
// Mensagem de sistema como primeira mensagem do usuário
{
role: “user”,
parts: [{ text: SYSTEM_PROMPT }],
},
{
role: “model”,
parts: [
{
text: “Entendido! Sou a Dielly, assistente da Hapvida SP. Como posso ajudar você hoje?”,
},
],
},
// Histórico anterior
…conversationHistory.map((msg) => ({
role: msg.role === “user” ? “user” : “model”,
parts: [{ text: msg.text }],
})),
// Mensagem atual
{
role: “user”,
parts: [{ text: userMessage }],
},
];

```
const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  }),
});

if (!response.ok) {
  throw new Error(`Erro na API: ${response.status}`);
}

const data = await response.json();
const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
  throw new Error("Resposta vazia da API");
}

return text;
```

} catch (error) {
console.error(“Erro ao consultar Gemini:”, error);
return “Desculpe, tive um problema para processar sua pergunta. Tente novamente em instantes!”;
}
}