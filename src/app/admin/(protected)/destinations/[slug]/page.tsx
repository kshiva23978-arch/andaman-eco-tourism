import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DestinationEditorClient } from "./DestinationEditorClient";

export default async function DestinationEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === "new";

  if (isNew) {
    return <DestinationEditorClient initialData={null} originalSlug={null} status={null} />;
  }

  const destination = await prisma.destination.findUnique({ where: { slug } });
  if (!destination) notFound();

  return (
    <DestinationEditorClient
      initialData={{
        slug: destination.slug,
        title: destination.title,
        subtitle: destination.subtitle,
        region: destination.region,
        rangeDivision: destination.rangeDivision,
        overview: destination.overview,
        accessRoad: destination.accessRoad,
        accessShip: destination.accessShip,
        bestTime: destination.bestTime,
        timing: destination.timing,
        permits: destination.permits,
        fees: destination.fees,
        activities: destination.activities,
        facility: destination.facility,
        accommodation: destination.accommodation,
        hospital: destination.hospital,
        nearbyPlaces: destination.nearbyPlaces,
        conservationNotes: destination.conservationNotes,
        ecoGuidelines: destination.ecoGuidelines,
        safetyTips: destination.safetyTips,
        whatToSee: destination.whatToSee,
        image: destination.image,
        heroImagePosition: destination.heroImagePosition ?? "",
        galleryImages: destination.galleryImages,
      }}
      originalSlug={destination.slug}
      status={destination.status}
    />
  );
}
