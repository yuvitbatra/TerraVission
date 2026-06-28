import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "model"; text: string };

const SUGGESTIONS = [
  "How do solar panels work?",
  "Why should we save water?",
  "What are the 3 Rs of waste?",
  "Give me one easy eco tip.",
];

const GREETING =
  "Hi! I'm EcoBot 🌱 — your sustainability helper. Ask me anything about renewable energy, water, waste or protecting the planet!";

export default function EcoBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "model", text: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const history: Msg[] = [...messages, { role: "user", text: clean }];
    setMessages([...history, { role: "model", text: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/ecobot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.filter((m) => m.text) }),
      });
      if (!res.ok || !res.body) throw new Error("no stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          acc += payload;
          const snapshot = acc;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "model", text: snapshot };
            return next;
          });
        }
      }
      if (!acc) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "model", text: "Sorry, I couldn't answer that just now. Please try again!" };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "model", text: "I'm having trouble connecting right now. Please try again in a moment." };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="eb-fab glass"
        aria-label={open ? "Close EcoBot assistant" : "Open EcoBot assistant"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{open ? "✕" : "🌿"}</span>
        <span className="eb-fab-label">EcoBot</span>
      </button>

      {open && (
        <div className="eb-panel glass" role="dialog" aria-label="EcoBot chat" ref={panelRef}>
          <div className="eb-head">
            <span className="eb-title"><span aria-hidden="true">🌿</span> EcoBot</span>
            <button className="eb-close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="eb-messages" ref={scrollRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`eb-msg ${m.role === "user" ? "eb-user" : "eb-bot"}`}>
                {m.text || (busy && i === messages.length - 1 ? "…" : "")}
              </div>
            ))}
          </div>

          {messages.length <= 1 && (
            <div className="eb-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="eb-chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <form
            className="eb-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              className="eb-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sustainability…"
              aria-label="Your message"
              disabled={busy}
            />
            <button className="eb-send" type="submit" disabled={busy || !input.trim()} aria-label="Send">→</button>
          </form>
        </div>
      )}

      <style>{`
        .eb-fab {
          position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 900;
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.1rem; border-radius: var(--radius-full);
          border: 1px solid var(--border-hairline); background: var(--glass-bg-strong, var(--glass-bg));
          box-shadow: var(--shadow-glass); color: var(--text);
          font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm); cursor: pointer;
        }
        .eb-fab:hover { box-shadow: var(--shadow-glass), 0 0 0 3px color-mix(in srgb, var(--color-green) 20%, transparent); }
        .eb-fab:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
        @media (max-width: 480px) { .eb-fab-label { display: none; } }

        .eb-panel {
          position: fixed; bottom: 5.5rem; right: 1.75rem; z-index: 901;
          width: min(22rem, calc(100vw - 2rem)); height: min(30rem, calc(100vh - 8rem));
          display: flex; flex-direction: column; border-radius: 1rem; overflow: hidden;
          border: 1px solid var(--border-hairline); box-shadow: var(--shadow-glass);
        }
        .eb-head { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1rem; border-bottom: 1px solid var(--border-hairline); background-image: var(--gradient-brand); }
        .eb-title { font-family: var(--font-display); font-weight: 800; color: var(--text-on-gradient); }
        .eb-close { background: none; border: none; color: var(--text-on-gradient); cursor: pointer; font-size: 1rem; }
        .eb-messages { flex: 1; overflow-y: auto; padding: 0.9rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .eb-msg { max-width: 85%; padding: 0.55rem 0.8rem; border-radius: 0.8rem; font-size: var(--text-sm); line-height: 1.5; white-space: pre-wrap; }
        .eb-bot { align-self: flex-start; background: var(--surface-2); color: var(--text); border-bottom-left-radius: 0.2rem; }
        .eb-user { align-self: flex-end; background-image: var(--gradient-brand); color: var(--text-on-gradient); border-bottom-right-radius: 0.2rem; }
        .eb-suggestions { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0 0.9rem 0.6rem; }
        .eb-chip { padding: 0.35rem 0.7rem; border-radius: var(--radius-full); border: 1px solid var(--border-hairline); background: var(--glass-bg); color: var(--text-muted); font-size: var(--text-xs); cursor: pointer; }
        .eb-chip:hover { color: var(--text); border-color: var(--color-green); }
        .eb-form { display: flex; gap: 0.5rem; padding: 0.7rem; border-top: 1px solid var(--border-hairline); }
        .eb-input { flex: 1; padding: 0.55rem 0.75rem; border-radius: var(--radius-full); border: 1px solid var(--border-hairline); background: var(--surface); color: var(--text); font-size: var(--text-sm); }
        .eb-input:focus-visible { outline: 2px solid var(--ring); outline-offset: 1px; }
        .eb-send { width: 2.4rem; border: none; border-radius: var(--radius-full); background-image: var(--gradient-brand); color: var(--text-on-gradient); font-weight: 800; cursor: pointer; }
        .eb-send:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </>
  );
}
