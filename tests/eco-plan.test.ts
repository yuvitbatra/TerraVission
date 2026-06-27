import { describe, it, expect } from 'vitest';
import { fallbackEcoPlan, buildEcoPlanPrompt } from '@/lib/eco-plan';

it('fallback returns summary + non-empty actions for carbon', () => {
  const r = fallbackEcoPlan({ kind:'carbon', metrics:{ tonnesPerYear: 6 } });
  expect(r.summary).toMatch(/carbon/i);
  expect(r.actions.length).toBeGreaterThanOrEqual(3);
});

it('prompt includes the metrics and the kind', () => {
  const p = buildEcoPlanPrompt({ kind:'energy', metrics:{ kwhSavedPerYear: 200 } });
  expect(p).toMatch(/energy/i);
  expect(p).toContain('200');
});

it('fallback returns summary + non-empty actions for water', () => {
  const r = fallbackEcoPlan({ kind:'water', metrics:{ litresPerDay: 150 } });
  expect(r.summary).toMatch(/water/i);
  expect(r.actions.length).toBeGreaterThanOrEqual(3);
});

it('fallback returns summary + non-empty actions for energy', () => {
  const r = fallbackEcoPlan({ kind:'energy', metrics:{ kwhPerMonth: 400 } });
  expect(r.summary).toMatch(/energy/i);
  expect(r.actions.length).toBeGreaterThanOrEqual(3);
});

it('prompt includes metric values and carbon kind', () => {
  const p = buildEcoPlanPrompt({ kind:'carbon', metrics:{ tonnesPerYear: 8.5 } });
  expect(p).toMatch(/carbon/i);
  expect(p).toContain('8.5');
});
