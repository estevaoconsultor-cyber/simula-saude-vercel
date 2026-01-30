import { eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, executives, InsertExecutive, Executive } from "../drizzle/schema";
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

/**
 * Criar novo executivo (cadastro)
 */
export async function createExecutive(data: InsertExecutive): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(executives).values(data);
  return Number(result[0].insertId);
}

/**
 * Buscar executivo por ID
 */
export async function getExecutiveById(id: number): Promise<Executive | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(executives).where(eq(executives.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Buscar executivo por userId (usuário logado)
 */
export async function getExecutiveByUserId(userId: number): Promise<Executive | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(executives).where(eq(executives.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Buscar executivos por nome (busca parcial)
 */
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

/**
 * Listar todos os executivos aprovados e ativos
 */
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

/**
 * Listar executivos pendentes de aprovação (para admin)
 */
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

/**
 * Atualizar dados do executivo
 */
export async function updateExecutive(
  id: number,
  data: Partial<InsertExecutive>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set(data).where(eq(executives.id, id));
}

/**
 * Aprovar cadastro do executivo
 */
export async function approveExecutive(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set({ status: "approved" }).where(eq(executives.id, id));
}

/**
 * Rejeitar cadastro do executivo
 */
export async function rejectExecutive(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set({ status: "rejected" }).where(eq(executives.id, id));
}

/**
 * Vincular executivo a um usuário autenticado
 */
export async function linkExecutiveToUser(executiveId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(executives).set({ userId }).where(eq(executives.id, executiveId));
}
