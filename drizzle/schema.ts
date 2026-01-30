import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de executivos/corretores
 * Cada executivo pode criar sua conta e editar seu próprio perfil
 */
export const executives = mysqlTable("executives", {
  id: int("id").autoincrement().primaryKey(),
  /** Referência ao usuário autenticado (opcional - pode ser null para cadastros pendentes) */
  userId: int("userId"),
  /** Nome completo do executivo */
  name: varchar("name", { length: 255 }).notNull(),
  /** Cargo/função */
  role: varchar("role", { length: 100 }),
  /** Número do WhatsApp */
  whatsapp: varchar("whatsapp", { length: 20 }),
  /** E-mail de contato */
  email: varchar("email", { length: 320 }),
  /** URL da foto de perfil */
  photoUrl: text("photoUrl"),
  /** Código do corretor na Hapvida */
  brokerCode: varchar("brokerCode", { length: 50 }),
  /** Status do cadastro: pending (aguardando aprovação), approved, rejected */
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  /** Se o executivo está ativo e visível para busca */
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Executive = typeof executives.$inferSelect;
export type InsertExecutive = typeof executives.$inferInsert;
