/**
 * resources.ts — downloadable / printable sustainability guides.
 * Each guide renders as a printable one-pager (print-to-PDF via the browser).
 */
export interface Guide {
  id: string;
  title: string;
  summary: string;
  category: string;
  icon: string;
  /** Section headings with bullet points — rendered on the page and printable. */
  sections: { heading: string; points: string[] }[];
}

export const GUIDES: Guide[] = [
  {
    id: "home-energy",
    title: "Home Energy Saving Checklist",
    summary: "A room-by-room checklist of simple actions to cut your home's electricity use and bills.",
    category: "Energy",
    icon: "⚡",
    sections: [
      {
        heading: "Lighting",
        points: [
          "Replace all bulbs with LEDs.",
          "Switch off lights when leaving a room.",
          "Use daylight instead of artificial light where possible.",
        ],
      },
      {
        heading: "Appliances",
        points: [
          "Switch off devices at the wall instead of standby.",
          "Run washing machines with full loads in cold/eco mode.",
          "Choose high star-rated appliances when replacing.",
        ],
      },
      {
        heading: "Heating & Cooling",
        points: [
          "Set air-conditioning to 24–26°C and use fans.",
          "Close curtains during the hottest part of the day.",
          "Clean AC and fan filters regularly for efficiency.",
        ],
      },
    ],
  },
  {
    id: "waste-segregation",
    title: "Waste Segregation Guide",
    summary: "Know exactly which bin each type of waste belongs in, so more of it is recycled or composted.",
    category: "Waste",
    icon: "♻️",
    sections: [
      {
        heading: "Wet / Organic (Green)",
        points: [
          "Food scraps, peels, leftovers.",
          "Garden trimmings and leaves.",
          "Tea bags and coffee grounds — great for compost.",
        ],
      },
      {
        heading: "Dry / Recyclable (Blue)",
        points: [
          "Clean paper, cardboard, newspapers.",
          "Rinsed plastic bottles and containers.",
          "Glass and metal cans.",
        ],
      },
      {
        heading: "Hazardous & E-waste (Separate)",
        points: [
          "Batteries, bulbs, paints and chemicals.",
          "Old phones, chargers and electronics.",
          "Take these to designated collection points — never the regular bin.",
        ],
      },
    ],
  },
  {
    id: "water-conservation",
    title: "Water Conservation Tips",
    summary: "Practical ways to save clean water at home, at school and in the garden.",
    category: "Water",
    icon: "💧",
    sections: [
      {
        heading: "In the Bathroom",
        points: [
          "Take showers under 5 minutes.",
          "Turn off the tap while brushing or soaping.",
          "Fix leaking taps and running toilets quickly.",
        ],
      },
      {
        heading: "In the Kitchen",
        points: [
          "Wash vegetables in a bowl, not under a running tap.",
          "Reuse the rinse water for plants.",
          "Run the dishwasher only when full.",
        ],
      },
      {
        heading: "Outdoors",
        points: [
          "Water plants early morning or evening to reduce evaporation.",
          "Collect rainwater for the garden.",
          "Use a bucket instead of a hose to wash vehicles.",
        ],
      },
    ],
  },
  {
    id: "green-school",
    title: "Green School Starter Guide",
    summary: "Ideas a class or eco-club can use to make a whole school more sustainable.",
    category: "Community",
    icon: "🏫",
    sections: [
      {
        heading: "Quick Wins",
        points: [
          "Set up clearly-labelled segregation bins in every classroom.",
          "Start a 'last person switches off' lights-and-fans rule.",
          "Place reusable water-bottle refill stations around campus.",
        ],
      },
      {
        heading: "Bigger Projects",
        points: [
          "Start a school compost pit for canteen and garden waste.",
          "Plant a native-tree or kitchen garden with each class.",
          "Install rooftop rainwater harvesting.",
        ],
      },
      {
        heading: "Keep It Going",
        points: [
          "Form a student eco-club to run campaigns.",
          "Track electricity and water bills to celebrate savings.",
          "Hold a yearly sustainability fair to share ideas.",
        ],
      },
    ],
  },
];
