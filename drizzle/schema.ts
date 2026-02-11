import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing Manus OAuth auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
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
 * Tabela de executivos/corretores (legado)
 */
export const executives = mysqlTable("executives", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 320 }),
  photoUrl: text("photoUrl"),
  brokerCode: varchar("brokerCode", { length: 50 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Executive = typeof executives.$inferSelect;
export type InsertExecutive = typeof executives.$inferInsert;

/**
 * Corretores - cadastro com email+senha próprio
 */
export const brokers = mysqlTable("brokers", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  /** vendedor | dono_corretora | adm | supervisor */
  profile: mysqlEnum("profile", ["vendedor", "dono_corretora", "adm", "supervisor"]).notNull(),
  /** Código de vendedor Hapvida (obrigatório para vendedores, ou null) */
  sellerCode: varchar("sellerCode", { length: 50 }),
  /** Código da corretora */
  brokerageCode: varchar("brokerageCode", { length: 50 }),
  /** Razão social ou nome da corretora (se não souber o código) */
  brokerageName: varchar("brokerageName", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
});

export type Broker = typeof brokers.$inferSelect;
export type InsertBroker = typeof brokers.$inferInsert;

/**
 * Sessões de dispositivos dos corretores (max 3)
 */
export const brokerSessions = mysqlTable("broker_sessions", {
  id: int("id").autoincrement().primaryKey(),
  brokerId: int("brokerId").notNull(),
  /** Token JWT único da sessão */
  sessionToken: varchar("sessionToken", { length: 512 }).notNull().unique(),
  /** Fingerprint do dispositivo (user-agent + IP hash) */
  deviceFingerprint: varchar("deviceFingerprint", { length: 255 }).notNull(),
  /** Nome amigável do dispositivo */
  deviceName: varchar("deviceName", { length: 255 }),
  /** IP do último acesso */
  lastIp: varchar("lastIp", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type BrokerSession = typeof brokerSessions.$inferSelect;
export type InsertBrokerSession = typeof brokerSessions.$inferInsert;

/**
 * Orçamentos salvos dos corretores
 */
export const brokerQuotes = mysqlTable("broker_quotes", {
  id: int("id").autoincrement().primaryKey(),
  brokerId: int("brokerId").notNull(),
  /** Nome da empresa/cliente */
  companyName: varchar("companyName", { length: 255 }),
  /** Data prevista para uso */
  expectedDate: varchar("expectedDate", { length: 20 }),
  /** Dados completos do orçamento (JSON) */
  quoteData: json("quoteData").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrokerQuote = typeof brokerQuotes.$inferSelect;
export type InsertBrokerQuote = typeof brokerQuotes.$inferInsert;

/**
 * Log de acessos para relatório diário
 */
export const accessLogs = mysqlTable("access_logs", {
  id: int("id").autoincrement().primaryKey(),
  brokerId: int("brokerId").notNull(),
  action: varchar("action", { length: 50 }).notNull(), // login, register, simulation, save_quote
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccessLog = typeof accessLogs.$inferSelect;
export type InsertAccessLog = typeof accessLogs.$inferInsert;
