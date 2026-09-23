"use client";

import { useMemo, useRef, useState } from "react";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { regions } from "@/lib/data/destinations";
import type { Destination } from "@/lib/types";
import { DecorativeLeaf } from "../ui/DecorativeLeaf";
import { GridReveal } from "@/components/ui/GridReveal";

const PAGE_SIZE = 6;

/** Page numbers to render, with `null` standing in for an ellipsis. Always shows first, last and the current page's neighbours. */
function getPageItems(current: number, total: number): Array<number | null> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items: Array<number | null> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(null);
    items.push(p);
  });
  return items;
}

export function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [region, setRegion] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLElement | null>(null);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  // A new filter or search starts from the first page.
  const handleRegionChange = (value: string) => {
    setRegion(value);
    setPage(1);
  };
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    if (clamped === currentPage) return;
    setPage(clamped);
    // Bring the top of the grid back into view so the new page starts from its first card.
    const top = gridRef.current?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 120, behavior: "smooth" });
  };

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
              onChange={(event) => handleRegionChange(event.target.value)}
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
              onChange={(event) => handleQueryChange(event.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:outline-none font-body-md text-body-md"
              placeholder="Search destinations..."
              type="text"
            />
          </div>
        </div>
      </section>

      <section ref={gridRef} className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {filtered.length > 0 ? (
          <>
            <DecorativeLeaf className="top-4 left-4 md:top-8 md:left-8" rotate={-60} size={110} opacity={0.22} />

            <p className="mb-4 text-caption text-on-surface-variant" aria-live="polite">
              Showing {rangeStart}–{rangeEnd} of {filtered.length} destinations
            </p>

            <GridReveal
              key={currentPage}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
              columns={{ base: 1, sm: 2, lg: 3 }}
              y={40}
            >
              {pageItems.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </GridReveal>

            {totalPages > 1 && (
              <nav
                aria-label="Destinations pagination"
                className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-container-lowest disabled:hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                {getPageItems(currentPage, totalPages).map((item, index) =>
                  item === null ? (
                    <span key={`gap-${index}`} className="px-1 text-on-surface-variant" aria-hidden="true">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      aria-label={`Page ${item}`}
                      aria-current={item === currentPage ? "page" : undefined}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-label-md text-label-md transition-colors ${
                        item === currentPage
                          ? "bg-primary text-white"
                          : "border border-outline-variant bg-surface-container-lowest text-primary hover:bg-primary/10"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-container-lowest disabled:hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </nav>
            )}

            <DecorativeLeaf className="bottom-6 right-4 md:bottom-10 md:right-14" rotate={110} flip size={110} opacity={0.22} delay={6} />
          </>
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
