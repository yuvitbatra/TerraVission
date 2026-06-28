import { useState } from "react";
import { QUIZ } from "@/data/quiz";
import { score } from "@/lib/quiz-scoring";

type Stage = "intro" | "playing" | "results";

export default function Quiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [name, setName] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => QUIZ.map(() => -1));
  const [logged, setLogged] = useState<"sheet" | "local" | null>(null);

  const result = stage === "results" ? score(answers, QUIZ) : null;
  const q = QUIZ[current];

  function choose(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  }

  async function finish(finalAnswers: number[]) {
    const r = score(finalAnswers, QUIZ);
    setStage("results");
    try {
      const res = await fetch("/api/quiz-log", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Anonymous", score: r.correct, total: r.total }),
      });
      const data = await res.json().catch(() => ({ logged: false }));
      if (data && data.logged) {
        setLogged("sheet");
      } else {
        saveLocal(r.correct, r.total);
        setLogged("local");
      }
    } catch {
      saveLocal(r.correct, r.total);
      setLogged("local");
    }
  }

  function saveLocal(correct: number, total: number) {
    try {
      const key = "terravision-quiz-attempts";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push({ name: name.trim() || "Anonymous", score: correct, total, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {
      /* ignore storage errors */
    }
  }

  function next() {
    if (current < QUIZ.length - 1) setCurrent((c) => c + 1);
    else finish(answers);
  }

  function restart() {
    setStage("intro");
    setCurrent(0);
    setAnswers(QUIZ.map(() => -1));
    setLogged(null);
  }

  return (
    <div className="quiz">
      {stage === "intro" && (
        <div className="glass quiz-card quiz-intro">
          <h2 className="quiz-h">Ready to test your eco-knowledge?</h2>
          <p className="quiz-p">10 quick questions on sustainability. Enter your name to begin.</p>
          <label className="quiz-label">
            Your name
            <input
              className="quiz-input"
              type="text"
              value={name}
              maxLength={40}
              placeholder="e.g. Aarav"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button className="quiz-btn" onClick={() => setStage("playing")}>Start Quiz →</button>
        </div>
      )}

      {stage === "playing" && (
        <div className="glass quiz-card">
          <div className="quiz-progress">
            <span>Question {current + 1} of {QUIZ.length}</span>
            <div className="quiz-bar" aria-hidden="true">
              <div className="quiz-bar-fill" style={{ width: `${((current + 1) / QUIZ.length) * 100}%` }} />
            </div>
          </div>
          <h2 className="quiz-q">{q.q}</h2>
          <fieldset className="quiz-options">
            <legend className="sr-only">Choose an answer</legend>
            {q.options.map((opt, i) => (
              <label key={i} className={`quiz-option${answers[current] === i ? " is-selected" : ""}`}>
                <input
                  type="radio"
                  name={`q-${current}`}
                  checked={answers[current] === i}
                  onChange={() => choose(i)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </fieldset>
          <div className="quiz-nav">
            <button className="quiz-btn ghost" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
              ← Back
            </button>
            <button className="quiz-btn" onClick={next} disabled={answers[current] === -1}>
              {current === QUIZ.length - 1 ? "Finish" : "Next →"}
            </button>
          </div>
        </div>
      )}

      {stage === "results" && result && (
        <div className="quiz-results">
          <div className="glass quiz-card quiz-score">
            <p className="quiz-score-label">Your score</p>
            <p className="quiz-score-big">{result.correct} / {result.total}</p>
            <p className="quiz-score-pct">{result.percent}%</p>
            <p className="quiz-p">
              {result.percent >= 80 ? "Outstanding — you're an eco-champion! 🌟" :
               result.percent >= 50 ? "Good job! Review the explanations to go further. 🌱" :
               "Great start — read the explanations and try again! 📚"}
            </p>
            {logged === "sheet" && <p className="quiz-saved">✓ Score recorded.</p>}
            {logged === "local" && <p className="quiz-saved">✓ Score saved on this device.</p>}
            <button className="quiz-btn" onClick={restart}>↺ Try Again</button>
          </div>

          <div className="quiz-review">
            {QUIZ.map((question, i) => {
              const correct = answers[i] === question.answer;
              return (
                <div key={question.id} className={`glass quiz-card quiz-feedback${correct ? " ok" : " no"}`}>
                  <p className="quiz-fb-q"><span aria-hidden="true">{correct ? "✅" : "❌"}</span> {question.q}</p>
                  <p className="quiz-fb-a">
                    Correct answer: <strong>{question.options[question.answer]}</strong>
                    {!correct && answers[i] !== -1 && <> · You chose: {question.options[answers[i]]}</>}
                    {answers[i] === -1 && <> · You skipped this</>}
                  </p>
                  <p className="quiz-fb-x">{question.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .quiz { display: flex; flex-direction: column; gap: 1.25rem; }
        .quiz-card { padding: clamp(1.25rem, 4vw, 2rem); }
        .quiz-intro { display: flex; flex-direction: column; gap: 1rem; text-align: center; align-items: center; }
        .quiz-h { font-family: var(--font-display); font-size: var(--text-h3); font-weight: 800; color: var(--text); margin: 0; }
        .quiz-p { margin: 0; color: var(--text-muted); line-height: 1.6; }
        .quiz-label { display: flex; flex-direction: column; gap: 0.35rem; font-size: var(--text-sm); font-weight: 600; color: var(--text); width: 100%; max-width: 20rem; text-align: left; }
        .quiz-input { padding: 0.6rem 0.8rem; border-radius: 0.6rem; border: 1px solid var(--border-hairline); background: var(--surface); color: var(--text); font-size: var(--text-body); }
        .quiz-btn { padding: 0.65rem 1.4rem; border: none; border-radius: var(--radius-full); background-image: var(--gradient-brand); color: var(--text-on-gradient); font-family: var(--font-display); font-weight: 800; font-size: var(--text-body); cursor: pointer; }
        .quiz-btn.ghost { background-image: none; background: var(--glass-bg); color: var(--text); border: 1px solid var(--border-hairline); }
        .quiz-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .quiz-btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
        .quiz-progress { display: flex; flex-direction: column; gap: 0.5rem; font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 1rem; }
        .quiz-bar { height: 6px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
        .quiz-bar-fill { height: 100%; background-image: var(--gradient-brand); transition: width var(--dur-base) var(--ease-out); }
        .quiz-q { font-family: var(--font-display); font-size: var(--text-h3); font-weight: 700; color: var(--text); margin: 0 0 1rem; }
        .quiz-options { border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
        .quiz-option { display: flex; align-items: center; gap: 0.7rem; padding: 0.7rem 0.9rem; border-radius: 0.6rem; border: 1px solid var(--border-hairline); cursor: pointer; color: var(--text); transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out); }
        .quiz-option:hover { border-color: var(--color-green); }
        .quiz-option.is-selected { border-color: var(--color-green); background: color-mix(in srgb, var(--color-green) 10%, transparent); }
        .quiz-nav { display: flex; justify-content: space-between; gap: 0.75rem; margin-top: 1.25rem; }
        .quiz-score { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
        .quiz-score-label { margin: 0; text-transform: uppercase; letter-spacing: 0.1em; font-size: var(--text-xs); color: var(--text-subtle); font-weight: 700; }
        .quiz-score-big { font-family: var(--font-display); font-weight: 800; font-size: var(--text-h1); margin: 0; color: transparent; background-image: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; }
        .quiz-score-pct { font-family: var(--font-display); font-weight: 700; color: var(--text-muted); margin: 0; }
        .quiz-saved { color: var(--color-green-deep); font-size: var(--text-sm); margin: 0; }
        .quiz-review { display: flex; flex-direction: column; gap: 0.75rem; }
        .quiz-feedback { border-left: 3px solid var(--border-hairline); }
        .quiz-feedback.ok { border-left-color: var(--color-green); }
        .quiz-feedback.no { border-left-color: #ef4444; }
        .quiz-fb-q { font-weight: 700; color: var(--text); margin: 0 0 0.3rem; }
        .quiz-fb-a { margin: 0 0 0.3rem; font-size: var(--text-sm); color: var(--text-muted); }
        .quiz-fb-x { margin: 0; font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; font-style: italic; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
        @media (prefers-reduced-motion: reduce) { .quiz-bar-fill { transition: none; } }
      `}</style>
    </div>
  );
}
