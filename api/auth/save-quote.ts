import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as db from "../_db";
import { corsHeaders } from "../_helpers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const headers = corsHeaders();
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const session = await db.getBrokerSessionByToken(token);
    if (!session) {
      return res.status(401).json({ error: "Sessão inválida" });
    }

    const { companyName, expectedDate, quoteData } = req.body;

    await db.saveQuote({
      brokerId: session.brokerId,
      companyName: companyName || null,
      expectedDate: expectedDate || null,
      quoteData: JSON.stringify(quoteData),
    });

    // Log de acesso
    await db.createAccessLog({
      brokerId: session.brokerId,
      action: "save_quote",
      ipAddress: req.headers["x-forwarded-for"]?.toString() || req.socket?.remoteAddress || null,
      userAgent: req.headers["user-agent"] || null,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("[SaveQuote Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
