"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  PageHeader,
  Badge,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  Modal,
  FormField,
  inputClass,
} from "@/components/admin/AdminUI";
import {
  toggleSuspendAction,
  createUserAction,
  updateUserAction,
  updateRolePermissionsAction,
} from "./actions";
import { PERMISSIONS, type PermissionKey } from "@/lib/permissions";

export type Role = "SUPER_ADMIN" | "CONTENT_EDITOR" | "REVIEWER" | "VIEWER";
export type UserStatus = "ACTIVE" | "INVITED" | "SUSPENDED";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastActive: string;
};

const ROLES: Role[] = ["SUPER_ADMIN", "CONTENT_EDITOR", "REVIEWER", "VIEWER"];
const EDITABLE_ROLES: Role[] = ["CONTENT_EDITOR", "REVIEWER", "VIEWER"];

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  CONTENT_EDITOR: "Content Editor",
  REVIEWER: "Reviewer",
  VIEWER: "Viewer",
};

function statusTone(status: UserStatus) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "INVITED") return "info" as const;
  return "danger" as const;
}

export function UsersManager({
  users,
  currentUserId,
  rolePermissions,
}: {
  users: UserRow[];
  currentUserId: string;
  rolePermissions: Record<Role, PermissionKey[]>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [permissionDrafts, setPermissionDrafts] =
    useState<Record<Role, PermissionKey[]>>(rolePermissions);
  const [savedRole, setSavedRole] = useState<Role | null>(null);
  const [prevRolePermissions, setPrevRolePermissions] = useState(rolePermissions);
  if (prevRolePermissions !== rolePermissions) {
    setPrevRolePermissions(rolePermissions);
    setPermissionDrafts(rolePermissions);
  }

  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    name: "",
    email: "",
    password: "",
    role: "CONTENT_EDITOR" as Role,
  });

  const [editTarget, setEditTarget] = useState<UserRow | null>(null);
  const [editDraft, setEditDraft] = useState({
    name: "",
    email: "",
    password: "",
    role: "CONTENT_EDITOR" as Role,
  });

  function toggleSuspend(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await toggleSuspendAction(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't update this account.");
      }
    });
  }

  function openCreate() {
    setCreateDraft({ name: "", email: "", password: "", role: "CONTENT_EDITOR" });
    setError(null);
    setCreateOpen(true);
  }

  function saveCreate() {
    setError(null);
    startTransition(async () => {
      try {
        await createUserAction(createDraft);
        setCreateOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't create this user.");
      }
    });
  }

  function openEditor(u: UserRow) {
    setEditDraft({ name: u.name, email: u.email, password: "", role: u.role });
    setError(null);
    setEditTarget(u);
  }

  function saveEdit() {
    if (!editTarget) return;
    const id = editTarget.id;
    setError(null);
    startTransition(async () => {
      try {
        await updateUserAction(id, { ...editDraft, password: editDraft.password || undefined });
        setEditTarget(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't update this user.");
      }
    });
  }

  function togglePermission(role: Role, key: PermissionKey) {
    setPermissionDrafts((prev) => {
      const current = prev[role] ?? [];
      const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
      return { ...prev, [role]: next };
    });
  }

  function savePermissions(role: Role) {
    setError(null);
    startTransition(async () => {
      try {
        await updateRolePermissionsAction(role, permissionDrafts[role] ?? []);
        setSavedRole(role);
        router.refresh();
        window.setTimeout(() => setSavedRole(null), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't update permissions.");
      }
    });
  }

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        description="Control who can access the admin panel and what each role is allowed to do."
        actions={
          <PrimaryButton icon="person_add" onClick={openCreate}>
            Add user
          </PrimaryButton>
        }
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-container px-4 py-2.5 text-sm font-medium text-on-error-container">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      <Card className={`mb-6 overflow-hidden ${isPending ? "opacity-60" : ""}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Last active</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-black/[0.015]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                        {u.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">
                          {u.name}
                          {u.id === currentUserId && (
                            <span className="ml-2 text-xs font-normal text-on-surface-variant">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-on-surface-variant">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{ROLE_LABELS[u.role]}</td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone(u.status)}>
                      {u.status === "ACTIVE" ? "Active" : u.status === "INVITED" ? "Invited" : "Suspended"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{u.lastActive}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        icon="edit"
                        title="Edit user"
                        onClick={() => openEditor(u)}
                      />
                      <IconButton
                        icon={u.status === "SUSPENDED" ? "lock_open" : "lock"}
                        title={u.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                        tone={u.status === "SUSPENDED" ? "neutral" : "danger"}
                        onClick={() => toggleSuspend(u.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-on-surface-variant">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-1 font-semibold text-on-surface">Roles &amp; permissions</h3>
        <p className="mb-4 text-sm text-on-surface-variant">
          Toggle what each role can do. Super Admin always keeps full access and can&apos;t be
          changed, to avoid locking everyone out.
        </p>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {ROLES.map((role) => {
            const editable = EDITABLE_ROLES.includes(role);
            const active = editable ? permissionDrafts[role] ?? [] : PERMISSIONS.map((p) => p.key);

            return (
              <div key={role} className="rounded-lg border border-black/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-on-surface">{ROLE_LABELS[role]}</p>
                  {!editable ? (
                    <Badge tone="info">Fixed</Badge>
                  ) : (
                    <SecondaryButton
                      icon={savedRole === role ? "check" : "save"}
                      onClick={() => savePermissions(role)}
                    >
                      {savedRole === role ? "Saved" : "Save changes"}
                    </SecondaryButton>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PERMISSIONS.map((perm) => {
                    const checked = active.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                          checked
                            ? "border-secondary bg-secondary-container/50 text-on-surface"
                            : "border-black/15 text-on-surface-variant"
                        } ${!editable ? "cursor-not-allowed opacity-70" : ""}`}
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5"
                          checked={checked}
                          disabled={!editable}
                          onChange={() => togglePermission(role, perm.key)}
                        />
                        {perm.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add user"
        footer={
          <>
            <SecondaryButton onClick={() => setCreateOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveCreate} disabled={isPending}>
              Create
            </PrimaryButton>
          </>
        }
      >
        <FormField label="Name">
          <input
            className={inputClass}
            value={createDraft.name}
            onChange={(e) => setCreateDraft((d) => ({ ...d, name: e.target.value }))}
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            className={inputClass}
            value={createDraft.email}
            onChange={(e) => setCreateDraft((d) => ({ ...d, email: e.target.value }))}
          />
        </FormField>
        <FormField label="Password" hint="At least 8 characters.">
          <input
            type="password"
            className={inputClass}
            value={createDraft.password}
            onChange={(e) => setCreateDraft((d) => ({ ...d, password: e.target.value }))}
          />
        </FormField>
        <FormField label="Role">
          <select
            className={inputClass}
            value={createDraft.role}
            onChange={(e) => setCreateDraft((d) => ({ ...d, role: e.target.value as Role }))}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </FormField>
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit user"
        footer={
          <>
            <SecondaryButton onClick={() => setEditTarget(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={saveEdit} disabled={isPending}>
              Save
            </PrimaryButton>
          </>
        }
      >
        <FormField label="Name">
          <input
            className={inputClass}
            value={editDraft.name}
            onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            className={inputClass}
            value={editDraft.email}
            onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))}
          />
        </FormField>
        <FormField label="New password" hint="Leave blank to keep the current password.">
          <input
            type="password"
            className={inputClass}
            value={editDraft.password}
            onChange={(e) => setEditDraft((d) => ({ ...d, password: e.target.value }))}
          />
        </FormField>
        <FormField label="Role">
          <select
            className={inputClass}
            value={editDraft.role}
            disabled={editTarget?.id === currentUserId}
            onChange={(e) => setEditDraft((d) => ({ ...d, role: e.target.value as Role }))}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </FormField>
      </Modal>
    </div>
  );
}
