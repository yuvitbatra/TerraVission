/**
 * tips.ts — 20 practical, accurate sustainability tips for Class 8–10 students.
 * Categories drive the on-page filter.
 */
export type TipCategory = "energy" | "water" | "waste" | "transport" | "nature";

export interface Tip {
  id: number;
  title: string;
  detail: string;
  category: TipCategory;
  icon: string;
}

export const TIP_CATEGORIES: { id: TipCategory; label: string; icon: string }[] = [
  { id: "energy", label: "Energy", icon: "⚡" },
  { id: "water", label: "Water", icon: "💧" },
  { id: "waste", label: "Waste", icon: "♻️" },
  { id: "transport", label: "Transport", icon: "🚲" },
  { id: "nature", label: "Nature", icon: "🌳" },
];

export const TIPS: Tip[] = [
  {
    id: 1,
    title: "Switch to LED bulbs",
    detail:
      "LEDs use up to 80% less electricity than old incandescent bulbs and last far longer. Replacing the most-used bulbs in your home is one of the quickest ways to cut your energy bill and emissions.",
    category: "energy",
    icon: "💡",
  },
  {
    id: 2,
    title: "Turn off standby power",
    detail:
      "TVs, chargers and set-top boxes keep drawing power on standby — sometimes 5–10% of home electricity. Switch off at the wall or use a power strip to cut this 'phantom load'.",
    category: "energy",
    icon: "🔌",
  },
  {
    id: 3,
    title: "Use natural light and ventilation",
    detail:
      "Open curtains by day and windows in the evening instead of relying on lights, fans and air-conditioning. Designing your day around daylight saves energy and is healthier too.",
    category: "energy",
    icon: "🌞",
  },
  {
    id: 4,
    title: "Set the AC a little higher",
    detail:
      "Each degree you raise an air-conditioner's temperature can cut its energy use by around 6%. Setting it to 24–26°C with a fan stays comfortable while saving a lot of power.",
    category: "energy",
    icon: "❄️",
  },
  {
    id: 5,
    title: "Carry a reusable bag",
    detail:
      "A single sturdy cloth bag can replace hundreds of single-use plastic bags over its life. Keep one folded in your school bag so you are never caught without it.",
    category: "waste",
    icon: "👜",
  },
  {
    id: 6,
    title: "Segregate your waste",
    detail:
      "Separate wet (food) waste, dry recyclables (paper, plastic, metal) and hazardous items. Clean, sorted waste is far more likely to actually be recycled or composted.",
    category: "waste",
    icon: "🗑️",
  },
  {
    id: 7,
    title: "Start a compost bin",
    detail:
      "Food scraps and garden waste make up a large share of household rubbish. Composting them creates free, rich soil for plants and keeps organic waste out of landfills, where it would release methane.",
    category: "waste",
    icon: "🪱",
  },
  {
    id: 8,
    title: "Refuse single-use plastics",
    detail:
      "Say no to plastic straws, cutlery and bottles. Carry a refillable water bottle and a steel straw — small swaps that prevent a surprising amount of plastic pollution over a year.",
    category: "waste",
    icon: "🚯",
  },
  {
    id: 9,
    title: "Take shorter showers",
    detail:
      "A typical showerhead uses about 9 litres a minute. Cutting your shower by just two minutes can save thousands of litres of water — and the energy used to heat it — every year.",
    category: "water",
    icon: "🚿",
  },
  {
    id: 10,
    title: "Fix dripping taps",
    detail:
      "A tap dripping once per second wastes thousands of litres a year. Tightening or replacing a worn washer is cheap and stops a steady, silent loss of clean water.",
    category: "water",
    icon: "🔧",
  },
  {
    id: 11,
    title: "Turn off the tap while brushing",
    detail:
      "Leaving the tap running while you brush your teeth can waste around 6 litres a minute. Wet your brush, turn it off, and only run it to rinse.",
    category: "water",
    icon: "🪥",
  },
  {
    id: 12,
    title: "Harvest rainwater",
    detail:
      "Collect rooftop rainwater in barrels for watering plants, cleaning and recharging groundwater. Even a simple system reduces demand on treated tap water during dry months.",
    category: "water",
    icon: "🌧️",
  },
  {
    id: 13,
    title: "Walk or cycle short trips",
    detail:
      "For journeys under 2 km, walking or cycling produces zero emissions, saves fuel and keeps you fit. Many short car trips can easily be swapped for active travel.",
    category: "transport",
    icon: "🚶",
  },
  {
    id: 14,
    title: "Use public transport",
    detail:
      "Buses and trains carry many people at once, so emissions per passenger are far lower than a private car. Choosing them for regular trips meaningfully shrinks your carbon footprint.",
    category: "transport",
    icon: "🚌",
  },
  {
    id: 15,
    title: "Share rides with others",
    detail:
      "Carpooling to school or activities splits the fuel, cost and emissions of a trip between several people. One shared car replaces several near-empty ones.",
    category: "transport",
    icon: "🚗",
  },
  {
    id: 16,
    title: "Plant trees and greenery",
    detail:
      "Trees absorb carbon dioxide, cool their surroundings, and provide homes for wildlife. Planting and caring for even a few native trees or a balcony garden makes a real difference.",
    category: "nature",
    icon: "🌳",
  },
  {
    id: 17,
    title: "Protect pollinators",
    detail:
      "Bees and butterflies pollinate most of our food crops. Growing flowering plants and avoiding harmful pesticides helps these vital insects thrive.",
    category: "nature",
    icon: "🐝",
  },
  {
    id: 18,
    title: "Buy local and seasonal food",
    detail:
      "Food grown nearby and in season travels shorter distances and needs less storage, cutting emissions. It is often fresher and supports local farmers too.",
    category: "nature",
    icon: "🥕",
  },
  {
    id: 19,
    title: "Choose energy-efficient appliances",
    detail:
      "When buying appliances, look for high star-rating labels. An efficient fridge or fan uses much less electricity over its lifetime, saving money and reducing emissions.",
    category: "energy",
    icon: "🏷️",
  },
  {
    id: 20,
    title: "Reduce, reuse, then recycle",
    detail:
      "Always reduce what you use first, reuse what you can, and recycle only what is left. Repairing clothes and gadgets instead of replacing them is one of the greenest habits of all.",
    category: "waste",
    icon: "🔁",
  },
];
