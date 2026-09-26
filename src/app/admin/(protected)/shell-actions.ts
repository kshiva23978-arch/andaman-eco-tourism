"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth";

export type SearchResult = {
  kind: "destination" | "activity" | "section";
  title: string;
  subtitle: string;
  href: string;
  status: "PUBLISHED" | "DRAFT";
};

/** Header search: matches destinations, activities and page sections by title/slug. */
export async function searchContentAction(query: string): Promise<SearchResult[]> {
  await requireUser();

  const q = query.trim().slice(0, 100);
  if (q.length < 2) return [];
  const contains = { contains: q, mode: "insensitive" as const };

  const [destinations, activities, sections] = await Promise.all([
    prisma.destination.findMany({
      where: { OR: [{ title: contains }, { slug: contains }, { region: contains }] },
      select: { slug: true, title: true, region: true, status: true },
      orderBy: { title: "asc" },
      take: 6,
    }),
    prisma.activity.findMany({
      where: { OR: [{ title: contains }, { slug: contains }] },
      select: { slug: true, title: true, duration: true, status: true },
      orderBy: { title: "asc" },
      take: 6,
    }),
    prisma.section.findMany({
      where: { OR: [{ name: contains }, { headline: contains }] },
      select: { name: true, description: true, status: true },
      orderBy: { name: "asc" },
      take: 4,
    }),
  ]);

  return [
    ...destinations.map((d) => ({
      kind: "destination" as const,
      title: d.title,
      subtitle: d.region,
      href: `/admin/destinations/${d.slug}`,
      status: d.status,
    })),
    ...activities.map((a) => ({
      kind: "activity" as const,
      title: a.title,
      subtitle: a.duration,
      href: `/admin/activities/${a.slug}`,
      status: a.status,
    })),
    ...sections.map((s) => ({
      kind: "section" as const,
      title: s.name,
      subtitle: s.description,
      href: "/admin/pages",
      status: s.status,
    })),
  ];
}

export type NotificationItem = {
  id: string;
  message: string;
  actor: string;
  category: "AUTH" | "CONTENT" | "SECURITY" | "SYSTEM";
  severity: "INFO" | "WARNING" | "CRITICAL";
  createdAt: string;
};

/** Header notifications: the most recent audit-log events. Requires `view_logs`. */
export async function getNotificationsAction(): Promise<NotificationItem[]> {
  await requirePermission("view_logs");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return logs.map((log) => ({
    id: log.id,
    message: log.message,
    actor: log.actorLabel,
    category: log.category,
    severity: log.severity,
    createdAt: log.createdAt.toISOString(),
  }));
}
