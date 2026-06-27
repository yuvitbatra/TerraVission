import { describe, it, expect } from 'vitest';
import { carbonFootprint, waterSaving, energySaving } from '@/lib/calculators';

describe('carbonFootprint', () => {
  it('sums electricity, car, flights, diet into tonnes/yr', () => {
    const r = carbonFootprint({ electricityKwh: 300, carKm: 1000, flightsPerYear: 2, diet: 'mixed' });
    expect(r.tonnesPerYear).toBeGreaterThan(0);
    expect(Object.keys(r.breakdown)).toEqual(['electricity','car','flights','diet']);
    // breakdown sums to total (within rounding)
    const sum = Object.values(r.breakdown).reduce((a,b)=>a+b,0);
    expect(Math.abs(sum - r.tonnesPerYear)).toBeLessThan(0.01);
  });
  it('veg diet emits less than meat diet, all else equal', () => {
    const base = { electricityKwh: 0, carKm: 0, flightsPerYear: 0 } as const;
    expect(carbonFootprint({ ...base, diet:'veg' }).tonnesPerYear)
      .toBeLessThan(carbonFootprint({ ...base, diet:'meat' }).tonnesPerYear);
  });
  it('zero inputs with veg diet returns veg diet baseline only', () => {
    const r = carbonFootprint({ electricityKwh: 0, carKm: 0, flightsPerYear: 0, diet: 'veg' });
    expect(r.breakdown.electricity).toBe(0);
    expect(r.breakdown.car).toBe(0);
    expect(r.breakdown.flights).toBe(0);
    expect(r.breakdown.diet).toBeGreaterThan(0);
  });
  it('more flights => higher total', () => {
    const base = { electricityKwh: 100, carKm: 500, diet: 'mixed' as const };
    const low = carbonFootprint({ ...base, flightsPerYear: 1 });
    const high = carbonFootprint({ ...base, flightsPerYear: 5 });
    expect(high.tonnesPerYear).toBeGreaterThan(low.tonnesPerYear);
  });
});

describe('energySaving', () => {
  it('more LED bulbs => more kWh and CO2 saved', () => {
    const a = energySaving({ ledBulbs: 5, acHoursReduced: 0, applianceStandbyDevices: 0 });
    const b = energySaving({ ledBulbs: 10, acHoursReduced: 0, applianceStandbyDevices: 0 });
    expect(b.kwhSavedPerYear).toBeGreaterThan(a.kwhSavedPerYear);
    expect(b.co2KgSaved).toBeGreaterThan(a.co2KgSaved);
  });
  it('co2KgSaved is proportional to kwhSavedPerYear', () => {
    const r = energySaving({ ledBulbs: 8, acHoursReduced: 2, applianceStandbyDevices: 3 });
    expect(r.kwhSavedPerYear).toBeGreaterThan(0);
    // CO2 factor ~0.7 kg/kWh — co2KgSaved should be roughly 0.7 * kwhSavedPerYear
    expect(r.co2KgSaved).toBeCloseTo(r.kwhSavedPerYear * 0.7, 1);
  });
  it('zero inputs => zero savings', () => {
    const r = energySaving({ ledBulbs: 0, acHoursReduced: 0, applianceStandbyDevices: 0 });
    expect(r.kwhSavedPerYear).toBe(0);
    expect(r.co2KgSaved).toBe(0);
  });
});

describe('waterSaving', () => {
  it('scales with people and rainwater capture', () => {
    const r = waterSaving({ showerMins: 5, tapTightening: true, rainwaterLitres: 100, people: 4 });
    expect(r.litresSavedPerYear).toBeGreaterThan(0);
  });
  it('more people => more water saved (shower saving scales)', () => {
    const base = { showerMins: 3, tapTightening: false, rainwaterLitres: 0 };
    const small = waterSaving({ ...base, people: 1 });
    const large = waterSaving({ ...base, people: 4 });
    expect(large.litresSavedPerYear).toBeGreaterThan(small.litresSavedPerYear);
  });
  it('tap tightening adds savings', () => {
    const base = { showerMins: 0, rainwaterLitres: 0, people: 1 };
    const withoutTap = waterSaving({ ...base, tapTightening: false });
    const withTap    = waterSaving({ ...base, tapTightening: true });
    expect(withTap.litresSavedPerYear).toBeGreaterThan(withoutTap.litresSavedPerYear);
  });
});
