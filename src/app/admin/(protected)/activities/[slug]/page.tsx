import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ActivityEditorClient } from "./ActivityEditorClient";

export default async function ActivityEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === "new";

  // Choices for the "Available at destinations" / "Related activities" pickers.
  const optionSelect = { slug: true, title: true, status: true } as const;
  const [destinationOptions, activityOptions] = await Promise.all([
    prisma.destination.findMany({ select: optionSelect, orderBy: { title: "asc" } }),
    prisma.activity.findMany({ select: optionSelect, orderBy: { title: "asc" } }),
  ]);
  const options = { destinations: destinationOptions, activities: activityOptions };

  if (isNew) {
    return (
      <ActivityEditorClient initialData={null} originalSlug={null} status={null} options={options} />
    );
  }

  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: { guidelines: { orderBy: { order: "asc" } } },
  });
  if (!activity) notFound();

  return (
    <ActivityEditorClient
      options={options}
      initialData={{
        slug: activity.slug,
        title: activity.title,
        tagline: activity.tagline,
        icon: activity.icon,
        heroBackground: {
          type:
            activity.heroBackgroundType === "COLOR"
              ? "color"
              : activity.heroBackgroundType === "PLAIN"
                ? "plain"
                : "image",
          image: activity.heroImage,
          color: activity.heroBackgroundColor ?? "#0f2b1e",
          overlay: {
            enabled: activity.heroOverlayEnabled,
            color: activity.heroOverlayColor,
            opacity: activity.heroOverlayOpacity,
          },
        },
        overview: activity.overview,
        duration: activity.duration,
        difficulty: activity.difficulty,
        guidelines: activity.guidelines.map((g) => ({ icon: g.icon, title: g.title, body: g.body })),
        equipmentProvided: activity.equipmentProvided,
        permitNote: activity.permitNote,
        destinationSlugs: activity.destinationSlugs,
        relatedActivitySlugs: activity.relatedActivitySlugs,
        guideBody: activity.guideBody,
        guideBullets: activity.guideBullets,
        galleryImages: activity.galleryImages,
        galleryTitles: activity.galleryTitles,
      }}
      originalSlug={activity.slug}
      status={activity.status}
    />
  );
}
