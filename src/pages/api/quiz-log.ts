/**
 * POST /api/quiz-log
 * Logs quiz results to a Google Apps Script Sheets webhook if configured.
 * Returns { ok: boolean; logged: boolean }.
 * Secrets are server-only; never forwarded to the client.
 */

import type { APIRoute } from "astro";

export const prerender = false;

const NAME_MAX_LENGTH = 60;

function getSheetsUrl(): string | undefined {
  try {
    const val = (import.meta.env as Record<string, string | undefined>)[
      "SHEETS_WEBAPP_URL"
    ];
    if (val) return val;
  } catch {
    // ignore
  }
  try {
    return (process.env as Record<string, string | undefined>)[
      "SHEETS_WEBAPP_URL"
    ];
  } catch {
    return undefined;
  }
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

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return new Response(JSON.stringify({ error: "Object body required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const raw = body as Record<string, unknown>;

  // Validate name
  if (typeof raw.name !== "string" || raw.name.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "name must be a non-empty string" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const name = raw.name.trim().slice(0, NAME_MAX_LENGTH);

  // Validate score
  if (
    typeof raw.score !== "number" ||
    !isFinite(raw.score) ||
    raw.score < 0
  ) {
    return new Response(
      JSON.stringify({ error: "score must be a finite number >= 0" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate total
  if (
    typeof raw.total !== "number" ||
    !isFinite(raw.total) ||
    raw.total < 0
  ) {
    return new Response(
      JSON.stringify({ error: "total must be a finite number >= 0" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const score = raw.score as number;
  const total = raw.total as number;

  // Attempt Sheets webhook if configured
  const sheetsUrl = getSheetsUrl();
  if (sheetsUrl) {
    try {
      const res = await fetch(sheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Never echo the URL or any secret; only send sanitised payload
        body: JSON.stringify({ name, score, total }),
      });
      if (res.ok) {
        return new Response(JSON.stringify({ ok: true, logged: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      // Sheets POST failed — degrade gracefully
      console.error("[quiz-log] Sheets POST failed:", res.status);
    } catch (err) {
      console.error("[quiz-log] Sheets POST error:", err);
    }
    // Fall through: logged:false
  }

  return new Response(JSON.stringify({ ok: true, logged: false }), {
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
