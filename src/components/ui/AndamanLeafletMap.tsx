"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, Marker, Tooltip, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DestinationPin } from "@/lib/data/destination-pins";

const INITIAL_ZOOM = 8;
// From this zoom every label stays visible; below it only featured pins are labelled
// (the rest show theirs on hover) so clustered sites like Rangat don't pile up.
const ALL_LABELS_ZOOM = 11;

function ZoomTracker({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({ zoomend: (e) => onZoom(e.target.getZoom()) });
  return null;
}

// Andaman & Nicobar archipelago roughly spans 6°N–14°N; center on the main islands.
const CENTER: [number, number] = [12.2, 92.85];

// Keeps panning/zooming confined to the archipelago itself, rather than
// letting the map zoom out to the mainland or the wider Bay of Bengal.
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [5.5, 91.0],
  [15.0, 95.0],
];
const MIN_ZOOM = 7;

const makePinIcon = (size: number) =>
  L.divIcon({
    className: "",
    html: `<span style="
      display:block;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:#e8734a;
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });

// Featured destinations get the larger pin.
const featuredPinIcon = makePinIcon(16);
const pinIcon = makePinIcon(12);

export function AndamanLeafletMap({
  heightClass,
  pins,
}: {
  heightClass: string;
  pins: DestinationPin[];
}) {
  const router = useRouter();
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const showAllLabels = zoom >= ALL_LABELS_ZOOM;

  return (
    <div
      className={`relative z-0 isolate w-full overflow-hidden ${heightClass}`}
      style={{
        maskImage: "radial-gradient(ellipse 90% 90% at center, black 70%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 90% at center, black 70%, transparent 100%)",
      }}
    >
      <MapContainer
        center={CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={MIN_ZOOM}
        maxBounds={MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomTracker onZoom={setZoom} />
        {pins.map((spot, index) => {
          const slug = spot.slug;
          const open = slug ? () => router.push(`/destinations/${slug}`) : undefined;
          const permanent = Boolean(spot.featured) || showAllLabels;
          const dir = spot.dir ?? "right";
          return (
            <Marker
              key={`${spot.slug ?? spot.label}-${index}`}
              position={[spot.lat, spot.lng]}
              icon={spot.featured ? featuredPinIcon : pinIcon}
              title={open ? `View ${spot.label}` : spot.label}
              eventHandlers={open ? { click: open } : {}}
              zIndexOffset={spot.featured ? 1000 : 0}
            >
              {/* Tooltips ignore the mouse by default; `interactive` makes the label clickable too.
                  Leaflet reads `permanent` only on creation, so the key remounts it when it flips. */}
              <Tooltip
                key={permanent ? "permanent" : "hover"}
                direction={dir}
                offset={dir === "right" ? [14, 0] : [-14, 0]}
                permanent={permanent}
                interactive={Boolean(open)}
                opacity={0.95}
                className="andaman-map-tooltip"
                eventHandlers={open ? { click: open } : {}}
              >
                {spot.label}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
      {/* OSM's tile licence requires visible attribution. Leaflet's own control sits in a
          corner, which the radial mask fades out, so credit sits bottom-centre instead. */}
      <p className="pointer-events-none absolute inset-x-0 bottom-1 z-[1000] text-center text-[10px] text-on-surface/70">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto underline"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </p>
    </div>
  );
}
