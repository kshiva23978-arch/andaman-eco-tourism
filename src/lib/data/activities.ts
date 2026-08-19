import type { Activity } from "@/lib/types";

const GOOGLE = (id: string) => `https://lh3.googleusercontent.com/aida-public/${id}`;

export const activities: Activity[] = [
  {
    slug: "scuba-snorkeling",
    title: "Scientific Scuba & Snorkeling",
    tagline:
      "Explore the depths through the lens of marine biology. Our scientific diving programs prioritize coral health monitoring and biodiversity documentation while providing an immersive educational experience in the Bay of Bengal.",
    icon: "scuba_diving",
    heroImage: GOOGLE(
      "AB6AXuCPUUwEFjRsnvALUo8nwIAXU6lTu8vllpTxSioNNaY8Sa4JLzPRN7MXrRbLSQYwIySBBbidMGbit3iv1YVRxyA3ehbhtuNCzMbgn3JeGMYKqsc22X72UMNXE7x-7LCp6ipelkcTrgE_I_eqjjMuECFKGbdgB107CHzXZiFSOgdP_1VWpvrxj4yPoC4c8Oa9OFptQP2rEJJ6FqFbHtxVBHhTiE87IwwjH1r6bfzUgXcngxUfTi2kpKPmsEJdkYyKLNziOVOa2eQQbIVm"
    ),
    overview: [
      "Scientific Scuba Diving and Snorkeling in the Andaman and Nicobar Islands is regulated by the Department of Environment & Forests. This activity is designed for those seeking a deeper understanding of marine ecosystems beyond recreational observation. Participants are guided by certified eco-divers who facilitate data collection on reef health and species identification.",
      "All dive sites are strictly monitored to ensure that human presence does not interfere with the natural regeneration of coral colonies. We maintain a strict policy of transparency regarding the environmental impact of tourism on these fragile habitats.",
    ],
    duration: "3-4 Hours (1 Dive)",
    difficulty: "Moderate (PADI/SSI Optional)",
    guidelines: [
      {
        icon: "do_not_touch",
        title: "No-Touch Policy",
        body: "Strict prohibition of touching or removing any marine life, corals, or shells. Any violation leads to immediate permit cancellation.",
      },
      {
        icon: "sanitizer",
        title: "Reef-Safe Sunscreen",
        body: "Only bio-degradable, reef-safe sunscreens are permitted within the marine national parks to prevent chemical bleaching.",
      },
    ],
    equipmentProvided: [
      "Regulator & BCD",
      "Wetsuit (3mm)",
      "High-Vis Dive Computer",
      "Eco-friendly fins",
    ],
    permitNote:
      "A valid Forest Department Permit is required for this activity. International travelers must present their RAP (Restricted Area Permit) at registration.",
    destinationSlugs: ["jolly-buoy-island", "red-skin-island", "cinque-island"],
    relatedActivitySlugs: ["glass-bottom-boating", "quiet-water-kayaking"],
    guideBody:
      "Exploration of the Andaman Sea is a journey into marine biology. Snorkeling and scuba diving at the marine national park islands allow for non-intrusive observation of coral gardens and diverse marine species under professional supervision.",
    guideBullets: [
      "Maintain neutral buoyancy",
      'Strict "No Touch" policy',
      "Reef-safe sunscreens only",
    ],
  },
  {
    slug: "sustainable-boating",
    title: "Sustainable Boating",
    tagline:
      "Regulated vessel operations across the islands' jetties, creeks and marine parks — engineered to minimize wake impact and protect the marine environment from pollution and noise.",
    icon: "sailing",
    heroImage: GOOGLE(
      "AB6AXuC4xJoZdqSdeKCYkijWT44kwpMFd_Wdg2YR_g9FNLt3klDVC9ygp91bCdX1RtBjS0yV9u3uxuMTH-c49D43fIaUCRlZbYbYSSS8DFc9YxReyeZq9rD_ta9w1dh1Ihe5BLsmQXi21tNaenUaQf-HOdCliT1VGqknmg6vxqv4RrG7M5lmgXeIXV6zMTgcerpq-DRhgl3BNYhdQZ1un0bNojM7h13MBNhStWfA_ATXEVG973hagFDezN_Mv0aSI4_CkJqAER03iUZg_PrZ"
    ),
    overview: [
      "Regulated vessel operations minimize wake impact on coastal erosion and ensure passenger safety during transit between jetties, creeks and outlying islands. Our fleet adheres to strict environmental standards to protect the delicate marine environment from pollution and excessive noise.",
      "Boat operators servicing forest-department jetties are licensed and required to run fixed departure windows, keeping vessel traffic predictable for both wildlife and other water users.",
    ],
    duration: "30 min – 3 hours (route dependent)",
    difficulty: "Easy — all ages",
    guidelines: [
      {
        icon: "speed",
        title: "Wake Discipline",
        body: "Speed limits are enforced near jetties, mangrove creeks and coral shallows to prevent bank erosion and propeller strikes on marine life.",
      },
      {
        icon: "volume_off",
        title: "Low-Noise Transit",
        body: "Engines are throttled down through designated quiet zones, particularly near nesting and roosting sites.",
      },
    ],
    equipmentProvided: [
      "Life jacket (mandatory)",
      "Dry bag for belongings",
      "First-aid kit on board",
    ],
    permitNote:
      "Standard jetty/ferry tickets apply; convoy or forest-department boats to restricted zones require the site's own permit, arranged in advance through the operator.",
    destinationSlugs: ["uttara-jetty", "parrot-island", "limestone-caves-baratang"],
    relatedActivitySlugs: ["glass-bottom-boating", "quiet-water-kayaking"],
    guideBody:
      "Regulated vessel operations to minimize wake impact on coastal erosion and ensure passenger safety during transit. Our fleet adheres to strict environmental standards to protect the delicate marine environment from pollution and excessive noise.",
  },
  {
    slug: "ocean-surfing",
    title: "Ocean Surfing",
    tagline:
      "Experience the swells of Little Andaman in harmony with the tides, within strictly designated surfing zones.",
    icon: "surfing",
    heroImage: GOOGLE(
      "AB6AXuAmVR9jeJZ7-Q0JZCrs7yGkKW7rNB4Xd6azSo3iDUplG4UCmSQJYK-0JIK-FN4vmtqLDDT361CrAZxMGe_sJA6AxN0nxNjnMEnva2cEzxVzz_gijx5ylGh6LSlpdiN8Dm0aJCimN14h2g5CYRs8CW_-G5TtjJP5t8ry4qnSPAGLxt-MfJOrECTw_QYVVk1kz8QYAMF6Z85Im2t29vrv93GZw1ShEQTmaRP7oroL1mh6cvdGag1nvkhI1YAZMuAuS9-yRfdKeWp0RtOw"
    ),
    overview: [
      "Experience the swells of Little Andaman in harmony with the tides, following strictly designated surfing zones. We ensure that surfing activities do not interfere with coastal nesting sites or sensitive marine habitats.",
      "Butler Bay is the island's best-known break, with consistent swells outside the June–September monsoon window.",
    ],
    duration: "2-3 Hours (tide dependent)",
    difficulty: "Moderate to Advanced",
    guidelines: [
      {
        icon: "check_circle",
        title: "Designated Surf Zones Only",
        body: "Surfing is restricted to marked zones away from turtle-nesting and reef-shallow areas.",
      },
      {
        icon: "schedule",
        title: "Tide-Conscious Scheduling",
        body: "Sessions are scheduled around tide charts to avoid exposed reef at low tide and rip currents at high tide.",
      },
    ],
    equipmentProvided: ["Surfboard rental", "Leash & wax", "Rash guard"],
    permitNote:
      "No special permit for the activity itself; standard Restricted Area Permit rules for Little Andaman apply to foreign nationals.",
    destinationSlugs: ["butler-bay-beach", "kalapathar-beach-little-andaman"],
    relatedActivitySlugs: ["dark-sky-stargazing", "avian-observation"],
    guideBody:
      "Experience the swells of Little Andaman in harmony with the tides, following strictly designated surfing zones. We ensure that surfing activities do not interfere with coastal nesting sites or sensitive marine habitats.",
    guideBullets: ["Designated Surf Zones Only", "Tide-conscious scheduling"],
  },
  {
    slug: "glass-bottom-boating",
    title: "Glass-Bottom Boating",
    tagline:
      "A non-invasive alternative to diving, allowing for the visual study of sub-aquatic ecosystems through transparent hulls.",
    icon: "visibility",
    heroImage: GOOGLE(
      "AB6AXuCypz4Ke8boOA4DBOxCtZNpdOpRPhQmEG0IKDwsRKM1PLtE2Ar870BUnvMk7Vp_Dxl5HAhIUYp8UsJI_cmpxbIw4szrdm1Ow4iKziHNPzgEUP3nNAQPeXMBLQZlM15pKqCyay_NtPFnoylyurIU4yuA76gVGTGd5f3VzLzaqdM4PKxQde6OmTCN3rIVselATw64nYwJlW0q_tCNMu8NU1AKVmphmFY2nqAxbugdmteFkeKVryb6S0uTqR_iUalTDzb2F0kG65uNVbOl"
    ),
    overview: [
      "A non-invasive alternative to diving, allowing for the visual study of sub-aquatic ecosystems through transparent hulls. This is an ideal educational activity for all ages, providing a window into the vibrant coral reefs without direct physical interaction.",
      '"Observation without interference is the pinnacle of ecotourism." — rides run in short, fixed-duration slots to limit boat traffic over sensitive reef.',
    ],
    duration: "15–60 minutes",
    difficulty: "Easy — all ages",
    guidelines: [
      {
        icon: "anchor",
        title: "No-Anchor Zones",
        body: "Boats use mooring buoys rather than anchors over reef to avoid coral breakage.",
      },
      {
        icon: "groups",
        title: "Small-Group Rides",
        body: "Passenger numbers per boat are capped to keep the hull's draft shallow and predictable.",
      },
    ],
    equipmentProvided: ["Life jacket", "Guided commentary"],
    permitNote:
      "Included as an optional add-on at marine-park jetties; booked on-site alongside the island entry permit.",
    destinationSlugs: ["jolly-buoy-island", "red-skin-island"],
    relatedActivitySlugs: ["scuba-snorkeling", "sustainable-boating"],
    guideBody:
      "A non-invasive alternative to diving, allowing for the visual study of sub-aquatic ecosystems through transparent hulls. This is an ideal educational activity for all ages, providing a window into the vibrant coral reefs without direct physical interaction.",
    guideCallout: '"Observation without interference is the pinnacle of ecotourism."',
  },
  {
    slug: "rainforest-trekking",
    title: "Rainforest Trekking",
    tagline:
      "Explore the dense tropical evergreen forests of the archipelago's national parks and peaks.",
    icon: "park",
    heroImage: GOOGLE(
      "AB6AXuAmZmQ69Mfxy1HiAlvK6RT-eYak2XN_EIy24yfIRDqJygUYzeiF3Fn3TLVQ86RAcid03fvPRW9ARDgmfeUpv6o0ehP6Lk42szeZKz9EyYRWX-QTCJc-Z2hIkNH7k7K-1p0tEWmEEteCTm5vUcv8ES0aNQlOSCB7WkFDnIQouT8eAv7MBZprri1-dcsLPqmZtHce6P2W_FTRLvOQoMfs78KX5ysPHmB9HO2mr8wEoHJaCHOS2NkOyX0qLZO8shy7mkBVqBNLvmfSA4ol"
    ),
    overview: [
      "Explore the dense tropical evergreen forests of Mount Manipur and Saddle Peak National Parks. These ecosystems are highly sensitive to soil compaction and habitat fragmentation. Every step must be taken with care for the ground-level species that form the forest floor.",
      "Trails range from gentle interpretation walks to the full 8–10 km summit trek at Saddle Peak, the archipelago's highest point.",
    ],
    duration: "1–6 hours (trail dependent)",
    difficulty: "Moderate to Strenuous",
    guidelines: [
      {
        icon: "eco",
        title: "Flora Protection",
        body: "Do not collect seeds, plants, or wood from the forest floor to maintain the natural nutrient cycle.",
      },
      {
        icon: "hiking",
        title: "Stay on Trail",
        body: "Off-trail exploration accelerates soil compaction and disturbs ground-nesting species.",
      },
    ],
    equipmentProvided: ["Forest-department guide", "Trail map", "Emergency whistle"],
    permitNote:
      "Indian nationals: no special permit for most trails. Foreign nationals need a Restricted Area Permit; a forest-department escort is mandatory on the Saddle Peak summit trail.",
    destinationSlugs: ["mount-manipur-national-park", "saddle-peak-national-park"],
    relatedActivitySlugs: ["avian-observation", "mangrove-walks"],
    guideBody:
      "Explore the dense tropical evergreen forests of Mount Harriet and Saddle Peak. These ecosystems are highly sensitive to soil compaction and habitat fragmentation. Every step must be taken with care for the ground-level species that form the forest floor.",
    guideCallout:
      "Do not collect seeds, plants, or wood from the forest floor to maintain the natural nutrient cycle.",
  },
  {
    slug: "mangrove-walks",
    title: "Mangrove Walks",
    tagline:
      "Walk through the unique mangrove boardwalks at Wright Myo, Dhaninallah and Yerrata — coastal sentinels that protect the shoreline.",
    icon: "route",
    heroImage: GOOGLE(
      "AB6AXuAmZmQ69Mfxy1HiAlvK6RT-eYak2XN_EIy24yfIRDqJygUYzeiF3Fn3TLVQ86RAcid03fvPRW9ARDgmfeUpv6o0ehP6Lk42szeZKz9EyYRWX-QTCJc-Z2hIkNH7k7K-1p0tEWmEEteCTm5vUcv8ES0aNQlOSCB7WkFDnIQouT8eAv7MBZprri1-dcsLPqmZtHce6P2W_FTRLvOQoMfs78KX5ysPHmB9HO2mr8wEoHJaCHOS2NkOyX0qLZO8shy7mkBVqBNLvmfSA4ol"
    ),
    overview: [
      "Walk through the unique mangrove boardwalks at Wright Myo Creek, Dhaninallah and Yerrata. These coastal sentinels protect the shoreline and provide nursery grounds for countless species. Staying on the designated paths is crucial to prevent accidental trampling of rare species.",
      "Elevated viewing towers along several boardwalks allow safe sighting of resident saltwater crocodiles and wading birds without disturbing the creek.",
    ],
    duration: "45 minutes – 2 hours",
    difficulty: "Easy",
    guidelines: [
      {
        icon: "front_hand",
        title: "Stay on Trail",
        body: "Prevent accidental trampling of rare ground-level species and respect the root systems of the mangroves.",
      },
      {
        icon: "visibility",
        title: "Observe from Towers",
        body: "Use the designated viewing platforms for crocodile and bird sightings rather than approaching the creek edge.",
      },
    ],
    equipmentProvided: ["Boardwalk access", "Interpretation signage", "Viewing tower"],
    permitNote:
      "A Forest Department entry permit (nominal fee) is required at most mangrove sites, issued on-site or at the nearest forest office.",
    destinationSlugs: [
      "wright-myo-creek",
      "dhaninallah-mangrove-nature-walk-beach",
      "yerrata-mangrove-walkway",
    ],
    relatedActivitySlugs: ["quiet-water-kayaking", "rainforest-trekking"],
    guideBody:
      "Walk through the unique mangrove boardwalks at Baratang, Shoal Bay-19, Dhaninallah etc. These coastal sentinels protect the shoreline and provide nursery grounds for countless species. Staying on the designated paths is crucial to prevent accidental trampling of rare species.",
    guideCallout:
      "Prevent accidental trampling of rare ground-level species and respect the root systems of the mangroves.",
  },
  {
    slug: "quiet-water-kayaking",
    title: "Quiet-Water Kayaking",
    tagline:
      "Paddle through serene mangrove creeks — the most intimate way to experience the islands' coastal biodiversity.",
    icon: "rowing",
    heroImage: GOOGLE(
      "AB6AXuAmVR9jeJZ7-Q0JZCrs7yGkKW7rNB4Xd6azSo3iDUplG4UCmSQJYK-0JIK-FN4vmtqLDDT361CrAZxMGe_sJA6AxN0nxNjnMEnva2cEzxVzz_gijx5ylGh6LSlpdiN8Dm0aJCimN14h2g5CYRs8CW_-G5TtjJP5t8ry4qnSPAGLxt-MfJOrECTw_QYVVk1kz8QYAMF6Z85Im2t29vrv93GZw1ShEQTmaRP7oroL1mh6cvdGag1nvkhI1YAZMuAuS9-yRfdKeWp0RtOw"
    ),
    overview: [
      "Paddle through the serene mangrove creeks. This low-impact activity provides a silent perspective on the interface between land and sea without disturbing nesting wildlife. It is the most intimate way to experience the islands' coastal biodiversity.",
      "Sunset departures at Austin Creek are particularly prized, with calm water and low glare for wildlife spotting.",
    ],
    duration: "1–2 hours",
    difficulty: "Easy to Moderate",
    guidelines: [
      {
        icon: "rowing",
        title: "Low-Impact Exploration",
        body: "Paddle quietly and keep a respectful distance from nesting birds and basking crocodiles.",
      },
      {
        icon: "life_lite",
        title: "Tide-Timed Launch",
        body: "Launches are scheduled around tide windows to avoid exposed mudbanks in narrow channels.",
      },
    ],
    equipmentProvided: ["Kayak & paddle", "Life jacket", "Dry bag"],
    permitNote:
      "Guided kayak tours through forest-department creeks require the same entry permit as the mangrove-walk site.",
    destinationSlugs: [
      "wright-myo-creek",
      "austin-creek-sunset-point",
      "dhaninallah-mangrove-nature-walk-beach",
    ],
    relatedActivitySlugs: ["mangrove-walks", "sustainable-boating"],
    guideBody:
      "Paddle through the serene mangrove creeks. This low-impact activity provides a silent perspective on the interface between land and sea without disturbing nesting wildlife. It is the most intimate way to experience the islands' coastal biodiversity.",
  },
  {
    slug: "avian-observation",
    title: "Avian Observation",
    tagline:
      "The islands are home to more than 270 species of birds, including 30 endemic species.",
    icon: "flutter_dash",
    heroImage: GOOGLE(
      "AB6AXuC4xJoZdqSdeKCYkijWT44kwpMFd_Wdg2YR_g9FNLt3klDVC9ygp91bCdX1RtBjS0yV9u3uxuMTH-c49D43fIaUCRlZbYbYSSS8DFc9YxReyeZq9rD_ta9w1dh1Ihe5BLsmQXi21tNaenUaQf-HOdCliT1VGqknmg6vxqv4RrG7M5lmgXeIXV6zMTgcerpq-DRhgl3BNYhdQZ1un0bNojM7h13MBNhStWfA_ATXEVG973hagFDezN_Mv0aSI4_CkJqAER03iUZg_PrZ"
    ),
    overview: [
      "The islands are home to more than 270 species of birds, including 30 endemic species. Observation requires patience and non-intrusive behavior. We advocate for responsible bird watching that puts the well-being of the birds first.",
      "Cuthbert Bay and Saddle Peak are noted hotspots, alongside the captive-breeding aviaries at Chidiyatapu's Biological Park.",
    ],
    duration: "1–3 hours (dawn/dusk preferred)",
    difficulty: "Easy",
    guidelines: [
      {
        icon: "campaign",
        title: "No Playback Calls",
        body: "Avoid use of bird-call playbacks and flash photography. Maintain a respectful distance to avoid stress to nesting pairs.",
      },
      {
        icon: "schedule",
        title: "Dawn & Dusk Windows",
        body: "Activity is highest — and least disruptive to observe — in the first and last hour of daylight.",
      },
    ],
    equipmentProvided: ["Binoculars (rental)", "Species checklist"],
    permitNote:
      "Standard site entry permit applies; no separate birding permit required.",
    destinationSlugs: [
      "cuthbert-bay-beach-wildlife-sanctuary",
      "saddle-peak-national-park",
      "biological-park-chidiyatapu",
    ],
    relatedActivitySlugs: ["rainforest-trekking", "mangrove-walks"],
    guideBody:
      "The islands are home to more than 270 species of birds, including 30 endemic species. Observation requires patience and non-intrusive behavior. We advocate for responsible bird watching that puts the well-being of the birds first.",
    guideCallout:
      "Avoid use of bird-call playbacks and flash photography. Maintain a respectful distance to avoid stress to nesting pairs.",
  },
  {
    slug: "dark-sky-stargazing",
    title: "Dark Sky Stargazing",
    tagline:
      "Minimal light pollution in remote areas offers exceptional astronomical clarity.",
    icon: "bedtime",
    heroImage: GOOGLE(
      "AB6AXuA_HC49PveLb3FAk7v_Si0NlK9rEoU7L76rB7GtakvKBqzw_5Q7jLWKBt33y1-TV2_kjU8LeMsxVUMvTOeAX85v1aOhW5tpU5KU-PN3tuJ2CPAlQIYdcmczPmbWNMB0QlucDKYMSrM4e6DHW-0FW7LCHl0etkIUJVhX1dvLlcfZL8lWZQ8LnrAQK7bquwFQfouImGnzs4QzGrM2B_t0kcSluwbjw6Qsnd36WlV6pT3GgWzeD2qTHLg8B6QJRtn1_5oSQ4sFTKz7xsmp"
    ),
    overview: [
      "Minimal light pollution in remote areas offers exceptional astronomical clarity. Observe the southern constellations in a pristine celestial environment. Stargazing sites are selected for their darkness and lack of ground-level interference.",
      "Little Andaman's outlying beaches and North Andaman's remote bays are the least light-polluted, weather-permitting outside monsoon.",
    ],
    duration: "2 hours (after dusk)",
    difficulty: "Easy",
    guidelines: [
      {
        icon: "flashlight_off",
        title: "Red-Light Only",
        body: "Use red-filtered torches only after dusk to preserve night vision and avoid disturbing nesting turtles nearby.",
      },
      {
        icon: "groups",
        title: "Guided Groups Only",
        body: "Night access to beaches is via guided forest-department group only, for safety and turtle-nesting protection.",
      },
    ],
    equipmentProvided: ["Telescope/binoculars (on select sites)", "Red-light torch", "Star chart"],
    permitNote:
      "Night access to protected beaches requires prior arrangement with the local forest office.",
    destinationSlugs: ["butler-bay-beach", "lamiya-bay-beach", "merk-bay-beach"],
    relatedActivitySlugs: ["ocean-surfing", "avian-observation"],
    guideBody:
      "Minimal light pollution in remote areas offers exceptional astronomical clarity. Observe the southern constellations in a pristine celestial environment. Stargazing sites are selected for their darkness and lack of ground-level interference.",
    guideCallout:
      "Experience the universe as it was seen for millennia, undisturbed by modern illumination.",
  },
];

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

export function getActivitiesBySlugs(slugs: string[]): Activity[] {
  return slugs
    .map((slug) => getActivityBySlug(slug))
    .filter((a): a is Activity => Boolean(a));
}

/** Curated subset for the homepage teaser grid. */
export const featuredActivitySlugs = [
  "scuba-snorkeling",
  "rainforest-trekking",
  "mangrove-walks",
  "dark-sky-stargazing",
];
