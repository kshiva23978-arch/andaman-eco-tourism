"use client";

import { useRouter } from "next/navigation";
import { MapContainer, Marker, Tooltip, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LeaderDirection = "left" | "right";

export interface MapHotspot {
  slug: string;
  label: string;
  lat: number;
  lng: number;
  /** Which side the label leader-lines out to — alternated so labels for
   * nearby markers (e.g. Saddle Peak / Ross & Smith) don't overlap. */
  dir: LeaderDirection;
}

// Approximate coordinates for each featured destination.
export const ANDAMAN_HOTSPOTS: MapHotspot[] = [
  { slug: "saddle-peak-national-park", label: "Saddle Peak", lat: 13.2003, lng: 93.0397, dir: "left" },
  { slug: "ross-and-smith-islands", label: "Ross & Smith", lat: 13.2694, lng: 93.05, dir: "right" },
  { slug: "limestone-caves-baratang", label: "Limestone Caves", lat: 12.1167, lng: 92.7667, dir: "left" },
  { slug: "cuthbert-bay-beach-wildlife-sanctuary", label: "Cuthbert Bay", lat: 12.7039, lng: 92.9589, dir: "right" },
  { slug: "mud-volcanoes-of-shyamnagar", label: "Mud Volcanoes", lat: 13.15, lng: 93.02, dir: "right" },
  { slug: "elephanta-beach", label: "Elephanta Beach", lat: 12.0167, lng: 92.9833, dir: "right" },
  { slug: "radhanagar-beach", label: "Radhanagar Beach", lat: 11.9721, lng: 92.9515, dir: "left" },
  { slug: "mount-manipur-national-park", label: "Mount Manipur", lat: 11.6725, lng: 92.6928, dir: "left" },
  { slug: "jolly-buoy-island", label: "Jolly Buoy", lat: 11.5333, lng: 92.6167, dir: "right" },
  { slug: "kalapathar-beach-little-andaman", label: "Kalapathar Beach Little Andaman", lat: 10.6167, lng: 92.5333, dir: "right" },
];

// Andaman & Nicobar archipelago roughly spans 6°N–14°N; center on the main islands.
const CENTER: [number, number] = [12.2, 92.85];

// Keeps panning/zooming confined to the archipelago itself, rather than
// letting the map zoom out to the mainland or the wider Bay of Bengal.
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [5.5, 91.0],
  [15.0, 95.0],
];
const MIN_ZOOM = 7;

const pinIcon = L.divIcon({
  className: "",
  html: `<span style="
    display:block;
    width:16px;height:16px;
    border-radius:50%;
    background:#e8734a;
    border:2px solid #fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.35);
  "></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

export function AndamanLeafletMap({ heightClass }: { heightClass: string }) {
  const router = useRouter();

  return (
    <div
      className={`relative z-0 isolate w-full overflow-hidden ${heightClass}`}
      style={{
        maskImage: "radial-gradient(ellipse 75% 75% at center, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 75% at center, black 30%, transparent 100%)",
      }}
    >
      <MapContainer
        center={CENTER}
        zoom={8}
        minZoom={MIN_ZOOM}
        maxBounds={MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {ANDAMAN_HOTSPOTS.map((spot) => (
          <Marker
            key={spot.slug}
            position={[spot.lat, spot.lng]}
            icon={pinIcon}
            eventHandlers={{
              click: () => router.push(`/destinations/${spot.slug}`),
            }}
          >
            <Tooltip
              direction={spot.dir}
              offset={spot.dir === "right" ? [14, 0] : [-14, 0]}
              permanent
              opacity={0.95}
              className="andaman-map-tooltip"
            >
              {spot.label}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
