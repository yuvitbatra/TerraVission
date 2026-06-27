/**
 * impact.ts — accurate datasets for the Global Impact page.
 *
 * Sources:
 *   - IEA World Energy Outlook 2023
 *   - IEA Global CO₂ Emissions Report 2022 & 2023
 *   - IRENA Renewable Power Generation 2023
 *   - BP Statistical Review of World Energy 2023
 *   - Our World in Data — Renewable Energy (Hannah Ritchie et al.)
 *   - Climate Watch Historical GHG Emissions (WRI, 2022)
 *
 * All figures are rounded; accuracy ±1 unit or ±1 percentage point.
 */

// ---------------------------------------------------------------------------
// Shared types (re-exported so Charts.tsx can import without circular deps)
// ---------------------------------------------------------------------------

/** A year + value pair used by the renewable-growth line chart. */
export interface LineDataPoint {
  year: string;
  value: number;
}

/** A named slice for the electricity-mix donut chart. */
export interface DonutSlice {
  label: string;
  /** Percentage of total (values should sum to 100). */
  value: number;
}

/** A sector entry for the CO₂-emissions bar chart. */
export interface BarDataItem {
  label: string;
  /** Gigatonnes CO₂ (Gt CO₂). */
  value: number;
}

/** Config for a StatCounter headline stat. */
export interface HeadlineStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

// ---------------------------------------------------------------------------
// Dataset 1 — Renewable electricity share of global generation (%)
// Source: IEA Electricity Information 2023; Our World in Data.
// Includes hydro, wind, solar PV, bioenergy, geothermal, marine.
// ---------------------------------------------------------------------------
export const renewableGrowthData: LineDataPoint[] = [
  { year: "2000", value: 19.0 },
  { year: "2005", value: 18.7 },
  { year: "2010", value: 20.7 },
  { year: "2015", value: 23.0 },
  { year: "2018", value: 26.2 },
  { year: "2019", value: 27.3 },
  { year: "2020", value: 29.0 },
  { year: "2021", value: 28.8 },
  { year: "2022", value: 30.3 },
  { year: "2023", value: 30.6 },
];

// ---------------------------------------------------------------------------
// Dataset 2 — Global electricity generation mix by source, 2023 (~%)
// Source: IEA World Energy Outlook 2023; BP Statistical Review 2023.
// ---------------------------------------------------------------------------
export const electricityMixData: DonutSlice[] = [
  { label: "Coal",             value: 36 },
  { label: "Natural Gas",      value: 22 },
  { label: "Hydro",            value: 14 },
  { label: "Nuclear",          value: 10 },
  { label: "Wind",             value:  8 },
  { label: "Solar PV",         value:  5 },
  { label: "Other Renewables", value:  5 },
];

// ---------------------------------------------------------------------------
// Dataset 3 — Global CO₂ emissions by sector, 2022 (Gt CO₂)
// Source: IEA Global CO₂ Emissions 2022; Climate Watch / WRI.
// Note: Agriculture includes forestry & land-use CO₂-eq (rounded).
// ---------------------------------------------------------------------------
export const emissionsBySectorData: BarDataItem[] = [
  { label: "Energy & Power", value: 15.6 },
  { label: "Transport",      value:  7.7 },
  { label: "Industry",       value:  6.1 },
  { label: "Agriculture",    value:  5.8 },
  { label: "Buildings",      value:  2.9 },
  { label: "Waste",          value:  0.9 },
];

// ---------------------------------------------------------------------------
// Headline statistics — animated StatCounters at the top of the page
// ---------------------------------------------------------------------------
export const impactStats: HeadlineStat[] = [
  {
    value: 30.6,
    suffix: "%",
    label: "Renewable electricity share (2023)",
    decimals: 1,
  },
  {
    value: 37.4,
    suffix: " Gt",
    label: "Global CO₂ emissions (2023)",
    decimals: 1,
  },
  {
    value: 340,
    suffix: " GW",
    label: "New renewable capacity added (2023)",
  },
  {
    value: 140,
    suffix: "+",
    label: "Countries with net-zero targets",
  },
];

// ---------------------------------------------------------------------------
// Sources note (rendered at page bottom)
// ---------------------------------------------------------------------------
export const DATA_SOURCES =
  "Data sources: IEA World Energy Outlook 2023 · IEA Global CO₂ Emissions 2022–23 · " +
  "IRENA Renewable Power Generation 2023 · BP Statistical Review 2023 · " +
  "Our World in Data (Ritchie et al.) · Climate Watch / WRI 2022. " +
  "All figures rounded; ±1 % / ±0.1 Gt accuracy.";
