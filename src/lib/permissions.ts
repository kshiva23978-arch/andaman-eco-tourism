export type PermissionKey =
  | "manage_users"
  | "manage_settings"
  | "publish_content"
  | "edit_content"
  | "upload_media"
  | "submit_for_review"
  | "review_approve_content"
  | "view_logs"
  | "view_dashboard";

export const PERMISSIONS: { key: PermissionKey; label: string }[] = [
  { key: "manage_users", label: "Manage users" },
  { key: "manage_settings", label: "Site settings" },
  { key: "publish_content", label: "Publish content" },
  { key: "edit_content", label: "Create & edit content" },
  { key: "upload_media", label: "Upload media" },
  { key: "submit_for_review", label: "Submit for review" },
  { key: "review_approve_content", label: "Review & approve content" },
  { key: "view_logs", label: "View logs" },
  { key: "view_dashboard", label: "Read-only dashboard access" },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  SUPER_ADMIN: PERMISSIONS.map((p) => p.key),
  CONTENT_EDITOR: ["edit_content", "upload_media", "submit_for_review"],
  REVIEWER: ["review_approve_content", "view_logs"],
  VIEWER: ["view_dashboard"],
};
