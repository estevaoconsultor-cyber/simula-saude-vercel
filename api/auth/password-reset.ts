import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
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
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres" });
    }

    const emailLower = email.toLowerCase().trim();

    // Buscar token válido
    const resetToken = await db.getValidPasswordReset(emailLower, code);
    if (!resetToken) {
      return res.status(400).json({ error: "Código inválido ou expirado. Solicite um novo código." });
    }

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Atualizar senha
    await db.updateBrokerPassword(resetToken.brokerId, passwordHash);

    // Marcar token como usado
    await db.markPasswordResetUsed(resetToken.id);

    // Invalidar todos os outros tokens
    await db.invalidatePasswordResets(emailLower);

    return res.status(200).json({
      success: true,
      message: "Senha redefinida com sucesso! Faça login com sua nova senha.",
    });
  } catch (error: any) {
    console.error("[PasswordReset Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
