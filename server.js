var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/_core/notification.ts
var notification_exports = {};
__export(notification_exports, {
  notifyOwner: () => notifyOwner
});
import { TRPCError } from "@trpc/server";
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}
var TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH, trimValue, isNonEmptyString2, buildEndpointUrl, validatePayload;
var init_notification = __esm({
  "server/_core/notification.ts"() {
    "use strict";
    init_env();
    TITLE_MAX_LENGTH = 1200;
    CONTENT_MAX_LENGTH = 2e4;
    trimValue = (value) => value.trim();
    isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
    buildEndpointUrl = (baseUrl) => {
      const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      return new URL("webdevtoken.v1.WebDevService/SendNotification", normalizedBase).toString();
    };
    validatePayload = (input) => {
      if (!isNonEmptyString2(input.title)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification title is required."
        });
      }
      if (!isNonEmptyString2(input.content)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification content is required."
        });
      }
      const title = trimValue(input.title);
      const content = trimValue(input.content);
      if (title.length > TITLE_MAX_LENGTH) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
        });
      }
      if (content.length > CONTENT_MAX_LENGTH) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
        });
      }
      return { title, content };
    };
  }
});

// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, like, or, and, desc, gte, lte, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var executives = mysqlTable("executives", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var brokers = mysqlTable("brokers", {
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
  lastLoginAt: timestamp("lastLoginAt")
});
var brokerSessions = mysqlTable("broker_sessions", {
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
  expiresAt: timestamp("expiresAt").notNull()
});
var brokerQuotes = mysqlTable("broker_quotes", {
  id: int("id").autoincrement().primaryKey(),
  brokerId: int("brokerId").notNull(),
  /** Nome da empresa/cliente */
  companyName: varchar("companyName", { length: 255 }),
  /** Data prevista para uso */
  expectedDate: varchar("expectedDate", { length: 20 }),
  /** Dados completos do orçamento (JSON) */
  quoteData: json("quoteData").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var accessLogs = mysqlTable("access_logs", {
  id: int("id").autoincrement().primaryKey(),
  brokerId: int("brokerId").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  // login, register, simulation, save_quote
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var passwordResets = mysqlTable("password_resets", {
  id: int("id").autoincrement().primaryKey(),
  brokerId: int("brokerId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  /** Código de 6 dígitos */
  code: varchar("code", { length: 6 }).notNull(),
  /** Expiração (15 minutos) */
  expiresAt: timestamp("expiresAt").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/db.ts
init_env();
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createExecutive(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(executives).values(data);
  return Number(result[0].insertId);
}
async function getExecutiveById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(executives).where(eq(executives.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getExecutiveByUserId(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(executives).where(eq(executives.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function searchExecutives(query) {
  const db = await getDb();
  if (!db) return [];
  const searchPattern = `%${query}%`;
  const result = await db.select().from(executives).where(
    or(
      like(executives.name, searchPattern),
      like(executives.email, searchPattern),
      like(executives.brokerCode, searchPattern)
    )
  ).limit(20);
  return result;
}
async function listApprovedExecutives() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(executives).where(eq(executives.status, "approved")).limit(100);
  return result.filter((e) => e.isActive);
}
async function listPendingExecutives() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(executives).where(eq(executives.status, "pending")).limit(100);
  return result;
}
async function updateExecutive(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(executives).set(data).where(eq(executives.id, id));
}
async function approveExecutive(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(executives).set({ status: "approved" }).where(eq(executives.id, id));
}
async function rejectExecutive(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(executives).set({ status: "rejected" }).where(eq(executives.id, id));
}
async function createBroker(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(brokers).values(data);
  return Number(result[0].insertId);
}
async function getBrokerByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(brokers).where(eq(brokers.email, email)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getBrokerById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(brokers).where(eq(brokers.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateBrokerLastLogin(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(brokers).set({ lastLoginAt: /* @__PURE__ */ new Date() }).where(eq(brokers.id, id));
}
async function countBrokersToday() {
  const db = await getDb();
  if (!db) return 0;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const result = await db.select({ count: count() }).from(brokers).where(gte(brokers.createdAt, today));
  return result[0]?.count ?? 0;
}
async function createBrokerSession(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(brokerSessions).values(data);
  return Number(result[0].insertId);
}
async function getBrokerSessionByToken(token) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(brokerSessions).where(eq(brokerSessions.sessionToken, token)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function listBrokerSessions(brokerId) {
  const db = await getDb();
  if (!db) return [];
  const now = /* @__PURE__ */ new Date();
  return db.select().from(brokerSessions).where(
    and(
      eq(brokerSessions.brokerId, brokerId),
      gte(brokerSessions.expiresAt, now)
    )
  ).orderBy(desc(brokerSessions.lastUsedAt));
}
async function touchBrokerSession(sessionId, ip) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { lastUsedAt: /* @__PURE__ */ new Date() };
  if (ip) updateData.lastIp = ip;
  await db.update(brokerSessions).set(updateData).where(eq(brokerSessions.id, sessionId));
}
async function deleteBrokerSession(sessionId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(brokerSessions).where(eq(brokerSessions.id, sessionId));
}
async function deleteBrokerSessionByToken(token) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(brokerSessions).where(eq(brokerSessions.sessionToken, token));
}
async function deleteOldestBrokerSession(brokerId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const sessions = await db.select().from(brokerSessions).where(eq(brokerSessions.brokerId, brokerId)).orderBy(brokerSessions.lastUsedAt).limit(1);
  if (sessions.length > 0) {
    await db.delete(brokerSessions).where(eq(brokerSessions.id, sessions[0].id));
  }
}
async function cleanExpiredSessions() {
  const db = await getDb();
  if (!db) return;
  const now = /* @__PURE__ */ new Date();
  await db.delete(brokerSessions).where(lte(brokerSessions.expiresAt, now));
}
async function createBrokerQuote(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(brokerQuotes).values(data);
  return Number(result[0].insertId);
}
async function listBrokerQuotes(brokerId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(brokerQuotes).where(eq(brokerQuotes.brokerId, brokerId)).orderBy(desc(brokerQuotes.updatedAt)).limit(100);
}
async function getBrokerQuoteById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(brokerQuotes).where(eq(brokerQuotes.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateBrokerQuote(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(brokerQuotes).set(data).where(eq(brokerQuotes.id, id));
}
async function deleteBrokerQuote(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(brokerQuotes).where(eq(brokerQuotes.id, id));
}
async function createAccessLog(data) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(accessLogs).values(data);
  } catch (error) {
    console.error("[Database] Failed to create access log:", error);
  }
}
async function countAccessLogsToday(action) {
  const db = await getDb();
  if (!db) return 0;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const conditions = [gte(accessLogs.createdAt, today)];
  if (action) {
    conditions.push(eq(accessLogs.action, action));
  }
  const result = await db.select({ count: count() }).from(accessLogs).where(and(...conditions));
  return result[0]?.count ?? 0;
}
async function countActiveBrokers() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(brokers).where(eq(brokers.isActive, true));
  return result[0]?.count ?? 0;
}
async function createPasswordReset(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(passwordResets).values(data);
  return Number(result[0].insertId);
}
async function getValidPasswordReset(email, code) {
  const db = await getDb();
  if (!db) return void 0;
  const now = /* @__PURE__ */ new Date();
  const result = await db.select().from(passwordResets).where(
    and(
      eq(passwordResets.email, email),
      eq(passwordResets.code, code),
      eq(passwordResets.used, false),
      gte(passwordResets.expiresAt, now)
    )
  ).orderBy(desc(passwordResets.createdAt)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function markPasswordResetUsed(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(passwordResets).set({ used: true }).where(eq(passwordResets.id, id));
}
async function updateBrokerPassword(brokerId, passwordHash) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(brokers).set({ passwordHash }).where(eq(brokers.id, brokerId));
}
async function invalidatePasswordResets(email) {
  const db = await getDb();
  if (!db) return;
  await db.update(passwordResets).set({ used: true }).where(
    and(
      eq(passwordResets.email, email),
      eq(passwordResets.used, false)
    )
  );
}

// server/_core/cookies.ts
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
function isIpAddress(host) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getParentDomain(hostname) {
  if (LOCAL_HOSTS.has(hostname) || isIpAddress(hostname)) {
    return void 0;
  }
  const parts = hostname.split(".");
  if (parts.length < 3) {
    return void 0;
  }
  return "." + parts.slice(-2).join(".");
}
function getSessionCookieOptions(req) {
  const hostname = req.hostname;
  const domain = getParentDomain(hostname);
  return {
    domain,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
init_env();
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(EXCHANGE_TOKEN_PATH, payload);
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(GET_USER_INFO_PATH, {
      accessToken: token.accessToken
    });
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(platforms.filter((p) => typeof p === "string"));
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    }
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = token || cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
async function syncUser(userInfo) {
  if (!userInfo.openId) {
    throw new Error("openId missing from user info");
  }
  const lastSignedIn = /* @__PURE__ */ new Date();
  await upsertUser({
    openId: userInfo.openId,
    name: userInfo.name || null,
    email: userInfo.email ?? null,
    loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
    lastSignedIn
  });
  const saved = await getUserByOpenId(userInfo.openId);
  return saved ?? {
    openId: userInfo.openId,
    name: userInfo.name,
    email: userInfo.email,
    loginMethod: userInfo.loginMethod ?? null,
    lastSignedIn
  };
}
function buildUserResponse(user) {
  return {
    id: user?.id ?? null,
    openId: user?.openId ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
    loginMethod: user?.loginMethod ?? null,
    lastSignedIn: (user?.lastSignedIn ?? /* @__PURE__ */ new Date()).toISOString()
  };
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      const frontendUrl = process.env.EXPO_WEB_PREVIEW_URL || process.env.EXPO_PACKAGER_PROXY_URL || "http://localhost:8081";
      res.redirect(302, frontendUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
  app.get("/api/oauth/mobile", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      const user = await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({
        app_session_id: sessionToken,
        user: buildUserResponse(user)
      });
    } catch (error) {
      console.error("[OAuth] Mobile exchange failed", error);
      res.status(500).json({ error: "OAuth mobile exchange failed" });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
  app.post("/api/auth/session", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Bearer token required" });
        return;
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/session failed:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });
}

// server/routers.ts
import { z as z2 } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/_core/systemRouter.ts
init_notification();
import { z } from "zod";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/storage.ts
init_env();
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
async function buildDownloadUrl(baseUrl, relKey, apiKey) {
  const downloadApiUrl = new URL("v1/storage/downloadUrl", ensureTrailingSlash(baseUrl));
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey)
  });
  return (await response.json()).url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storageGet(relKey) {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey)
  };
}

// server/routers.ts
var MAX_DEVICES = 3;
var SESSION_DURATION_DAYS = 30;
var DOCUMENT_MAP = {
  "carta-nomeacao.docx": {
    s3Key: "documents/carta-nomeacao.docx",
    displayName: "Carta de Nomea\xE7\xE3o"
  },
  "contrato-prestacao-servico.docx": {
    s3Key: "documents/contrato-prestacao-servico.docx",
    displayName: "Contrato de Presta\xE7\xE3o de Servi\xE7o"
  },
  "0.ManualAPPdoBenefici\xE1rio.pdf": {
    s3Key: "documents/manuais/0-manual-app-beneficiario.pdf",
    displayName: "Manual APP do Benefici\xE1rio"
  },
  "1.ManualdoCorretorSuperSimplesePME.pdf": {
    s3Key: "documents/manuais/1-manual-corretor-ss-pme.pdf",
    displayName: "Manual do Corretor Super Simples e PME"
  },
  "2.Gui\xE1Pr\xE1ticoAppVendedor(a).pdf": {
    s3Key: "documents/manuais/2-guia-app-vendedor.pdf",
    displayName: "Guia Pr\xE1tico App Vendedor"
  },
  "2.1ManualPortalWebVendedor.pdf": {
    s3Key: "documents/manuais/2-1-manual-portal-web-vendedor.pdf",
    displayName: "Manual Portal Web Vendedor"
  },
  "3.ManualPortaldoCliente.pdf": {
    s3Key: "documents/manuais/3-manual-portal-cliente.pdf",
    displayName: "Manual Portal do Cliente"
  },
  "4.PortalCorretorCNPJPF.pdf": {
    s3Key: "documents/manuais/4-portal-corretor-cnpj-pf.pdf",
    displayName: "Portal Corretor CNPJ/PF"
  },
  "5.ManualAppePortal.pdf": {
    s3Key: "documents/manuais/5-manual-app-portal.pdf",
    displayName: "Manual App e Portal"
  },
  "7.Manualdemovimenta\xE7\xE3oparacontratosPF.pdf": {
    s3Key: "documents/manuais/7-manual-movimentacao-pf.pdf",
    displayName: "Manual de Movimenta\xE7\xE3o para Contratos PF"
  },
  "8.GuiaTrilhadeVendasHapvida.pdf": {
    s3Key: "documents/manuais/8-guia-trilha-vendas.pdf",
    displayName: "Guia Trilha de Vendas Hapvida"
  },
  "9.ManualdeReembolso-APPePortal.pdf": {
    s3Key: "documents/manuais/9-manual-reembolso.pdf",
    displayName: "Manual de Reembolso - APP e Portal"
  }
};
function generateSessionToken() {
  return crypto.randomBytes(48).toString("base64url");
}
function getDeviceFingerprint(req) {
  const ua = req.headers["user-agent"] || "unknown";
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  const hash = crypto.createHash("sha256").update(`${ua}:${ip}`).digest("hex").slice(0, 32);
  return hash;
}
function getDeviceName(req) {
  const ua = req.headers["user-agent"] || "";
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("iPad")) return "iPad";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Windows")) return "Windows PC";
  if (ua.includes("Mac")) return "Mac";
  if (ua.includes("Linux")) return "Linux";
  return "Navegador Web";
}
function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
}
var createExecutiveSchema = z2.object({
  name: z2.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  role: z2.string().max(100).optional(),
  whatsapp: z2.string().max(20).optional(),
  email: z2.string().email("E-mail inv\xE1lido").max(320).optional(),
  brokerCode: z2.string().max(50).optional()
});
var updateExecutiveSchema = z2.object({
  id: z2.number(),
  name: z2.string().min(2).max(255).optional(),
  role: z2.string().max(100).optional(),
  whatsapp: z2.string().max(20).optional(),
  email: z2.string().email().max(320).optional(),
  photoUrl: z2.string().optional(),
  brokerCode: z2.string().max(50).optional()
});
var registerBrokerSchema = z2.object({
  firstName: z2.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  lastName: z2.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres").max(100),
  email: z2.string().email("E-mail inv\xE1lido").max(320),
  password: z2.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100),
  profile: z2.enum(["vendedor", "dono_corretora", "adm", "supervisor"]),
  sellerCode: z2.string().max(50).optional().nullable(),
  brokerageCode: z2.string().max(50).optional().nullable(),
  brokerageName: z2.string().max(255).optional().nullable()
});
var loginBrokerSchema = z2.object({
  email: z2.string().email("E-mail inv\xE1lido"),
  password: z2.string().min(1, "Senha \xE9 obrigat\xF3ria")
});
var saveQuoteSchema = z2.object({
  companyName: z2.string().max(255).optional().nullable(),
  expectedDate: z2.string().max(20).optional().nullable(),
  quoteData: z2.any()
});
var updateQuoteSchema = z2.object({
  id: z2.number(),
  companyName: z2.string().max(255).optional().nullable(),
  expectedDate: z2.string().max(20).optional().nullable(),
  quoteData: z2.any().optional()
});
var appRouter = router({
  system: systemRouter,
  // Rota de download de documentos
  documents: router({
    getDownloadUrl: publicProcedure.input(z2.object({ filename: z2.string() })).query(async ({ input }) => {
      const doc = DOCUMENT_MAP[input.filename];
      if (!doc) {
        throw new Error(`Documento n\xE3o encontrado: ${input.filename}`);
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
        displayName: info.displayName
      }));
    })
  }),
  // Auth Manus OAuth (legado)
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  // ==================== BROKER AUTH ====================
  broker: router({
    /**
     * Cadastro de novo corretor
     */
    register: publicProcedure.input(registerBrokerSchema).mutation(async ({ input, ctx }) => {
      const existing = await getBrokerByEmail(input.email.toLowerCase());
      if (existing) {
        throw new TRPCError3({
          code: "CONFLICT",
          message: "Este e-mail j\xE1 est\xE1 cadastrado. Fa\xE7a login."
        });
      }
      const passwordHash = await bcrypt.hash(input.password, 12);
      const brokerId = await createBroker({
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.toLowerCase().trim(),
        passwordHash,
        profile: input.profile,
        sellerCode: input.sellerCode || null,
        brokerageCode: input.brokerageCode || null,
        brokerageName: input.brokerageName || null
      });
      const sessionToken = generateSessionToken();
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
      await createBrokerSession({
        brokerId,
        sessionToken,
        deviceFingerprint: getDeviceFingerprint(ctx.req),
        deviceName: getDeviceName(ctx.req),
        lastIp: getClientIp(ctx.req),
        expiresAt
      });
      await createAccessLog({
        brokerId,
        action: "register",
        ipAddress: getClientIp(ctx.req),
        userAgent: ctx.req.headers["user-agent"] || null,
        metadata: { profile: input.profile }
      });
      await updateBrokerLastLogin(brokerId);
      return {
        success: true,
        token: sessionToken,
        broker: {
          id: brokerId,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.toLowerCase().trim(),
          profile: input.profile
        }
      };
    }),
    /**
     * Login de corretor
     */
    login: publicProcedure.input(loginBrokerSchema).mutation(async ({ input, ctx }) => {
      const broker = await getBrokerByEmail(input.email.toLowerCase());
      if (!broker) {
        throw new TRPCError3({
          code: "NOT_FOUND",
          message: "E-mail ou senha incorretos."
        });
      }
      if (!broker.isActive) {
        throw new TRPCError3({
          code: "FORBIDDEN",
          message: "Sua conta est\xE1 desativada. Entre em contato com o suporte."
        });
      }
      const isValid = await bcrypt.compare(input.password, broker.passwordHash);
      if (!isValid) {
        throw new TRPCError3({
          code: "UNAUTHORIZED",
          message: "E-mail ou senha incorretos."
        });
      }
      const activeSessions = await listBrokerSessions(broker.id);
      const deviceFingerprint = getDeviceFingerprint(ctx.req);
      const existingSession = activeSessions.find(
        (s) => s.deviceFingerprint === deviceFingerprint
      );
      if (existingSession) {
        const expiresAt2 = /* @__PURE__ */ new Date();
        expiresAt2.setDate(expiresAt2.getDate() + SESSION_DURATION_DAYS);
        await deleteBrokerSession(existingSession.id);
      } else if (activeSessions.length >= MAX_DEVICES) {
        await deleteOldestBrokerSession(broker.id);
      }
      const sessionToken = generateSessionToken();
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
      await createBrokerSession({
        brokerId: broker.id,
        sessionToken,
        deviceFingerprint,
        deviceName: getDeviceName(ctx.req),
        lastIp: getClientIp(ctx.req),
        expiresAt
      });
      await createAccessLog({
        brokerId: broker.id,
        action: "login",
        ipAddress: getClientIp(ctx.req),
        userAgent: ctx.req.headers["user-agent"] || null
      });
      await updateBrokerLastLogin(broker.id);
      return {
        success: true,
        token: sessionToken,
        broker: {
          id: broker.id,
          firstName: broker.firstName,
          lastName: broker.lastName,
          email: broker.email,
          profile: broker.profile
        }
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
      const session = await getBrokerSessionByToken(token);
      if (!session || session.expiresAt < /* @__PURE__ */ new Date()) {
        return null;
      }
      const broker = await getBrokerById(session.brokerId);
      if (!broker || !broker.isActive) {
        return null;
      }
      await touchBrokerSession(session.id, getClientIp(ctx.req));
      return {
        id: broker.id,
        firstName: broker.firstName,
        lastName: broker.lastName,
        email: broker.email,
        profile: broker.profile,
        sellerCode: broker.sellerCode,
        brokerageCode: broker.brokerageCode,
        brokerageName: broker.brokerageName,
        createdAt: broker.createdAt
      };
    }),
    /**
     * Logout
     */
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (token) {
        await deleteBrokerSessionByToken(token);
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
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "N\xE3o autenticado" });
      }
      const session = await getBrokerSessionByToken(token);
      if (!session) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Sess\xE3o inv\xE1lida" });
      }
      const sessions = await listBrokerSessions(session.brokerId);
      return sessions.map((s) => ({
        id: s.id,
        deviceName: s.deviceName,
        lastIp: s.lastIp,
        lastUsedAt: s.lastUsedAt,
        createdAt: s.createdAt,
        isCurrent: s.sessionToken === token
      }));
    }),
    /**
     * Revogar uma sessão específica
     */
    revokeSession: publicProcedure.input(z2.object({ sessionId: z2.number() })).mutation(async ({ input, ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "N\xE3o autenticado" });
      }
      const currentSession = await getBrokerSessionByToken(token);
      if (!currentSession) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Sess\xE3o inv\xE1lida" });
      }
      const targetSession = await getBrokerSessionByToken(token);
      const sessions = await listBrokerSessions(currentSession.brokerId);
      const target = sessions.find((s) => s.id === input.sessionId);
      if (!target) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Sess\xE3o n\xE3o encontrada" });
      }
      await deleteBrokerSession(input.sessionId);
      return { success: true };
    })
  }),
  // ==================== PASSWORD RESET ====================
  passwordReset: router({
    /**
     * Solicitar redefinição de senha - envia código de 6 dígitos por e-mail
     */
    request: publicProcedure.input(z2.object({ email: z2.string().email("E-mail inv\xE1lido") })).mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();
      const broker = await getBrokerByEmail(email);
      if (!broker) {
        return { success: true, message: "Se o e-mail estiver cadastrado, voc\xEA receber\xE1 um c\xF3digo de redefini\xE7\xE3o." };
      }
      const code = Math.floor(1e5 + Math.random() * 9e5).toString();
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      await invalidatePasswordResets(email);
      await createPasswordReset({
        brokerId: broker.id,
        email,
        code,
        expiresAt
      });
      try {
        const { notifyOwner: notifyOwner2 } = await Promise.resolve().then(() => (init_notification(), notification_exports));
        await notifyOwner2({
          title: `Redefini\xE7\xE3o de Senha - ${broker.firstName} ${broker.lastName}`,
          content: `O corretor ${broker.firstName} ${broker.lastName} (${email}) solicitou redefini\xE7\xE3o de senha.

C\xF3digo: ${code}

V\xE1lido por 15 minutos.

Envie este c\xF3digo para o corretor por WhatsApp ou e-mail.`
        });
      } catch (e) {
        console.log(`[PasswordReset] C\xF3digo para ${email}: ${code}`);
      }
      return { success: true, message: "Se o e-mail estiver cadastrado, voc\xEA receber\xE1 um c\xF3digo de redefini\xE7\xE3o." };
    }),
    /**
     * Verificar código e redefinir senha
     */
    reset: publicProcedure.input(z2.object({
      email: z2.string().email("E-mail inv\xE1lido"),
      code: z2.string().length(6, "C\xF3digo deve ter 6 d\xEDgitos"),
      newPassword: z2.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100)
    })).mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();
      const resetToken = await getValidPasswordReset(email, input.code);
      if (!resetToken) {
        throw new TRPCError3({
          code: "BAD_REQUEST",
          message: "C\xF3digo inv\xE1lido ou expirado. Solicite um novo c\xF3digo."
        });
      }
      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await updateBrokerPassword(resetToken.brokerId, passwordHash);
      await markPasswordResetUsed(resetToken.id);
      await invalidatePasswordResets(email);
      return { success: true, message: "Senha redefinida com sucesso! Fa\xE7a login com sua nova senha." };
    })
  }),
  // ==================== BROKER QUOTES ====================
  quotes: router({
    /**
     * Salvar orçamento
     */
    save: publicProcedure.input(saveQuoteSchema).mutation(async ({ input, ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Fa\xE7a login para salvar or\xE7amentos" });
      }
      const session = await getBrokerSessionByToken(token);
      if (!session) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Sess\xE3o inv\xE1lida" });
      }
      const quoteId = await createBrokerQuote({
        brokerId: session.brokerId,
        companyName: input.companyName || null,
        expectedDate: input.expectedDate || null,
        quoteData: input.quoteData
      });
      await createAccessLog({
        brokerId: session.brokerId,
        action: "save_quote",
        ipAddress: getClientIp(ctx.req),
        userAgent: ctx.req.headers["user-agent"] || null
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
      const session = await getBrokerSessionByToken(token);
      if (!session) {
        return [];
      }
      return listBrokerQuotes(session.brokerId);
    }),
    /**
     * Buscar orçamento por ID
     */
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input, ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "N\xE3o autenticado" });
      }
      const session = await getBrokerSessionByToken(token);
      if (!session) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Sess\xE3o inv\xE1lida" });
      }
      const quote = await getBrokerQuoteById(input.id);
      if (!quote || quote.brokerId !== session.brokerId) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Or\xE7amento n\xE3o encontrado" });
      }
      return quote;
    }),
    /**
     * Atualizar orçamento
     */
    update: publicProcedure.input(updateQuoteSchema).mutation(async ({ input, ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "N\xE3o autenticado" });
      }
      const session = await getBrokerSessionByToken(token);
      if (!session) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Sess\xE3o inv\xE1lida" });
      }
      const quote = await getBrokerQuoteById(input.id);
      if (!quote || quote.brokerId !== session.brokerId) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Or\xE7amento n\xE3o encontrado" });
      }
      const { id, ...data } = input;
      await updateBrokerQuote(id, data);
      return { success: true };
    }),
    /**
     * Deletar orçamento
     */
    delete: publicProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "N\xE3o autenticado" });
      }
      const session = await getBrokerSessionByToken(token);
      if (!session) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Sess\xE3o inv\xE1lida" });
      }
      const quote = await getBrokerQuoteById(input.id);
      if (!quote || quote.brokerId !== session.brokerId) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Or\xE7amento n\xE3o encontrado" });
      }
      await deleteBrokerQuote(input.id);
      return { success: true };
    })
  }),
  // ==================== RELATÓRIO DIÁRIO ====================
  report: router({
    /**
     * Gerar relatório diário (pode ser chamado manualmente ou por cron)
     */
    daily: publicProcedure.query(async () => {
      const newBrokersToday = await countBrokersToday();
      const loginsToday = await countAccessLogsToday("login");
      const registersToday = await countAccessLogsToday("register");
      const simulationsToday = await countAccessLogsToday("simulation");
      const quotesToday = await countAccessLogsToday("save_quote");
      const totalBrokers = await countActiveBrokers();
      return {
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        newBrokersToday,
        loginsToday,
        registersToday,
        simulationsToday,
        quotesToday,
        totalBrokers
      };
    })
  }),
  // ==================== EXECUTIVES (legado) ====================
  executives: router({
    register: publicProcedure.input(createExecutiveSchema).mutation(async ({ input, ctx }) => {
      const executiveId = await createExecutive({
        ...input,
        userId: ctx.user?.id,
        status: "pending"
      });
      return {
        success: true,
        id: executiveId,
        message: "Cadastro realizado! Aguarde aprova\xE7\xE3o."
      };
    }),
    myProfile: protectedProcedure.query(async ({ ctx }) => {
      const executive = await getExecutiveByUserId(ctx.user.id);
      return executive || null;
    }),
    updateProfile: protectedProcedure.input(updateExecutiveSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
      const executive = await getExecutiveByUserId(ctx.user.id);
      if (!executive) {
        throw new Error("Perfil de executivo n\xE3o encontrado");
      }
      await updateExecutive(executive.id, input);
      return { success: true };
    }),
    search: publicProcedure.input(z2.object({ query: z2.string().min(2) })).query(async ({ input }) => {
      const executives2 = await searchExecutives(input.query);
      return executives2.filter((e) => e.status === "approved" && e.isActive);
    }),
    listApproved: publicProcedure.query(async () => {
      return listApprovedExecutives();
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const executive = await getExecutiveById(input.id);
      if (!executive || executive.status !== "approved") {
        return null;
      }
      return executive;
    }),
    listPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }
      return listPendingExecutives();
    }),
    approve: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }
      await approveExecutive(input.id);
      return { success: true };
    }),
    reject: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }
      await rejectExecutive(input.id);
      return { success: true };
    }),
    adminUpdate: protectedProcedure.input(updateExecutiveSchema).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso negado");
      }
      const { id, ...data } = input;
      await updateExecutive(id, data);
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/daily-report.ts
init_notification();
async function sendDailyReport() {
  try {
    const newBrokersToday = await countBrokersToday();
    const loginsToday = await countAccessLogsToday("login");
    const registersToday = await countAccessLogsToday("register");
    const simulationsToday = await countAccessLogsToday("simulation");
    const quotesToday = await countAccessLogsToday("save_quote");
    const totalBrokers = await countActiveBrokers();
    const today = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const title = `Relat\xF3rio Di\xE1rio SimulaSa\xFAde - ${today}`;
    const content = [
      `\u{1F4CA} RELAT\xD3RIO DI\xC1RIO - ${today}`,
      ``,
      `\u{1F4CB} NOVOS CADASTROS`,
      `\u2022 Novos corretores hoje: ${newBrokersToday}`,
      `\u2022 Total de corretores ativos: ${totalBrokers}`,
      ``,
      `\u{1F510} ACESSOS`,
      `\u2022 Logins realizados hoje: ${loginsToday}`,
      `\u2022 Cadastros realizados hoje: ${registersToday}`,
      ``,
      `\u{1F4C8} ATIVIDADE`,
      `\u2022 Simula\xE7\xF5es realizadas: ${simulationsToday}`,
      `\u2022 Or\xE7amentos salvos: ${quotesToday}`,
      ``,
      `---`,
      `Simulador Hapvida - Relat\xF3rio autom\xE1tico`,
      `Para: estevao.cardoso@hapvida.com.br`
    ].join("\n");
    const sent = await notifyOwner({ title, content });
    if (sent) {
      console.log(`[DailyReport] Relat\xF3rio enviado com sucesso: ${today}`);
    } else {
      console.warn(`[DailyReport] Falha ao enviar relat\xF3rio: ${today}`);
    }
    return sent;
  } catch (error) {
    console.error("[DailyReport] Erro ao gerar relat\xF3rio:", error);
    return false;
  }
}
async function dailyMaintenance() {
  try {
    await cleanExpiredSessions();
    console.log("[DailyMaintenance] Sess\xF5es expiradas limpas");
  } catch (error) {
    console.error("[DailyMaintenance] Erro:", error);
  }
}

// server/_core/index.ts
var DOCUMENT_MAP2 = {
  "carta-nomeacao.docx": {
    s3Key: "documents/carta-nomeacao.docx",
    displayName: "Carta de Nomea\xE7\xE3o"
  },
  "contrato-prestacao-servico.docx": {
    s3Key: "documents/contrato-prestacao-servico.docx",
    displayName: "Contrato de Presta\xE7\xE3o de Servi\xE7o"
  },
  "0.ManualAPPdoBenefici\xE1rio.pdf": {
    s3Key: "documents/manuais/0-manual-app-beneficiario.pdf",
    displayName: "Manual APP do Benefici\xE1rio"
  },
  "1.ManualdoCorretorSuperSimplesePME.pdf": {
    s3Key: "documents/manuais/1-manual-corretor-ss-pme.pdf",
    displayName: "Manual do Corretor Super Simples e PME"
  },
  "2.Gui\xE1Pr\xE1ticoAppVendedor(a).pdf": {
    s3Key: "documents/manuais/2-guia-app-vendedor.pdf",
    displayName: "Guia Pr\xE1tico App Vendedor"
  },
  "2.1ManualPortalWebVendedor.pdf": {
    s3Key: "documents/manuais/2-1-manual-portal-web-vendedor.pdf",
    displayName: "Manual Portal Web Vendedor"
  },
  "3.ManualPortaldoCliente.pdf": {
    s3Key: "documents/manuais/3-manual-portal-cliente.pdf",
    displayName: "Manual Portal do Cliente"
  },
  "4.PortalCorretorCNPJPF.pdf": {
    s3Key: "documents/manuais/4-portal-corretor-cnpj-pf.pdf",
    displayName: "Portal Corretor CNPJ/PF"
  },
  "5.ManualAppePortal.pdf": {
    s3Key: "documents/manuais/5-manual-app-portal.pdf",
    displayName: "Manual App e Portal"
  },
  "7.Manualdemovimenta\xE7\xE3oparacontratosPF.pdf": {
    s3Key: "documents/manuais/7-manual-movimentacao-pf.pdf",
    displayName: "Manual de Movimenta\xE7\xE3o para Contratos PF"
  },
  "8.GuiaTrilhadeVendasHapvida.pdf": {
    s3Key: "documents/manuais/8-guia-trilha-vendas.pdf",
    displayName: "Guia Trilha de Vendas Hapvida"
  },
  "9.ManualdeReembolso-APPePortal.pdf": {
    s3Key: "documents/manuais/9-manual-reembolso.pdf",
    displayName: "Manual de Reembolso - APP e Portal"
  }
};
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
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
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
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
  app.get("/api/documents/download", async (req, res) => {
    try {
      const filename = req.query.filename;
      if (!filename) {
        res.status(400).json({ error: "Filename is required" });
        return;
      }
      const doc = DOCUMENT_MAP2[filename];
      if (!doc) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      try {
        const { url } = await storageGet(doc.s3Key);
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
      createContext
    })
  );
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  app.get("/api/report/daily", async (_req, res) => {
    try {
      const sent = await sendDailyReport();
      res.json({ ok: sent, timestamp: Date.now() });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to send report" });
    }
  });
  app.get("/api/maintenance", async (_req, res) => {
    try {
      await dailyMaintenance();
      res.json({ ok: true, timestamp: Date.now() });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Maintenance failed" });
    }
  });
  const webDistPath = path.join(process.cwd(), "dist");
  app.use(express.static(webDistPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return;
    const htmlFile = path.join(webDistPath, req.path + ".html");
    const fs = __require("fs");
    if (fs.existsSync(htmlFile)) {
      res.sendFile(htmlFile);
    } else {
      res.sendFile(path.join(webDistPath, "index.html"));
    }
  });
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
    setInterval(async () => {
      const now = /* @__PURE__ */ new Date();
      const hour = now.getUTCHours();
      const minute = now.getUTCMinutes();
      if (hour === 21 && minute < 5) {
        console.log("[Cron] Enviando relat\xF3rio di\xE1rio...");
        await sendDailyReport();
        await dailyMaintenance();
      }
    }, 5 * 60 * 1e3);
  });
}
startServer().catch(console.error);
