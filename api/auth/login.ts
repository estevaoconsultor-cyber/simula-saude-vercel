import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import * as db from "../_db";
import { generateSessionToken, getDeviceFingerprint, getDeviceName, getClientIp, corsHeaders } from "../_helpers";

const MAX_DEVICES = 3;
const SESSION_DURATION_DAYS = 30;

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const broker = await db.getBrokerByEmail(email.toLowerCase());
    if (!broker) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    if (!broker.isActive) {
      return res.status(403).json({ error: "Sua conta está desativada. Entre em contato com o suporte." });
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, broker.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // Controle de dispositivos
    const activeSessions = await db.listBrokerSessions(broker.id);
    const deviceFingerprint = getDeviceFingerprint(req);

    const existingSession = activeSessions.find(
      (s: any) => s.deviceFingerprint === deviceFingerprint
    );

    if (existingSession) {
      await db.deleteBrokerSession(existingSession.id);
    } else if (activeSessions.length >= MAX_DEVICES) {
      await db.deleteOldestBrokerSession(broker.id);
    }

    // Criar nova sessão
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

    await db.createBrokerSession({
      brokerId: broker.id,
      sessionToken,
      deviceFingerprint,
      deviceName: getDeviceName(req),
      lastIp: getClientIp(req),
      expiresAt,
    });

    // Log de acesso
    await db.createAccessLog({
      brokerId: broker.id,
      action: "login",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"] || null,
    });

    await db.updateBrokerLastLogin(broker.id);

    return res.status(200).json({
      success: true,
      token: sessionToken,
      broker: {
        id: broker.id,
        firstName: broker.firstName,
        lastName: broker.lastName,
        email: broker.email,
        profile: broker.profile,
      },
    });
  } catch (error: any) {
    console.error("[Login Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
