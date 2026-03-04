/**
 * Dielly AI - Endpoint de chat inteligente usando LLM do servidor
 * Usa toda a base de conhecimento como contexto para respostas precisas
 */
import { invokeLLM, type Message } from "./_core/llm";
import {
  KNOWLEDGE_BASE,
  searchKnowledge,
  generatePriceResponse,
} from "../data/knowledge-base";
import {
  PRODUCTS,
  CITIES,
  CONTRACT_TYPES,
  AGE_RANGES,
  AGE_RANGE_LABELS,
  getAvailableProducts,
  getPrice,
  type City,
  type ContractType,
  type CoparticipationType,
  type AgeRange,
} from "../data/hapvida-prices";

// ============================================
// SYSTEM PROMPT COMPLETO DA DIELLY
// ============================================

function buildSystemPrompt(): string {
  // Montar resumo de todos os produtos com detalhes
  const productSummary = KNOWLEDGE_BASE
    .filter(e => e.category === "Produtos" || e.category === "Comparação")
    .map(e => `### ${e.question}\n${e.answer}`)
    .join("\n\n");

  // Montar resumo de regras
  const rulesSummary = KNOWLEDGE_BASE
    .filter(e => ["Regras", "Coparticipação", "Contratos", "Carência", "Vigência", "Faixas Etárias", "Filiais"].includes(e.category))
    .map(e => `### ${e.question}\n${e.answer}`)
    .join("\n\n");

  // Montar resumo de vendas e recomendações
  const salesSummary = KNOWLEDGE_BASE
    .filter(e => ["Vendas", "Recomendação", "FAQ", "Promoção", "Benefícios", "Suporte", "Institucional", "Simulador"].includes(e.category))
    .map(e => `### ${e.question}\n${e.answer}`)
    .join("\n\n");

  // Montar tabela de preços resumida para São Paulo (referência)
  let priceTable = "### Tabela de Preços - São Paulo (Super Simples 1 Vida, Copart. Parcial)\n\n";
  priceTable += "| Produto | 0-18 | 29-33 | 59+ |\n|---|---|---|---|\n";
  const spProducts = getAvailableProducts("sao-paulo" as City, "super-simples-1-vida" as ContractType, "parcial");
  for (const prod of spProducts) {
    const p1 = getPrice("sao-paulo" as City, "super-simples-1-vida" as ContractType, "parcial", prod.id, "00-18");
    const p2 = getPrice("sao-paulo" as City, "super-simples-1-vida" as ContractType, "parcial", prod.id, "29-33");
    const p3 = getPrice("sao-paulo" as City, "super-simples-1-vida" as ContractType, "parcial", prod.id, "59+");
    if (p1 && p2 && p3) {
      priceTable += `| ${prod.name} | R$ ${p1.toFixed(2)} | R$ ${p2.toFixed(2)} | R$ ${p3.toFixed(2)} |\n`;
    }
  }

  return `Você é a **Dielly**, assistente virtual inteligente do **Simula Saúde** — plataforma de simulação de planos de saúde Hapvida para corretores.

## PERSONALIDADE
- Simpática, profissional e objetiva
- Fala como uma colega experiente de vendas
- Usa linguagem clara e acessível, sem ser informal demais
- Sempre responde em português brasileiro
- Usa formatação Markdown para organizar respostas (tabelas, negrito, listas)
- Quando não souber algo com certeza, admite e sugere consultar a equipe comercial

## CAPACIDADES
Você pode ajudar o corretor com:
1. **Informações sobre produtos** — Detalhes de cada plano, coberturas, redes, acomodação
2. **Comparações entre produtos** — Tabelas comparativas lado a lado
3. **Sugestão inteligente de plano** — Baseada no perfil do cliente (idade, orçamento, necessidades)
4. **Argumentação de vendas** — Textos prontos para usar com o cliente
5. **Regras comerciais** — Carência, portabilidade, vigência, contratos, aceitação
6. **Análise de objeções** — Como contornar objeções do cliente ("achei caro", "já tenho plano")
7. **Preços e cotações** — Valores por faixa etária, filial e tipo de contrato

## REGRAS IMPORTANTES
- NUNCA invente dados ou preços. Use APENAS as informações fornecidas abaixo.
- Quando o corretor perguntar sobre um produto específico, responda EXATAMENTE sobre aquele produto. Exemplo: se perguntar "Advance 600 e Smart 200 UP", compare ESSES DOIS produtos, não outros.
- Preste muita atenção aos nomes dos produtos. "Smart 200" é diferente de "Smart 200 UP". "Premium 900" é diferente de "Premium 900 Care".
- Se o corretor pedir comparação, faça uma tabela comparativa clara.
- Se o corretor descrever um perfil de cliente, sugira o melhor plano com argumentação.
- Se o corretor pedir argumentação de vendas, forneça textos prontos e persuasivos.
- Se o corretor mencionar uma objeção do cliente, forneça contra-argumentos eficazes.
- Vigência atual das tabelas: 10/02/2026 a 31/03/2026.

## BASE DE CONHECIMENTO COMPLETA

### PRODUTOS E COMPARAÇÕES
${productSummary}

### REGRAS COMERCIAIS
${rulesSummary}

### VENDAS, RECOMENDAÇÕES E FAQ
${salesSummary}

### PREÇOS DE REFERÊNCIA
${priceTable}

**Filiais disponíveis:** ${CITIES.map(c => c.name).join(", ")}
**Tipos de contrato:** ${CONTRACT_TYPES.map(c => c.name).join(", ")}
**Faixas etárias ANS:** ${AGE_RANGES.map(ar => AGE_RANGE_LABELS[ar]).join(", ")}
`;
}

// Cache do system prompt (não muda durante a sessão)
let cachedSystemPrompt: string | null = null;
function getSystemPrompt(): string {
  if (!cachedSystemPrompt) {
    cachedSystemPrompt = buildSystemPrompt();
  }
  return cachedSystemPrompt;
}

// ============================================
// GERADOR DE CONTEXTO DINÂMICO DE PREÇOS
// ============================================

function buildPriceContext(query: string): string {
  const priceResponse = generatePriceResponse(query);
  if (priceResponse) {
    return `\n\n### DADOS DE PREÇO RELEVANTES PARA ESTA PERGUNTA:\n${priceResponse}`;
  }
  return "";
}

// ============================================
// BUSCA DE CONHECIMENTO RELEVANTE
// ============================================

function buildRelevantContext(query: string): string {
  const results = searchKnowledge(query, 5);
  if (results.length === 0) return "";

  let context = "\n\n### ENTRADAS MAIS RELEVANTES DA BASE:\n";
  for (const entry of results) {
    if (!entry.answer.startsWith("PRICE_LOOKUP")) {
      context += `**${entry.question}:**\n${entry.answer}\n\n`;
    }
  }
  return context;
}

// ============================================
// FUNÇÃO PRINCIPAL DE CHAT
// ============================================

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithDielly(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
  const systemPrompt = buildSystemPrompt();
  const priceContext = buildPriceContext(userMessage);
  const relevantContext = buildRelevantContext(userMessage);

  const messages: Message[] = [
    {
      role: "system",
      content: systemPrompt + priceContext + relevantContext,
    },
  ];

  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  messages.push({
    role: "user",
    content: userMessage,
  });

  try {
    const result = await invokeLLM({
      messages,
      max_tokens: 4096,
    });

    const content = result.choices?.[0]?.message?.content;
    if (typeof content === "string") {
      return content;
    }
    if (Array.isArray(content)) {
      return content
        .filter((c): c is { type: "text"; text: string } => c.type === "text")
        .map((c) => c.text)
        .join("\n");
    }
    return "Desculpe, nao consegui processar sua pergunta. Tente reformular!";
  } catch (error: any) {
    console.error("[Dielly] LLM error:", error.message);
    return fallbackResponse(userMessage);
  }
}

// ============================================
// FALLBACK (caso LLM esteja indisponível)
// ============================================

function fallbackResponse(query: string): string {
  const results = searchKnowledge(query, 3);
  const priceResponse = generatePriceResponse(query);

  if (results.length === 0 && !priceResponse) {
    return "Desculpe, estou com dificuldade para processar sua pergunta no momento. Tente novamente em alguns instantes ou reformule sua pergunta! 😊";
  }

  let response = "";
  if (priceResponse) {
    response = priceResponse;
  }
  if (results.length > 0 && !results[0].answer.startsWith("PRICE_LOOKUP")) {
    if (response) response += "\n\n---\n\n";
    response += results[0].answer;
  }
  return response || "Tente reformular sua pergunta!";
}
