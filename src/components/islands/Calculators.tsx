import { useMemo, useState } from "react";
import {
  carbonFootprint,
  waterSaving,
  energySaving,
} from "@/lib/calculators";

type Tab = "carbon" | "water" | "energy";
type Plan = { summary: string; actions: string[] };

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "carbon", label: "Carbon", icon: "🌍" },
  { id: "water", label: "Water", icon: "💧" },
  { id: "energy", label: "Energy", icon: "⚡" },
];

function num(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function Calculators() {
  const [tab, setTab] = useState<Tab>("carbon");

  // Carbon inputs
  const [electricityKwh, setElec] = useState("300");
  const [carKm, setCarKm] = useState("800");
  const [flightsPerYear, setFlights] = useState("1");
  const [diet, setDiet] = useState<"meat" | "mixed" | "veg">("mixed");

  // Water inputs
  const [showerMins, setShower] = useState("8");
  const [tapTightening, setTap] = useState(true);
  const [rainwaterLitres, setRain] = useState("200");
  const [people, setPeople] = useState("4");

  // Energy inputs
  const [ledBulbs, setLed] = useState("8");
  const [acHoursReduced, setAc] = useState("2");
  const [applianceStandbyDevices, setStandby] = useState("5");

  const carbon = useMemo(
    () =>
      carbonFootprint({
        electricityKwh: num(electricityKwh),
        carKm: num(carKm),
        flightsPerYear: num(flightsPerYear),
        diet,
      }),
    [electricityKwh, carKm, flightsPerYear, diet]
  );
  const water = useMemo(
    () =>
      waterSaving({
        showerMins: num(showerMins),
        tapTightening,
        rainwaterLitres: num(rainwaterLitres),
        people: num(people),
      }),
    [showerMins, tapTightening, rainwaterLitres, people]
  );
  const energy = useMemo(
    () =>
      energySaving({
        ledBulbs: num(ledBulbs),
        acHoursReduced: num(acHoursReduced),
        applianceStandbyDevices: num(applianceStandbyDevices),
      }),
    [ledBulbs, acHoursReduced, applianceStandbyDevices]
  );

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getPlan() {
    setLoading(true);
    setError(null);
    setPlan(null);
    const metrics: Record<string, number | string> =
      tab === "carbon"
        ? { tonnesPerYear: carbon.tonnesPerYear, ...carbon.breakdown }
        : tab === "water"
          ? { litresSavedPerYear: water.litresSavedPerYear, people: num(people) }
          : { kwhSavedPerYear: energy.kwhSavedPerYear, co2KgSaved: energy.co2KgSaved };
    try {
      const res = await fetch("/api/eco-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: tab, metrics }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as Plan;
      setPlan(data);
    } catch {
      setError("Couldn't generate a plan right now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const label: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    fontSize: "var(--text-sm)",
    color: "var(--text)",
    fontWeight: 600,
  };
  const input: React.CSSProperties = {
    padding: "0.55rem 0.7rem",
    borderRadius: "0.6rem",
    border: "1px solid var(--border-hairline)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: "var(--text-body)",
  };

  return (
    <div className="calc">
      <div className="calc-tabs" role="tablist" aria-label="Choose a calculator">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`calc-tab${tab === t.id ? " is-active" : ""}`}
            onClick={() => {
              setTab(t.id);
              setPlan(null);
              setError(null);
            }}
          >
            <span aria-hidden="true">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="glass calc-panel" role="tabpanel">
        {tab === "carbon" && (
          <div className="calc-grid">
            <label style={label}>
              Monthly electricity (kWh)
              <input style={input} type="number" min="0" value={electricityKwh} onChange={(e) => setElec(e.target.value)} />
            </label>
            <label style={label}>
              Car travel per month (km)
              <input style={input} type="number" min="0" value={carKm} onChange={(e) => setCarKm(e.target.value)} />
            </label>
            <label style={label}>
              Flights per year
              <input style={input} type="number" min="0" value={flightsPerYear} onChange={(e) => setFlights(e.target.value)} />
            </label>
            <label style={label}>
              Diet
              <select style={input} value={diet} onChange={(e) => setDiet(e.target.value as typeof diet)}>
                <option value="meat">Meat-heavy</option>
                <option value="mixed">Mixed</option>
                <option value="veg">Vegetarian</option>
              </select>
            </label>
          </div>
        )}

        {tab === "water" && (
          <div className="calc-grid">
            <label style={label}>
              Shower length (minutes)
              <input style={input} type="number" min="0" value={showerMins} onChange={(e) => setShower(e.target.value)} />
            </label>
            <label style={label}>
              People in household
              <input style={input} type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
            </label>
            <label style={label}>
              Rainwater collected (litres/day)
              <input style={input} type="number" min="0" value={rainwaterLitres} onChange={(e) => setRain(e.target.value)} />
            </label>
            <label style={{ ...label, flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={tapTightening} onChange={(e) => setTap(e.target.checked)} />
              Fix dripping taps
            </label>
          </div>
        )}

        {tab === "energy" && (
          <div className="calc-grid">
            <label style={label}>
              Bulbs switched to LED
              <input style={input} type="number" min="0" value={ledBulbs} onChange={(e) => setLed(e.target.value)} />
            </label>
            <label style={label}>
              AC hours reduced per day
              <input style={input} type="number" min="0" value={acHoursReduced} onChange={(e) => setAc(e.target.value)} />
            </label>
            <label style={label}>
              Devices unplugged from standby
              <input style={input} type="number" min="0" value={applianceStandbyDevices} onChange={(e) => setStandby(e.target.value)} />
            </label>
          </div>
        )}

        <div className="calc-result" aria-live="polite">
          {tab === "carbon" && (
            <>
              <span className="calc-big">{carbon.tonnesPerYear}</span>
              <span className="calc-unit">tonnes CO₂ / year</span>
              <p className="calc-note">
                That's your estimated annual carbon footprint. The global average is around 4 tonnes;
                to limit warming we need to head toward ~2 tonnes per person.
              </p>
            </>
          )}
          {tab === "water" && (
            <>
              <span className="calc-big">{water.litresSavedPerYear.toLocaleString()}</span>
              <span className="calc-unit">litres saved / year</span>
              <p className="calc-note">Water you could save each year with these habits — enough to fill many bathtubs!</p>
            </>
          )}
          {tab === "energy" && (
            <>
              <span className="calc-big">{energy.kwhSavedPerYear.toLocaleString()}</span>
              <span className="calc-unit">kWh saved / year (~{energy.co2KgSaved} kg CO₂)</span>
              <p className="calc-note">Electricity — and the emissions behind it — that you could avoid each year.</p>
            </>
          )}
        </div>

        <button className="calc-plan-btn" onClick={getPlan} disabled={loading}>
          {loading ? "Creating your plan…" : "✨ Get my eco-action plan"}
        </button>

        {error && <p className="calc-error" role="alert">{error}</p>}

        {plan && (
          <div className="glass calc-plan" role="region" aria-label="Your eco-action plan">
            <p className="calc-plan-summary">{plan.summary}</p>
            <ul className="calc-plan-actions">
              {plan.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        .calc { display: flex; flex-direction: column; gap: 1rem; }
        .calc-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .calc-tab {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.5rem 1.1rem; border-radius: var(--radius-full);
          border: 1px solid var(--border-hairline); background: var(--glass-bg);
          color: var(--text-muted); font-family: var(--font-display); font-weight: 600;
          font-size: var(--text-sm); cursor: pointer;
        }
        .calc-tab.is-active { color: var(--text-on-gradient); background-image: var(--gradient-brand); border-color: transparent; }
        .calc-tab:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
        .calc-panel { padding: clamp(1.1rem, 4vw, 1.75rem); display: flex; flex-direction: column; gap: 1.25rem; }
        .calc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr)); gap: 1rem; }
        .calc-result { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.25rem; padding-top: 0.5rem; }
        .calc-big { font-family: var(--font-display); font-weight: 800; font-size: var(--text-h1); line-height: 1;
          color: transparent; background-image: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; }
        .calc-unit { font-family: var(--font-display); font-weight: 600; color: var(--text-muted); }
        .calc-note { margin: 0.4rem 0 0; font-size: var(--text-sm); color: var(--text-muted); max-width: 34rem; line-height: 1.6; }
        .calc-plan-btn {
          align-self: center; padding: 0.7rem 1.4rem; border: none; border-radius: var(--radius-full);
          background-image: var(--gradient-brand); color: var(--text-on-gradient);
          font-family: var(--font-display); font-weight: 800; font-size: var(--text-body); cursor: pointer;
        }
        .calc-plan-btn:disabled { opacity: 0.6; cursor: progress; }
        .calc-plan-btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
        .calc-error { color: #b91c1c; text-align: center; margin: 0; font-size: var(--text-sm); }
        .calc-plan { padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .calc-plan-summary { margin: 0; color: var(--text); font-weight: 600; }
        .calc-plan-actions { margin: 0; padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem; }
        .calc-plan-actions li { color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; }
        @media (prefers-reduced-motion: reduce) { .calc-plan-btn { transition: none; } }
      `}</style>
    </div>
  );
}
