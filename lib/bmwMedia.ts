export type BmwMediaAsset = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  subtitle?: string;
  description?: string;
  mediaLabel?: string;
};

const BMW_MEDIA_BASE = "https://www.bmw-m.com";

const withBase = (path: string) => `${BMW_MEDIA_BASE}${path}`;

const bmwM3TouringStill = withBase(
  "/content/dam/bmw/marketBMW_M/www_bmw-m_com/fastlane/motorsport/M3-Touring-24H/bmw-m3-touring-24h-shell-01-16x9.jpg"
);
const bmwTrackKitStill = withBase(
  "/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/magazine-article-pool/2026/m-performance-track-kit-bmw-m2/bmw-m2-m-performance-track-kit-03-16x9.jpg"
);
const bmwNeueKlasseStill = withBase(
  "/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/magazine-article-pool/2026/m-neue-klasse-technology/bmw-m-neue-klasse-za0-technology-05-16x9.jpg"
);
const bmwM2RacingStill = withBase(
  "/content/dam/bmw/marketBMW_M/www_bmw-m_com/fastlane/motorsport/m2-racing/bmw-m2-racing-01b-16x9.jpg"
);
const bmwCockpitAppsStill = withBase(
  "/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/m-community-incar-app/in-car-apps/bmw-m-in-car-apps-011-9x16.jpg"
);
const bmwCommunityStill = withBase(
  "/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/m-community-incar-app/m-community/bmw-m-community-stage-01-9x16.jpg"
);
const bmwM5CockpitStill = withBase(
  "/content/dam/bmw/marketBMW_M/www_bmw-m_com/fastlane/mpp/2025/bmw-m5-sedan-mpp-stage-01-9x16.jpg"
);

export const compactHeroStill = bmwTrackKitStill;

export const performanceReelMedia: BmwMediaAsset[] = [
  {
    kind: "image",
    src: bmwM3TouringStill,
    title: "24H TOURING",
    subtitle: "Built for the Nurburgring",
    mediaLabel: "BMW image",
  },
  {
    kind: "image",
    src: bmwTrackKitStill,
    title: "M2 DESIGN ICONS",
    subtitle: "Sharper aero, tighter form",
    mediaLabel: "BMW image",
  },
  {
    kind: "image",
    src: bmwNeueKlasseStill,
    title: "M IGNITE",
    subtitle: "BMW M future-performance pulse",
    mediaLabel: "BMW image",
  },
  {
    kind: "image",
    src: bmwM2RacingStill,
    title: "M2 RACING",
    subtitle: "Pure motorsport DNA",
    mediaLabel: "BMW image",
  },
];

export const cockpitShowcaseMedia = {
  hero: {
    kind: "image",
    src: bmwCockpitAppsStill,
    title: "M SETUP MODE",
    description: "Configure engine, chassis, and steering response with precision presets.",
    mediaLabel: "BMW image",
  } satisfies BmwMediaAsset,
  stack: [
    {
      kind: "image",
      src: bmwCommunityStill,
      title: "M COMMUNITY",
      description: "Connect with drivers worldwide and share track telemetry in real time.",
      mediaLabel: "BMW image",
    },
    {
      kind: "image",
      src: bmwM5CockpitStill,
      title: "TELEMETRY PRO",
      description: "Advanced track analysis with sector-by-sector performance breakdown.",
      mediaLabel: "BMW image",
    },
  ] satisfies BmwMediaAsset[],
};

export const mSeriesGalleryMedia: BmwMediaAsset[] = [
  {
    kind: "image",
    src: bmwM3TouringStill,
    title: "M3 TOURING 24H",
    subtitle: "Endurance one-off",
    description: "The 24-hour touring program opens the mobile chapter with a proper race-bred silhouette instead of another repeated studio still.",
    mediaLabel: "BMW image",
  },
  {
    kind: "image",
    src: bmwTrackKitStill,
    title: "M2 TRACK KIT",
    subtitle: "Sharper aero package",
    description: "A more aggressive M2 frame adds a distinct second look, with exposed aero hardware and a cleaner road-to-track tone.",
    mediaLabel: "BMW image",
  },
  {
    kind: "image",
    src: bmwNeueKlasseStill,
    title: "NEUE KLASSE M",
    subtitle: "Future-performance study",
    description: "The electric-forward concept frame breaks up the gallery with a completely different proportion, lighting treatment, and stance.",
    mediaLabel: "BMW image",
  },
  {
    kind: "image",
    src: bmwM2RacingStill,
    title: "M2 RACING",
    subtitle: "Factory motorsport shell",
    description: "A dedicated customer-racing body closes the sequence with a cleaner motorsport image that does not repeat the earlier touring-car look.",
    mediaLabel: "BMW image",
  },
];
