import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, Badge } from "@/components/admin/AdminUI";

const QUICK_LINKS = [
  { href: "/admin/destinations/new", label: "Add destination", icon: "add_location_alt" },
  { href: "/admin/activities", label: "Add activity", icon: "add_circle" },
  { href: "/admin/pages", label: "Edit homepage", icon: "edit_note" },
  { href: "/admin/media", label: "Upload media", icon: "upload" },
];

function relativeTime(date: Date) {
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

function severityTone(severity: string) {
  if (severity === "CRITICAL") return "danger" as const;
  if (severity === "WARNING") return "warning" as const;
  return "info" as const;
}

export default async function AdminDashboardPage() {
  const [destinationCount, publishedDestinations, activityCount, recentLogs] = await Promise.all([
    prisma.destination.count(),
    prisma.destination.count({ where: { status: "PUBLISHED" } }),
    prisma.activity.count(),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "Published destinations", value: publishedDestinations.toString(), icon: "landscape" },
    { label: "Total destinations", value: destinationCount.toString(), icon: "map" },
    { label: "Activities", value: activityCount.toString(), icon: "hiking" },
    { label: "Security events (recent)", value: recentLogs.filter((l) => l.category === "SECURITY").length.toString(), icon: "shield" },
  ];

  return (
    <div>
      <PageHeader
        title="Welcome back"
        description="Here's what's happening across the ecotourism portal today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  {s.label}
                </p>
                <p className="mt-2 font-headline-lg text-headline-lg text-primary">{s.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container text-secondary">
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-on-surface">Recent activity</h3>
            <Link href="/admin/logs" className="text-sm font-semibold text-secondary hover:underline">
              View all logs
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-on-surface-variant">
                    {log.actorLabel.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="text-sm text-on-surface">
                    <span className="font-semibold">{log.actorLabel}</span>{" "}
                    <span className="text-on-surface-variant">{log.message}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone={severityTone(log.severity)}>{log.category}</Badge>
                  <span className="whitespace-nowrap text-xs text-on-surface-variant">
                    {relativeTime(log.createdAt)}
                  </span>
                </div>
              </li>
            ))}
            {recentLogs.length === 0 && (
              <li className="py-6 text-center text-sm text-on-surface-variant">
                No activity recorded yet.
              </li>
            )}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-on-surface">Quick actions</h3>
          <div className="flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg border border-black/10 px-3 py-2.5 text-sm font-medium text-on-surface transition-colors hover:border-secondary hover:bg-secondary-container/40"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-secondary-container/50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-on-secondary-container">
              <span className="material-symbols-outlined text-[18px]">database</span>
              Live database connected
            </p>
            <p className="mt-1 text-xs text-on-secondary-container/80">
              Destinations, activities and the audit log above are read from Postgres. Activities,
              Pages &amp; Sections, Media, Users and Settings still run on local sample data.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
