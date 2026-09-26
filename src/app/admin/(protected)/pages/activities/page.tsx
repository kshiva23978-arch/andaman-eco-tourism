import { prisma } from "@/lib/prisma";
import { normalizeActivitiesGuide } from "@/lib/content/activities";
import { ActivitiesGuideEditor } from "./ActivitiesGuideEditor";

export default async function AdminActivitiesGuideEditor() {
  const [row, activities] = await Promise.all([
    prisma.pageContent.findUnique({ where: { key: "activities" } }),
    prisma.activity.findMany({ select: { slug: true, title: true, status: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <ActivitiesGuideEditor
      initialContent={normalizeActivitiesGuide(row?.data)}
      lastSaved={row?.updatedAt.toISOString() ?? null}
      activityOptions={activities}
    />
  );
}
