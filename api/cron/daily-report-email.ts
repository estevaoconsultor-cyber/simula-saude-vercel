import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as db from "../_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Aceitar GET para visualização no navegador
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Proteção simples por query param
  const key = req.query.key;
  if (key !== "hapvida2026report") {
    return res.status(401).json({ error: "Chave inválida. Use ?key=hapvida2026report" });
  }

  try {
    const logs = await db.getAccessLogsToday();
    const allBrokers = await db.getAllBrokers();

    const loginCount = logs.filter((l: any) => l.action === "login").length;
    const registerCount = logs.filter((l: any) => l.action === "register").length;
    const simulationCount = logs.filter((l: any) => l.action === "simulation" || l.action === "save_quote").length;

    const uniqueUserIds = [...new Set(logs.map((l: any) => l.brokerId))];

    const today = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    });

    let accessRows = "";
    for (const userId of uniqueUserIds) {
      const userLogs = logs.filter((l: any) => l.brokerId === userId);
      const firstLog = userLogs[userLogs.length - 1];
      const name = `${firstLog?.firstName || ""} ${firstLog?.lastName || ""}`.trim();
      const email = firstLog?.brokerEmail || "";
      const profile = firstLog?.profile || "";
      const actions = userLogs.map((l: any) => l.action).join(", ");
      const lastIp = userLogs[0]?.ipAddress || "";

      accessRows += `
        <tr>
          <td>${name}</td>
          <td>${email}</td>
          <td>${profile}</td>
          <td>${actions}</td>
          <td>${lastIp}</td>
        </tr>`;
    }

    if (!accessRows) {
      accessRows = `
        <tr>
          <td colspan="5" style="text-align: center; color: #999; padding: 20px;">
            Nenhum acesso registrado hoje
          </td>
        </tr>`;
    }

    let brokersRows = "";
    for (const b of allBrokers) {
      const lastLogin = b.lastLoginAt
        ? new Date(b.lastLoginAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Sao_Paulo",
          })
        : "Nunca";

      brokersRows += `
        <tr>
          <td>${b.firstName} ${b.lastName}</td>
          <td>${b.email}</td>
          <td>${b.profile}</td>
          <td>${b.sellerCode || "-"}</td>
          <td>${b.brokerageName || "-"}</td>
          <td>${b.isActive ? "✅ Ativo" : "❌ Inativo"}</td>
          <td>${lastLogin}</td>
        </tr>`;
    }

    // Formato de resposta: se ?format=json retorna JSON, senão retorna HTML
    if (req.query.format === "json") {
      return res.status(200).json({
        date: today,
        uniqueUsers: uniqueUserIds.length,
        logins: loginCount,
        registers: registerCount,
        simulations: simulationCount,
        totalBrokers: allBrokers.length,
        accessLogs: logs,
        brokers: allBrokers,
      });
    }

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Diário - Simulador Hapvida - ${today}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #333; padding: 20px; }
    .container { max-width: 1000px; margin: 0 auto; }
    h1 { color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 12px; margin-bottom: 20px; font-size: 24px; }
    h2 { color: #333; margin: 30px 0 15px; font-size: 18px; }
    .date { color: #666; margin-bottom: 20px; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
    .card { padding: 20px; border-radius: 12px; text-align: center; }
    .card .number { font-size: 32px; font-weight: bold; }
    .card .label { font-size: 13px; color: #666; margin-top: 4px; }
    .card-green { background: #e8f5e9; }
    .card-green .number { color: #2e7d32; }
    .card-blue { background: #e3f2fd; }
    .card-blue .number { color: #1565c0; }
    .card-orange { background: #fff3e0; }
    .card-orange .number { color: #e65100; }
    .card-purple { background: #f3e5f5; }
    .card-purple .number { color: #7b1fa2; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 30px; }
    th { background: #f8f9fa; padding: 12px 10px; text-align: left; font-size: 13px; color: #555; border-bottom: 2px solid #e0e0e0; }
    td { padding: 10px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    tr:hover { background: #f8f9fa; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
    @media (max-width: 768px) {
      .cards { grid-template-columns: repeat(2, 1fr); }
      table { font-size: 11px; }
      td, th { padding: 6px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Relatório Diário - Simulador Hapvida</h1>
    <p class="date">Data: ${today}</p>

    <div class="cards">
      <div class="card card-green">
        <div class="number">${uniqueUserIds.length}</div>
        <div class="label">Usuários Únicos</div>
      </div>
      <div class="card card-blue">
        <div class="number">${loginCount}</div>
        <div class="label">Logins</div>
      </div>
      <div class="card card-orange">
        <div class="number">${registerCount}</div>
        <div class="label">Novos Cadastros</div>
      </div>
      <div class="card card-purple">
        <div class="number">${simulationCount}</div>
        <div class="label">Simulações Salvas</div>
      </div>
    </div>

    <h2>🔍 Acessos de Hoje</h2>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Perfil</th>
          <th>Ações</th>
          <th>IP</th>
        </tr>
      </thead>
      <tbody>
        ${accessRows}
      </tbody>
    </table>

    <h2>👥 Todos os Corretores Cadastrados (${allBrokers.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Perfil</th>
          <th>Cód. Vendedor</th>
          <th>Corretora</th>
          <th>Status</th>
          <th>Último Login</th>
        </tr>
      </thead>
      <tbody>
        ${brokersRows}
      </tbody>
    </table>

    <div class="footer">
      Relatório automático do Simulador Hapvida - simulasaude.app.br
    </div>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (error: any) {
    console.error("[DailyReport Error]", error);
    return res.status(500).json({ error: "Erro interno do servidor", details: error.message });
  }
}
