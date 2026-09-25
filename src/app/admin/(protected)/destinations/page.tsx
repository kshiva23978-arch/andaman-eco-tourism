import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, PrimaryButton } from "@/components/admin/AdminUI";
import { DestinationsTable } from "./DestinationsTable";

const PAGE_SIZE = 10;

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const region = sp.region && sp.region !== "All" ? sp.region : undefined;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where = {
    ...(region ? { region } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, destinations] = await Promise.all([
    prisma.destination.count({ where }),
    prisma.destination.findMany({
      where,
      orderBy: { title: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { slug: true, title: true, region: true, image: true, status: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Destinations"
        description={`Manage all ${total} destinations shown across the public site. Open one to edit its full content, background image and gallery.`}
        actions={
          <Link href="/admin/destinations/new">
            <PrimaryButton icon="add">Add destination</PrimaryButton>
          </Link>
        }
      />
      <DestinationsTable
        rows={destinations}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        query={q}
        region={sp.region ?? "All"}
      />
    </div>
  );
}
