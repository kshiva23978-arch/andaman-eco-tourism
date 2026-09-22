"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const FALLBACK_CENTER: [number, number] = [11.6234, 92.7265]; // Port Blair, Andaman

const PIN_ICON_HTML = `
  <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0z" fill="#8a6d3b"/>
    <circle cx="17" cy="17" r="7" fill="#f4ecd8"/>
  </svg>
`;

export function LeafletMap({
  query,
  title,
  className = "",
}: {
  query: string;
  title: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !container) return;

      map = L.map(container, {
        center: FALLBACK_CENTER,
        zoom: 12,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: PIN_ICON_HTML,
        className: "",
        iconSize: [34, 44],
        iconAnchor: [17, 44],
      });

      const marker = L.marker(FALLBACK_CENTER, { icon }).addTo(map);
      marker.bindPopup(title);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
        );
        const results = (await res.json()) as { lat: string; lon: string }[];
        const first = results[0];
        if (!cancelled && first && map) {
          const center: [number, number] = [parseFloat(first.lat), parseFloat(first.lon)];
          map.setView(center, 13);
          marker.setLatLng(center);
        }
      } catch {
        // keep the fallback center/marker if geocoding fails
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [query, title]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Map showing ${title}`}
      className={`h-full w-full sepia-[.35] saturate-150 contrast-[1.05] brightness-95 ${className}`}
    />
  );
}
