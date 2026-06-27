# TerraVision Sustainability Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build TerraVision — a multi-page, science-exhibition-quality sustainability education website (Astro + TS + Tailwind, React islands, Vercel serverless API) that runs locally and is ready for one-project Vercel deploy.

**Architecture:** Static-first Astro multi-page site with one locked "Forest & Sky" glassmorphism design system (Tailwind tokens). Small React islands (`client:visible`) for calculators, quiz, EcoBot chat, and charts. Backend = Astro server endpoints under `src/pages/api/` (Vercel serverless) holding all secrets; every integration has a deterministic fallback so the site works with zero env vars.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, `@astrojs/vercel`, `@astrojs/react`, React, `@fontsource` (Sora + Source Sans 3), Vitest (unit tests), hand-built SVG charts, Google Gemini Flash-Lite (REST), Google Apps Script (quiz log).

## Global Constraints

- **No hardcoded hex** in components — colors come from Tailwind theme tokens / CSS variables only.
- **Palette:** primary green `#10B981` (deep `#047857`); secondary blue `#0EA5E9` (deep `#0369A1`); base light `#F8FAFC` / surface `#FFFFFF` / text `#1E293B`; base dark `#020617` / surface `#0F172A` / text `#E2E8F0`. Signature gradient green→blue, used sparingly (hero + CTAs).
- **Fonts:** Sora (display) + Source Sans 3 (body), self-hosted via `@fontsource`. Never Inter/Roboto/Arial.
- **No lorem ipsum** — every page ships real, accurate Class 8–10 content.
- **Secrets server-side only** — `GEMINI_API_KEY`, `GEMINI_MODEL`, `SHEETS_WEBAPP_URL` read only inside `src/pages/api/*`. Never imported into client/island code.
- **Every integration degrades gracefully** when its env var is unset (rule-based / localStorage fallback).
- **Performance:** Lighthouse mobile 90+ target; minimal JS (islands only); Astro `<Image>` with explicit width/height; CSS/SVG animation over JS; respect `prefers-reduced-motion`.
- **Accessibility:** semantic HTML, keyboard-operable nav/toggles, visible focus, alt text / aria-labels on icons & diagrams.
- **Team (footer + /team):** Ivaan, Shiven, Jaskeerat, Laksh, Darshil. Labelled placeholders for Class, School Name, Teacher Name.
- **SEO:** per-page title/description/OG via a shared Head component; sitemap + robots.txt.
- **Commit after each task.** Conventional commit messages. End commit bodies with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## File Structure (locked decomposition)

```
astro.config.mjs            # integrations: react, vercel adapter, sitemap, output mode
tsconfig.json               # strict TS, @/* path alias to src/*
package.json
vercel.json                 # (optional) headers/caching
.env.example                # documents GEMINI_API_KEY, GEMINI_MODEL, SHEETS_WEBAPP_URL
public/
  robots.txt
  favicon.svg
  pdfs/                      # bundled resource one-pager PDFs
src/
  styles/global.css         # Tailwind layers + design tokens (CSS vars) + glass/utility classes
  lib/
    calculators.ts          # PURE math (carbon/water/energy) — unit tested
    quiz-scoring.ts         # PURE scoring/feedback — unit tested
    eco-plan.ts             # prompt builder + deterministic fallback — unit tested
    gemini.ts               # server-only Gemini REST client (streaming + non-stream)
    seo.ts                  # SEO defaults + helper
  data/
    site.ts                 # nav links, footer, team, seo defaults
    topics.ts               # 5 solution topics metadata (for Home/nav/cards)
    sdgs.ts                 # SDG list for About
    tips.ts                 # 20 tips
    quiz.ts                 # 10 quiz questions + answers + feedback
    timeline.ts             # renewable-energy milestones + roadmap
    impact.ts               # impact stats + chart datasets
    resources.ts            # resource guide metadata + pdf paths
  layouts/BaseLayout.astro  # html shell, slots, mounts shell components
  components/
    Head.astro              # title/meta/OG/canonical
    Navbar.astro            # sticky, responsive hamburger
    Footer.astro
    ScrollProgress.astro    # top progress bar (tiny inline script)
    LoadingScreen.astro     # first-load screen (CSS + tiny script)
    ThemeToggle.astro       # dark/light, localStorage, no-flash inline script
    EcoBotButton.astro      # floating button -> opens EcoBot island
    ui/
      GlassCard.astro
      SectionHeader.astro   # eyebrow + title (+ optional subtitle/align)
      StatCounter.astro     # animated count-up (IntersectionObserver, reduced-motion safe)
      CTAButton.astro       # variant: primary|secondary|ghost; href or type
      TopicCard.astro
    diagrams/               # pure SVG .astro illustrations (CSS-animated)
      SolarFlow.astro  WindTurbine.astro  RainwaterProcess.astro
      RecyclingCycle.astro  WaterFlowchart.astro  EarthHero.astro
    islands/                # React, client:visible
      Calculators.tsx       # tabbed Carbon/Water/Energy + eco-plan trigger
      Quiz.tsx
      EcoBot.tsx
      charts/Charts.tsx      # Bar/Line/Donut SVG components + tooltips
  pages/
    index.astro  about.astro
    solutions/solar.astro  solutions/wind.astro  solutions/rainwater.astro
    solutions/waste.astro   solutions/water.astro
    compare.astro  calculators.astro  tips.astro  impact.astro
    gallery.astro  quiz.astro  timeline.astro  resources.astro
    conclusion.astro  team.astro
    api/ecobot.ts  api/eco-plan.ts  api/quiz-log.ts
tests/
  calculators.test.ts  quiz-scoring.test.ts  eco-plan.test.ts
```

---

# PHASE 0 — Foundation & Design System

### Task 0.1: Scaffold Astro project + integrations

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.env.example`, `public/favicon.svg`, `public/robots.txt`, `src/pages/index.astro` (temporary placeholder)

**Interfaces:**
- Produces: a runnable Astro app with React + Vercel adapter + sitemap; `@/*` → `src/*` alias; npm scripts `dev`, `build`, `preview`, `test`.

- [ ] **Step 1:** Scaffold with `npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes` (run in project root; keep existing `docs/` and `.git`).
- [ ] **Step 2:** Install deps:
```bash
npx astro add react vercel sitemap --yes
npm i @fontsource/sora @fontsource-variable/source-sans-3
npm i -D vitest @types/node
npm i tailwindcss @tailwindcss/vite
```
- [ ] **Step 3:** Configure `astro.config.mjs`: `output: 'static'` with Vercel adapter; add `@tailwindcss/vite` to `vite.plugins`; add `site: 'https://terravision.vercel.app'` (placeholder) for sitemap; add `@astrojs/react` and `@astrojs/sitemap`. (API routes use `export const prerender = false`.)
- [ ] **Step 4:** Add `@/*` path alias in `tsconfig.json` (`"baseUrl": ".", "paths": {"@/*": ["src/*"]}`). Add `"test": "vitest run"` to package.json scripts.
- [ ] **Step 5:** Write `.env.example` with `GEMINI_API_KEY=`, `GEMINI_MODEL=gemini-flash-lite-latest`, `SHEETS_WEBAPP_URL=` and a comment that all are optional (fallbacks exist).
- [ ] **Step 6:** Write `public/robots.txt` (`User-agent: *` / `Allow: /` / `Sitemap: https://terravision.vercel.app/sitemap-index.xml`) and a simple leaf/eco `favicon.svg`.
- [ ] **Step 7:** Verify: `npm run dev` boots with no errors; `npm run build` succeeds. Expected: build completes, dist produced.
- [ ] **Step 8:** Commit: `chore: scaffold astro + react + tailwind + vercel adapter`.

### Task 0.2: Lock the "Forest & Sky" design system

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro` (temporary swatch/typography preview page)

**Interfaces:**
- Produces: CSS variables + Tailwind `@theme` tokens for all palette colors, font families, radii, shadows, glass surfaces; utility classes `.glass`, `.glass-strong`, `.gradient-brand`, `.text-gradient`; `[data-theme="dark"]` overrides. These tokens are the ONLY color source for all later tasks.

- [ ] **Step 1:** Invoke the **ui-ux-pro-max** skill and run its Design System Generator for a "sustainability education website" (glassmorphism). Invoke **frontend-design** for aesthetic direction. Reconcile output to the locked palette/fonts in Global Constraints — do not introduce off-palette colors.
- [ ] **Step 2:** Write `src/styles/global.css`: import `@fontsource/sora` weights (400/600/700/800) and `@fontsource-variable/source-sans-3`; `@import "tailwindcss"`; a `@theme` block mapping tokens — `--color-green`, `--color-green-deep`, `--color-blue`, `--color-blue-deep`, light/dark surface + text tokens, `--font-display: "Sora"`, `--font-body: "Source Sans 3 Variable"`. Define semantic CSS vars (`--surface`, `--text`, `--border-hairline`, `--glass-bg`, `--glass-blur`) for `:root` (light) and `[data-theme="dark"]`.
- [ ] **Step 3:** Add utilities: `.glass` (translucent surface + `backdrop-filter: blur(var(--glass-blur))` + 1px hairline border + soft shadow), `.glass-strong`, `.gradient-brand` (green→blue), `.text-gradient`. Add a global `prefers-reduced-motion` block that disables transitions/animations.
- [ ] **Step 4:** Build a temporary preview in `index.astro`: render every token as a swatch, the type scale (display + body), and one `.glass` card in both themes (toggle via a `data-theme` attribute on `<html>`).
- [ ] **Step 5:** Verify: `npm run dev`; confirm fonts load (Sora headings, Source Sans body), glass blur renders, dark/light swatches differ, no console errors. `npm run build` passes.
- [ ] **Step 6:** Commit: `feat: lock Forest & Sky glassmorphism design system`.

**Phase 0 review gate:** design system tokens complete, on-palette, both themes legible, fonts correct, build green.

---

# PHASE 1 — Shared Shell & UI Kit

### Task 1.1: SEO Head + site data

**Files:**
- Create: `src/lib/seo.ts`, `src/data/site.ts`, `src/components/Head.astro`

**Interfaces:**
- Produces:
  - `site.ts`: `export const SITE = { name, tagline, url, defaultDescription, ogImage }`; `export const NAV: {label:string; href:string; children?:{label:string;href:string}[]}[]` (Home, About, Solutions▾[solar/wind/rainwater/waste/water], Compare, Calculators, Tips, Impact, Gallery, Quiz, Timeline, Resources, Team); `export const TEAM: {name:string}[]`; `export const PLACEHOLDERS = { class:'[Class — TODO]', school:'[School Name — TODO]', teacher:'[Teacher Name — TODO]' }`.
  - `seo.ts`: `export interface SeoProps { title:string; description?:string; image?:string; canonical?:string; noindex?:boolean }`.
  - `Head.astro`: accepts `SeoProps`, renders `<title>`, meta description, canonical, Open Graph + Twitter card tags, charset/viewport, favicon link.

- [ ] **Step 1:** Write `src/data/site.ts` with the data above (real nav + team + placeholders).
- [ ] **Step 2:** Write `src/lib/seo.ts` with `SeoProps` and a helper `resolveSeo(props): Required<SeoProps>` filling defaults from `SITE`.
- [ ] **Step 3:** Write `src/components/Head.astro` consuming `SeoProps`, importing `global.css`, emitting all meta/OG/Twitter tags + the no-flash theme inline script (reads `localStorage.theme`, sets `data-theme` before paint).
- [ ] **Step 4:** Verify: `npm run build` passes; view source of a temp page shows correct `<title>`/OG tags.
- [ ] **Step 5:** Commit: `feat: SEO head component + site data`.

### Task 1.2: BaseLayout + shell components

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Navbar.astro`, `src/components/Footer.astro`, `src/components/ScrollProgress.astro`, `src/components/LoadingScreen.astro`, `src/components/ThemeToggle.astro`, `src/components/EcoBotButton.astro`

**Interfaces:**
- Consumes: `Head.astro` (SeoProps), `SITE`/`NAV`/`TEAM`/`PLACEHOLDERS` from `site.ts`.
- Produces: `BaseLayout.astro` props = `SeoProps`; renders `<html data-theme>`, `Head`, `ScrollProgress`, `LoadingScreen`, `Navbar`, `<slot/>`, `Footer`, `EcoBotButton`. `EcoBotButton` toggles an element with id `ecobot-root` (the island mounts here in Phase 4).

- [ ] **Step 1:** Write `Navbar.astro` — sticky, glass background, brand/logo left, desktop nav from `NAV` (Solutions dropdown), `ThemeToggle`, mobile hamburger that opens a full-screen glass menu (CSS-only checkbox toggle or tiny inline script; keyboard-accessible, `aria-expanded`).
- [ ] **Step 2:** Write `ThemeToggle.astro` — button toggling `data-theme` on `<html>`, persists to `localStorage.theme`, smooth transition, `aria-label`, sun/moon SVG.
- [ ] **Step 3:** Write `ScrollProgress.astro` — fixed top bar; tiny inline script updating width on scroll (passive listener); hidden under `prefers-reduced-motion`? keep (it's informative, not motion). Gradient-brand fill.
- [ ] **Step 4:** Write `LoadingScreen.astro` — full-screen glass overlay with logo + spinner; inline script removes it on `window.load` and sets a `sessionStorage` flag so it only shows on first load of the session; respects reduced-motion (no spinner animation).
- [ ] **Step 5:** Write `Footer.astro` — brand blurb, nav columns, team names from `TEAM`, Class/School/Teacher placeholders, copyright.
- [ ] **Step 6:** Write `EcoBotButton.astro` — floating bottom-right glass button (leaf/chat icon, `aria-label`), plus an empty `<div id="ecobot-root" hidden>` container.
- [ ] **Step 7:** Write `BaseLayout.astro` assembling all of the above with a named `<slot/>`.
- [ ] **Step 8:** Convert `index.astro` to use `BaseLayout` with a minimal hero placeholder. Verify: `npm run dev` — navbar sticky, hamburger works on mobile width, theme toggle persists across reload, loading screen shows once, scroll bar moves, footer correct. `npm run build` passes.
- [ ] **Step 9:** Commit: `feat: base layout + shared shell (navbar, footer, theme, scroll, loading, ecobot button)`.

### Task 1.3: Reusable UI kit

**Files:**
- Create: `src/components/ui/GlassCard.astro`, `SectionHeader.astro`, `StatCounter.astro`, `CTAButton.astro`, `TopicCard.astro`
- Modify: `src/pages/index.astro` (kit preview)

**Interfaces:**
- Produces (exact props):
  - `GlassCard`: `{ as?:string; class?:string; strong?:boolean }` + slot.
  - `SectionHeader`: `{ eyebrow?:string; title:string; subtitle?:string; align?:'left'|'center' }`.
  - `StatCounter`: `{ value:number; suffix?:string; prefix?:string; label:string; decimals?:number }` — counts up via IntersectionObserver; shows final value immediately under reduced-motion.
  - `CTAButton`: `{ href?:string; type?:'button'|'submit'; variant?:'primary'|'secondary'|'ghost'; size?:'sm'|'md'|'lg'; class?:string }` + slot.
  - `TopicCard`: `{ title:string; blurb:string; href:string; icon?:string; accent?:'green'|'blue' }` + optional slot for an SVG.

- [ ] **Step 1:** Write all five components using only design tokens + `.glass`/utility classes; ensure focus states and `aria` where interactive.
- [ ] **Step 2:** `StatCounter` inline script: IntersectionObserver triggers a rAF count-up; guard with `matchMedia('(prefers-reduced-motion: reduce)')`.
- [ ] **Step 3:** Preview all components on `index.astro` (one of each + a StatCounter row).
- [ ] **Step 4:** Verify: `npm run dev` — counters animate on scroll into view (and show final value with reduced-motion forced), buttons have correct variants, cards glassy. `npm run build` passes.
- [ ] **Step 5:** Commit: `feat: reusable UI kit (glass card, section header, stat counter, CTA, topic card)`.

**Phase 1 review gate:** shell + kit complete, accessible, themed, reusable; build green.

---

# PHASE 2 — Core Content Pages

> Each solution page uses `BaseLayout`, `SectionHeader`, `GlassCard`, `CTAButton`, its diagram component, and pulls metadata from `topics.ts`. Content must be accurate Class 8–10 level. Reserve island mount points where noted. **Each page task:** build page + its SVG diagram, verify build + run content checklist, commit.

### Task 2.1: Topics data + Home page

**Files:**
- Create: `src/data/topics.ts`, `src/components/diagrams/EarthHero.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `topics.ts` → `export interface Topic { slug:string; title:string; href:string; blurb:string; accent:'green'|'blue'; highlights:string[] }` and `export const TOPICS: Topic[]` for solar/wind/rainwater/waste/water (real one-line blurbs + 3 highlights each).

- [ ] **Step 1:** Write `topics.ts` with accurate blurbs/highlights for the 5 solutions.
- [ ] **Step 2:** Write `EarthHero.astro` — lightweight animated CSS/SVG Earth/nature background (orbiting/parallax via CSS, reduced-motion safe).
- [ ] **Step 3:** Build Home: hero (title "Sustainable Planet: Eco-Friendly Solutions", subtitle "Innovative Ideas for a Cleaner, Greener, and Sustainable Future", `EarthHero` bg, CTAs "Explore Solutions"→`/about` or `#solutions`, "Learn More"→`/about`), a `TopicCard` grid from `TOPICS`, a stat-counter strip, and a closing CTA to `/quiz`/`/calculators`.
- [ ] **Step 4:** Verify: build passes; Home renders hero + 5 topic cards + counters; Lighthouse quick check (no obvious perf regressions). Content checklist: real copy, no lorem.
- [ ] **Step 5:** Commit: `feat: home page + topics data + animated earth hero`.

### Task 2.2: About + SDGs page

**Files:**
- Create: `src/data/sdgs.ts`, `src/pages/about.astro`

**Interfaces:**
- Produces: `sdgs.ts` → `export const SDGS: { number:number; title:string; blurb:string }[]` (the environment-relevant UN SDGs, accurate titles).

- [ ] **Step 1:** Write `sdgs.ts` with accurate SDG entries (focus on 6,7,11,12,13,14,15 + brief note these are part of the 17 Global Goals).
- [ ] **Step 2:** Build About: what sustainability is; why conservation matters; current global challenges (climate change, pollution, resource depletion, biodiversity loss); SDG overview grid (GlassCards); interactive **StatCounter** cards (e.g., global temp rise, people without clean water, renewable share — cite accurate figures).
- [ ] **Step 3:** Verify: build passes; counters animate; SDG grid accurate. Content checklist.
- [ ] **Step 4:** Commit: `feat: about + SDGs page`.

### Task 2.3: Solar page + energy-flow diagram

**Files:**
- Create: `src/components/diagrams/SolarFlow.astro`, `src/pages/solutions/solar.astro`

- [ ] **Step 1:** Write `SolarFlow.astro` — animated SVG energy-flow (sun → panel → inverter → home/grid), CSS-animated dashes/glow, reduced-motion safe, `role="img"` + `aria-label`.
- [ ] **Step 2:** Build Solar page sections: what it is; how panels work (photovoltaic effect, simply explained); advantages; disadvantages; environmental benefits; real-world uses; the interactive infographic (`SolarFlow`). Use SectionHeader + GlassCards.
- [ ] **Step 3:** Verify: build passes; diagram animates; content accurate Class 8–10. Checklist.
- [ ] **Step 4:** Commit: `feat: solar solution page + energy-flow diagram`.

### Task 2.4: Wind page + turbine diagram

**Files:**
- Create: `src/components/diagrams/WindTurbine.astro`, `src/pages/solutions/wind.astro`

- [ ] **Step 1:** Write `WindTurbine.astro` — animated SVG turbine (rotating blades via CSS, pausable under reduced-motion), labelled parts.
- [ ] **Step 2:** Build Wind page: what it is; how turbines work; benefits; challenges; future potential; animated turbine; a wind-vs-fossil-fuels comparison block (GlassCards / mini table).
- [ ] **Step 3:** Verify build + content checklist.
- [ ] **Step 4:** Commit: `feat: wind solution page + turbine diagram`.

### Task 2.5: Rainwater page + process diagram

**Files:**
- Create: `src/components/diagrams/RainwaterProcess.astro`, `src/pages/solutions/rainwater.astro`

- [ ] **Step 1:** Write `RainwaterProcess.astro` — animated SVG process (rain → catchment/roof → gutter → filter → storage tank → recharge/use).
- [ ] **Step 2:** Build Rainwater page: definition; working process; collection methods; storage systems; community benefits; conservation impact; interactive process diagram.
- [ ] **Step 3:** Verify build + content checklist.
- [ ] **Step 4:** Commit: `feat: rainwater harvesting page + process diagram`.

### Task 2.6: Waste page + recycling cycle

**Files:**
- Create: `src/components/diagrams/RecyclingCycle.astro`, `src/pages/solutions/waste.astro`

- [ ] **Step 1:** Write `RecyclingCycle.astro` — animated circular SVG (collect → sort → process → manufacture → reuse), and a segregation color guide (wet/dry/hazardous/e-waste).
- [ ] **Step 2:** Build Waste page: types of waste; Reduce/Reuse/Recycle; composting; plastic reduction; smart waste systems; animated recycling cycle; segregation guide.
- [ ] **Step 3:** Verify build + content checklist.
- [ ] **Step 4:** Commit: `feat: waste management page + recycling cycle`.

### Task 2.7: Water purification page + flowchart

**Files:**
- Create: `src/components/diagrams/WaterFlowchart.astro`, `src/pages/solutions/water.astro`

- [ ] **Step 1:** Write `WaterFlowchart.astro` — animated SVG flowchart (source → screening → coagulation/sedimentation → filtration → disinfection → safe water).
- [ ] **Step 2:** Build Water page: importance of clean water; treatment process; filtration methods (boiling, RO, UV, activated carbon, sand); purification tech; safe-drinking-water solutions; interactive flowchart.
- [ ] **Step 3:** Verify build + content checklist.
- [ ] **Step 4:** Commit: `feat: water purification page + flowchart`.

**Phase 2 review gate:** Home + About + 5 solution pages live with accurate content, on-brand diagrams, all navigable; build green; spot Lighthouse check.

---

# PHASE 3 — Remaining Content Pages

### Task 3.1: Compare dashboard

**Files:**
- Create: `src/pages/compare.astro`

- [ ] **Step 1:** Build comparison cards: Solar vs Wind; Traditional vs Sustainable; Environmental Impact; Cost Efficiency — as attractive GlassCard comparisons (two-column / metric rows). Accurate, sourced figures.
- [ ] **Step 2:** Verify build + content checklist.
- [ ] **Step 3:** Commit: `feat: comparison dashboard page`.

### Task 3.2: Tips page (20 tips)

**Files:**
- Create: `src/data/tips.ts`, `src/pages/tips.astro`

**Interfaces:**
- Produces: `tips.ts` → `export const TIPS: { id:number; title:string; detail:string; category:'energy'|'water'|'waste'|'transport'|'nature'; icon?:string }[]` (exactly 20 real, practical tips).

- [ ] **Step 1:** Write `tips.ts` with 20 accurate, practical tips across categories.
- [ ] **Step 2:** Build Tips page: filterable/interactive card grid (CSS or tiny script category filter, accessible), each an expandable GlassCard.
- [ ] **Step 3:** Verify build; 20 tips present; filter works. Checklist.
- [ ] **Step 4:** Commit: `feat: 20 sustainability tips page`.

### Task 3.3: Timeline page

**Files:**
- Create: `src/data/timeline.ts`, `src/pages/timeline.astro`

**Interfaces:**
- Produces: `timeline.ts` → `export const MILESTONES: { year:string; title:string; detail:string }[]` (accurate renewable-energy history) + `export const ROADMAP: { period:string; goal:string }[]` (future goals, e.g., net-zero targets).

- [ ] **Step 1:** Write `timeline.ts` with accurate milestones (e.g., 1839 photovoltaic effect, first wind turbines, modern solar growth) + roadmap.
- [ ] **Step 2:** Build Timeline page: vertical alternating glass timeline (CSS), milestones + roadmap section.
- [ ] **Step 3:** Verify build + content checklist.
- [ ] **Step 4:** Commit: `feat: renewable energy timeline page`.

### Task 3.4: Gallery page

**Files:**
- Create: `src/pages/gallery.astro` (+ any SVG illustration components inline or under `diagrams/`)

- [ ] **Step 1:** Build Gallery: responsive glass grid of CSS/SVG illustrations — solar panels, wind turbines, rainwater systems, recycling plants, clean-water projects. Each card has a caption; lazy-render heavy SVGs; lightbox optional (CSS `:target` or skip). Decorative SVGs `aria-hidden`, captioned cards labelled.
- [ ] **Step 2:** Verify build + content checklist.
- [ ] **Step 3:** Commit: `feat: project gallery page`.

### Task 3.5: Resources page + PDFs

**Files:**
- Create: `src/data/resources.ts`, `src/pages/resources.astro`, `public/pdfs/*.pdf` (2–3 one-pagers)

**Interfaces:**
- Produces: `resources.ts` → `export const RESOURCES: { title:string; summary:string; pdf?:string; printHref?:string }[]`.

- [ ] **Step 1:** Create 2–3 real one-pager PDFs in `public/pdfs/` (e.g., "Home Energy Saving Checklist", "Waste Segregation Guide", "Water Conservation Tips") — generate from accurate content.
- [ ] **Step 2:** Write `resources.ts`; build Resources page: download cards (link to PDFs) + printable guide sections with a "Print / Save as PDF" button (`window.print()`), print-styled.
- [ ] **Step 3:** Verify build; PDFs download; print view clean. Checklist.
- [ ] **Step 4:** Commit: `feat: resource library + downloadable guides`.

### Task 3.6: Conclusion + Team pages

**Files:**
- Create: `src/pages/conclusion.astro`, `src/pages/team.astro`

- [ ] **Step 1:** Build Conclusion: "Together We Can Build a Sustainable Future" — summary, motivating call to action, CTAs to Quiz/Calculators/Tips.
- [ ] **Step 2:** Build Team: glass profile cards for Ivaan, Shiven, Jaskeerat, Laksh, Darshil (role placeholders ok), and a clearly-labelled project info block with Class / School Name / Teacher Name placeholders.
- [ ] **Step 3:** Verify build + content checklist.
- [ ] **Step 4:** Commit: `feat: conclusion + team pages`.

**Phase 3 review gate:** all remaining static pages live; nav covers every route; build green.

---

# PHASE 4 — Islands & Integrations

### Task 4.1: Calculator math (pure, TDD)

**Files:**
- Create: `src/lib/calculators.ts`, `tests/calculators.test.ts`

**Interfaces:**
- Produces:
  - `carbonFootprint(input: { electricityKwh:number; carKm:number; flightsPerYear:number; diet:'meat'|'mixed'|'veg' }): { tonnesPerYear:number; breakdown:Record<string,number> }`
  - `waterSaving(input: { showerMins:number; tapTightening:boolean; rainwaterLitres:number; people:number }): { litresSavedPerYear:number }`
  - `energySaving(input: { ledBulbs:number; acHoursReduced:number; applianceStandbyDevices:number }): { kwhSavedPerYear:number; co2KgSaved:number }`
  - All pure, deterministic, documented factor constants.

- [ ] **Step 1:** Write `tests/calculators.test.ts` with concrete cases:
```ts
import { describe, it, expect } from 'vitest';
import { carbonFootprint, waterSaving, energySaving } from '@/lib/calculators';

describe('carbonFootprint', () => {
  it('sums electricity, car, flights, diet into tonnes/yr', () => {
    const r = carbonFootprint({ electricityKwh: 300, carKm: 1000, flightsPerYear: 2, diet: 'mixed' });
    expect(r.tonnesPerYear).toBeGreaterThan(0);
    expect(Object.keys(r.breakdown)).toEqual(['electricity','car','flights','diet']);
    // breakdown sums to total (within rounding)
    const sum = Object.values(r.breakdown).reduce((a,b)=>a+b,0);
    expect(Math.abs(sum - r.tonnesPerYear)).toBeLessThan(0.01);
  });
  it('veg diet emits less than meat diet, all else equal', () => {
    const base = { electricityKwh: 0, carKm: 0, flightsPerYear: 0 } as const;
    expect(carbonFootprint({ ...base, diet:'veg' }).tonnesPerYear)
      .toBeLessThan(carbonFootprint({ ...base, diet:'meat' }).tonnesPerYear);
  });
});

describe('energySaving', () => {
  it('more LED bulbs => more kWh and CO2 saved', () => {
    const a = energySaving({ ledBulbs: 5, acHoursReduced: 0, applianceStandbyDevices: 0 });
    const b = energySaving({ ledBulbs: 10, acHoursReduced: 0, applianceStandbyDevices: 0 });
    expect(b.kwhSavedPerYear).toBeGreaterThan(a.kwhSavedPerYear);
    expect(b.co2KgSaved).toBeGreaterThan(a.co2KgSaved);
  });
});

describe('waterSaving', () => {
  it('scales with people and rainwater capture', () => {
    const r = waterSaving({ showerMins: 5, tapTightening: true, rainwaterLitres: 100, people: 4 });
    expect(r.litresSavedPerYear).toBeGreaterThan(0);
  });
});
```
- [ ] **Step 2:** Run `npm test -- calculators` — expect FAIL (module not found).
- [ ] **Step 3:** Implement `src/lib/calculators.ts` with documented, realistic factor constants (e.g., grid CO2 ~0.7 kg/kWh, petrol car ~0.17 kg/km, short flight ~0.25 t each, diet meat 2.5 / mixed 1.7 / veg 1.0 t/yr; LED saves ~40 kWh/bulb/yr; CO2 0.7 kg/kWh). Round outputs sensibly.
- [ ] **Step 4:** Run `npm test -- calculators` — expect PASS.
- [ ] **Step 5:** Commit: `feat: pure calculator math with unit tests`.

### Task 4.2: Eco-plan fallback (pure, TDD) + prompt builder

**Files:**
- Create: `src/lib/eco-plan.ts`, `tests/eco-plan.test.ts`

**Interfaces:**
- Consumes: calculator result shapes from Task 4.1.
- Produces:
  - `buildEcoPlanPrompt(payload: EcoPlanInput): string`
  - `fallbackEcoPlan(payload: EcoPlanInput): { summary:string; actions:string[] }`
  - `export interface EcoPlanInput { kind:'carbon'|'water'|'energy'; metrics: Record<string, number|string> }`

- [ ] **Step 1:** Write `tests/eco-plan.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { fallbackEcoPlan, buildEcoPlanPrompt } from '@/lib/eco-plan';

it('fallback returns summary + non-empty actions for carbon', () => {
  const r = fallbackEcoPlan({ kind:'carbon', metrics:{ tonnesPerYear: 6 } });
  expect(r.summary).toMatch(/carbon/i);
  expect(r.actions.length).toBeGreaterThanOrEqual(3);
});
it('prompt includes the metrics and the kind', () => {
  const p = buildEcoPlanPrompt({ kind:'energy', metrics:{ kwhSavedPerYear: 200 } });
  expect(p).toMatch(/energy/i);
  expect(p).toContain('200');
});
```
- [ ] **Step 2:** Run `npm test -- eco-plan` — expect FAIL.
- [ ] **Step 3:** Implement `eco-plan.ts`: `buildEcoPlanPrompt` produces a concise instruction + JSON of metrics; `fallbackEcoPlan` returns curated, kind-specific advice (carbon/water/energy) with ≥3 concrete actions.
- [ ] **Step 4:** Run `npm test -- eco-plan` — expect PASS.
- [ ] **Step 5:** Commit: `feat: eco-plan prompt builder + deterministic fallback`.

### Task 4.3: Quiz scoring (pure, TDD) + quiz data

**Files:**
- Create: `src/lib/quiz-scoring.ts`, `src/data/quiz.ts`, `tests/quiz-scoring.test.ts`

**Interfaces:**
- Produces:
  - `quiz.ts` → `export interface Question { id:number; q:string; options:string[]; answer:number; explanation:string }`; `export const QUIZ: Question[]` (exactly 10 accurate questions).
  - `quiz-scoring.ts` → `score(answers:number[], quiz:Question[]): { correct:number; total:number; percent:number; perQuestion:{ id:number; correct:boolean; explanation:string }[] }`.

- [ ] **Step 1:** Write `tests/quiz-scoring.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { score } from '@/lib/quiz-scoring';
const quiz = [
  { id:1, q:'a', options:['x','y'], answer:0, explanation:'e1' },
  { id:2, q:'b', options:['x','y'], answer:1, explanation:'e2' },
];
it('scores correct answers and returns per-question feedback', () => {
  const r = score([0,1], quiz);
  expect(r.correct).toBe(2);
  expect(r.total).toBe(2);
  expect(r.percent).toBe(100);
  expect(r.perQuestion[0]).toEqual({ id:1, correct:true, explanation:'e1' });
});
it('handles wrong + unanswered', () => {
  const r = score([1,-1], quiz);
  expect(r.correct).toBe(0);
  expect(r.percent).toBe(0);
});
```
- [ ] **Step 2:** Run `npm test -- quiz-scoring` — expect FAIL.
- [ ] **Step 3:** Implement `quiz-scoring.ts`; write `quiz.ts` with 10 accurate questions + explanations.
- [ ] **Step 4:** Run `npm test -- quiz-scoring` — expect PASS.
- [ ] **Step 5:** Commit: `feat: quiz scoring + 10-question data with tests`.

### Task 4.4: Gemini server client

**Files:**
- Create: `src/lib/gemini.ts`

**Interfaces:**
- Produces:
  - `geminiConfigured(): boolean` (true if `GEMINI_API_KEY` set)
  - `streamGemini(messages:{role:'user'|'model';text:string}[], system:string): Promise<ReadableStream<Uint8Array>>` — streams text chunks (SSE-ready).
  - `generateGemini(prompt:string, system?:string): Promise<string>` — non-streaming.
  - Reads `GEMINI_API_KEY` + `GEMINI_MODEL` (default `gemini-flash-lite-latest`) from `import.meta.env`/`process.env`. Server-only (no client import).

- [ ] **Step 1:** Implement `gemini.ts` calling the Gemini REST `generateContent` / `streamGenerateContent` endpoints with the API key as query/header; map roles; surface errors. Keep all timeouts well under 60s.
- [ ] **Step 2:** Verify: `npm run build` passes (type-check). (No network test here — covered via endpoint manual check.)
- [ ] **Step 3:** Commit: `feat: server-only Gemini REST client (stream + generate)`.

### Task 4.5: API endpoints (ecobot, eco-plan, quiz-log)

**Files:**
- Create: `src/pages/api/ecobot.ts`, `src/pages/api/eco-plan.ts`, `src/pages/api/quiz-log.ts`

**Interfaces:**
- Consumes: `gemini.ts`, `eco-plan.ts`. Each route `export const prerender = false`.
- Produces (contracts the islands rely on):
  - `POST /api/ecobot` body `{ messages:{role,text}[] }` → streamed `text/event-stream` of `data: <chunk>` lines; if `!geminiConfigured()`, stream a rule-based answer from a local sustainability knowledge base.
  - `POST /api/eco-plan` body `EcoPlanInput` → JSON `{ summary:string; actions:string[] }`; Gemini if configured (parse to that shape), else `fallbackEcoPlan`.
  - `POST /api/quiz-log` body `{ name:string; score:number; total:number }` → JSON `{ ok:boolean; logged:boolean }`; if `SHEETS_WEBAPP_URL` set, POST to it (server-side fetch) and return `logged:true`; else `logged:false` (client falls back to localStorage). Validate/escape inputs; never echo secrets.
- [ ] **Step 1:** Implement `ecobot.ts` (streaming + fallback knowledge base with a strict eco-education system prompt).
- [ ] **Step 2:** Implement `eco-plan.ts` (Gemini→parse JSON, else fallback).
- [ ] **Step 3:** Implement `quiz-log.ts` (input validation, optional Sheets POST, safe response).
- [ ] **Step 4:** Verify: `npm run dev`; `curl -X POST localhost:4321/api/eco-plan -d '{"kind":"carbon","metrics":{"tonnesPerYear":6}}' -H 'content-type: application/json'` returns summary+actions (fallback path with no key); `curl` ecobot returns streamed text; quiz-log returns `{ok:true,logged:false}` with no env. `npm run build` passes.
- [ ] **Step 5:** Commit: `feat: ecobot, eco-plan, and quiz-log serverless endpoints with fallbacks`.

### Task 4.6: Calculators island + page

**Files:**
- Create: `src/components/islands/Calculators.tsx`
- Modify: `src/pages/calculators.astro`

**Interfaces:**
- Consumes: `calculators.ts` math, `POST /api/eco-plan`.
- Produces: a tabbed (Carbon/Water/Energy) React island; each computes instantly on input change (uses pure functions), shows a friendly summary, and a **"Get my eco-action plan"** button that POSTs the result to `/api/eco-plan` and renders the returned summary+actions (loading + error states).

- [ ] **Step 1:** Build `Calculators.tsx` (controlled inputs, instant results via `calculators.ts`, eco-plan fetch). Accessible labels, number inputs with sane min/max.
- [ ] **Step 2:** Build `calculators.astro` mounting `<Calculators client:visible />` with intro + explanation of factors.
- [ ] **Step 3:** Verify: `npm run dev` — all three calculators compute correctly; eco-plan button returns advice (fallback w/o key). Build passes.
- [ ] **Step 4:** Commit: `feat: calculators island + page with eco-action plan`.

### Task 4.7: Quiz island + page

**Files:**
- Create: `src/components/islands/Quiz.tsx`
- Modify: `src/pages/quiz.astro`

**Interfaces:**
- Consumes: `QUIZ` data, `score()`, `POST /api/quiz-log`.
- Produces: a React quiz island — name input, 10 questions one-at-a-time or scrollable, per-question feedback (explanations) after submit, final score; on submit POSTs `{name,score,total}` to `/api/quiz-log`; if response `logged:false`, persist attempt to `localStorage`. Restart option.

- [ ] **Step 1:** Build `Quiz.tsx` (state machine: intro→questions→results; uses `score()`; logging + localStorage fallback). Keyboard accessible options (radio group).
- [ ] **Step 2:** Build `quiz.astro` mounting `<Quiz client:visible />`.
- [ ] **Step 3:** Verify: dev — answer flow works, score + feedback correct, logging returns ok (fallback stores locally). Build passes.
- [ ] **Step 4:** Commit: `feat: quiz island + page with scoring, feedback, and logging`.

### Task 4.8: EcoBot island

**Files:**
- Create: `src/components/islands/EcoBot.tsx`
- Modify: `src/components/EcoBotButton.astro` (mount island into `#ecobot-root`), relevant layout

**Interfaces:**
- Consumes: `POST /api/ecobot` (SSE stream).
- Produces: a floating glass chat panel toggled by the EcoBot button; sends message history, renders streamed assistant tokens; suggested-question chips; loading/typing + error states; reduced-motion safe.

- [ ] **Step 1:** Build `EcoBot.tsx` consuming the SSE stream (`ReadableStream` reader / `EventSource`-style parse of `data:` lines), maintaining history.
- [ ] **Step 2:** Wire `EcoBotButton.astro` to mount `<EcoBot client:visible />` (or `client:idle`) into `#ecobot-root` and toggle visibility.
- [ ] **Step 3:** Verify: dev — chat streams responses (fallback knowledge base w/o key); panel opens/closes from every page. Build passes.
- [ ] **Step 4:** Commit: `feat: EcoBot streaming chat island on every page`.

### Task 4.9: Charts island + Impact page

**Files:**
- Create: `src/components/islands/charts/Charts.tsx`, `src/data/impact.ts`
- Modify: `src/pages/impact.astro`

**Interfaces:**
- Produces:
  - `impact.ts` → typed datasets: renewable-energy growth (line), energy-mix (donut), emissions by sector (bar), plus headline stats — accurate figures with notes.
  - `Charts.tsx` → exports `<BarChart>`, `<LineChart>`, `<DonutChart>` SVG components with props `{ data, labels, ... }`, CSS-animated, hover/focus tooltips, reduced-motion safe, `role="img"` + accessible summaries.

- [ ] **Step 1:** Write `impact.ts` with accurate datasets + sources note.
- [ ] **Step 2:** Build `Charts.tsx` (pure SVG, no chart lib).
- [ ] **Step 3:** Build Impact page: headline StatCounters + the three charts (`client:visible`) + climate-change facts + future goals.
- [ ] **Step 4:** Verify: dev — charts render + animate + tooltips work; accurate data. Build passes.
- [ ] **Step 5:** Commit: `feat: global impact page with lightweight SVG charts`.

**Phase 4 review gate:** all islands + endpoints work with fallbacks (no env vars); secrets never in client bundle (grep build output); tests pass; build green.

---

# PHASE 5 — Polish & Verify

### Task 5.1: SEO, sitemap, per-page meta sweep

**Files:**
- Modify: every `src/pages/*.astro` (ensure `BaseLayout` gets real `title`/`description`); confirm `@astrojs/sitemap` config + `robots.txt`.

- [ ] **Step 1:** Give every page a unique, descriptive `title` + `description` + OG image; verify canonical URLs.
- [ ] **Step 2:** Verify: `npm run build` produces `sitemap-index.xml`; robots references it; view-source spot-check 3 pages.
- [ ] **Step 3:** Commit: `chore: per-page SEO metadata + sitemap sweep`.

### Task 5.2: Performance, a11y, reduced-motion pass

**Files:**
- Modify: as needed across components/pages.

- [ ] **Step 1:** Ensure all raster images use Astro `<Image>` with width/height + lazy; SVGs optimized; fonts `display: swap`.
- [ ] **Step 2:** Force `prefers-reduced-motion: reduce` and confirm animations stop (hero, diagrams, counters, charts, loading).
- [ ] **Step 3:** Keyboard pass: tab through nav (incl. mobile menu + dropdown), theme toggle, calculators, quiz, EcoBot — visible focus everywhere; aria-labels on icon buttons.
- [ ] **Step 4:** Run a production Lighthouse (mobile) on `npm run preview`: `npx lighthouse http://localhost:4321 --preset=desktop` and mobile; record scores; fix any <90 quick wins.
- [ ] **Step 5:** Commit: `perf+a11y: image/motion/keyboard/lighthouse pass`.

### Task 5.3: Final verification + deploy docs

**Files:**
- Create: `README.md` (run + deploy + env var docs)

- [ ] **Step 1:** Write `README.md`: project overview, `npm install/dev/build/preview/test`, the three env vars (where to get them: Google AI Studio for `GEMINI_API_KEY`; Apps Script Web App deploy steps for `SHEETS_WEBAPP_URL`), Vercel one-project deploy steps, and a note that all features work without keys (fallbacks).
- [ ] **Step 2:** Full verify: `npm test` (all pass), `npm run build` (green), `npm run preview` — click through **every** route, toggle theme, run each calculator, take the quiz, open EcoBot, download a resource PDF. Record results.
- [ ] **Step 3:** Commit: `docs: README with run + env + Vercel deploy instructions`.

**Phase 5 review gate:** tests pass, build green, every route verified in preview, Lighthouse recorded, README complete.

---

## Self-Review (spec coverage)

- Tech stack / Vercel adapter / islands / API → Tasks 0.1, 4.4–4.9. ✓
- Design system "Forest & Sky" (tokens, fonts, glass, dark/light) → Task 0.2, 1.2. ✓
- Shared shell (navbar/footer/scroll/loading/toggle/EcoBot btn) → Task 1.2. ✓
- UI kit (GlassCard/SectionHeader/StatCounter/CTA/TopicCard) → Task 1.3. ✓
- All 17 routes → Home 2.1, About 2.2, solar/wind/rainwater/waste/water 2.3–2.7, compare 3.1, tips 3.2, timeline 3.3, gallery 3.4, resources 3.5, conclusion+team 3.6, calculators 4.6, quiz 4.7, impact 4.9. ✓
- Diagrams/infographics per solution → 2.1, 2.3–2.7. ✓
- Calculators real math + eco-plan → 4.1, 4.2, 4.6. ✓
- Quiz + logging + fallback → 4.3, 4.5, 4.7. ✓
- EcoBot Gemini streaming + fallback → 4.4, 4.5, 4.8. ✓
- Charts (light SVG) → 4.9. ✓
- SEO/sitemap/robots → 1.1, 5.1. ✓
- Perf/a11y/reduced-motion → 5.2. ✓
- Run locally & verify + deploy docs → 5.3. ✓
- Team + placeholders → 1.1 (footer), 3.6 (team page). ✓

No placeholders/TBDs in steps; pure-logic interfaces (calculators, eco-plan, quiz-scoring, gemini) named consistently across producing and consuming tasks.
