import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, PrimaryButton } from "@/components/admin/AdminUI";
import { ActivitiesTable } from "./ActivitiesTable";

const PAGE_SIZE = 10;

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, activities] = await Promise.all([
    prisma.activity.count({ where }),
    prisma.activity.findMany({
      where,
      orderBy: { title: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { slug: true, title: true, duration: true, difficulty: true, heroImage: true, status: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Activities"
        description={`Manage all ${total} regulated activities listed on the public site. Open one to edit its full content, background image and gallery.`}
        actions={
          <Link href="/admin/activities/new">
            <PrimaryButton icon="add">Add activity</PrimaryButton>
          </Link>
        }
      />
      <ActivitiesTable rows={activities} total={total} page={page} pageSize={PAGE_SIZE} query={q} />
    </div>
  );
}
