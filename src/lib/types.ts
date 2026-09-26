/** Region name; the list of regions is managed in the admin (destinations page content). */
export type Region = string;

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
  /** CSS object-position for the hero photo; only needed when the default
   * center crop of a portrait source lands on an illegible patch. */
  heroImagePosition?: string;
  galleryImages?: string[];
  /** Caption per gallery image, index-aligned with `galleryImages`. */
  galleryTitles?: string[];
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
  /** Caption per gallery image, index-aligned with `galleryImages`. */
  galleryTitles?: string[];
  /** Hero banner styling set in the admin; absent means the default photo hero. */
  heroBackground?: HeroBackground;
}

export interface HeroBackground {
  type: "image" | "color" | "plain";
  color: string;
  overlay: { enabled: boolean; color: string; opacity: number };
}
