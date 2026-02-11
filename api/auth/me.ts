import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as db from "../_db";
import { getClientIp, corsHeaders } from "../_helpers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .end();
  }

  const headers = corsHeaders();
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(200).json({ broker: null });
    }

    const session = await db.getBrokerSessionByToken(token);
    if (!session) {
      return res.status(200).json({ broker: null });
    }

    const broker = await db.getBrokerById(session.brokerId);
    if (!broker || !broker.isActive) {
      return res.status(200).json({ broker: null });
    }

    // Touch session
    await db.touchBrokerSession(session.id, getClientIp(req));

    return res.status(200).json({
      broker: {
        id: broker.id,
        firstName: broker.firstName,
        lastName: broker.lastName,
        email: broker.email,
        profile: broker.profile,
        sellerCode: broker.sellerCode,
        brokerageCode: broker.brokerageCode,
        brokerageName: broker.brokerageName,
        createdAt: broker.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[Me Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
