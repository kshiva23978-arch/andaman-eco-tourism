import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/AdminUI";
import { MediaGrid, type MediaRow } from "./MediaGrid";

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { uploadedAt: "desc" } });

  const rows: MediaRow[] = assets.map((a) => ({
    id: a.id,
    src: a.path,
    name: a.filename,
    usedIn: a.usedIn ?? "",
    size: formatSize(a.sizeBytes),
  }));

  return (
    <div>
      <PageHeader
        title="Media Library"
        description={`${assets.length} assets in the library, scanned from the site's real image and video files.`}
      />
      <MediaGrid items={rows} />
    </div>
  );
}
