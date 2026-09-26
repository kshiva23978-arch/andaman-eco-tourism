import { prisma } from "@/lib/prisma";
import { normalizeDestinationPage } from "@/lib/content/destinations";
import { DestinationPageEditor } from "./DestinationPageEditor";

export default async function AdminDestinationLayoutEditor() {
  const [row, sample] = await Promise.all([
    prisma.pageContent.findUnique({ where: { key: "destination-page" } }),
    prisma.destination.findFirst({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <DestinationPageEditor
      initialContent={normalizeDestinationPage(row?.data)}
      lastSaved={row?.updatedAt.toISOString() ?? null}
      previewHref={sample ? `/destinations/${sample.slug}` : "/destinations"}
    />
  );
}
