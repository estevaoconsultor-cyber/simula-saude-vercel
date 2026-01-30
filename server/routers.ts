import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storageGet } from "./storage";

// Mapeamento de documentos para S3 keys
const DOCUMENT_MAP: Record<string, { s3Key: string; displayName: string }> = {
  // Documentos principais
  "carta-nomeacao.docx": {
    s3Key: "documents/carta-nomeacao.docx",
    displayName: "Carta de Nomeação",
  },
  "contrato-prestacao-servico.docx": {
    s3Key: "documents/contrato-prestacao-servico.docx",
    displayName: "Contrato de Prestação de Serviço",
  },
  // Manuais
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

// Schema de validação para cadastro de executivo
const createExecutiveSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  role: z.string().max(100).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email("E-mail inválido").max(320).optional(),
  brokerCode: z.string().max(50).optional(),
});

// Schema de validação para atualização de executivo
const updateExecutiveSchema = z.object({
  id: z.number(),
  name: z.string().min(2).max(255).optional(),
  role: z.string().max(100).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email().max(320).optional(),
  photoUrl: z.string().optional(),
  brokerCode: z.string().max(50).optional(),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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
  
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Rotas de executivos
  executives: router({
    // Cadastrar novo executivo (público - qualquer um pode se cadastrar)
    register: publicProcedure
      .input(createExecutiveSchema)
      .mutation(async ({ input, ctx }) => {
        const executiveId = await db.createExecutive({
          ...input,
          userId: ctx.user?.id,
          status: "pending",
        });

        // TODO: Enviar e-mail de notificação para admin
        // Aqui você pode integrar com um serviço de e-mail

        return {
          success: true,
          id: executiveId,
          message: "Cadastro realizado! Aguarde aprovação.",
        };
      }),

    // Buscar perfil do executivo logado
    myProfile: protectedProcedure.query(async ({ ctx }) => {
      const executive = await db.getExecutiveByUserId(ctx.user.id);
      return executive || null;
    }),

    // Atualizar perfil do executivo logado
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

    // Buscar executivos por nome/código (público)
    search: publicProcedure
      .input(z.object({ query: z.string().min(2) }))
      .query(async ({ input }) => {
        const executives = await db.searchExecutives(input.query);
        // Retorna apenas executivos aprovados
        return executives.filter((e) => e.status === "approved" && e.isActive);
      }),

    // Listar todos os executivos aprovados (público)
    listApproved: publicProcedure.query(async () => {
      return db.listApprovedExecutives();
    }),

    // Buscar executivo por ID (público)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const executive = await db.getExecutiveById(input.id);
        if (!executive || executive.status !== "approved") {
          return null;
        }
        return executive;
      }),

    // === ROTAS ADMIN ===

    // Listar executivos pendentes (admin)
    listPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }
      return db.listPendingExecutives();
    }),

    // Aprovar executivo (admin)
    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Acesso negado");
        }
        await db.approveExecutive(input.id);
        return { success: true };
      }),

    // Rejeitar executivo (admin)
    reject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Acesso negado");
        }
        await db.rejectExecutive(input.id);
        return { success: true };
      }),

    // Atualizar qualquer executivo (admin)
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
