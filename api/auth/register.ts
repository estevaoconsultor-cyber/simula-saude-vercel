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
    const { firstName, lastName, email, password, profile, sellerCode, brokerageCode, brokerageName } = req.body;

    // Validações
    if (!firstName || !lastName || !email || !password || !profile) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres" });
    }
    if (!["vendedor", "dono_corretora", "adm", "supervisor"].includes(profile)) {
      return res.status(400).json({ error: "Perfil inválido" });
    }

    // Verificar se email já existe
    const existing = await db.getBrokerByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "Este e-mail já está cadastrado. Faça login." });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar corretor
    const brokerId = await db.createBroker({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      profile,
      sellerCode: sellerCode || null,
      brokerageCode: brokerageCode || null,
      brokerageName: brokerageName || null,
    });

    // Criar sessão
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

    await db.createBrokerSession({
      brokerId,
      sessionToken,
      deviceFingerprint: getDeviceFingerprint(req),
      deviceName: getDeviceName(req),
      lastIp: getClientIp(req),
      expiresAt,
    });

    // Log de acesso
    await db.createAccessLog({
      brokerId,
      action: "register",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"] || null,
      metadata: { profile },
    });

    await db.updateBrokerLastLogin(brokerId);

    return res.status(200).json({
      success: true,
      token: sessionToken,
      broker: {
        id: brokerId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        profile,
      },
    });
  } catch (error: any) {
    console.error("[Register Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
