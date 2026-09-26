"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission, logAudit, hashPassword } from "@/lib/auth";
import type { Role } from "@prisma/client";
import { PERMISSIONS, type PermissionKey } from "@/lib/permissions";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
}

function isUniqueEmailError(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

export async function createUserAction(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) {
  const currentUser = await requirePermission("manage_users");
  const ip = await getClientIp();

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name) throw new Error("Enter a name.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (input.password.length < 8) throw new Error("Password must be at least 8 characters.");

  let created;
  try {
    created = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(input.password),
        role: input.role,
        status: "ACTIVE",
      },
    });
  } catch (err) {
    if (isUniqueEmailError(err)) throw new Error("A user with this email already exists.");
    throw err;
  }

  await logAudit({
    actorId: currentUser.id,
    actorLabel: currentUser.email,
    ip,
    category: "AUTH",
    message: `Created user ${created.email} (${created.role.replace("_", " ").toLowerCase()})`,
  });

  revalidatePath("/admin/users");
}

export async function updateUserAction(
  id: string,
  input: { name: string; email: string; role: Role; password?: string }
) {
  const currentUser = await requirePermission("manage_users");
  const ip = await getClientIp();

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name) throw new Error("Enter a name.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (input.password && input.password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (id === currentUser.id && input.role !== currentUser.role) {
    throw new Error("You can't change your own role.");
  }

  let updated;
  try {
    updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role: input.role,
        ...(input.password ? { passwordHash: hashPassword(input.password) } : {}),
      },
    });
  } catch (err) {
    if (isUniqueEmailError(err)) throw new Error("A user with this email already exists.");
    throw err;
  }

  await logAudit({
    actorId: currentUser.id,
    actorLabel: currentUser.email,
    ip,
    category: "AUTH",
    message: `Updated user ${updated.email}${input.password ? " (password reset)" : ""}`,
  });

  revalidatePath("/admin/users");
}

export async function toggleSuspendAction(id: string) {
  const currentUser = await requirePermission("manage_users");
  const ip = await getClientIp();

  if (id === currentUser.id) {
    throw new Error("You can't suspend your own account.");
  }

  const target = await prisma.user.findUniqueOrThrow({ where: { id } });
  const nextStatus = target.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
  await prisma.user.update({ where: { id }, data: { status: nextStatus } });

  await logAudit({
    actorId: currentUser.id,
    actorLabel: currentUser.email,
    ip,
    category: "AUTH",
    severity: nextStatus === "SUSPENDED" ? "WARNING" : "INFO",
    message: `${nextStatus === "SUSPENDED" ? "Suspended" : "Reactivated"} account ${target.email}`,
  });

  revalidatePath("/admin/users");
}

export async function updateRolePermissionsAction(role: Role, permissions: PermissionKey[]) {
  if (role === "SUPER_ADMIN") {
    throw new Error("Super Admin always has full access and can't be changed.");
  }

  const currentUser = await requirePermission("manage_users");
  const ip = await getClientIp();

  const validKeys = new Set(PERMISSIONS.map((p) => p.key));
  const cleaned = permissions.filter((p) => validKeys.has(p));

  await prisma.rolePermission.upsert({
    where: { role },
    update: { permissions: cleaned },
    create: { role, permissions: cleaned },
  });

  await logAudit({
    actorId: currentUser.id,
    actorLabel: currentUser.email,
    ip,
    category: "AUTH",
    message: `Updated permissions for ${role.replace("_", " ").toLowerCase()}`,
  });

  revalidatePath("/admin/users");
}
