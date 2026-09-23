/**
 * Map pins for every destination (slugs match destinations.generated.json).
 *
 * Sources, checked Sep 2026:
 *   - OpenStreetMap features (beach / island / peak / cave / reserve nodes) via Nominatim
 *   - Wikipedia coordinates (Cuthbert Bay WLS, Saddle Peak NP, Mount Harriet NP)
 *
 * `approx: true` marks sites OSM doesn't map yet. They're placed from documented
 * road distances and nearby mapped features, so treat them as ±1–2 km and correct
 * them from a survey or Google Maps when available.
 */

export type LabelSide = "left" | "right";

export interface DestinationPin {
  slug: string;
  /** Short map label (full titles are too long to sit on the map). */
  label: string;
  lat: number;
  lng: number;
  /** Featured pins keep their label visible at every zoom level. */
  featured?: boolean;
  /** Which side the label sits on — alternated so nearby labels don't overlap. */
  dir?: LabelSide;
  approx?: true;
}

export const DESTINATION_PINS: DestinationPin[] = [
  // ---- South Andaman ------------------------------------------------------------
  { slug: "mount-manipur-national-park", label: "Mount Manipur", lat: 11.725, lng: 92.7331, featured: true, dir: "left" },
  // Wrightmyo sits on a mangrove creek off Shoal Bay, north of Port Blair.
  { slug: "wright-myo-creek", label: "Wright Myo Creek", lat: 11.78, lng: 92.71, dir: "right", approx: true },
  { slug: "munda-pahad-beach", label: "Munda Pahad Beach", lat: 11.4913, lng: 92.7089, dir: "right" },
  { slug: "biological-park-chidiyatapu", label: "Biological Park", lat: 11.503, lng: 92.7022, dir: "left" },
  { slug: "cinque-island", label: "Cinque Island", lat: 11.2659, lng: 92.7005, dir: "right" },
  // The data lists "Long Island", but its range (MGMNP, Haddo) and the well-known
  // Jahaji Beach are on Rutland Island — pinned there.
  { slug: "jahaji-beach", label: "Jahaji Beach", lat: 11.4316, lng: 92.6518, dir: "left", approx: true },
  { slug: "jolly-buoy-island", label: "Jolly Buoy", lat: 11.51, lng: 92.605, featured: true, dir: "right", approx: true },
  { slug: "red-skin-island", label: "Red Skin Island", lat: 11.5554, lng: 92.5924, dir: "left" },
  { slug: "loha-barrack-crocodile-wildlife-sanctuary", label: "Loha Barrack Sanctuary", lat: 11.629, lng: 92.6109, dir: "left" },

  // ---- Baratang -----------------------------------------------------------------
  { slug: "limestone-caves-baratang", label: "Limestone Caves", lat: 12.0931, lng: 92.745, featured: true, dir: "left" },
  { slug: "mud-volcano-baratang", label: "Mud Volcano (Baratang)", lat: 12.072, lng: 92.756, dir: "left", approx: true },
  { slug: "parrot-island", label: "Parrot Island", lat: 12.1812, lng: 92.7203, dir: "left" },
  { slug: "baludera-beach-baratang", label: "Baludera Beach", lat: 12.13, lng: 92.835, dir: "right", approx: true },
  { slug: "uttara-jetty", label: "Uttara Jetty", lat: 12.3126, lng: 92.7874, dir: "left" },

  // ---- Middle Andaman (Rangat, Long Island) ---------------------------------------
  // Aamkunj (~8 km), Morice Dera (~11 km) and Dhani Nallah lie in that order north of
  // Rangat along the ATR.
  { slug: "yerrata-mangrove-walkway", label: "Yerrata Mangrove Walk", lat: 12.525, lng: 92.945, dir: "right", approx: true },
  { slug: "aamkunj-beach", label: "Aamkunj Beach", lat: 12.555, lng: 92.95, dir: "left", approx: true },
  { slug: "morice-dera-beach", label: "Morice Dera Beach", lat: 12.585, lng: 92.96, dir: "right", approx: true },
  { slug: "dhaninallah-mangrove-nature-walk-beach", label: "Dhaninallah Beach", lat: 12.6197, lng: 92.9582, dir: "left" },
  { slug: "cuthbert-bay-beach-wildlife-sanctuary", label: "Cuthbert Bay", lat: 12.7092, lng: 92.9683, featured: true, dir: "right" },
  { slug: "lalaji-bay-beach", label: "Lalaji Bay Beach", lat: 12.413, lng: 92.95, dir: "right", approx: true },
  { slug: "merk-bay-beach", label: "Merk Bay Beach", lat: 12.2706, lng: 92.9266, dir: "right", approx: true },

  // ---- Mayabunder -----------------------------------------------------------------
  { slug: "karmatang-beach", label: "Karmatang Beach", lat: 12.83, lng: 92.93, dir: "right", approx: true },
  { slug: "baludera-beach-mayabunder", label: "Baludera Beach", lat: 12.87, lng: 92.915, dir: "left", approx: true },
  { slug: "austin-creek-sunset-point", label: "Austin Creek Sunset Point", lat: 12.965, lng: 92.875, dir: "left", approx: true },
  { slug: "aves-island", label: "Aves Island", lat: 12.925, lng: 92.955, dir: "right", approx: true },
  { slug: "sound-island", label: "Sound Island", lat: 12.9654, lng: 92.9704, dir: "right" },

  // ---- Diglipur (North Andaman) -----------------------------------------------------
  { slug: "saddle-peak-national-park", label: "Saddle Peak", lat: 13.1586, lng: 93.0056, featured: true, dir: "left" },
  { slug: "lamiya-bay-beach", label: "Lamiya Bay Beach", lat: 13.2, lng: 93.05, dir: "right", approx: true },
  { slug: "kalipur-beach", label: "Kalipur Beach", lat: 13.2239, lng: 93.0448, dir: "right" },
  { slug: "ross-and-smith-islands", label: "Ross & Smith", lat: 13.3429, lng: 93.0611, featured: true, dir: "right" },
  { slug: "ram-nagar-beach", label: "Ram Nagar Beach", lat: 13.0762, lng: 93.0266, dir: "right" },
  { slug: "mud-volcanoes-of-shyamnagar", label: "Mud Volcanoes", lat: 13.4149, lng: 92.893, featured: true, dir: "left" },

  // ---- Swaraj Dweep (Havelock) -------------------------------------------------------
  // Elephanta and Radhanagar are ~3 km apart, so only Radhanagar is labelled at the default zoom.
  { slug: "elephanta-beach", label: "Elephanta Beach", lat: 12.0101, lng: 92.948, dir: "left" },
  { slug: "radhanagar-beach", label: "Radhanagar Beach", lat: 11.9827, lng: 92.9571, featured: true, dir: "right" },
  { slug: "govind-nagar-no-3-beach", label: "Govind Nagar Beach", lat: 12.03, lng: 93.001, dir: "right", approx: true },
  { slug: "kalapathar-beach-havelock", label: "Kalapathar (Havelock)", lat: 11.9762, lng: 93.0189, dir: "right" },

  // ---- Shaheed Dweep (Neil) --------------------------------------------------------
  { slug: "laxmanpur-beach", label: "Laxmanpur Beach", lat: 11.8479, lng: 93.0127, dir: "left" },
  { slug: "bharatpur-beach", label: "Bharatpur Beach", lat: 11.8379, lng: 93.0296, dir: "right" },
  { slug: "sitapur-beach", label: "Sitapur Beach", lat: 11.819, lng: 93.0628, dir: "right" },

  // ---- Little Andaman -------------------------------------------------------------
  // Butler Bay is ~14 km north of Hut Bay along the east coast.
  { slug: "butler-bay-beach", label: "Butler Bay Beach", lat: 10.7, lng: 92.56, dir: "right", approx: true },
  { slug: "kalapathar-beach-little-andaman", label: "Kalapathar (Little Andaman)", lat: 10.6583, lng: 92.5817, featured: true, dir: "right" },
  { slug: "white-surf-waterfall", label: "White Surf Waterfall", lat: 10.6164, lng: 92.5285, dir: "left" },
];
