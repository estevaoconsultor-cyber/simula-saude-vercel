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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório" });
    }

    const emailLower = email.toLowerCase().trim();
    const broker = await db.getBrokerByEmail(emailLower);

    // Sempre retorna sucesso (não revelar se email existe)
    if (!broker) {
      return res.status(200).json({
        success: true,
        message: "Se o e-mail estiver cadastrado, você receberá um código de redefinição.",
      });
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Expira em 15 minutos
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Invalidar códigos anteriores
    await db.invalidatePasswordResets(emailLower);

    // Salvar no banco
    await db.createPasswordReset({
      brokerId: broker.id,
      email: emailLower,
      code,
      expiresAt,
    });

    // Log para debug (em produção, enviar por email)
    console.log(`[PasswordReset] Código para ${emailLower}: ${code}`);

    return res.status(200).json({
      success: true,
      message: "Se o e-mail estiver cadastrado, você receberá um código de redefinição.",
    });
  } catch (error: any) {
    console.error("[PasswordReset Request Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
