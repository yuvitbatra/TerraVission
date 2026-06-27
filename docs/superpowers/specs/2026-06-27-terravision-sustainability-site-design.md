# TerraVision — "Sustainable Planet: Eco-Friendly Solutions" — Design Spec

**Date:** 2026-06-27
**Status:** Approved (design); pending spec review

## 1. Overview

A national-level, science-exhibition-quality educational website on sustainability,
green technology, and protecting the Earth. Built by students, for teachers and judges.
Must impress on **both** design and educational value. All content accurate and readable
for Class 8–10 students. No lorem ipsum — every page ships real, accurate content.

**Team (Team page + footer):** Ivaan, Shiven, Jaskeerat, Laksh, Darshil.
Clearly-labelled placeholders for **Class**, **School Name**, **Teacher Name**.

## 2. Tech Stack

- **Astro + TypeScript + Tailwind CSS**, multi-page (real routes).
- **`@astrojs/vercel` adapter** — whole app deploys to Vercel as ONE project.
- Static HTML/CSS by default; **small React islands ONLY** for calculators, quiz,
  EcoBot chat, and charts — hydrated `client:visible`. shadcn/ui optional, inside islands only.
- **Backend = Astro server endpoints** under `src/pages/api/` → Vercel serverless functions.
  No separate backend, no Python.
- **All secret keys live only in server endpoints / Vercel env vars** — never in the browser.
- **SEO:** per-page `<title>`/meta, Open Graph tags, semantic HTML, sitemap, robots.txt.

## 3. Performance Targets

- Lighthouse **90+ on mobile**. Total JS tiny (islands only).
- Astro `<Image>` for lazy-loading, modern formats, explicit width/height.
- **CSS/SVG animations** over JS animation libs. Respect `prefers-reduced-motion`.
- **Light charting:** hand-built SVG chart components (no heavy lib).
- All serverless responses well under 60s (Gemini Flash-Lite streaming).

## 4. Design System — "Forest & Sky"

Mood: modern eco-friendly, nature-inspired gradients, glassmorphism cards, clean,
minimalist, professional (not childish).

**Locked via ui-ux-pro-max Design System Generator** (run in Phase 0 for a
"sustainability education website") + **frontend-design** for aesthetic direction.
ONE coherent glassmorphism system locked before any components are written.

**Palette (Tailwind theme tokens — NEVER hardcode hex):**
- Primary green: `#10B981` (deep accent `#047857`)
- Secondary blue: `#0EA5E9` (deep accent `#0369A1`)
- Base light: `#F8FAFC` / surfaces `#FFFFFF` / text `#1E293B`
- Base dark: `#020617` / surfaces `#0F172A` / text `#E2E8F0`
- Signature gradient: green → blue, used sparingly on hero + CTAs.
- Glass cards: translucent white (light) / translucent slate (dark) + backdrop-blur,
  1px hairline border, soft shadow.

**Typography:** Sora (geometric display) + Source Sans 3 (humanist body), self-hosted
via `@fontsource` for performance/offline. Avoid Inter/Roboto/Arial. Clear type scale,
intentional weights.

**Theming:** Dark/Light toggle persisted in localStorage, smooth transition.

**Reusable components:** GlassCard, SectionHeader (eyebrow + title), animated StatCounter,
primary CTAButton, TopicCard.

## 5. Routes (multi-page)

| Route | Purpose |
|---|---|
| `/` | Home: hero + condensed highlight card per topic + CTAs |
| `/about` | About sustainability + SDGs + interactive stat cards |
| `/solutions/solar` | Solar Energy |
| `/solutions/wind` | Wind Energy |
| `/solutions/rainwater` | Rainwater Harvesting |
| `/solutions/waste` | Waste Management |
| `/solutions/water` | Water Purification |
| `/compare` | Comparison Dashboard (cards) |
| `/calculators` | Carbon / Water / Energy calculators |
| `/tips` | 20 sustainability tips |
| `/impact` | Global impact + stats + charts |
| `/gallery` | Project gallery |
| `/quiz` | 10-question quiz (logs name + score) |
| `/timeline` | Renewable-energy evolution + milestones + roadmap |
| `/resources` | Resource library (downloadable PDF guides) |
| `/conclusion` | "Together We Can Build a Sustainable Future" |
| `/team` | School project team |

**Shared shell (every page):** sticky responsive navbar (hamburger on mobile), footer,
top scroll-progress bar, professional loading screen on first load, floating EcoBot button.

## 6. Section Content (real, accurate, Class 8–10)

1. **Hero:** title "Sustainable Planet: Eco-Friendly Solutions"; subtitle "Innovative
   Ideas for a Cleaner, Greener, and Sustainable Future"; Earth/nature animated background
   (lightweight CSS/SVG); CTAs "Explore Solutions" + "Learn More".
2. **About:** what is sustainability; why conservation matters; current global challenges;
   SDGs overview; interactive animated-counter stat cards.
3. **Solar:** what it is; how panels work; advantages; disadvantages; environmental
   benefits; real-world uses; interactive infographic; animated energy-flow diagram.
4. **Wind:** what it is; how turbines work; benefits; challenges; future potential;
   animated turbine illustration; comparison vs fossil fuels.
5. **Rainwater Harvesting:** definition; working process; collection methods; storage
   systems; community benefits; conservation impact; interactive process diagram.
6. **Waste Management:** types of waste; Reduce/Reuse/Recycle; composting; plastic
   reduction; smart waste systems; animated recycling cycle; segregation guide.
7. **Water Purification:** importance of clean water; treatment process; filtration
   methods; purification tech; safe-drinking-water solutions; interactive flowchart.
8. **Comparison Dashboard:** Solar vs Wind; Traditional vs Sustainable; Environmental
   Impact; Cost Efficiency — attractive comparison cards.
9. **Calculators** (real working math, instant results, friendly summaries): Carbon
   Footprint, Water Saving, Energy Saving. Each result shows a "Get my eco-action plan"
   button (feeds the AI eco-plan endpoint).
10. **20 Tips:** practical eco habits (save electricity, reusable bags, plant trees,
    reduce plastic, save water, sustainable transport, etc.) as interactive cards.
11. **Global Impact:** environmental stats; climate-change facts; renewable-energy growth;
    future goals — with interactive SVG charts/graphs.
12. **Gallery:** solar panels, wind turbines, rainwater systems, recycling plants,
    clean-water projects — **CSS/SVG illustrations** (offline-safe, on-brand), lazy-loaded.
13. **Quiz:** 10 questions, score tracking, per-question feedback; on submit, save student
    name + score (see Integrations).
14. **Timeline:** evolution of renewable energy; major milestones; future roadmap.
15. **Resources:** content-rich printable guide pages with "Download PDF" (print) action +
    a few bundled real PDF one-pagers.
16. **Conclusion:** "Together We Can Build a Sustainable Future" — call to action.
17. **Team:** Ivaan, Shiven, Jaskeerat, Laksh, Darshil + Class/School/Teacher placeholders.

## 7. Integrations

### A. Quiz logging
- `POST /api/quiz-log` forwards `{ name, score }` to a **Google Apps Script Web App URL**
  read from env (`SHEETS_WEBAPP_URL`).
- **Fallback:** if env var unset, save attempt to localStorage and show results screen.
  The quiz is fully functional standalone.

### B. AI features (Gemini Flash-Lite)
- `POST /api/ecobot` — EcoBot chat, **streamed (SSE)**. Reads `GEMINI_API_KEY` and
  `GEMINI_MODEL` (default `gemini-flash-lite-latest`) from env. Key never reaches browser.
- `POST /api/eco-plan` — converts calculator inputs into a personalized eco-action plan.
- **Build target:** real Gemini-backed endpoints; user only sets the env var. Each endpoint
  has a **rule-based / deterministic fallback** so a missing key never breaks the demo.

## 8. Charts
Hand-built lightweight **SVG chart components** (bar, line, donut) — no heavy library.
CSS-animated, `prefers-reduced-motion` respected. Used on Impact and Compare.

## 9. Component & Module Boundaries
- **Layout shell** (`src/layouts/`): base layout, head/SEO, navbar, footer, scroll progress,
  loading screen, theme toggle, EcoBot button.
- **UI kit** (`src/components/ui/`): GlassCard, SectionHeader, StatCounter, CTAButton, TopicCard.
- **Islands** (`src/components/islands/`, React): calculators, quiz, EcoBot chat, charts.
- **API** (`src/pages/api/`): ecobot, eco-plan, quiz-log.
- **Content/data** (`src/data/`): typed content modules (tips, quiz questions, timeline,
  topic metadata, impact stats) so pages stay declarative.
- Each unit has one clear purpose, a typed interface, and is independently understandable.

## 10. Phase Plan (each phase = fresh subagent + code-review pass)

- **Phase 0 — Foundation & Design System:** scaffold Astro/TS/Tailwind/Vercel adapter,
  git init. Run ui-ux-pro-max Design System Generator + frontend-design direction → lock
  glassmorphism system as Tailwind tokens, fonts, glass utilities, dark/light, base layout.
- **Phase 1 — Shared Shell & Components:** navbar (hamburger), footer, scroll-progress bar,
  loading screen, theme toggle, floating EcoBot button; UI kit; SEO base (meta, OG, sitemap,
  robots).
- **Phase 2 — Core content pages:** Home, About+SDGs, 5 solution pages with SVG/CSS
  infographics & animated diagrams. Reserve island mount points.
- **Phase 3 — Remaining content pages:** Compare, Impact, Tips, Timeline, Gallery,
  Resources, Conclusion, Team.
- **Phase 4 — Islands & integrations:** 3 calculators + eco-plan, quiz + logging, EcoBot
  chat (streaming), SVG charts; the 3 `/api` endpoints.
- **Phase 5 — Polish & verify:** Lighthouse/perf, a11y, reduced-motion, lazy images, final
  SEO; run locally & verify; env-var + Vercel deploy docs.

## 11. Success Criteria
- All 18 routes built with real, accurate Class 8–10 content; no lorem ipsum.
- ONE coherent "Forest & Sky" glassmorphism design system; tokens only (no hardcoded hex).
- Dark/light toggle persists; smooth transitions; `prefers-reduced-motion` respected.
- Interactive features work: calculators (real math), quiz (feedback + logging w/ fallback),
  EcoBot (streaming + fallback), eco-plan, SVG charts.
- Secrets only server-side; works with zero env vars (fallbacks), better with keys set.
- Site runs locally (dev + build/preview) and is verified. Vercel deploy documented.
- Lighthouse mobile 90+ target; minimal JS.

## 12. Out of Scope (YAGNI)
- No separate backend / database / auth.
- No heavy animation or charting libraries.
- No CMS — content lives in typed data modules + page markup.
- Actual Vercel deployment is a documented final step the user triggers (not done in-session).
