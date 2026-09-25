import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createHash, randomBytes } from "crypto";
import { readdirSync, statSync } from "fs";
import path from "path";
import { destinations } from "../src/lib/data/destinations";
import { activities } from "../src/lib/data/activities";
import { DESTINATION_PINS } from "../src/lib/data/destination-pins";
import { DEFAULT_ROLE_PERMISSIONS } from "../src/lib/permissions";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string) {
  const salt = randomBytes(8).toString("hex"); // 16 hex characters
  const hash = createHash("sha256").update(salt + password).digest("hex");
  return `${salt}:${hash}`;
}

type SectionSeed = {
  name: string;
  description: string;
  pages: string[];
  targetType?: "destination" | "activity";
  targetSlug?: string;
  targetTitle?: string;
  headline?: string;
  body?: string;
  backgroundType: "IMAGE" | "COLOR";
  backgroundImage?: string;
  backgroundColor?: string;
  overlayEnabled: boolean;
  overlayColor: string;
  overlayOpacity: number;
  gallery: string[];
};

const EVERY_PAGE = "Every Page";

const sectionSeeds: SectionSeed[] = [
  {
    name: "Hero banner",
    description: "Headline, subtext and background video/image on the landing page.",
    pages: ["Home"],
    backgroundType: "IMAGE",
    backgroundImage: "/images/bg/beach.jpg",
    overlayEnabled: true,
    overlayColor: "#000000",
    overlayOpacity: 45,
    gallery: [],
  },
  {
    name: "Island map pins",
    description: "42 pinned destinations shown on the interactive homepage map.",
    pages: ["Home"],
    backgroundType: "IMAGE",
    backgroundImage: "/images/bg/destination-head-bg.png",
    overlayEnabled: true,
    overlayColor: "#000000",
    overlayOpacity: 20,
    gallery: [],
  },
  {
    name: "Featured destinations carousel",
    description: "Curated set of destinations highlighted on the homepage.",
    pages: ["Home"],
    backgroundType: "IMAGE",
    backgroundImage: "/images/google-hosted/destinations/kalapathar-beach-havelock.png",
    overlayEnabled: true,
    overlayColor: "#000000",
    overlayOpacity: 30,
    gallery: [
      "/images/google-hosted/destinations/kalapathar-beach-havelock.png",
      "/images/google-hosted/destinations/red-skin-island.png",
      "/images/google-hosted/destinations/cinque-island.png",
    ],
  },
  {
    name: "Listing intro copy",
    description: "Introductory paragraph and filters shown above the destinations grid.",
    pages: ["Destinations"],
    backgroundType: "COLOR",
    backgroundColor: "#f3ecd9",
    overlayEnabled: false,
    overlayColor: "#000000",
    overlayOpacity: 0,
    gallery: [],
  },
  {
    name: "Listing intro copy",
    description: "Introductory paragraph shown above the activities grid.",
    pages: ["Activities"],
    backgroundType: "IMAGE",
    backgroundImage: "/images/bg/bg-patter-act.jpg",
    overlayEnabled: true,
    overlayColor: "#000000",
    overlayOpacity: 55,
    gallery: [],
  },
  {
    name: "Site footer",
    description: "Contact details, department links and social channels — shown on every page.",
    pages: [EVERY_PAGE],
    backgroundType: "COLOR",
    backgroundColor: "#0f2b1e",
    overlayEnabled: false,
    overlayColor: "#000000",
    overlayOpacity: 0,
    gallery: [],
  },
  {
    name: "Eco guidelines banner",
    description: "Reef-safe and conservation reminders shown across the whole site.",
    pages: [EVERY_PAGE],
    backgroundType: "IMAGE",
    backgroundImage: "/images/bg/starfish-sea.jpg",
    overlayEnabled: true,
    overlayColor: "#000000",
    overlayOpacity: 60,
    gallery: [],
  },
  {
    name: "Bioluminescence night-tour callout",
    description: "Extra promo banner shown only on this one destination's page.",
    pages: ["Destinations"],
    targetType: "destination",
    targetSlug: "radhanagar-beach",
    targetTitle: "Radhanagar Beach",
    backgroundType: "IMAGE",
    backgroundImage: "/images/bg/starfish-sea.jpg",
    overlayEnabled: true,
    overlayColor: "#000000",
    overlayOpacity: 50,
    gallery: [],
  },
];

const MEDIA_DIRS = ["public/images", "public/videos"];
const MEDIA_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".webm"]);

function listMediaFiles(rootDir: string): { publicPath: string; absPath: string }[] {
  const results: { publicPath: string; absPath: string }[] = [];
  const projectRoot = path.resolve(__dirname, "..");
  const dirAbs = path.join(projectRoot, rootDir);

  let entries: string[];
  try {
    entries = readdirSync(dirAbs, { recursive: true }) as string[];
  } catch {
    return results;
  }

  for (const entry of entries) {
    const absPath = path.join(dirAbs, entry);
    if (statSync(absPath).isDirectory()) continue;
    if (!MEDIA_EXTENSIONS.has(path.extname(entry).toLowerCase())) continue;
    const relFromPublic = path.relative(path.join(projectRoot, "public"), absPath).split(path.sep).join("/");
    results.push({ publicPath: `/${relFromPublic}`, absPath });
  }
  return results;
}

async function main() {
  const adminEmail = "admin@doef.gov.in";
  const adminPassword = "ChangeMe@2026!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashPassword(adminPassword) },
    create: {
      name: "Super Admin",
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });
  console.log(`Seeded admin user: ${adminEmail} / ${adminPassword}`);

  for (const [role, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    await prisma.rolePermission.upsert({
      where: { role: role as "SUPER_ADMIN" | "CONTENT_EDITOR" | "REVIEWER" | "VIEWER" },
      update: {},
      create: { role: role as "SUPER_ADMIN" | "CONTENT_EDITOR" | "REVIEWER" | "VIEWER", permissions },
    });
  }
  console.log(`Seeded default role permissions for ${Object.keys(DEFAULT_ROLE_PERMISSIONS).length} roles`);

  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        title: d.title,
        subtitle: d.subtitle,
        region: d.region,
        rangeDivision: d.rangeDivision,
        overview: d.overview,
        accessRoad: d.accessibility.road,
        accessShip: d.accessibility.ship,
        bestTime: d.bestTime,
        timing: d.timing,
        permits: d.permits,
        fees: d.fees,
        activities: d.activities,
        facility: d.facility,
        accommodation: d.accommodation,
        hospital: d.hospital,
        nearbyPlaces: d.nearbyPlaces,
        conservationNotes: d.conservationNotes,
        ecoGuidelines: d.ecoGuidelines,
        safetyTips: d.safetyTips,
        whatToSee: d.whatToSee,
        image: d.image,
        heroImagePosition: d.heroImagePosition,
        galleryImages: d.galleryImages ?? [],
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Seeded ${destinations.length} destinations`);

  for (const a of activities) {
    const activity = await prisma.activity.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        tagline: a.tagline,
        icon: a.icon,
        heroImage: a.heroImage,
        overview: a.overview,
        duration: a.duration,
        difficulty: a.difficulty,
        equipmentProvided: a.equipmentProvided,
        permitNote: a.permitNote,
        destinationSlugs: a.destinationSlugs,
        relatedActivitySlugs: a.relatedActivitySlugs,
        guideBody: a.guideBody,
        guideCallout: a.guideCallout,
        guideBullets: a.guideBullets ?? [],
        galleryImages: a.galleryImages ?? [],
        status: "PUBLISHED",
      },
    });

    await prisma.activityGuideline.deleteMany({ where: { activityId: activity.id } });
    for (const [i, g] of a.guidelines.entries()) {
      await prisma.activityGuideline.create({
        data: { activityId: activity.id, icon: g.icon, title: g.title, body: g.body, order: i },
      });
    }
  }
  console.log(`Seeded ${activities.length} activities`);

  await prisma.mapPin.deleteMany({});
  for (const [i, p] of DESTINATION_PINS.entries()) {
    await prisma.mapPin.create({
      data: {
        label: p.label,
        lat: p.lat,
        lng: p.lng,
        featured: Boolean(p.featured),
        dir: (p.dir ?? "right").toUpperCase() as "LEFT" | "RIGHT",
        approx: Boolean(p.approx),
        destinationSlug: p.slug,
        order: i,
      },
    });
  }
  console.log(`Seeded ${DESTINATION_PINS.length} map pins`);

  await prisma.section.deleteMany({});
  for (const s of sectionSeeds) {
    await prisma.section.create({
      data: {
        name: s.name,
        description: s.description,
        pages: s.pages,
        targetType: s.targetType,
        targetSlug: s.targetSlug,
        targetTitle: s.targetTitle,
        backgroundType: s.backgroundType,
        backgroundImage: s.backgroundImage,
        backgroundColor: s.backgroundColor,
        overlayEnabled: s.overlayEnabled,
        overlayColor: s.overlayColor,
        overlayOpacity: s.overlayOpacity,
        gallery: s.gallery,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Seeded ${sectionSeeds.length} sections`);

  const usedIn = new Map<string, string>();
  for (const d of destinations) {
    usedIn.set(d.image, d.title);
    for (const g of d.galleryImages ?? []) usedIn.set(g, d.title);
  }
  for (const a of activities) {
    usedIn.set(a.heroImage, a.title);
    for (const g of a.galleryImages ?? []) usedIn.set(g, a.title);
  }
  for (const s of sectionSeeds) {
    if (s.backgroundImage) usedIn.set(s.backgroundImage, s.name);
    for (const g of s.gallery) usedIn.set(g, s.name);
  }

  await prisma.mediaAsset.deleteMany({});
  let mediaCount = 0;
  for (const dir of MEDIA_DIRS) {
    for (const file of listMediaFiles(dir)) {
      const size = statSync(file.absPath).size;
      await prisma.mediaAsset.upsert({
        where: { path: file.publicPath },
        update: {},
        create: {
          path: file.publicPath,
          filename: path.basename(file.publicPath),
          usedIn: usedIn.get(file.publicPath) ?? null,
          sizeBytes: size,
        },
      });
      mediaCount++;
    }
  }
  console.log(`Seeded ${mediaCount} media assets`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
