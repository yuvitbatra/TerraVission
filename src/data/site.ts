export const SITE = {
  name: "TerraVision",
  tagline: "See the Planet. Save the Planet.",
  url: "https://terravision.vercel.app",
  defaultDescription:
    "TerraVision is a student-built sustainability education platform exploring solar, wind, rainwater harvesting, waste reduction, and water conservation — with interactive calculators, impact trackers, and learning resources.",
  ogImage: "/og-default.png",
} as const;

export const NAV: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Solar", href: "/solutions/solar" },
      { label: "Wind", href: "/solutions/wind" },
      { label: "Rainwater", href: "/solutions/rainwater" },
      { label: "Waste", href: "/solutions/waste" },
      { label: "Water", href: "/solutions/water" },
    ],
  },
  { label: "Compare", href: "/compare" },
  { label: "Calculators", href: "/calculators" },
  { label: "Tips", href: "/tips" },
  { label: "Impact", href: "/impact" },
  { label: "Gallery", href: "/gallery" },
  { label: "Quiz", href: "/quiz" },
  { label: "Timeline", href: "/timeline" },
  { label: "Resources", href: "/resources" },
  { label: "Conclusion", href: "/conclusion" },
  { label: "Team", href: "/team" },
];

export const TEAM: { name: string }[] = [
  { name: "Ivaan" },
  { name: "Shiven" },
  { name: "Jaskeerat" },
  { name: "Laksh" },
  { name: "Darshil" },
];

export const PLACEHOLDERS = {
  class: "8-D",
  school: "Amity International School, Noida",
  teacher: "Ruchi Sethi",
} as const;
