import { prisma } from "@/lib/prisma";
import { Card, PageHeader, SecondaryButton } from "@/components/admin/AdminUI";
import { LogsTable, type LogRow } from "./LogsTable";

function last24Hours() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

export default async function AdminLogsPage() {
  const since24h = last24Hours();

  const [logs, events24h, failedLogins, securityBlocks] = await Promise.all([
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.auditLog.count({ where: { createdAt: { gte: since24h } } }),
    prisma.auditLog.count({
      where: { category: "AUTH", severity: "WARNING", createdAt: { gte: since24h } },
    }),
    prisma.auditLog.count({
      where: { category: "SECURITY", createdAt: { gte: since24h } },
    }),
  ]);

  const rows: LogRow[] = logs.map((log) => ({
    id: log.id,
    timestamp: log.createdAt.toISOString().replace("T", " ").slice(0, 19),
    actor: log.actorLabel,
    ip: log.ip ?? "—",
    category: log.category,
    message: log.message,
    severity: log.severity,
  }));

  return (
    <div>
      <PageHeader
        title="Logs & Audit"
        description="Authentication events, content changes and security alerts across the platform."
        actions={<SecondaryButton icon="download">Export CSV</SecondaryButton>}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase text-on-surface-variant">Events (24h)</p>
          <p className="mt-1 font-headline-md text-headline-md text-primary">{events24h}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase text-on-surface-variant">Failed logins (24h)</p>
          <p className="mt-1 font-headline-md text-headline-md text-error">{failedLogins}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase text-on-surface-variant">Security events (24h)</p>
          <p className="mt-1 font-headline-md text-headline-md text-[#8a5a00]">{securityBlocks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase text-on-surface-variant">Total logged</p>
          <p className="mt-1 font-headline-md text-headline-md text-secondary">{logs.length}</p>
        </Card>
      </div>

      <LogsTable logs={rows} />
    </div>
  );
}
