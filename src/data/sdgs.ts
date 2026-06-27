/**
 * sdgs.ts — Environment-relevant UN Sustainable Development Goals
 *
 * These 7 goals are drawn from the 17 Global Goals (SDGs) adopted in 2015 as
 * part of the UN 2030 Agenda for Sustainable Development. All 193 UN member
 * states committed to achieving them by 2030.
 *
 * Official titles match the UN SDG branding verbatim.
 * Source: United Nations, https://sdgs.un.org/goals
 */

export interface SDG {
  number: number;
  title: string;
  blurb: string;
}

export const SDGS: SDG[] = [
  {
    number: 6,
    title: "Clean Water and Sanitation",
    blurb:
      "Ensure availability and sustainable management of water and sanitation for all. Nearly 2 billion people still lack safely managed drinking water — protecting watersheds, reducing pollution, and harvesting rainwater are critical steps.",
  },
  {
    number: 7,
    title: "Affordable and Clean Energy",
    blurb:
      "Ensure access to affordable, reliable, sustainable and modern energy for all. Transitioning from fossil fuels to solar, wind, and other renewables is the single largest lever available to limit global warming.",
  },
  {
    number: 11,
    title: "Sustainable Cities and Communities",
    blurb:
      "Make cities and human settlements inclusive, safe, resilient and sustainable. Urban areas consume over two-thirds of the world's energy and account for more than 70 % of global CO₂ emissions — how we build cities matters enormously.",
  },
  {
    number: 12,
    title: "Responsible Consumption and Production",
    blurb:
      "Ensure sustainable consumption and production patterns. Humanity currently uses resources as if we had 1.7 Earths. Reducing waste, choosing circular products, and rethinking supply chains can bring us back within planetary limits.",
  },
  {
    number: 13,
    title: "Climate Action",
    blurb:
      "Take urgent action to combat climate change and its impacts. Global average temperatures have already risen ~1.2 °C above pre-industrial levels. Limiting warming to 1.5 °C requires halving emissions by 2030 and reaching net zero by mid-century.",
  },
  {
    number: 14,
    title: "Life Below Water",
    blurb:
      "Conserve and sustainably use the oceans, seas and marine resources for sustainable development. Oceans absorb ~25 % of our CO₂ and generate over half the oxygen we breathe — yet plastic pollution, overfishing, and ocean acidification threaten this vital system.",
  },
  {
    number: 15,
    title: "Life on Land",
    blurb:
      "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, halt and reverse land degradation and biodiversity loss. Around 1 million animal and plant species now face extinction — many within decades.",
  },
];

/**
 * Note: The SDGS array above covers the 7 goals most directly tied to
 * environmental sustainability. They are a subset of the full 17 Global Goals
 * (Agenda 2030) which together address poverty, health, education, gender
 * equality, economic growth, peace, and global partnerships alongside
 * environmental priorities.
 */
