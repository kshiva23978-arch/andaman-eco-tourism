"use client";

import { useState } from "react";
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
  const [saved, setSaved] = useState(false);

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
      className="group relative flex flex-col overflow-hidden rounded-3xl shadow-lg transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/[0.35] to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Top row: region pill + save toggle */}
          <div className="flex items-center justify-between">
            <span className="glass-panel-soft rounded-full px-4 py-1.5 font-label-md text-[11px] uppercase tracking-widest text-white">
              {destination.region}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setSaved((prev) => !prev);
              }}
              aria-label={saved ? "Remove from saved destinations" : "Save destination"}
              aria-pressed={saved}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full glass-panel-soft text-white transition-colors hover:bg-white/25"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings: `'FILL' ${saved ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24`,
                }}
              >
                favorite
              </span>
            </button>
          </div>

          {/* Bottom stack: tags, title, footer bar */}
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full glass-panel px-3 py-1 font-label-md text-[10px] text-white">
                <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                {firstClause(destination.bestTime, 26)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full glass-panel px-3 py-1 font-label-md text-[10px] text-white">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {destination.subtitle}
              </span>
            </div>

            <h3 className="mb-3 font-headline-md text-lg leading-snug text-white drop-shadow-sm line-clamp-2 sm:text-xl">
              {destination.title}
            </h3>

            <div className="-mx-4 -mb-4 flex items-center justify-between glass-panel px-4 py-3">
              <div className="min-w-0">
                <p className="font-label-md text-[10px] uppercase tracking-widest text-white/60">
                  Entry Fee
                </p>
                <p className="truncate font-label-md text-[12px] text-white/90">
                  {firstClause(destination.fees, 28)}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 font-label-md text-[12px] text-primary transition-transform duration-300 group-hover:translate-x-0.5">
                View
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
