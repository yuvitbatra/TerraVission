/**
 * topics.ts — Canonical topic data for all five TerraVision sustainability solutions.
 * Used on the home page grid, solutions index, and navigation.
 */

export interface Topic {
  slug: string;
  title: string;
  href: string;
  blurb: string;
  accent: "green" | "blue";
  highlights: string[];
}

export const TOPICS: Topic[] = [
  {
    slug: "solar",
    title: "Solar Energy",
    href: "/solutions/solar",
    blurb:
      "Photovoltaic panels convert sunlight into clean electricity, slashing carbon emissions and energy bills for homes, schools, and entire cities.",
    accent: "green",
    highlights: [
      "Solar panel costs have fallen by over 89% since 2010, making it the cheapest electricity source in history.",
      "A 5 kW rooftop system can offset roughly 6 tonnes of CO₂ and generate ~7,000 kWh of clean electricity per year.",
      "Global installed solar capacity crossed 1.6 terawatts in 2023 — enough to power hundreds of millions of homes.",
    ],
  },
  {
    slug: "wind",
    title: "Wind Energy",
    href: "/solutions/wind",
    blurb:
      "Wind turbines harness the kinetic energy of moving air to generate zero-emission electricity at scale, both onshore and offshore.",
    accent: "blue",
    highlights: [
      "Wind power supplied over 2,400 TWh globally in 2023 — sufficient to meet the annual electricity needs of around 600 million homes.",
      "Modern offshore turbines stand over 260 m tall with rotor diameters wider than two football fields placed end to end.",
      "Wind energy consumes virtually no water during operation, making it ideal for water-scarce regions.",
    ],
  },
  {
    slug: "rainwater",
    title: "Rainwater Harvesting",
    href: "/solutions/rainwater",
    blurb:
      "Collecting and storing roof runoff provides a reliable non-potable water source, easing demand on municipal systems and preventing stormwater flooding.",
    accent: "green",
    highlights: [
      "A 100 m² rooftop in a region receiving 800 mm of annual rainfall can capture up to 72,000 litres of usable water per year.",
      "Residential rainwater systems can reduce household reliance on mains water by 40–50% for toilet flushing, laundry, and irrigation.",
      "Harvested rainwater is naturally soft and chlorine-free, making it gentler on plants and household appliances than treated tap water.",
    ],
  },
  {
    slug: "waste",
    title: "Waste Reduction",
    href: "/solutions/waste",
    blurb:
      "Minimising, reusing, and recycling solid waste diverts materials from landfills, cuts methane emissions, and conserves the energy and resources needed to produce new goods.",
    accent: "blue",
    highlights: [
      "Recycling one tonne of paper saves 17 trees, 26,000 litres of water, and approximately 4,100 kWh of energy compared to virgin production.",
      "Composting organic waste prevents the release of methane — a greenhouse gas over 80× more potent than CO₂ over a 20-year period.",
      "Extended Producer Responsibility (EPR) legislation has boosted national recycling rates by up to 30 percentage points in countries that adopted it.",
    ],
  },
  {
    slug: "water",
    title: "Water Conservation",
    href: "/solutions/water",
    blurb:
      "Smart fixtures, greywater recycling, and precision irrigation can cut household and agricultural water use by up to 50% without compromising quality of life.",
    accent: "green",
    highlights: [
      "Low-flow showerheads and dual-flush toilets together reduce indoor water consumption by up to 60 litres per person per day.",
      "Drip irrigation delivers water directly to plant roots, cutting agricultural water use by 30–50% compared with traditional flood or sprinkler methods.",
      "Around 2.2 billion people already lack access to safe drinking water; every litre conserved today helps secure supply for future generations.",
    ],
  },
];
