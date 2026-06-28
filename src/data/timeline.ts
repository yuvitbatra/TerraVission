/**
 * timeline.ts — milestones in the history of renewable energy + a future roadmap.
 * Dates and facts are historically accurate (Class 8–10 level).
 */
export interface Milestone {
  year: string;
  title: string;
  detail: string;
}

export interface RoadmapItem {
  period: string;
  goal: string;
}

export const MILESTONES: Milestone[] = [
  {
    year: "1839",
    title: "The photovoltaic effect discovered",
    detail:
      "French physicist Edmond Becquerel observed that certain materials produce a small electric current when exposed to light — the basic principle behind every solar cell today.",
  },
  {
    year: "1882",
    title: "First hydroelectric power plant",
    detail:
      "The world's first hydroelectric station began operating on the Fox River in Appleton, USA, using flowing water to generate electricity for nearby buildings.",
  },
  {
    year: "1887–88",
    title: "First wind turbine for electricity",
    detail:
      "Inventors Charles Brush (USA) and James Blyth (Scotland) built the first windmills that generated electricity rather than just grinding grain or pumping water.",
  },
  {
    year: "1954",
    title: "The first practical solar cell",
    detail:
      "Bell Labs created the first silicon photovoltaic cell efficient enough to power everyday devices — about 6% efficient, the ancestor of modern solar panels.",
  },
  {
    year: "1970s",
    title: "Oil crises spark a renewables push",
    detail:
      "Sharp rises in oil prices pushed governments worldwide to invest in solar, wind and energy efficiency, kick-starting serious renewable-energy research.",
  },
  {
    year: "1991",
    title: "First offshore wind farm",
    detail:
      "Denmark installed the world's first offshore wind farm at Vindeby — proving turbines could harvest the stronger, steadier winds out at sea.",
  },
  {
    year: "1997",
    title: "Kyoto Protocol adopted",
    detail:
      "The first major international treaty to commit countries to cutting greenhouse-gas emissions, setting the stage for decades of climate action.",
  },
  {
    year: "2015",
    title: "Paris Agreement signed",
    detail:
      "Nearly 200 nations agreed to limit global warming to well below 2°C — ideally 1.5°C — above pre-industrial levels, accelerating the shift to clean energy.",
  },
  {
    year: "2020s",
    title: "Renewables become the cheapest power",
    detail:
      "Solar and wind costs fell by roughly 80–90% over the previous decade, making new renewable plants cheaper than new fossil-fuel plants in most of the world.",
  },
];

export const ROADMAP: RoadmapItem[] = [
  {
    period: "2030",
    goal: "Triple global renewable capacity and roughly halve emissions this decade to stay on a 1.5°C path (UN / IEA targets).",
  },
  {
    period: "2050",
    goal: "Reach global net-zero CO₂ emissions — the level scientists say is needed to stabilise the climate. Many countries and companies have pledged this date.",
  },
  {
    period: "2070",
    goal: "India's pledged target to reach net-zero emissions, backed by huge expansions in solar, wind and green hydrogen.",
  },
];
