/**
 * Server-only Gemini REST client.
 * NEVER import this from client-side code — the API key must not reach the browser.
 */

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

function getEnv(key: string): string | undefined {
  // import.meta.env is available in Astro server context; process.env as fallback
  try {
    const val = (import.meta.env as Record<string, string | undefined>)[key];
    if (val) return val;
  } catch {
    // import.meta.env may not be available in all contexts
  }
  try {
    return (process.env as Record<string, string | undefined>)[key];
  } catch {
    return undefined;
  }
}

function getApiKey(): string | undefined {
  return getEnv("GEMINI_API_KEY");
}

function getModel(): string {
  return getEnv("GEMINI_MODEL") ?? "gemini-flash-lite-latest";
}

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Public: geminiConfigured
// ---------------------------------------------------------------------------

/** Returns true iff GEMINI_API_KEY is set in the environment. */
export function geminiConfigured(): boolean {
  const key = getApiKey();
  return typeof key === "string" && key.length > 0;
}

// ---------------------------------------------------------------------------
// Internal types (Gemini REST shapes)
// ---------------------------------------------------------------------------

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface GeminiSystemInstruction {
  parts: GeminiPart[];
}

interface GeminiRequestBody {
  contents: GeminiContent[];
  systemInstruction?: GeminiSystemInstruction;
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
    role: string;
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

// ---------------------------------------------------------------------------
// Internal: build request body
// ---------------------------------------------------------------------------

function buildBody(
  messages: { role: "user" | "model"; text: string }[],
  system: string
): GeminiRequestBody {
  const body: GeminiRequestBody = {
    contents: messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
  };
  if (system && system.trim().length > 0) {
    body.systemInstruction = {
      parts: [{ text: system }],
    };
  }
  return body;
}

// ---------------------------------------------------------------------------
// Internal: throw on non-OK with message from body
// ---------------------------------------------------------------------------

async function throwIfNotOk(res: Response, context: string): Promise<void> {
  if (!res.ok) {
    let detail = "";
    try {
      const json = (await res.json()) as { error?: { message?: string } };
      detail = json?.error?.message ?? "";
    } catch {
      try {
        detail = await res.text();
      } catch {
        // ignore
      }
    }
    throw new Error(
      `[gemini] ${context} failed: HTTP ${res.status}${detail ? ` — ${detail}` : ""}`
    );
  }
}

// ---------------------------------------------------------------------------
// Public: streamGemini
// ---------------------------------------------------------------------------

/**
 * Calls the Gemini streamGenerateContent endpoint and returns a ReadableStream
 * of UTF-8 bytes containing only the model's text chunks, suitable for piping
 * into an SSE response.
 *
 * Each emitted chunk is a plain UTF-8 byte sequence of the text token(s) from
 * that streamed response chunk. Callers are responsible for SSE framing.
 */
export async function streamGemini(
  messages: { role: "user" | "model"; text: string }[],
  system: string
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("[gemini] GEMINI_API_KEY is not set");
  }

  const model = getModel();
  const url = `${BASE_URL}/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildBody(messages, system)),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  await throwIfNotOk(res, "streamGenerateContent");

  if (!res.body) {
    throw new Error("[gemini] streamGenerateContent: response body is null");
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Transform the raw SSE byte stream into plain text chunks.
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const raw = decoder.decode(chunk, { stream: true });
      // SSE lines look like: data: {"candidates":[{"content":{"parts":[{"text":"..."}],...}},...]}
      const lines = raw.split("\n");
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const jsonStr = line.slice(5).trim();
        if (!jsonStr || jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr) as GeminiResponse;
          const text =
            parsed?.candidates?.[0]?.content?.parts
              ?.map((p) => p.text)
              .join("") ?? "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        } catch {
          // Malformed SSE chunk — skip silently
        }
      }
    },
  });

  return res.body.pipeThrough(transform);
}

// ---------------------------------------------------------------------------
// Public: generateGemini
// ---------------------------------------------------------------------------

/**
 * Non-streaming Gemini generateContent call.
 * Returns the model's full text response.
 */
export async function generateGemini(
  prompt: string,
  system?: string
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("[gemini] GEMINI_API_KEY is not set");
  }

  const model = getModel();
  const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;

  const messages: { role: "user" | "model"; text: string }[] = [
    { role: "user", text: prompt },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildBody(messages, system ?? "")),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  await throwIfNotOk(res, "generateContent");

  const json = (await res.json()) as GeminiResponse;
  const text =
    json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";

  return text;
}
