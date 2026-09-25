import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { DEFAULT_ROLE_PERMISSIONS, type PermissionKey } from "@/lib/permissions";
import { UsersManager, type UserRow, type Role } from "./UsersManager";

function relativeLabel(date: Date | null) {
  if (!date) return "Never";
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const ROLES: Role[] = ["SUPER_ADMIN", "CONTENT_EDITOR", "REVIEWER", "VIEWER"];

export default async function AdminUsersPage() {
  const [users, currentUser, rolePermissionRows] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    getSessionUser(),
    prisma.rolePermission.findMany(),
  ]);

  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    lastActive: relativeLabel(u.lastActiveAt),
  }));

  const rolePermissions = Object.fromEntries(
    ROLES.map((role) => {
      const found = rolePermissionRows.find((r) => r.role === role);
      return [role, (found?.permissions as PermissionKey[] | undefined) ?? DEFAULT_ROLE_PERMISSIONS[role]];
    })
  ) as Record<Role, PermissionKey[]>;

  return (
    <UsersManager
      users={rows}
      currentUserId={currentUser?.id ?? ""}
      rolePermissions={rolePermissions}
    />
  );
}
