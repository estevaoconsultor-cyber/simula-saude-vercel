import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL!,
      waitForConnections: true,
      connectionLimit: 5,
      ssl: { rejectUnauthorized: true },
    });
  }
  return pool;
}

// ==================== BROKER ====================

export async function getBrokerByEmail(email: string) {
  const db = getPool();
  const [rows] = await db.execute(
    "SELECT * FROM brokers WHERE email = ? LIMIT 1",
    [email]
  );
  return (rows as any[])[0] || null;
}

export async function getBrokerById(id: number) {
  const db = getPool();
  const [rows] = await db.execute(
    "SELECT * FROM brokers WHERE id = ? LIMIT 1",
    [id]
  );
  return (rows as any[])[0] || null;
}

export async function createBroker(data: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  profile: string;
  sellerCode: string | null;
  brokerageCode: string | null;
  brokerageName: string | null;
}): Promise<number> {
  const db = getPool();
  const [result] = await db.execute(
    `INSERT INTO brokers (firstName, lastName, email, passwordHash, profile, sellerCode, brokerageCode, brokerageName, isActive, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [data.firstName, data.lastName, data.email, data.passwordHash, data.profile, data.sellerCode, data.brokerageCode, data.brokerageName]
  );
  return (result as any).insertId;
}

export async function updateBrokerLastLogin(id: number) {
  const db = getPool();
  await db.execute("UPDATE brokers SET lastLoginAt = NOW() WHERE id = ?", [id]);
}

export async function updateBrokerPassword(brokerId: number, passwordHash: string) {
  const db = getPool();
  await db.execute("UPDATE brokers SET passwordHash = ?, updatedAt = NOW() WHERE id = ?", [passwordHash, brokerId]);
}

// ==================== SESSIONS ====================

export async function createBrokerSession(data: {
  brokerId: number;
  sessionToken: string;
  deviceFingerprint: string;
  deviceName: string;
  lastIp: string;
  expiresAt: Date;
}) {
  const db = getPool();
  await db.execute(
    `INSERT INTO broker_sessions (brokerId, sessionToken, deviceFingerprint, deviceName, lastIp, createdAt, lastUsedAt, expiresAt)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    [data.brokerId, data.sessionToken, data.deviceFingerprint, data.deviceName, data.lastIp, data.expiresAt]
  );
}

export async function getBrokerSessionByToken(token: string) {
  const db = getPool();
  const [rows] = await db.execute(
    "SELECT * FROM broker_sessions WHERE sessionToken = ? AND expiresAt > NOW() LIMIT 1",
    [token]
  );
  return (rows as any[])[0] || null;
}

export async function listBrokerSessions(brokerId: number) {
  const db = getPool();
  const [rows] = await db.execute(
    "SELECT * FROM broker_sessions WHERE brokerId = ? AND expiresAt > NOW() ORDER BY lastUsedAt DESC",
    [brokerId]
  );
  return rows as any[];
}

export async function deleteBrokerSession(id: number) {
  const db = getPool();
  await db.execute("DELETE FROM broker_sessions WHERE id = ?", [id]);
}

export async function deleteOldestBrokerSession(brokerId: number) {
  const db = getPool();
  await db.execute(
    "DELETE FROM broker_sessions WHERE brokerId = ? ORDER BY lastUsedAt ASC LIMIT 1",
    [brokerId]
  );
}

export async function touchBrokerSession(sessionId: number, ip: string) {
  const db = getPool();
  await db.execute("UPDATE broker_sessions SET lastUsedAt = NOW(), lastIp = ? WHERE id = ?", [ip, sessionId]);
}

export async function deleteBrokerSessionByToken(token: string) {
  const db = getPool();
  await db.execute("DELETE FROM broker_sessions WHERE sessionToken = ?", [token]);
}

// ==================== ACCESS LOGS ====================

export async function createAccessLog(data: {
  brokerId: number;
  action: string;
  ipAddress: string | null;
  userAgent: string | null;
  metadata?: any;
}) {
  const db = getPool();
  await db.execute(
    `INSERT INTO access_logs (brokerId, action, ipAddress, userAgent, metadata, createdAt)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [data.brokerId, data.action, data.ipAddress, data.userAgent, data.metadata ? JSON.stringify(data.metadata) : null]
  );
}

// ==================== PASSWORD RESETS ====================

export async function invalidatePasswordResets(email: string) {
  const db = getPool();
  await db.execute("UPDATE password_resets SET used = 1 WHERE email = ? AND used = 0", [email]);
}

export async function createPasswordReset(data: {
  brokerId: number;
  email: string;
  code: string;
  expiresAt: Date;
}): Promise<number> {
  const db = getPool();
  const [result] = await db.execute(
    `INSERT INTO password_resets (brokerId, email, code, expiresAt, used, createdAt)
     VALUES (?, ?, ?, ?, 0, NOW())`,
    [data.brokerId, data.email, data.code, data.expiresAt]
  );
  return (result as any).insertId;
}

export async function getValidPasswordReset(email: string, code: string) {
  const db = getPool();
  const [rows] = await db.execute(
    "SELECT * FROM password_resets WHERE email = ? AND code = ? AND used = 0 AND expiresAt > NOW() ORDER BY createdAt DESC LIMIT 1",
    [email, code]
  );
  return (rows as any[])[0] || null;
}

export async function markPasswordResetUsed(id: number) {
  const db = getPool();
  await db.execute("UPDATE password_resets SET used = 1 WHERE id = ?", [id]);
}

// ==================== DAILY REPORT ====================

export async function getAccessLogsToday() {
  const db = getPool();
  const [rows] = await db.execute(
    `SELECT al.*, b.firstName, b.lastName, b.email as brokerEmail, b.profile
     FROM access_logs al
     JOIN brokers b ON al.brokerId = b.id
     WHERE DATE(al.createdAt) = CURDATE()
     ORDER BY al.createdAt DESC`
  );
  return rows as any[];
}

export async function getAllBrokers() {
  const db = getPool();
  const [rows] = await db.execute(
    "SELECT id, firstName, lastName, email, profile, sellerCode, brokerageCode, brokerageName, isActive, createdAt, lastLoginAt FROM brokers ORDER BY createdAt DESC"
  );
  return rows as any[];
}

// ==================== QUOTES ====================

export async function saveQuote(data: {
  brokerId: number;
  companyName: string | null;
  expectedDate: string | null;
  quoteData: string;
}) {
  const db = getPool();
  await db.execute(
    `INSERT INTO broker_quotes (brokerId, companyName, expectedDate, quoteData, createdAt)
     VALUES (?, ?, ?, ?, NOW())`,
    [data.brokerId, data.companyName, data.expectedDate, data.quoteData]
  );
}
