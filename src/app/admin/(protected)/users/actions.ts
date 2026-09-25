"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requirePermission, logAudit } from "@/lib/auth";
import type { Role } from "@prisma/client";
import { PERMISSIONS, type PermissionKey } from "@/lib/permissions";

async function getClientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;
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

export async function updateUserRoleAction(id: string, role: Role) {
  const currentUser = await requirePermission("manage_users");
  const ip = await getClientIp();

  if (id === currentUser.id) {
    throw new Error("You can't change your own role.");
  }

  const target = await prisma.user.update({ where: { id }, data: { role } });

  await logAudit({
    actorId: currentUser.id,
    actorLabel: currentUser.email,
    ip,
    category: "AUTH",
    message: `Changed ${target.email}'s role to ${role.replace("_", " ").toLowerCase()}`,
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
