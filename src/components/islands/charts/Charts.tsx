/**
 * Charts.tsx — lightweight pure-SVG chart island (no external chart library).
 *
 * Exports: LineChart, BarChart, DonutChart
 *
 * All charts:
 *   - Are hand-built SVG (no d3 / recharts / etc.)
 *   - Use CSS vars (var(--color-green), var(--text), etc.) — never raw hex
 *   - Animate on first scroll into view via IntersectionObserver
 *   - Skip animation when prefers-reduced-motion is set
 *   - Expose keyboard-focusable data elements (bars / points / slices)
 *   - Render hover + focus tooltips
 *   - Carry role="img" + <title> + <desc> for screen readers
 */

import React, {
  useEffect,
  useRef,
  useState,
  useId,
  type RefObject,
} from "react";
import type { LineDataPoint, DonutSlice, BarDataItem } from "@/data/impact";

// ============================================================================
// Shared hooks
// ============================================================================

/** Returns true once the user has requested reduced motion. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/** Returns true once the referenced element enters the viewport. */
function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

// ============================================================================
// Shared tooltip
// ============================================================================

interface TooltipState {
  x: number;
  y: number;
  text: string;
  visible: boolean;
}

function ChartTooltip({ x, y, text, visible }: TooltipState) {
  if (!visible || !text) return null;
  const w = Math.max(text.length * 7.8 + 18, 52);
  const left = x - w / 2;
  return (
    <g role="tooltip" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <rect
        x={left}
        y={y - 36}
        width={w}
        height={22}
        rx={5}
        fill="var(--surface)"
        stroke="var(--border-strong)"
        strokeWidth={1}
        style={{ filter: "drop-shadow(0 2px 6px var(--shadow-ambient))" }}
      />
      <text
        x={x}
        y={y - 20}
        textAnchor="middle"
        fontSize={11}
        fill="var(--text)"
        fontFamily="var(--font-body)"
        fontWeight={600}
      >
        {text}
      </text>
    </g>
  );
}

// ============================================================================
// LineChart
// ============================================================================

export interface LineChartProps {
  data: LineDataPoint[];
  title: string;
  summary: string;
  yLabel?: string;
  yUnit?: string;
}

export function LineChart({
  data,
  title,
  summary,
  yLabel = "",
  yUnit = "%",
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inView = useInView(svgRef as RefObject<Element | null>);
  const reduced = useReducedMotion();
  const rawId = useId();
  const id = rawId.replace(/:/g, "lc");
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });
  const [animated, setAnimated] = useState(false);

  // Chart geometry
  const W = 400, H = 264;
  const padL = 54, padR = 20, padT = 24, padB = 48;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const vals = data.map((d) => d.value);
  const minVal = Math.floor(Math.min(...vals) - 2);
  const maxVal = Math.ceil(Math.max(...vals) + 2);

  const xOf = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const yOf = (v: number) =>
    padT + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const pts = data.map((d, i) => ({ x: xOf(i), y: yOf(d.value), ...d }));

  const lineD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaD =
    lineD +
    ` L ${pts[pts.length - 1].x.toFixed(1)} ${(padT + chartH).toFixed(1)}` +
    ` L ${pts[0].x.toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;

  // Y-axis ticks (5 steps)
  const yTicks = Array.from({ length: 5 }, (_, i) =>
    Math.round(minVal + ((maxVal - minVal) / 4) * i)
  );

  // Animate line draw via stroke-dashoffset
  useEffect(() => {
    if (!inView || animated) return;
    setAnimated(true);
    if (reduced) return;
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    if (!len) return;
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    void path.getBoundingClientRect(); // force reflow
    path.style.transition =
      "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)";
    path.style.strokeDashoffset = "0";
  }, [inView, reduced, animated]);

  const showDots = animated || reduced;

  return (
    <figure style={{ margin: 0 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        style={{ overflow: "visible", display: "block" }}
      >
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{summary}</desc>

        <defs>
          <linearGradient id={`${id}-ag`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-green)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--color-green)" stopOpacity={0.02} />
          </linearGradient>
          <clipPath id={`${id}-cp`}>
            <rect x={padL} y={padT} width={chartW} height={chartH + 2} />
          </clipPath>
        </defs>

        {/* Grid lines + y-axis labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padL}
              y1={yOf(tick)}
              x2={W - padR}
              y2={yOf(tick)}
              stroke="var(--border-hairline)"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={yOf(tick) + 4}
              textAnchor="end"
              fontSize={10}
              fill="var(--text-muted)"
              fontFamily="var(--font-body)"
            >
              {tick}{yUnit}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path
          d={areaD}
          fill={`url(#${id}-ag)`}
          clipPath={`url(#${id}-cp)`}
          style={{
            opacity: showDots ? 1 : 0,
            transition: "opacity 0.5s 1.2s ease",
          }}
        />

        {/* Line */}
        <path
          ref={pathRef}
          d={lineD}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          clipPath={`url(#${id}-cp)`}
        />

        {/* X-axis labels (every other point to avoid crowding) */}
        {pts.map(
          (p, i) =>
            i % 2 === 0 && (
              <text
                key={i}
                x={p.x}
                y={H - padB + 16}
                textAnchor="middle"
                fontSize={10}
                fill="var(--text-muted)"
                fontFamily="var(--font-body)"
              >
                {p.year}
              </text>
            )
        )}

        {/* Focusable dots (rendered after animation) */}
        {showDots &&
          pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={5}
              fill="var(--color-green)"
              stroke="var(--surface)"
              strokeWidth={2}
              tabIndex={0}
              role="graphics-symbol"
              aria-label={`${p.year}: ${p.value}${yUnit}`}
              style={{ cursor: "pointer", outline: "none" }}
              onMouseEnter={() =>
                setTooltip({
                  x: p.x,
                  y: p.y,
                  text: `${p.year}: ${p.value}${yUnit}`,
                  visible: true,
                })
              }
              onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
              onFocus={() =>
                setTooltip({
                  x: p.x,
                  y: p.y,
                  text: `${p.year}: ${p.value}${yUnit}`,
                  visible: true,
                })
              }
              onBlur={() => setTooltip((t) => ({ ...t, visible: false }))}
            />
          ))}

        <ChartTooltip {...tooltip} />
      </svg>

      {yLabel && (
        <figcaption
          style={{
            textAlign: "center",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            marginTop: "0.5rem",
          }}
        >
          {yLabel}
        </figcaption>
      )}
    </figure>
  );
}

// ============================================================================
// BarChart
// ============================================================================

// Palette: CSS vars from design system, mixed or extended where needed.
const BAR_PALETTE = [
  "var(--color-green)",
  "var(--color-blue)",
  "var(--color-green-deep)",
  "var(--color-blue-deep)",
  "color-mix(in srgb, var(--color-green) 65%, var(--color-blue))",
  "color-mix(in srgb, var(--color-blue) 65%, var(--color-green-deep))",
];

export interface BarChartProps {
  data: BarDataItem[];
  title: string;
  summary: string;
  yLabel?: string;
  unit?: string;
}

export function BarChart({
  data,
  title,
  summary,
  yLabel = "",
  unit = "",
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef as RefObject<Element | null>);
  const reduced = useReducedMotion();
  const rawId = useId();
  const id = rawId.replace(/:/g, "bc");
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });
  const [progress, setProgress] = useState(0);

  const W = 400, H = 264;
  const padL = 54, padR = 16, padT = 24, padB = 68;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.ceil(Math.max(...data.map((d) => d.value)) * 1.18);
  const slotW = chartW / data.length;
  const barW = slotW * 0.58;

  // Animate bars on scroll into view
  useEffect(() => {
    if (!inView || progress > 0) return;
    if (reduced) { setProgress(1); return; }
    let start: number | null = null;
    const dur = 900;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setProgress(ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, reduced, progress]);

  const yTicks = Array.from({ length: 4 }, (_, i) =>
    Math.round((maxVal / 3) * i)
  );

  return (
    <figure style={{ margin: 0 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        style={{ overflow: "visible", display: "block" }}
      >
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{summary}</desc>

        {/* Grid lines + y-axis labels */}
        {yTicks.map((tick, i) => {
          const y = padT + chartH - (tick / maxVal) * chartH;
          return (
            <g key={i}>
              <line
                x1={padL}
                y1={y}
                x2={W - padR}
                y2={y}
                stroke="var(--border-hairline)"
                strokeWidth={1}
              />
              <text
                x={padL - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="var(--text-muted)"
                fontFamily="var(--font-body)"
              >
                {tick}{unit}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={padL}
          y1={padT + chartH}
          x2={W - padR}
          y2={padT + chartH}
          stroke="var(--border-strong)"
          strokeWidth={1}
        />

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * chartH * progress;
          const x = padL + slotW * i + (slotW - barW) / 2;
          const y = padT + chartH - barH;
          const midX = x + barW / 2;
          const words = d.label.split(" ");

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={BAR_PALETTE[i % BAR_PALETTE.length]}
                opacity={0.88}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${d.label}: ${d.value}${unit}`}
                style={{ cursor: "pointer", outline: "none" }}
                onMouseEnter={() =>
                  setTooltip({
                    x: midX,
                    y: y,
                    text: `${d.value}${unit}`,
                    visible: true,
                  })
                }
                onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                onFocus={() =>
                  setTooltip({
                    x: midX,
                    y: y,
                    text: `${d.label}: ${d.value}${unit}`,
                    visible: true,
                  })
                }
                onBlur={() => setTooltip((t) => ({ ...t, visible: false }))}
              />
              {/* Multi-line x-axis label */}
              {words.map((word, wi) => (
                <text
                  key={wi}
                  x={midX}
                  y={padT + chartH + 14 + wi * 11}
                  textAnchor="middle"
                  fontSize={9}
                  fill="var(--text-muted)"
                  fontFamily="var(--font-body)"
                >
                  {word}
                </text>
              ))}
            </g>
          );
        })}

        <ChartTooltip {...tooltip} />
      </svg>

      {yLabel && (
        <figcaption
          style={{
            textAlign: "center",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            marginTop: "0.5rem",
          }}
        >
          {yLabel}
        </figcaption>
      )}
    </figure>
  );
}

// ============================================================================
// DonutChart
// ============================================================================

// Palette: design-system tokens where possible; chart-specific via CSS vars
// defined in impact.astro <style> (--chart-coal, --chart-gas, etc.)
const DONUT_PALETTE = [
  "var(--chart-coal)",
  "var(--chart-gas)",
  "var(--color-blue)",
  "var(--chart-nuclear)",
  "var(--color-green)",
  "var(--chart-solar)",
  "var(--color-green-deep)",
];

export interface DonutChartProps {
  data: DonutSlice[];
  title: string;
  summary: string;
}

export function DonutChart({ data, title, summary }: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef as RefObject<Element | null>);
  const reduced = useReducedMotion();
  const rawId = useId();
  const id = rawId.replace(/:/g, "dc");
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView || progress > 0) return;
    if (reduced) { setProgress(1); return; }
    let start: number | null = null;
    const dur = 1100;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setProgress(ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, reduced, progress]);

  const W = 300, H = 300;
  const cx = W / 2, cy = H / 2;
  const outerR = 110, innerR = 66;
  const total = data.reduce((s, d) => s + d.value, 0);

  function polar(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180; // 0° = top
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  // Build slice paths — each slice's sweep is scaled by progress so the donut
  // "grows" clockwise from 12 o'clock.
  let cumProp = 0;
  const slices = data.map((d, i) => {
    const prop = d.value / total;
    const startDeg = cumProp * 360 * progress;
    const endDeg = (cumProp + prop) * 360 * progress;
    const sliceDeg = endDeg - startDeg;

    // Tooltip position: use the full-scale mid-angle (stable across animation)
    const fullMidDeg = (cumProp + prop / 2) * 360;
    const tipPos = polar(fullMidDeg, outerR + 18);

    cumProp += prop;

    if (sliceDeg < 0.3) {
      return { pathD: "", color: DONUT_PALETTE[i % DONUT_PALETTE.length], ...d, tipPos };
    }

    const p1 = polar(startDeg, outerR);
    const p2 = polar(endDeg, outerR);
    const p3 = polar(endDeg, innerR);
    const p4 = polar(startDeg, innerR);
    const large = sliceDeg > 180 ? 1 : 0;

    const pathD = [
      `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
      `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
      "Z",
    ].join(" ");

    return {
      pathD,
      color: DONUT_PALETTE[i % DONUT_PALETTE.length],
      label: d.label,
      value: d.value,
      tipPos,
    };
  });

  const done = progress >= 0.98;

  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        style={{ overflow: "visible", display: "block", maxWidth: 300 }}
      >
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{summary}</desc>

        {slices.map(
          (s, i) =>
            s.pathD && (
              <path
                key={i}
                d={s.pathD}
                fill={s.color}
                stroke="var(--surface)"
                strokeWidth={2}
                tabIndex={done ? 0 : -1}
                role="graphics-symbol"
                aria-label={`${s.label}: ${s.value}%`}
                style={{ cursor: done ? "pointer" : "default", outline: "none" }}
                onMouseEnter={() =>
                  setTooltip({
                    x: s.tipPos.x,
                    y: s.tipPos.y,
                    text: `${s.label}: ${s.value}%`,
                    visible: true,
                  })
                }
                onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                onFocus={() =>
                  setTooltip({
                    x: s.tipPos.x,
                    y: s.tipPos.y,
                    text: `${s.label}: ${s.value}%`,
                    visible: true,
                  })
                }
                onBlur={() => setTooltip((t) => ({ ...t, visible: false }))}
              />
            )
        )}

        {/* Centre label */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize={12}
          fill="var(--text-muted)"
          fontFamily="var(--font-body)"
          fontWeight={600}
        >
          Electricity
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize={12}
          fill="var(--text-muted)"
          fontFamily="var(--font-body)"
          fontWeight={600}
        >
          Mix 2023
        </text>

        <ChartTooltip {...tooltip} />
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.35rem 0.85rem",
          justifyContent: "center",
          marginTop: "0.875rem",
          width: "100%",
        }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "var(--text-xs)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: DONUT_PALETTE[i % DONUT_PALETTE.length],
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <span style={{ color: "var(--text-muted)" }}>
              {d.label}{" "}
              <span style={{ color: "var(--text-subtle)" }}>({d.value}%)</span>
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
