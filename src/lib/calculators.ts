/**
 * Pure calculator functions for TerraVision carbon/water/energy estimators.
 * All factors are documented with approximate real-world sources.
 */

// ---------------------------------------------------------------------------
// Factor constants
// ---------------------------------------------------------------------------

/** Grid electricity emission factor (kg CO2 per kWh) — global avg ~0.7 kg/kWh */
const GRID_KG_PER_KWH = 0.7;

/** Petrol car emission factor (kg CO2 per km) — avg UK/EU passenger car ~0.17 kg/km */
const CAR_KG_PER_KM = 0.17;

/** Short-haul economy flight (t CO2 per return flight, incl. radiative forcing) ~0.25 t */
const FLIGHT_TONNES_EACH = 0.25;

/** Annual dietary footprint by type (t CO2/yr) — Our World in Data / Poore & Nemecek 2018 */
const DIET_TONNES: Record<'meat' | 'mixed' | 'veg', number> = {
  meat:  2.5,
  mixed: 1.7,
  veg:   1.0,
};

/** kWh saved per LED bulb per year replacing incandescent (40 W → < 5 W, ~2 h/day) ~40 kWh */
const LED_KWH_PER_BULB_YR = 40;

/** kWh saved per AC-hour reduction per year (365 days × ~1.5 kW AC unit) */
const AC_KWH_PER_HOUR_YR = 365 * 1.5;

/** kWh saved per standby device per year (avg phantom load ~50 kWh/device/yr) */
const STANDBY_KWH_PER_DEVICE_YR = 50;

/** Litres of water saved per minute of shorter shower per person per day × 365 */
const SHOWER_LITRES_PER_MIN = 9; // avg showerhead ~9 L/min

/** Litres saved per year by fixing leaky tap (one dripping tap ~5000 L/yr) */
const TAP_TIGHTENING_LITRES_YR = 5000;

// ---------------------------------------------------------------------------
// carbonFootprint
// ---------------------------------------------------------------------------

export interface CarbonInput {
  electricityKwh: number;
  carKm: number;
  flightsPerYear: number;
  diet: 'meat' | 'mixed' | 'veg';
}

export interface CarbonResult {
  tonnesPerYear: number;
  breakdown: Record<string, number>;
}

/**
 * Estimates annual personal carbon footprint in tonnes CO2e.
 * Breakdown keys are exactly: electricity, car, flights, diet.
 */
export function carbonFootprint(input: CarbonInput): CarbonResult {
  const electricity = round3((input.electricityKwh * GRID_KG_PER_KWH) / 1000);
  const car         = round3((input.carKm         * CAR_KG_PER_KM)   / 1000);
  const flights     = round3(input.flightsPerYear  * FLIGHT_TONNES_EACH);
  const diet        = round3(DIET_TONNES[input.diet]);

  const tonnesPerYear = round3(electricity + car + flights + diet);

  return {
    tonnesPerYear,
    breakdown: { electricity, car, flights, diet },
  };
}

// ---------------------------------------------------------------------------
// waterSaving
// ---------------------------------------------------------------------------

export interface WaterInput {
  showerMins: number;   // minutes saved per shower per person
  tapTightening: boolean;
  rainwaterLitres: number; // litres collected per year
  people: number;
}

export interface WaterResult {
  litresSavedPerYear: number;
}

/**
 * Estimates annual household water savings in litres.
 * Shower saving scales with number of people (daily, 365 days).
 */
export function waterSaving(input: WaterInput): WaterResult {
  const showerSaving  = input.showerMins * SHOWER_LITRES_PER_MIN * 365 * input.people;
  const tapSaving     = input.tapTightening ? TAP_TIGHTENING_LITRES_YR : 0;
  const rainSaving    = input.rainwaterLitres; // direct displacement of mains water

  const litresSavedPerYear = Math.round(showerSaving + tapSaving + rainSaving);

  return { litresSavedPerYear };
}

// ---------------------------------------------------------------------------
// energySaving
// ---------------------------------------------------------------------------

export interface EnergyInput {
  ledBulbs: number;
  acHoursReduced: number;
  applianceStandbyDevices: number;
}

export interface EnergyResult {
  kwhSavedPerYear: number;
  co2KgSaved: number;
}

/**
 * Estimates annual energy savings in kWh and associated CO2 reduction.
 */
export function energySaving(input: EnergyInput): EnergyResult {
  const kwhSavedPerYear = round1(
    input.ledBulbs                 * LED_KWH_PER_BULB_YR +
    input.acHoursReduced           * AC_KWH_PER_HOUR_YR +
    input.applianceStandbyDevices  * STANDBY_KWH_PER_DEVICE_YR,
  );

  const co2KgSaved = round1(kwhSavedPerYear * GRID_KG_PER_KWH);

  return { kwhSavedPerYear, co2KgSaved };
}

// ---------------------------------------------------------------------------
// Rounding helpers
// ---------------------------------------------------------------------------

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
