import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { firstClause } from "@/lib/format";
import type { Destination } from "@/lib/types";

export function DestinationCard({
  destination,
  variant = "grid",
}: {
  destination: Destination;
  variant?: "grid" | "carousel";
}) {
  const href = `/destinations/${destination.slug}`;

  if (variant === "carousel") {
    return (
      <Link
        href={href}
        className="min-w-[300px] md:min-w-[400px] snap-start bg-white border border-outline-variant rounded-xl overflow-hidden hover:border-primary transition-colors flex flex-col"
      >
        <div className="h-56 overflow-hidden relative">
          <Image
            src={destination.image}
            alt={destination.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(min-width: 768px) 400px, 300px"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4 gap-2">
            <h3 className="font-headline-md text-xl md:text-headline-md text-on-surface">
              {destination.title}
            </h3>
            <Chip variant="primary">{destination.region}</Chip>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-3">
            {destination.overview}
          </p>
          <div className="mt-6 flex items-center justify-center md:justify-start text-primary font-label-md text-label-md">
            Learn More
            <span className="material-symbols-outlined ml-1 text-sm">
              chevron_right
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="bg-surface-container-lowest border border-outline-variant overflow-hidden flex flex-col group hover:border-primary transition-colors"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <Image
          src={destination.image}
          alt={destination.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-headline-md text-headline-md text-primary">
            {destination.title}
          </h3>
        </div>
        <p className="font-caption text-caption text-on-surface-variant mb-3">
          {destination.subtitle} · {destination.region}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">
          {destination.overview}
        </p>
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-2 text-on-secondary-container bg-secondary-container px-3 py-2 rounded">
            <span className="material-symbols-outlined text-[18px]">
              calendar_month
            </span>
            <span className="font-label-md text-label-md">
              Best time: {firstClause(destination.bestTime)}
            </span>
          </div>
          <span className="block w-full py-3 text-center border border-primary text-primary font-label-md text-label-md rounded group-hover:bg-primary group-hover:text-on-primary transition-all">
            VIEW DETAILS
          </span>
        </div>
      </div>
    </Link>
  );
}
