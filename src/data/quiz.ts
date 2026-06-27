export interface Question {
  id: number;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const QUIZ: Question[] = [
  {
    id: 1,
    q: 'Which of the following is NOT a greenhouse gas?',
    options: ['Carbon dioxide', 'Methane', 'Oxygen', 'Nitrous oxide'],
    answer: 2,
    explanation:
      'Greenhouse gases such as carbon dioxide, methane, and nitrous oxide trap heat in Earth\'s atmosphere. Oxygen is abundant in the atmosphere but does not trap heat and is therefore not a greenhouse gas.',
  },
  {
    id: 2,
    q: 'How many Sustainable Development Goals (SDGs) did the United Nations adopt in 2015?',
    options: ['10', '15', '17', '20'],
    answer: 2,
    explanation:
      'The United Nations adopted 17 Sustainable Development Goals in 2015 as part of the 2030 Agenda for Sustainable Development, covering issues from poverty elimination to climate action.',
  },
  {
    id: 3,
    q: 'What is the primary advantage of solar energy over fossil fuels?',
    options: [
      'It is always cheaper to install',
      'It produces no greenhouse gas emissions during electricity generation',
      'It works more efficiently at night',
      'It requires no maintenance at all',
    ],
    answer: 1,
    explanation:
      'Solar panels convert sunlight into electricity through the photovoltaic effect without burning any fuel, so they produce no greenhouse gas emissions during operation, making them a clean energy source.',
  },
  {
    id: 4,
    q: 'Approximately what percentage of Earth\'s total water is freshwater?',
    options: ['50%', '25%', '10%', 'About 3%'],
    answer: 3,
    explanation:
      'Only about 2.5–3% of Earth\'s water is freshwater, and most of it is locked in glaciers and ice caps, leaving less than 1% readily accessible in rivers, lakes, and groundwater for human use.',
  },
  {
    id: 5,
    q: 'What is the correct order of priority for the 3Rs of waste management?',
    options: [
      'Recycle, Reuse, Reduce',
      'Reduce, Reuse, Recycle',
      'Reuse, Reduce, Recycle',
      'Recycle, Reduce, Reuse',
    ],
    answer: 1,
    explanation:
      'The 3Rs are prioritised as Reduce, Reuse, Recycle: reducing consumption prevents waste from being created in the first place, reusing items extends their life, and recycling is used as a last resort.',
  },
  {
    id: 6,
    q: 'Which part of Earth\'s atmosphere contains the ozone layer that shields us from harmful UV radiation?',
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
    answer: 1,
    explanation:
      'The ozone layer is found in the stratosphere, roughly 15–35 km above Earth\'s surface, where it absorbs the majority of the Sun\'s harmful ultraviolet-B and ultraviolet-C radiation.',
  },
  {
    id: 7,
    q: 'Which renewable energy technology generates electricity using the movement of water?',
    options: ['Solar photovoltaic', 'Wind turbines', 'Hydroelectric power', 'Geothermal plants'],
    answer: 2,
    explanation:
      'Hydroelectric power plants harness the kinetic and potential energy of flowing or falling water to spin turbines connected to generators, producing electricity with no direct carbon emissions.',
  },
  {
    id: 8,
    q: 'What does "carbon footprint" measure?',
    options: [
      'The physical mark carbon deposits leave on surfaces',
      'The total greenhouse gas emissions caused by an individual, activity, or product',
      'The amount of carbon dioxide currently in the atmosphere',
      'The cost of deploying carbon capture technology',
    ],
    answer: 1,
    explanation:
      'A carbon footprint is the total amount of greenhouse gases (expressed in CO₂-equivalent units) emitted directly or indirectly by a person, organisation, event, or product over its lifetime.',
  },
  {
    id: 9,
    q: 'Which UN Sustainable Development Goal specifically focuses on "Affordable and Clean Energy"?',
    options: ['SDG 6', 'SDG 7', 'SDG 13', 'SDG 15'],
    answer: 1,
    explanation:
      'SDG 7 — "Affordable and Clean Energy" — aims to ensure universal access to affordable, reliable, sustainable, and modern energy by 2030, promoting renewables and energy efficiency.',
  },
  {
    id: 10,
    q: 'What does "net zero" mean in the context of climate change?',
    options: [
      'Producing zero energy from all sources',
      'Eliminating all pollution from water bodies',
      'Balancing greenhouse gas emissions with removals so that net additions to the atmosphere equal zero',
      'Planting no trees while reducing emissions',
    ],
    answer: 2,
    explanation:
      '"Net zero" means achieving a balance between the amount of greenhouse gases emitted into the atmosphere and the amount removed or offset, so that overall atmospheric concentrations stop increasing.',
  },
];
