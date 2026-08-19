"use client";

import { useMemo, useState } from "react";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { regions } from "@/lib/data/destinations";
import type { Destination } from "@/lib/types";

export function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [region, setRegion] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesRegion = region === "All" || d.region === region;
      const matchesQuery =
        q.length === 0 ||
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.overview.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
  }, [destinations, region, query]);

  return (
    <>
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <div className="flex flex-wrap items-center justify-between gap-gutter bg-surface-container-low p-6 rounded border border-outline-variant">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-label-md text-label-md text-on-surface-variant">
              FILTER BY REGION:
            </span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="px-4 py-2 border border-primary text-primary font-label-md text-label-md rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:outline-none font-body-md text-body-md"
              placeholder="Search destinations..."
              type="text"
            />
          </div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filtered.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant font-body-md text-body-md py-12 text-center">
            No destinations match your filters. Try a different region or
            search term.
          </p>
        )}
      </section>
    </>
  );
}
