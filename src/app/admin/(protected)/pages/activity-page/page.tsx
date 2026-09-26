import { prisma } from "@/lib/prisma";
import { normalizeActivityPage } from "@/lib/content/activities";
import { ActivityPageEditor } from "./ActivityPageEditor";

export default async function AdminActivityLayoutEditor() {
  const [row, sample] = await Promise.all([
    prisma.pageContent.findUnique({ where: { key: "activity-page" } }),
    prisma.activity.findFirst({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <ActivityPageEditor
      initialContent={normalizeActivityPage(row?.data)}
      lastSaved={row?.updatedAt.toISOString() ?? null}
      previewHref={sample ? `/activities/${sample.slug}` : "/activities"}
    />
  );
}
