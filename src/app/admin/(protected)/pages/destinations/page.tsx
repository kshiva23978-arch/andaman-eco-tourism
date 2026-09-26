import { prisma } from "@/lib/prisma";
import { normalizeDestinationsList } from "@/lib/content/destinations";
import { DestinationsPageEditor } from "./DestinationsPageEditor";

export default async function AdminDestinationsPageEditor() {
  const [row, regionUsage] = await Promise.all([
    prisma.pageContent.findUnique({ where: { key: "destinations" } }),
    prisma.destination.groupBy({ by: ["region"], _count: { _all: true } }),
  ]);

  return (
    <DestinationsPageEditor
      initialContent={normalizeDestinationsList(row?.data)}
      lastSaved={row?.updatedAt.toISOString() ?? null}
      regionUsage={Object.fromEntries(regionUsage.map((r) => [r.region, r._count._all]))}
    />
  );
}
