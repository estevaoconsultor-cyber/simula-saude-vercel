import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storageGet } from "./storage";

// ==================== CONSTANTES ====================

const MAX_DEVICES = 3;
const SESSION_DURATION_DAYS = 30;
const BROKER_COOKIE_NAME = "broker_session";

// ==================== DOCUMENT MAP ====================

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

// ==================== HELPERS ====================

function generateSessionToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

function getDeviceFingerprint(req: any): string {
  const ua = req.headers["user-agent"] || "unknown";
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  const hash = crypto.createHash("sha256").update(`${ua}:${ip}`).digest("hex").slice(0, 32);
  return hash;
}

function getDeviceName(req: any): string {
  const ua = req.headers["user-agent"] || "";
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("iPad")) return "iPad";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Windows")) return "Windows PC";
  if (ua.includes("Mac")) return "Mac";
  if (ua.includes("Linux")) return "Linux";
  return "Navegador Web";
}

function getClientIp(req: any): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

// Schema de validação para cadastro de executivo (legado)
const createExecutiveSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  role: z.string().max(100).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email("E-mail inválido").max(320).optional(),
  brokerCode: z.string().max(50).optional(),
});

const updateExecutiveSchema = z.object({
  id: z.number(),
  name: z.string().min(2).max(255).optional(),
  role: z.string().max(100).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email().max(320).optional(),
  photoUrl: z.string().optional(),
  brokerCode: z.string().max(50).optional(),
});

// ==================== SCHEMAS DE BROKER ====================

const registerBrokerSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido").max(320),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100),
  profile: z.enum(["vendedor", "dono_corretora", "adm", "supervisor"]),
  sellerCode: z.string().max(50).optional().nullable(),
  brokerageCode: z.string().max(50).optional().nullable(),
  brokerageName: z.string().max(255).optional().nullable(),
});

const loginBrokerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const saveQuoteSchema = z.object({
  companyName: z.string().max(255).optional().nullable(),
  expectedDate: z.string().max(20).optional().nullable(),
  quoteData: z.any(),
});

const updateQuoteSchema = z.object({
  id: z.number(),
  companyName: z.string().max(255).optional().nullable(),
  expectedDate: z.string().max(20).optional().nullable(),
  quoteData: z.any().optional(),
});

// ==================== ROUTER ====================

export const appRouter = router({
  system: systemRouter,

  // Rota de download de documentos
  documents: router({
    getDownloadUrl: publicProcedure
      .input(z.object({ filename: z.string() }))
      .query(async ({ input }) => {
        const doc = DOCUMENT_MAP[input.filename];
        if (!doc) {
          throw new Error(`Documento não encontrado: ${input.filename}`);
        }

        try {
          const { url } = await storageGet(doc.s3Key);
          return { url, displayName: doc.displayName };
        } catch (error) {
          throw new Error(`Erro ao obter URL do documento: ${input.filename}`);
        }
      }),

    list: publicProcedure.query(() => {
      return Object.entries(DOCUMENT_MAP).map(([filename, info]) => ({
        filename,
        displayName: info.displayName,
      }));
    }),
  }),

  // Auth Manus OAuth (legado)
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== BROKER AUTH ====================
  broker: router({
    /**
     * Cadastro de novo corretor
     */
    register: publicProcedure
      .input(registerBrokerSchema)
      .mutation(async ({ input, ctx }) => {
        // Verificar se email já existe
        const existing = await db.getBrokerByEmail(input.email.toLowerCase());
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Este e-mail já está cadastrado. Faça login.",
          });
        }

        // Hash da senha
        const passwordHash = await bcrypt.hash(input.password, 12);

        // Criar corretor
        const brokerId = await db.createBroker({
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.toLowerCase().trim(),
          passwordHash,
          profile: input.profile,
          sellerCode: input.sellerCode || null,
          brokerageCode: input.brokerageCode || null,
          brokerageName: input.brokerageName || null,
        });

        // Criar sessão
        const sessionToken = generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

        await db.createBrokerSession({
          brokerId,
          sessionToken,
          deviceFingerprint: getDeviceFingerprint(ctx.req),
          deviceName: getDeviceName(ctx.req),
          lastIp: getClientIp(ctx.req),
          expiresAt,
        });

        // Log de acesso
        await db.createAccessLog({
          brokerId,
          action: "register",
          ipAddress: getClientIp(ctx.req),
          userAgent: ctx.req.headers["user-agent"] || null,
          metadata: { profile: input.profile },
        });

        // Atualizar último login
        await db.updateBrokerLastLogin(brokerId);

        return {
          success: true,
          token: sessionToken,
          broker: {
            id: brokerId,
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            email: input.email.toLowerCase().trim(),
            profile: input.profile,
          },
        };
      }),

    /**
     * Login de corretor
     */
    login: publicProcedure
      .input(loginBrokerSchema)
      .mutation(async ({ input, ctx }) => {
        const broker = await db.getBrokerByEmail(input.email.toLowerCase());
        if (!broker) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "E-mail ou senha incorretos.",
          });
        }

        if (!broker.isActive) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Sua conta está desativada. Entre em contato com o suporte.",
          });
        }

        // Verificar senha
        const isValid = await bcrypt.compare(input.password, broker.passwordHash);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "E-mail ou senha incorretos.",
          });
        }

        // Controle de dispositivos: verificar sessões ativas
        const activeSessions = await db.listBrokerSessions(broker.id);
        const deviceFingerprint = getDeviceFingerprint(ctx.req);

        // Verificar se já existe sessão para este dispositivo
        const existingSession = activeSessions.find(
          (s) => s.deviceFingerprint === deviceFingerprint
        );

        if (existingSession) {
          // Renovar sessão existente
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

          // Deletar a antiga e criar nova
          await db.deleteBrokerSession(existingSession.id);
        } else if (activeSessions.length >= MAX_DEVICES) {
          // Excedeu limite: derrubar a sessão mais antiga
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
          deviceName: getDeviceName(ctx.req),
          lastIp: getClientIp(ctx.req),
          expiresAt,
        });

        // Log de acesso
        await db.createAccessLog({
          brokerId: broker.id,
          action: "login",
          ipAddress: getClientIp(ctx.req),
          userAgent: ctx.req.headers["user-agent"] || null,
        });

        // Atualizar último login
        await db.updateBrokerLastLogin(broker.id);

        return {
          success: true,
          token: sessionToken,
          broker: {
            id: broker.id,
            firstName: broker.firstName,
            lastName: broker.lastName,
            email: broker.email,
            profile: broker.profile,
          },
        };
      }),

    /**
     * Verificar sessão atual (me)
     */
    me: publicProcedure.query(async ({ ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return null;
      }

      const session = await db.getBrokerSessionByToken(token);
      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      const broker = await db.getBrokerById(session.brokerId);
      if (!broker || !broker.isActive) {
        return null;
      }

      // Touch session (atualizar último uso)
      await db.touchBrokerSession(session.id, getClientIp(ctx.req));

      return {
        id: broker.id,
        firstName: broker.firstName,
        lastName: broker.lastName,
        email: broker.email,
        profile: broker.profile,
        sellerCode: broker.sellerCode,
        brokerageCode: broker.brokerageCode,
        brokerageName: broker.brokerageName,
        createdAt: broker.createdAt,
      };
    }),

    /**
     * Logout
     */
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");

      if (token) {
        await db.deleteBrokerSessionByToken(token);
      }

      return { success: true };
    }),

    /**
     * Listar sessões ativas do corretor
     */
    sessions: publicProcedure.query(async ({ ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
      }

      const session = await db.getBrokerSessionByToken(token);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida" });
      }

      const sessions = await db.listBrokerSessions(session.brokerId);

      return sessions.map((s) => ({
        id: s.id,
        deviceName: s.deviceName,
        lastIp: s.lastIp,
        lastUsedAt: s.lastUsedAt,
        createdAt: s.createdAt,
        isCurrent: s.sessionToken === token,
      }));
    }),

    /**
     * Revogar uma sessão específica
     */
    revokeSession: publicProcedure
      .input(z.object({ sessionId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const authHeader = ctx.req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
        }

        const currentSession = await db.getBrokerSessionByToken(token);
        if (!currentSession) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida" });
        }

        // Verificar se a sessão pertence ao mesmo corretor
        const targetSession = await db.getBrokerSessionByToken(token);
        // Buscar a sessão alvo
        const sessions = await db.listBrokerSessions(currentSession.brokerId);
        const target = sessions.find((s) => s.id === input.sessionId);

        if (!target) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Sessão não encontrada" });
        }

        await db.deleteBrokerSession(input.sessionId);

        return { success: true };
      }),
  }),

  // ==================== BROKER QUOTES ====================
  quotes: router({
    /**
     * Salvar orçamento
     */
    save: publicProcedure
      .input(saveQuoteSchema)
      .mutation(async ({ input, ctx }) => {
        const authHeader = ctx.req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Faça login para salvar orçamentos" });
        }

        const session = await db.getBrokerSessionByToken(token);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida" });
        }

        const quoteId = await db.createBrokerQuote({
          brokerId: session.brokerId,
          companyName: input.companyName || null,
          expectedDate: input.expectedDate || null,
          quoteData: input.quoteData,
        });

        // Log de acesso
        await db.createAccessLog({
          brokerId: session.brokerId,
          action: "save_quote",
          ipAddress: getClientIp(ctx.req),
          userAgent: ctx.req.headers["user-agent"] || null,
        });

        return { success: true, id: quoteId };
      }),

    /**
     * Listar orçamentos do corretor
     */
    list: publicProcedure.query(async ({ ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return [];
      }

      const session = await db.getBrokerSessionByToken(token);
      if (!session) {
        return [];
      }

      return db.listBrokerQuotes(session.brokerId);
    }),

    /**
     * Buscar orçamento por ID
     */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const authHeader = ctx.req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
        }

        const session = await db.getBrokerSessionByToken(token);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida" });
        }

        const quote = await db.getBrokerQuoteById(input.id);
        if (!quote || quote.brokerId !== session.brokerId) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Orçamento não encontrado" });
        }

        return quote;
      }),

    /**
     * Atualizar orçamento
     */
    update: publicProcedure
      .input(updateQuoteSchema)
      .mutation(async ({ input, ctx }) => {
        const authHeader = ctx.req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
        }

        const session = await db.getBrokerSessionByToken(token);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida" });
        }

        const quote = await db.getBrokerQuoteById(input.id);
        if (!quote || quote.brokerId !== session.brokerId) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Orçamento não encontrado" });
        }

        const { id, ...data } = input;
        await db.updateBrokerQuote(id, data);

        return { success: true };
      }),

    /**
     * Deletar orçamento
     */
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const authHeader = ctx.req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
        }

        const session = await db.getBrokerSessionByToken(token);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida" });
        }

        const quote = await db.getBrokerQuoteById(input.id);
        if (!quote || quote.brokerId !== session.brokerId) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Orçamento não encontrado" });
        }

        await db.deleteBrokerQuote(input.id);

        return { success: true };
      }),
  }),

  // ==================== RELATÓRIO DIÁRIO ====================
  report: router({
    /**
     * Gerar relatório diário (pode ser chamado manualmente ou por cron)
     */
    daily: publicProcedure.query(async () => {
      const newBrokersToday = await db.countBrokersToday();
      const loginsToday = await db.countAccessLogsToday("login");
      const registersToday = await db.countAccessLogsToday("register");
      const simulationsToday = await db.countAccessLogsToday("simulation");
      const quotesToday = await db.countAccessLogsToday("save_quote");
      const totalBrokers = await db.countActiveBrokers();

      return {
        date: new Date().toISOString().split("T")[0],
        newBrokersToday,
        loginsToday,
        registersToday,
        simulationsToday,
        quotesToday,
        totalBrokers,
      };
    }),
  }),

  // ==================== EXECUTIVES (legado) ====================
  executives: router({
    register: publicProcedure
      .input(createExecutiveSchema)
      .mutation(async ({ input, ctx }) => {
        const executiveId = await db.createExecutive({
          ...input,
          userId: ctx.user?.id,
          status: "pending",
        });

        return {
          success: true,
          id: executiveId,
          message: "Cadastro realizado! Aguarde aprovação.",
        };
      }),

    myProfile: protectedProcedure.query(async ({ ctx }) => {
      const executive = await db.getExecutiveByUserId(ctx.user.id);
      return executive || null;
    }),

    updateProfile: protectedProcedure
      .input(updateExecutiveSchema.omit({ id: true }))
      .mutation(async ({ ctx, input }) => {
        const executive = await db.getExecutiveByUserId(ctx.user.id);
        if (!executive) {
          throw new Error("Perfil de executivo não encontrado");
        }

        await db.updateExecutive(executive.id, input);
        return { success: true };
      }),

    search: publicProcedure
      .input(z.object({ query: z.string().min(2) }))
      .query(async ({ input }) => {
        const executives = await db.searchExecutives(input.query);
        return executives.filter((e) => e.status === "approved" && e.isActive);
      }),

    listApproved: publicProcedure.query(async () => {
      return db.listApprovedExecutives();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const executive = await db.getExecutiveById(input.id);
        if (!executive || executive.status !== "approved") {
          return null;
        }
        return executive;
      }),

    listPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }
      return db.listPendingExecutives();
    }),

    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Acesso negado");
        }
        await db.approveExecutive(input.id);
        return { success: true };
      }),

    reject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Acesso negado");
        }
        await db.rejectExecutive(input.id);
        return { success: true };
      }),

    adminUpdate: protectedProcedure
      .input(updateExecutiveSchema)
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Acesso negado");
        }
        const { id, ...data } = input;
        await db.updateExecutive(id, data);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
