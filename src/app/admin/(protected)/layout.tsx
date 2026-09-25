import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
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

  return (
    <AdminShell currentUser={{ name: user.name, role: ROLE_LABELS[user.role] ?? user.role }}>
      {children}
    </AdminShell>
  );
}
