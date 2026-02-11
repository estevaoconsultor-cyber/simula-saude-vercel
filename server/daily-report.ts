import * as db from "./db";
import { notifyOwner } from "./_core/notification";

/**
 * Gera e envia o relatório diário de cadastros e acessos.
 * Usa o sistema de notificação da plataforma Manus para enviar ao owner.
 */
export async function sendDailyReport(): Promise<boolean> {
  try {
    const newBrokersToday = await db.countBrokersToday();
    const loginsToday = await db.countAccessLogsToday("login");
    const registersToday = await db.countAccessLogsToday("register");
    const simulationsToday = await db.countAccessLogsToday("simulation");
    const quotesToday = await db.countAccessLogsToday("save_quote");
    const totalBrokers = await db.countActiveBrokers();

    const today = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const title = `Relatório Diário SimulaSaúde - ${today}`;

    const content = [
      `📊 RELATÓRIO DIÁRIO - ${today}`,
      ``,
      `📋 NOVOS CADASTROS`,
      `• Novos corretores hoje: ${newBrokersToday}`,
      `• Total de corretores ativos: ${totalBrokers}`,
      ``,
      `🔐 ACESSOS`,
      `• Logins realizados hoje: ${loginsToday}`,
      `• Cadastros realizados hoje: ${registersToday}`,
      ``,
      `📈 ATIVIDADE`,
      `• Simulações realizadas: ${simulationsToday}`,
      `• Orçamentos salvos: ${quotesToday}`,
      ``,
      `---`,
      `Simulador Hapvida - Relatório automático`,
      `Para: estevao.cardoso@hapvida.com.br`,
    ].join("\n");

    // Enviar via sistema de notificação da plataforma
    const sent = await notifyOwner({ title, content });

    if (sent) {
      console.log(`[DailyReport] Relatório enviado com sucesso: ${today}`);
    } else {
      console.warn(`[DailyReport] Falha ao enviar relatório: ${today}`);
    }

    return sent;
  } catch (error) {
    console.error("[DailyReport] Erro ao gerar relatório:", error);
    return false;
  }
}

/**
 * Limpa sessões expiradas (manutenção diária)
 */
export async function dailyMaintenance(): Promise<void> {
  try {
    await db.cleanExpiredSessions();
    console.log("[DailyMaintenance] Sessões expiradas limpas");
  } catch (error) {
    console.error("[DailyMaintenance] Erro:", error);
  }
}
