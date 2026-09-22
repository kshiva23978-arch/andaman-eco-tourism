import { LeafletMap } from "@/components/destinations/LeafletMap";

/**
 * Full-bleed "discover" map section: a large map on one side and a short
 * intro + directions link on the other, on a warm parchment backdrop.
 */
export function DestinationMapSection({
  title,
  overview,
}: {
  title: string;
  overview: string;
}) {
  const query = `${title}, Andaman and Nicobar Islands, India`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section className="relative overflow-hidden bg-[#f6efe0] py-16 lg:py-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(138,109,59,0.18)_1px,transparent_1px)] [background-size:14px_14px]"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_380px]">
        <div className="relative mx-margin-mobile h-[320px] overflow-hidden rounded-2xl sm:h-[420px] md:mx-margin-desktop lg:mx-0 lg:h-[560px] lg:rounded-none">
          <LeafletMap query={query} title={title} />
        </div>

        <div className="relative flex flex-col justify-center px-margin-mobile py-10 md:px-margin-desktop lg:px-14 lg:py-0">
          <span className="mb-4 block h-px w-10 bg-[#8a6d3b]" aria-hidden="true" />
          <h2 className="font-headline-lg text-headline-lg leading-tight text-[#3c2f1e]">
            Discover
            <br />
            {title}
          </h2>
          <p className="mt-4 max-w-sm font-body-md text-body-md text-[#6b5b45] text-justify">{overview}</p>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get directions to ${title}`}
            className="group absolute -top-7 left-margin-mobile z-30 flex h-14 w-14 items-center justify-center rounded-full border border-[#8a6d3b]/30 bg-white text-[#8a6d3b] shadow-lg transition-transform hover:scale-105 md:left-margin-desktop lg:left-14 lg:top-10"
          >
            <span className="material-symbols-outlined text-[22px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              north_east
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
