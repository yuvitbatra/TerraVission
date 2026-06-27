/**
 * POST /api/eco-plan
 * Returns a JSON eco-action plan: { summary: string; actions: string[] }.
 * Uses Gemini if configured; falls back to local static plans otherwise.
 * Secrets are server-only; never forwarded to the client.
 */

import type { APIRoute } from "astro";
import { geminiConfigured, generateGemini } from "@/lib/gemini";
import {
  type EcoPlanInput,
  buildEcoPlanPrompt,
  fallbackEcoPlan,
} from "@/lib/eco-plan";

export const prerender = false;

const VALID_KINDS = new Set<string>(["carbon", "water", "energy"]);

// Strip markdown code fences that the model may wrap JSON in
function stripFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
}

function isValidPlan(
  v: unknown
): v is { summary: string; actions: string[] } {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.summary === "string" &&
    Array.isArray(obj.actions) &&
    (obj.actions as unknown[]).every((a) => typeof a === "string")
  );
}

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

  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify({ error: "Object body required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const raw = body as Record<string, unknown>;
  const kind = raw.kind;

  if (typeof kind !== "string" || !VALID_KINDS.has(kind)) {
    return new Response(
      JSON.stringify({ error: "kind must be one of: carbon, water, energy" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const metrics =
    raw.metrics && typeof raw.metrics === "object" && !Array.isArray(raw.metrics)
      ? (raw.metrics as Record<string, number | string>)
      : {};

  const payload: EcoPlanInput = {
    kind: kind as EcoPlanInput["kind"],
    metrics,
  };

  // Gemini path
  if (geminiConfigured()) {
    const system =
      "You are a concise sustainability advisor. Respond ONLY with valid compact JSON.";
    const prompt =
      buildEcoPlanPrompt(payload) +
      ' Respond ONLY as compact JSON {"summary":string,"actions":string[]}.';

    try {
      const raw = await generateGemini(prompt, system);
      const cleaned = stripFences(raw);
      let parsed: unknown;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = null;
      }
      if (isValidPlan(parsed)) {
        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      // Shape failure — fall through to static fallback
    } catch (err) {
      console.error("[eco-plan] generateGemini error, using fallback:", err);
    }
  }

  // Static fallback
  const plan = fallbackEcoPlan(payload);
  return new Response(JSON.stringify(plan), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// Reject non-POST
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  });
