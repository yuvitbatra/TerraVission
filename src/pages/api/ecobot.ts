/**
 * POST /api/ecobot
 * Streaming SSE endpoint for the EcoBot sustainability tutor.
 * Secrets are server-only; never forwarded to the client.
 */

import type { APIRoute } from "astro";
import { geminiConfigured, streamGemini } from "@/lib/gemini";

export const prerender = false;

// ---------------------------------------------------------------------------
// Rule-based fallback knowledge base
// ---------------------------------------------------------------------------

const KB: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ["solar", "solar panel", "photovoltaic", "pv"],
    answer:
      "Solar energy comes from the Sun's rays captured by photovoltaic (PV) panels and converted into electricity. Solar panels produce zero emissions during operation, making them one of the cleanest energy sources available. A typical rooftop system can meet 50–100% of a household's electricity needs and pays back its carbon cost in 1–4 years.",
  },
  {
    keys: ["wind", "wind turbine", "wind energy", "wind power"],
    answer:
      "Wind energy harnesses the kinetic energy of moving air using turbines. It is one of the fastest-growing renewable sources globally. Onshore wind is now the cheapest form of new electricity generation in many countries. Wind turbines emit no greenhouse gases during operation and can coexist with farmland.",
  },
  {
    keys: ["rainwater", "rain water", "rainwater harvest", "rain harvesting"],
    answer:
      "Rainwater harvesting collects and stores rainfall for later use — for irrigation, toilet flushing, or (with treatment) drinking. A 100 m² roof can capture around 60,000 litres of water per year. This reduces demand on treated mains water and helps manage stormwater runoff, protecting rivers and groundwater.",
  },
  {
    keys: ["waste", "recycling", "recycle", "landfill", "composting", "compost"],
    answer:
      "Waste reduction follows the '5 Rs': Refuse, Reduce, Reuse, Recycle, and Rot (compost). Recycling saves energy — recycling aluminium uses 95% less energy than making new aluminium. Composting food and garden waste keeps organic matter out of landfill, where it would produce methane, a powerful greenhouse gas.",
  },
  {
    keys: ["water purif", "drinking water", "clean water", "water treatment", "filter water"],
    answer:
      "Water purification makes water safe to drink by removing pathogens, chemicals, and sediments. Common methods include boiling, chlorination, UV treatment, and ceramic or carbon filtration. Access to clean water is UN Sustainable Development Goal (SDG) 6. Simple biosand filters or solar disinfection (SODIS) can purify water in low-resource settings.",
  },
  {
    keys: ["climate", "climate change", "global warming", "greenhouse", "co2", "carbon dioxide"],
    answer:
      "Climate change refers to long-term shifts in global temperatures and weather patterns, primarily driven since the 1800s by human activities — mainly burning fossil fuels. This releases CO₂ and other greenhouse gases that trap heat in the atmosphere. Limiting warming to 1.5 °C above pre-industrial levels requires roughly halving global emissions by 2030 and reaching net-zero by 2050.",
  },
  {
    keys: ["sdg", "sustainable development goal", "sustainable development goals", "united nations goals"],
    answer:
      "The 17 UN Sustainable Development Goals (SDGs) are a blueprint for a better world by 2030. Key SDGs include SDG 7 (Affordable and Clean Energy), SDG 13 (Climate Action), SDG 6 (Clean Water and Sanitation), and SDG 12 (Responsible Consumption and Production). Every action — from switching off lights to choosing local food — contributes to these global goals.",
  },
  {
    keys: ["energy saving", "save energy", "energy efficiency", "electricity saving", "reduce electricity"],
    answer:
      "Energy-saving tips: switch to LED bulbs (75% less energy than incandescent), set your thermostat 1–2 °C lower, unplug devices on standby, run appliances on eco-mode with full loads, and insulate your home. Collectively, improved energy efficiency could deliver 40% of the emissions cuts needed to meet climate targets.",
  },
  {
    keys: ["water saving", "save water", "water conservation", "reduce water"],
    answer:
      "Water-saving tips: take shorter showers (saving ~10 L/minute), turn off the tap while brushing teeth (saves ~6 L/minute), fix dripping taps, run full dishwasher/washing machine loads, and use drought-tolerant plants in gardens. Freshwater makes up only 3% of Earth's water, and less than 1% is easily accessible — every drop matters.",
  },
];

function fallbackAnswer(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const entry of KB) {
    if (entry.keys.some((k) => lower.includes(k))) {
      return entry.answer;
    }
  }
  return (
    "Great question! Sustainability covers topics like renewable energy (solar, wind), " +
    "water conservation, waste reduction, climate action, and the UN's 17 SDGs. " +
    "Feel free to ask me anything about those topics and I'll do my best to help!"
  );
}

// ---------------------------------------------------------------------------
// SSE helpers
// ---------------------------------------------------------------------------

function sseChunk(text: string): Uint8Array {
  // Escape newlines within a single data field value
  const escaped = text.replace(/\n/g, " ");
  return new TextEncoder().encode(`data: ${escaped}\n\n`);
}

const SSE_DONE = new TextEncoder().encode("data: [DONE]\n\n");

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const POST: APIRoute = async ({ request }) => {
  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as Record<string, unknown>).messages)
  ) {
    return new Response(JSON.stringify({ error: "messages array required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = (body as { messages: { role: "user" | "model"; text: string }[] }).messages;

  const sseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
  };

  // ---------------------------------------------------------------------------
  // Gemini path
  // ---------------------------------------------------------------------------
  if (geminiConfigured()) {
    const system =
      "You are EcoBot, a friendly sustainability tutor for Class 8–10 students. " +
      "Answer accurately and concisely about sustainability, renewable energy, water, " +
      "waste, climate, and related topics. Politely decline questions that are unrelated " +
      "to sustainability or that are unsafe. Keep answers clear and encouraging.";

    let geminiStream: ReadableStream<Uint8Array>;
    try {
      geminiStream = await streamGemini(messages, system);
    } catch (err) {
      // Fall through to rule-based on Gemini error
      console.error("[ecobot] streamGemini error, using fallback:", err);
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const answer = fallbackAnswer(lastUser?.text ?? "");
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(sseChunk(answer));
          controller.enqueue(SSE_DONE);
          controller.close();
        },
      });
      return new Response(stream, { headers: sseHeaders });
    }

    // Wrap Gemini text-chunk stream into SSE framing
    const encoder = new TextEncoder();
    const sseStream = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        if (text) {
          controller.enqueue(encoder.encode(`data: ${text.replace(/\n/g, " ")}\n\n`));
        }
      },
      flush(controller) {
        controller.enqueue(SSE_DONE);
      },
    });

    return new Response(geminiStream.pipeThrough(sseStream), {
      headers: sseHeaders,
    });
  }

  // ---------------------------------------------------------------------------
  // Rule-based fallback path
  // ---------------------------------------------------------------------------
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const answer = fallbackAnswer(lastUser?.text ?? "");

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(sseChunk(answer));
      controller.enqueue(SSE_DONE);
      controller.close();
    },
  });

  return new Response(stream, { headers: sseHeaders });
};

// Reject non-POST
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  });
