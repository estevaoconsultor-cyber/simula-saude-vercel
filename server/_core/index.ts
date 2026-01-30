import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { storageGet } from "../storage";

// Mapeamento de documentos para S3 keys
const DOCUMENT_MAP: Record<string, { s3Key: string; displayName: string }> = {
  "carta-nomeacao.docx": {
    s3Key: "documents/carta-nomeacao.docx",
    displayName: "Carta de Nomeação",
  },
  "contrato-prestacao-servico.docx": {
    s3Key: "documents/contrato-prestacao-servico.docx",
    displayName: "Contrato de Prestação de Serviço",
  },
  "0.ManualAPPdoBeneficiário.pdf": {
    s3Key: "documents/manuais/0-manual-app-beneficiario.pdf",
    displayName: "Manual APP do Beneficiário",
  },
  "1.ManualdoCorretorSuperSimplesePME.pdf": {
    s3Key: "documents/manuais/1-manual-corretor-ss-pme.pdf",
    displayName: "Manual do Corretor Super Simples e PME",
  },
  "2.GuiáPráticoAppVendedor(a).pdf": {
    s3Key: "documents/manuais/2-guia-app-vendedor.pdf",
    displayName: "Guia Prático App Vendedor",
  },
  "2.1ManualPortalWebVendedor.pdf": {
    s3Key: "documents/manuais/2-1-manual-portal-web-vendedor.pdf",
    displayName: "Manual Portal Web Vendedor",
  },
  "3.ManualPortaldoCliente.pdf": {
    s3Key: "documents/manuais/3-manual-portal-cliente.pdf",
    displayName: "Manual Portal do Cliente",
  },
  "4.PortalCorretorCNPJPF.pdf": {
    s3Key: "documents/manuais/4-portal-corretor-cnpj-pf.pdf",
    displayName: "Portal Corretor CNPJ/PF",
  },
  "5.ManualAppePortal.pdf": {
    s3Key: "documents/manuais/5-manual-app-portal.pdf",
    displayName: "Manual App e Portal",
  },
  "7.ManualdemovimentaçãoparacontratosPF.pdf": {
    s3Key: "documents/manuais/7-manual-movimentacao-pf.pdf",
    displayName: "Manual de Movimentação para Contratos PF",
  },
  "8.GuiaTrilhadeVendasHapvida.pdf": {
    s3Key: "documents/manuais/8-guia-trilha-vendas.pdf",
    displayName: "Guia Trilha de Vendas Hapvida",
  },
  "9.ManualdeReembolso-APPePortal.pdf": {
    s3Key: "documents/manuais/9-manual-reembolso.pdf",
    displayName: "Manual de Reembolso - APP e Portal",
  },
};

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  // Rota de download de documentos
  app.get("/api/documents/download", async (req, res) => {
    try {
      const filename = req.query.filename as string;
      if (!filename) {
        res.status(400).json({ error: "Filename is required" });
        return;
      }

      const doc = DOCUMENT_MAP[filename];
      if (!doc) {
        res.status(404).json({ error: "Document not found" });
        return;
      }

      try {
        const { url } = await storageGet(doc.s3Key);
        // Redirecionar para a URL do S3
        res.redirect(url);
      } catch (error) {
        console.error("Error getting document URL:", error);
        res.status(500).json({ error: "Failed to get document URL" });
      }
    } catch (error) {
      console.error("Error in download route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
