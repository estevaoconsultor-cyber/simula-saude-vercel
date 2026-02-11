import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as db from "../_db";
import { corsHeaders } from "../_helpers";

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
    // Verificar auth (opcional - pode ser protegido por API key)
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    // Se tem token, verificar se é admin
    if (token) {
      const session = await db.getBrokerSessionByToken(token);
      if (session) {
        const broker = await db.getBrokerById(session.brokerId);
        if (!broker || broker.profile !== "adm") {
          return res.status(403).json({ error: "Acesso restrito a administradores" });
        }
      }
    }

    const logs = await db.getAccessLogsToday();
    const allBrokers = await db.getAllBrokers();

    // Resumo
    const loginCount = logs.filter((l: any) => l.action === "login").length;
    const registerCount = logs.filter((l: any) => l.action === "register").length;
    const simulationCount = logs.filter((l: any) => l.action === "simulation" || l.action === "save_quote").length;

    // Usuários únicos que acessaram hoje
    const uniqueUsers = [...new Set(logs.map((l: any) => l.brokerId))];
    const usersToday = uniqueUsers.map((id) => {
      const brokerLogs = logs.filter((l: any) => l.brokerId === id);
      const firstLog = brokerLogs[brokerLogs.length - 1];
      return {
        id,
        name: `${firstLog?.firstName || ""} ${firstLog?.lastName || ""}`.trim(),
        email: firstLog?.brokerEmail || "",
        profile: firstLog?.profile || "",
        actions: brokerLogs.map((l: any) => ({
          action: l.action,
          time: l.createdAt,
          ip: l.ipAddress,
        })),
      };
    });

    return res.status(200).json({
      date: new Date().toISOString().split("T")[0],
      summary: {
        totalLogins: loginCount,
        totalRegisters: registerCount,
        totalSimulations: simulationCount,
        uniqueUsersToday: uniqueUsers.length,
        totalBrokers: allBrokers.length,
      },
      usersToday,
      allBrokers: allBrokers.map((b: any) => ({
        id: b.id,
        name: `${b.firstName} ${b.lastName}`,
        email: b.email,
        profile: b.profile,
        sellerCode: b.sellerCode,
        brokerageCode: b.brokerageCode,
        brokerageName: b.brokerageName,
        isActive: b.isActive,
        createdAt: b.createdAt,
        lastLoginAt: b.lastLoginAt,
      })),
    });
  } catch (error: any) {
    console.error("[DailyReport Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
