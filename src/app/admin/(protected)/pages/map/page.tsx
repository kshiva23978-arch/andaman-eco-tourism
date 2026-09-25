import { prisma } from "@/lib/prisma";
import { MapPageClient } from "./MapPageClient";

export default async function AdminMapPage() {
  const [pins, destinations] = await Promise.all([
    prisma.mapPin.findMany({ orderBy: { order: "asc" } }),
    prisma.destination.findMany({ select: { slug: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  const initialPins = pins.map((p) => ({
    id: p.id,
    label: p.label,
    lat: p.lat,
    lng: p.lng,
    featured: p.featured,
    dir: p.dir,
    approx: p.approx,
    destinationSlug: p.destinationSlug ?? "",
  }));

  return <MapPageClient initialPins={initialPins} destinationOptions={destinations} />;
}
