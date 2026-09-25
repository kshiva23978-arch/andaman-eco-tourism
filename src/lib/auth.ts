import { randomBytes, timingSafeEqual, createHash } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { DEFAULT_ROLE_PERMISSIONS, type PermissionKey } from "@/lib/permissions";
import type { Role } from "@prisma/client";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashPassword(password: string) {
  const salt = randomBytes(8).toString("hex"); // 16 hex characters
  const hash = sha256(salt + password);
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = Buffer.from(sha256(salt + password), "hex");
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  if (session.user.status === "SUSPENDED") return null;
  return session.user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function roleHasPermission(role: Role, permission: PermissionKey) {
  const record = await prisma.rolePermission.findUnique({ where: { role } });
  const permissions = (record?.permissions as PermissionKey[] | undefined) ?? DEFAULT_ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

export async function requirePermission(permission: PermissionKey) {
  const user = await requireUser();
  const allowed = await roleHasPermission(user.role, permission);
  if (!allowed) throw new Error("FORBIDDEN");
  return user;
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  store.delete(SESSION_COOKIE);
}

export async function registerFailedLogin(userId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: { increment: 1 } },
  });
  if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    await prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_MS), failedLoginAttempts: 0 },
    });
    return true;
  }
  return false;
}

export async function clearFailedLogins(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastActiveAt: new Date() },
  });
}

export function isLocked(user: { lockedUntil: Date | null }) {
  return Boolean(user.lockedUntil && user.lockedUntil > new Date());
}

export async function logAudit(entry: {
  actorId?: string | null;
  actorLabel: string;
  ip?: string | null;
  category: "AUTH" | "CONTENT" | "SECURITY" | "SYSTEM";
  severity?: "INFO" | "WARNING" | "CRITICAL";
  message: string;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: entry.actorId ?? null,
      actorLabel: entry.actorLabel,
      ip: entry.ip ?? null,
      category: entry.category,
      severity: entry.severity ?? "INFO",
      message: entry.message,
    },
  });
}
