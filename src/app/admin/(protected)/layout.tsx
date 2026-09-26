import { redirect } from "next/navigation";
import { getSessionUser, roleHasPermission } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  CONTENT_EDITOR: "Content Editor",
  REVIEWER: "Reviewer",
  VIEWER: "Viewer",
};

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [canViewLogs, canManageSettings] = await Promise.all([
    roleHasPermission(user.role, "view_logs"),
    roleHasPermission(user.role, "manage_settings"),
  ]);

  return (
    <AdminShell
      currentUser={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: ROLE_LABELS[user.role] ?? user.role,
        canViewLogs,
        canManageSettings,
      }}
    >
      {children}
    </AdminShell>
  );
}
