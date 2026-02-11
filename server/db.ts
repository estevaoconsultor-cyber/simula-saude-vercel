import { eq, like, or, and, desc, gte, lte, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  executives,
  InsertExecutive,
  Executive,
  brokers,
  InsertBroker,
  Broker,
  brokerSessions,
  InsertBrokerSession,
  BrokerSession,
  brokerQuotes,
  InsertBrokerQuote,
  BrokerQuote,
  accessLogs,
  InsertAccessLog,
  AccessLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USERS (Manus OAuth) ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== EXECUTIVES ====================

export async function createExecutive(data: InsertExecutive): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(executives).values(data);
  return Number(result[0].insertId);
}

export async function getExecutiveById(id: number): Promise<Executive | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(executives).where(eq(executives.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getExecutiveByUserId(userId: number): Promise<Executive | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(executives).where(eq(executives.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchExecutives(query: string): Promise<Executive[]> {
  const db = await getDb();
  if (!db) return [];

  const searchPattern = `%${query}%`;
  const result = await db
    .select()
    .from(executives)
    .where(
      or(
        like(executives.name, searchPattern),
        like(executives.email, searchPattern),
        like(executives.brokerCode, searchPattern)
      )
    )
    .limit(20);

  return result;
}

export async function listApprovedExecutives(): Promise<Executive[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(executives)
    .where(eq(executives.status, "approved"))
    .limit(100);

  return result.filter((e) => e.isActive);
}

export async function listPendingExecutives(): Promise<Executive[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(executives)
    .where(eq(executives.status, "pending"))
    .limit(100);

  return result;
}

export async function updateExecutive(
  id: number,
  data: Partial<InsertExecutive>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set(data).where(eq(executives.id, id));
}

export async function approveExecutive(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set({ status: "approved" }).where(eq(executives.id, id));
}

export async function rejectExecutive(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set({ status: "rejected" }).where(eq(executives.id, id));
}

export async function linkExecutiveToUser(executiveId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set({ userId }).where(eq(executives.id, executiveId));
}

// ==================== BROKERS (email+senha) ====================

/**
 * Criar novo corretor
 */
export async function createBroker(data: InsertBroker): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(brokers).values(data);
  return Number(result[0].insertId);
}

/**
 * Buscar corretor por email
 */
export async function getBrokerByEmail(email: string): Promise<Broker | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(brokers).where(eq(brokers.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Buscar corretor por ID
 */
export async function getBrokerById(id: number): Promise<Broker | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(brokers).where(eq(brokers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Atualizar último login do corretor
 */
export async function updateBrokerLastLogin(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(brokers).set({ lastLoginAt: new Date() }).where(eq(brokers.id, id));
}

/**
 * Listar todos os corretores (para relatório)
 */
export async function listBrokers(): Promise<Broker[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(brokers).orderBy(desc(brokers.createdAt)).limit(500);
}

/**
 * Contar corretores cadastrados hoje
 */
export async function countBrokersToday(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .select({ count: count() })
    .from(brokers)
    .where(gte(brokers.createdAt, today));

  return result[0]?.count ?? 0;
}

// ==================== BROKER SESSIONS ====================

/**
 * Criar nova sessão de dispositivo
 */
export async function createBrokerSession(data: InsertBrokerSession): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(brokerSessions).values(data);
  return Number(result[0].insertId);
}

/**
 * Buscar sessão por token
 */
export async function getBrokerSessionByToken(token: string): Promise<BrokerSession | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(brokerSessions)
    .where(eq(brokerSessions.sessionToken, token))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Listar sessões ativas de um corretor
 */
export async function listBrokerSessions(brokerId: number): Promise<BrokerSession[]> {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return db
    .select()
    .from(brokerSessions)
    .where(
      and(
        eq(brokerSessions.brokerId, brokerId),
        gte(brokerSessions.expiresAt, now)
      )
    )
    .orderBy(desc(brokerSessions.lastUsedAt));
}

/**
 * Atualizar último uso da sessão
 */
export async function touchBrokerSession(sessionId: number, ip?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = { lastUsedAt: new Date() };
  if (ip) updateData.lastIp = ip;

  await db.update(brokerSessions).set(updateData).where(eq(brokerSessions.id, sessionId));
}

/**
 * Deletar sessão por ID
 */
export async function deleteBrokerSession(sessionId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(brokerSessions).where(eq(brokerSessions.id, sessionId));
}

/**
 * Deletar sessão por token
 */
export async function deleteBrokerSessionByToken(token: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(brokerSessions).where(eq(brokerSessions.sessionToken, token));
}

/**
 * Deletar sessão mais antiga de um corretor (quando excede limite de dispositivos)
 */
export async function deleteOldestBrokerSession(brokerId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const sessions = await db
    .select()
    .from(brokerSessions)
    .where(eq(brokerSessions.brokerId, brokerId))
    .orderBy(brokerSessions.lastUsedAt)
    .limit(1);

  if (sessions.length > 0) {
    await db.delete(brokerSessions).where(eq(brokerSessions.id, sessions[0].id));
  }
}

/**
 * Contar sessões ativas de um corretor
 */
export async function countBrokerActiveSessions(brokerId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const result = await db
    .select({ count: count() })
    .from(brokerSessions)
    .where(
      and(
        eq(brokerSessions.brokerId, brokerId),
        gte(brokerSessions.expiresAt, now)
      )
    );

  return result[0]?.count ?? 0;
}

/**
 * Limpar sessões expiradas
 */
export async function cleanExpiredSessions(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const now = new Date();
  await db.delete(brokerSessions).where(lte(brokerSessions.expiresAt, now));
}

// ==================== BROKER QUOTES ====================

/**
 * Salvar orçamento
 */
export async function createBrokerQuote(data: InsertBrokerQuote): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(brokerQuotes).values(data);
  return Number(result[0].insertId);
}

/**
 * Listar orçamentos de um corretor
 */
export async function listBrokerQuotes(brokerId: number): Promise<BrokerQuote[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(brokerQuotes)
    .where(eq(brokerQuotes.brokerId, brokerId))
    .orderBy(desc(brokerQuotes.updatedAt))
    .limit(100);
}

/**
 * Buscar orçamento por ID
 */
export async function getBrokerQuoteById(id: number): Promise<BrokerQuote | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(brokerQuotes).where(eq(brokerQuotes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Atualizar orçamento
 */
export async function updateBrokerQuote(
  id: number,
  data: Partial<InsertBrokerQuote>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(brokerQuotes).set(data).where(eq(brokerQuotes.id, id));
}

/**
 * Deletar orçamento
 */
export async function deleteBrokerQuote(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(brokerQuotes).where(eq(brokerQuotes.id, id));
}

// ==================== ACCESS LOGS ====================

/**
 * Registrar log de acesso
 */
export async function createAccessLog(data: InsertAccessLog): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(accessLogs).values(data);
  } catch (error) {
    console.error("[Database] Failed to create access log:", error);
  }
}

/**
 * Listar logs de acesso de hoje
 */
export async function getAccessLogsToday(): Promise<AccessLog[]> {
  const db = await getDb();
  if (!db) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return db
    .select()
    .from(accessLogs)
    .where(gte(accessLogs.createdAt, today))
    .orderBy(desc(accessLogs.createdAt))
    .limit(1000);
}

/**
 * Contar acessos de hoje por tipo
 */
export async function countAccessLogsToday(action?: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const conditions = [gte(accessLogs.createdAt, today)];
  if (action) {
    conditions.push(eq(accessLogs.action, action));
  }

  const result = await db
    .select({ count: count() })
    .from(accessLogs)
    .where(and(...conditions));

  return result[0]?.count ?? 0;
}

/**
 * Contar total de corretores ativos
 */
export async function countActiveBrokers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: count() })
    .from(brokers)
    .where(eq(brokers.isActive, true));

  return result[0]?.count ?? 0;
}
