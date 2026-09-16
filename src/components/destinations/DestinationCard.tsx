import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { firstClause } from "@/lib/format";
import type { Destination } from "@/lib/types";

export function DestinationCard({
  destination,
  variant = "grid",
  isActive = false,
  onExpand,
}: {
  destination: Destination;
  variant?: "grid" | "carousel";
  isActive?: boolean;
  onExpand?: () => void;
}) {
  const href = `/destinations/${destination.slug}`;

  if (variant === "carousel") {
    return (
      <Link
        href={href}
        onClick={(event) => {
          if (!isActive && onExpand) {
            event.preventDefault();
            onExpand();
          }
        }}
        className={`group relative h-[380px] shrink-0 snap-center overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ease-out md:h-[420px] ${
          isActive
            ? "w-[300px] md:w-[380px]"
            : "w-[220px] opacity-80 md:w-[260px]"
        }`}
      >
        <Image
          src={destination.image}
          alt={destination.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(min-width: 768px) 400px, 300px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col">
          <div className="p-5 pb-3">
            <Chip variant="primary" className="mb-2">
              {destination.region}
            </Chip>
            <h3 className="font-headline-md text-xl text-white">
              {destination.title}
            </h3>
            <p
              className={`font-body-md text-body-sm text-justify text-white/85 overflow-hidden transition-all duration-500 ease-out ${
                isActive ? "mt-2 max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {destination.overview}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/20 px-5 py-3">
            <span className="font-label-md text-label-md text-white">
              Know More
            </span>
            <span className="material-symbols-outlined text-[18px] text-white transition-transform duration-300 group-hover:translate-x-1">
              arrow_forward
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
