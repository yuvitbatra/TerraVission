export interface EcoPlanInput {
  kind: 'carbon' | 'water' | 'energy';
  metrics: Record<string, number | string>;
}

export function buildEcoPlanPrompt(payload: EcoPlanInput): string {
  const metricsJson = JSON.stringify(payload.metrics, null, 2);
  return (
    `You are a friendly sustainability advisor. ` +
    `The user has ${payload.kind} data. ` +
    `Produce a concise, encouraging eco-action plan (3–5 bullet points) ` +
    `based on the following ${payload.kind} metrics:\n${metricsJson}\n` +
    `Focus on practical, achievable steps the user can start today. ` +
    `Keep the tone warm and motivating.`
  );
}

const FALLBACK_PLANS: Record<
  EcoPlanInput['kind'],
  { summary: string; actions: string[] }
> = {
  carbon: {
    summary:
      'Reducing your carbon footprint is one of the most impactful steps you can take for the planet.',
    actions: [
      'Switch to a plant-rich diet at least 3 days per week to cut food-related carbon emissions.',
      'Replace short car trips (under 3 km) with walking, cycling, or public transport.',
      'Audit your home energy use: switch to LED bulbs and unplug idle electronics.',
      'Offset unavoidable emissions by supporting verified reforestation or renewable energy projects.',
      'Choose airlines and brands that publish credible net-zero commitments.',
    ],
  },
  water: {
    summary:
      'Conserving water protects ecosystems and reduces the energy needed for treatment and distribution.',
    actions: [
      'Install low-flow showerheads and aerators on taps to cut household water use by up to 50%.',
      'Fix leaky taps immediately — a dripping tap can waste over 20 litres per day.',
      'Collect rainwater for garden irrigation instead of using treated mains water.',
      'Run dishwashers and washing machines only with full loads, and on eco-mode.',
      'Choose drought-resistant plants for your garden to minimise outdoor water demand.',
    ],
  },
  energy: {
    summary:
      'Cutting energy consumption lowers your bills and reduces reliance on fossil fuels.',
    actions: [
      'Set your thermostat 2 °C lower in winter and use a programmable timer to avoid heating empty rooms.',
      'Switch to a 100% renewable electricity tariff from a certified green energy provider.',
      'Replace old appliances with A-rated energy-efficient models when they need replacing.',
      'Insulate your loft and draught-proof doors and windows to retain heat without extra energy.',
      'Consider installing rooftop solar panels or joining a community energy scheme.',
    ],
  },
};

export function fallbackEcoPlan(payload: EcoPlanInput): {
  summary: string;
  actions: string[];
} {
  return FALLBACK_PLANS[payload.kind];
}
