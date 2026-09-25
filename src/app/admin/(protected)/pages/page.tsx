import { prisma } from "@/lib/prisma";
import type { BackgroundConfig } from "@/components/admin/AdminUI";
import { SectionsManager, type SectionRow } from "./SectionsManager";

function relativeLabel(date: Date) {
  const days = Math.round((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export default async function AdminPagesPage() {
  const [sections, destinationOptions, activityOptions] = await Promise.all([
    prisma.section.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.destination.findMany({ select: { slug: true, title: true }, orderBy: { title: "asc" } }),
    prisma.activity.findMany({ select: { slug: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  const rows: SectionRow[] = sections.map((s) => {
    const background: BackgroundConfig = {
      type: s.backgroundType === "COLOR" ? "color" : "image",
      image: s.backgroundImage ?? "/images/alternate/alternate-image-destinations.jpg",
      color: s.backgroundColor ?? "#0f2b1e",
      overlay: { enabled: s.overlayEnabled, color: s.overlayColor, opacity: s.overlayOpacity },
    };

    return {
      id: s.id,
      pages: s.pages,
      target:
        s.targetType && s.targetSlug && s.targetTitle
          ? { type: s.targetType as "destination" | "activity", slug: s.targetSlug, title: s.targetTitle }
          : undefined,
      name: s.name,
      description: s.description,
      headline: s.headline ?? "",
      body: s.body ?? "",
      updatedAtLabel: relativeLabel(s.updatedAt),
      background,
      gallery: s.gallery,
    };
  });

  return (
    <SectionsManager
      initialSections={rows}
      destinationOptions={destinationOptions}
      activityOptions={activityOptions}
    />
  );
}
