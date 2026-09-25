"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, PrimaryButton, IconButton, inputClass } from "@/components/admin/AdminUI";
import { savePinsAction, type MapPinInput } from "@/app/admin/(protected)/pages/map/actions";

type LabelSide = "LEFT" | "RIGHT";

export type PinRow = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  featured: boolean;
  dir: LabelSide;
  approx: boolean;
  destinationSlug: string;
};

type Pin = PinRow;

const CENTER: [number, number] = [12.2, 92.85];
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [5.5, 91.0],
  [15.0, 95.0],
];
const MIN_ZOOM = 7;
const INITIAL_ZOOM = 8;

let nextId = 1;

const makePinIcon = (color: string, size: number, ring: boolean) =>
  L.divIcon({
    className: "",
    html: `<span style="
      display:block;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.35)${ring ? ", 0 0 0 4px rgba(46,139,130,0.45)" : ""};
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

function ClickCapture({ active, onPick }: { active: boolean; onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function AdminMapPinEditor({
  initialPins,
  destinationOptions,
}: {
  initialPins: PinRow[];
  destinationOptions: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [pins, setPins] = useState<Pin[]>(initialPins);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const mapRef = useRef<LeafletMap | null>(null);

  function updatePin(id: string, patch: Partial<Pin>) {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePin(id: string) {
    setPins((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function addPinAt(lat: number, lng: number) {
    const id = `new-pin-${nextId++}`;
    setPins((prev) => [
      ...prev,
      { id, destinationSlug: "", label: "New pin", lat, lng, dir: "RIGHT", featured: false, approx: false },
    ]);
    setSelectedId(id);
    setAddMode(false);
  }

  function selectAndFly(pin: Pin) {
    setSelectedId(pin.id);
    mapRef.current?.flyTo([pin.lat, pin.lng], Math.max(mapRef.current.getZoom(), 10), {
      duration: 0.6,
    });
  }

  function save() {
    setError(null);
    const payload: MapPinInput[] = pins.map((p) => ({
      label: p.label,
      lat: p.lat,
      lng: p.lng,
      featured: p.featured,
      dir: p.dir,
      approx: p.approx,
      destinationSlug: p.destinationSlug || null,
    }));
    startTransition(async () => {
      try {
        await savePinsAction(payload);
        setSavedAt(new Date().toLocaleTimeString());
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save the map pins.");
      }
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddMode((v) => !v)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
              addMode
                ? "border-secondary bg-secondary-container text-on-secondary-container"
                : "border-black/15 bg-white text-on-surface hover:bg-black/5"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            {addMode ? "Click the map to place a pin…" : "Add pin"}
          </button>
          <span className="text-xs text-on-surface-variant">{pins.length} pins</span>
        </div>
        <PrimaryButton icon="save" onClick={save}>
          {isPending ? "Saving…" : "Save changes"}
        </PrimaryButton>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-container px-4 py-2.5 text-sm font-medium text-on-error-container">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {savedAt && !error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2.5 text-sm font-medium text-on-secondary-container">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Saved to the database at {savedAt}.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="flex max-h-[640px] flex-col overflow-hidden">
          <div className="border-b border-black/10 p-3">
            <p className="text-xs font-semibold uppercase text-on-surface-variant">
              Pins &amp; labels
            </p>
          </div>
          <div className="flex-1 divide-y divide-black/5 overflow-y-auto">
            {pins.map((pin) => (
              <div
                key={pin.id}
                onClick={() => selectAndFly(pin)}
                className={`cursor-pointer p-3 transition-colors ${
                  selectedId === pin.id ? "bg-secondary-container/40" : "hover:bg-black/[0.02]"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <input
                    className={`${inputClass} py-1.5 text-sm`}
                    value={pin.label}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updatePin(pin.id, { label: e.target.value })}
                    placeholder="Map label"
                  />
                  <div onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      icon="delete"
                      title="Remove pin"
                      tone="danger"
                      onClick={() => removePin(pin.id)}
                    />
                  </div>
                </div>
                <input
                  className={`${inputClass} mb-2 py-1.5 text-xs`}
                  list="admin-map-destination-slugs"
                  value={pin.destinationSlug}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updatePin(pin.id, { destinationSlug: e.target.value })}
                  placeholder="Linked destination slug"
                />
                <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                  <label
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5"
                      checked={pin.featured}
                      onChange={(e) => updatePin(pin.id, { featured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <label
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5"
                      checked={pin.approx}
                      onChange={(e) => updatePin(pin.id, { approx: e.target.checked })}
                    />
                    Approx. location
                  </label>
                  <select
                    className="rounded-md border border-black/15 bg-white px-1.5 py-0.5"
                    value={pin.dir}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updatePin(pin.id, { dir: e.target.value as LabelSide })}
                  >
                    <option value="LEFT">Label: left</option>
                    <option value="RIGHT">Label: right</option>
                  </select>
                  <span className="ml-auto font-mono">
                    {pin.lat.toFixed(3)}, {pin.lng.toFixed(3)}
                  </span>
                </div>
              </div>
            ))}
            {pins.length === 0 && (
              <p className="p-6 text-center text-sm text-on-surface-variant">
                No pins yet — click &quot;Add pin&quot; and place one on the map.
              </p>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div
            className={`relative h-[500px] w-full lg:h-[640px] ${addMode ? "cursor-crosshair" : ""}`}
          >
            <MapContainer
              ref={mapRef}
              center={CENTER}
              zoom={INITIAL_ZOOM}
              minZoom={MIN_ZOOM}
              maxBounds={MAX_BOUNDS}
              maxBoundsViscosity={1.0}
              scrollWheelZoom
              attributionControl={false}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickCapture active={addMode} onPick={addPinAt} />
              {pins.map((pin) => (
                <Marker
                  key={pin.id}
                  position={[pin.lat, pin.lng]}
                  draggable
                  icon={makePinIcon(
                    pin.featured ? "#e8734a" : "#2e8b82",
                    pin.featured ? 16 : 12,
                    selectedId === pin.id
                  )}
                  eventHandlers={{
                    click: () => setSelectedId(pin.id),
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      updatePin(pin.id, { lat, lng });
                    },
                  }}
                />
              ))}
            </MapContainer>
            {addMode && (
              <div className="pointer-events-none absolute inset-x-0 top-3 z-[1000] flex justify-center">
                <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow">
                  Click anywhere on the map to drop a new pin
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <datalist id="admin-map-destination-slugs">
        {destinationOptions.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.title}
          </option>
        ))}
      </datalist>

      <p className="mt-3 text-xs text-on-surface-variant">
        Drag any marker to reposition it — its coordinates update automatically. Click a marker
        or a row to select it.
      </p>
    </div>
  );
}
