"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSession,
  registerFailedLogin,
  clearFailedLogins,
  isLocked,
  logAudit,
  destroySession,
} from "@/lib/auth";
import { CAPTCHA_COOKIE, hashCaptcha } from "@/lib/captcha";

export type LoginState = { error?: string };

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const captchaInput = String(formData.get("captcha") || "").trim();

  const store = await cookies();
  const captchaHash = store.get(CAPTCHA_COOKIE)?.value;
  store.delete(CAPTCHA_COOKIE);

  const ip = await getClientIp();

  if (!email || !password) {
    return { error: "Enter your username and password." };
  }

  if (!captchaInput || !captchaHash || hashCaptcha(captchaInput) !== captchaHash) {
    await logAudit({
      actorLabel: email,
      ip,
      category: "SECURITY",
      severity: "WARNING",
      message: "Login attempt failed the security check (captcha)",
    });
    return { error: "The code you entered doesn't match. Try again." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await logAudit({
      actorLabel: email,
      ip,
      category: "AUTH",
      severity: "WARNING",
      message: "Login attempt for unknown account",
    });
    return { error: "Invalid username or password." };
  }

  if (isLocked(user)) {
    await logAudit({
      actorId: user.id,
      actorLabel: email,
      ip,
      category: "SECURITY",
      severity: "CRITICAL",
      message: "Login attempt on temporarily locked account",
    });
    return { error: "This account is temporarily locked from repeated failed attempts. Try again later." };
  }

  if (user.status === "SUSPENDED") {
    await logAudit({
      actorId: user.id,
      actorLabel: email,
      ip,
      category: "AUTH",
      severity: "WARNING",
      message: "Login attempt on suspended account",
    });
    return { error: "This account has been suspended." };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    const lockedNow = await registerFailedLogin(user.id);
    await logAudit({
      actorId: user.id,
      actorLabel: email,
      ip,
      category: lockedNow ? "SECURITY" : "AUTH",
      severity: lockedNow ? "CRITICAL" : "WARNING",
      message: lockedNow
        ? "Account locked after 5 consecutive failed login attempts"
        : "Failed login attempt (incorrect password)",
    });
    return { error: "Invalid username or password." };
  }

  await clearFailedLogins(user.id);
  await createSession(user.id);
  await logAudit({
    actorId: user.id,
    actorLabel: email,
    ip,
    category: "AUTH",
    severity: "INFO",
    message: "Successful login to admin console",
  });

  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
