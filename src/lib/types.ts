export type Region =
  | "South Andaman"
  | "Diglipur"
  | "Mayabunder"
  | "Middle Andaman"
  | "Baratang"
  | "Little Andaman"
  | "Swaraj Dweep";

export interface Destination {
  slug: string;
  title: string;
  subtitle: string;
  region: Region;
  rangeDivision: string;
  overview: string;
  accessibility: {
    road: string;
    ship: string;
  };
  bestTime: string;
  timing: string;
  permits: string;
  fees: string;
  activities: string[];
  facility: string[];
  accommodation: string;
  hospital: string;
  nearbyPlaces: string[];
  conservationNotes: string;
  ecoGuidelines: string[];
  safetyTips: string[];
  whatToSee: string[];
  image: string;
  galleryImages?: string[];
}

export interface ActivityEquipmentGroup {
  label: string;
  items: string[];
}

export interface ActivityGuideline {
  icon: string;
  title: string;
  body: string;
}

export interface Activity {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  heroImage: string;
  overview: string[];
  duration: string;
  difficulty: string;
  guidelines: ActivityGuideline[];
  equipmentProvided: string[];
  permitNote: string;
  destinationSlugs: string[];
  relatedActivitySlugs: string[];
  guideBody: string;
  guideCallout?: string;
  guideBullets?: string[];
  galleryImages?: string[];
}
