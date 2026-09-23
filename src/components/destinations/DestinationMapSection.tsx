"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faLeaf,
  faLocationDot,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleMap } from "@/components/destinations/GoogleMap";
import { RevealSide } from "@/components/ui/RevealSide";

/**
 * Full-bleed "discover" map section: an interactive map on one side and a
 * short intro + quick actions on the other, on a forest-green backdrop.
 * The two panels slide in from opposite sides as the section scrolls in.
 */
export function DestinationMapSection({
  title,
  overview,
}: {
  title: string;
  overview: string;
}) {
  const query = `${title}, Andaman and Nicobar Islands, India`;
  const viewMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  return (
    <section className="relative overflow-hidden bg-[var(--forest-deep)] py-16 lg:py-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-repeat opacity-50 mix-blend-soft-light"
        style={{ backgroundImage: "url('/images/bg/footprint-bg.jpg')", backgroundSize: "600px" }}
      />
      <RevealSide as="div" className="relative grid grid-cols-1 lg:grid-cols-12" x={64}>
        {/* Map */}
        <div className="group relative mx-margin-mobile my-6 h-[320px] overflow-hidden rounded-[28px] shadow-[0_32px_64px_-24px_rgba(15,43,30,0.35)] sm:h-[420px] md:mx-margin-desktop lg:col-span-8 lg:my-10 lg:ml-margin-desktop lg:mr-0 lg:h-[560px]">
          <GoogleMap query={query} title={title} />

          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-2 group-hover:ring-[var(--lagoon)]/50" />

          {/* Big custom pin, centered over the map's marker */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center">
            <span className="pin-pulse relative inline-flex">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-[52px] drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
                style={{ color: "var(--coral)" }}
              />
            </span>
            <span className="-mt-1 whitespace-nowrap rounded-full bg-[var(--forest-deep)] px-3 py-1 text-[11.5px] font-semibold text-white shadow-lg">
              {title}
            </span>
          </div>

          <a
            href={viewMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in Google Maps"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--forest-mid)] shadow-lg transition-transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[14px]" />
          </a>
        </div>

        {/* Info panel */}
        <div className="relative flex flex-col justify-center px-margin-mobile py-12 md:px-margin-desktop lg:col-span-4 lg:px-14 lg:py-0">
          <span className="relative mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--lagoon-light)]">
            <FontAwesomeIcon icon={faLeaf} className="text-[12px]" />
            Discover
          </span>

          <h2
            className="relative text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight text-[var(--sand)] font-semibold"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            {title}
          </h2>
          <p className="relative mt-4 max-w-sm font-body-md text-body-md text-white/75 text-justify">{overview}</p>

          <div className="relative mt-7 flex flex-wrap gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-3 text-[13.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--forest-mid)] hover:shadow-lg"
            >
              <FontAwesomeIcon
                icon={faRoute}
                className="text-[13px] transition-transform group-hover:translate-x-0.5"
              />
              Get Directions
            </a>
            <a
              href={viewMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[13.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
            >
              View Larger Map
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="text-[12px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </RevealSide>
    </section>
  );
}
