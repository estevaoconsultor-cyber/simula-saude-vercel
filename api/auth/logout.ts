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

  const headers = corsHeaders();
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (token) {
      await db.deleteBrokerSessionByToken(token);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("[Logout Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
