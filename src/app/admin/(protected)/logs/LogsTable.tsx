"use client";

import { useMemo, useState } from "react";
import { Card, Badge, inputClass } from "@/components/admin/AdminUI";

export type LogRow = {
  id: string;
  timestamp: string;
  actor: string;
  ip: string;
  category: "AUTH" | "CONTENT" | "SECURITY" | "SYSTEM";
  message: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
};

const CATEGORIES = ["All", "AUTH", "CONTENT", "SECURITY", "SYSTEM"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  All: "All",
  AUTH: "Auth",
  CONTENT: "Content",
  SECURITY: "Security",
  SYSTEM: "System",
};

function severityTone(s: LogRow["severity"]) {
  if (s === "CRITICAL") return "danger" as const;
  if (s === "WARNING") return "warning" as const;
  return "neutral" as const;
}

export function LogsTable({ logs }: { logs: LogRow[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchesCategory = category === "All" || l.category === category;
      const matchesQuery =
        l.message.toLowerCase().includes(query.toLowerCase()) ||
        l.actor.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [logs, category, query]);

  return (
    <div>
      <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                category === c
                  ? "bg-primary text-white"
                  : "border border-black/10 bg-white text-on-surface-variant hover:bg-black/5"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <div className="relative ml-auto min-w-[220px] flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs by actor or message…"
            className={`${inputClass} pl-9`}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Actor</th>
                <th className="px-5 py-3 font-semibold">IP address</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-black/[0.015]">
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-on-surface-variant">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-3 text-on-surface">{log.actor}</td>
                  <td className="px-5 py-3 font-mono text-xs text-on-surface-variant">{log.ip}</td>
                  <td className="px-5 py-3">
                    <Badge tone={severityTone(log.severity)}>{CATEGORY_LABELS[log.category]}</Badge>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{log.message}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-on-surface-variant">
                    No log entries match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
