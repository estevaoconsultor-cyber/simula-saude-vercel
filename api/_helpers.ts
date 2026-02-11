import crypto from "crypto";

export function generateSessionToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function getDeviceFingerprint(req: any): string {
  const ua = req.headers["user-agent"] || "unknown";
  const ip = req.headers["x-forwarded-for"] || "unknown";
  const hash = crypto.createHash("sha256").update(`${ua}:${ip}`).digest("hex").slice(0, 32);
  return hash;
}

export function getDeviceName(req: any): string {
  const ua = req.headers["user-agent"] || "";
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("iPad")) return "iPad";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Windows")) return "Windows PC";
  if (ua.includes("Mac")) return "Mac";
  if (ua.includes("Linux")) return "Linux";
  return "Navegador Web";
}

export function getClientIp(req: any): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}
