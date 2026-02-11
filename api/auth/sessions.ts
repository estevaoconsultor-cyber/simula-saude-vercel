import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as db from "../_db";
import { corsHeaders } from "../_helpers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .end();
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

    if (req.method === "DELETE") {
      const { sessionId } = req.body || {};
      if (!sessionId) {
        return res.status(400).json({ error: "sessionId é obrigatório" });
      }

      const sessions = await db.listBrokerSessions(session.brokerId);
      const target = sessions.find((s: any) => s.id === sessionId);
      if (!target) {
        return res.status(404).json({ error: "Sessão não encontrada" });
      }

      await db.deleteBrokerSession(sessionId);
      return res.status(200).json({ success: true });
    }

    // GET - listar sessões
    const sessions = await db.listBrokerSessions(session.brokerId);
    return res.status(200).json({
      sessions: sessions.map((s: any) => ({
        id: s.id,
        deviceName: s.deviceName,
        lastIp: s.lastIp,
        lastUsedAt: s.lastUsedAt,
        createdAt: s.createdAt,
        isCurrent: s.sessionToken === token,
      })),
    });
  } catch (error: any) {
    console.error("[Sessions Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
