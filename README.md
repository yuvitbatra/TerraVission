# 🌍 TerraVision — Sustainable Planet: Eco-Friendly Solutions

A national-level, science-exhibition-quality educational website on sustainability,
green technology, and protecting the Earth. Built by students, for teachers and judges.

Built with **Astro + TypeScript + Tailwind CSS**, small **React islands** for interactivity,
and **Astro server endpoints** (Vercel serverless functions) for the backend. Ships as **one
project** that hosts free on Vercel.

---

## ✨ What's inside

**17 pages:** Home · About + SDGs · 5 Solution pages (Solar, Wind, Rainwater, Waste, Water)
· Solutions overview · Compare dashboard · Calculators · Tips (20) · Impact + charts · Gallery
· Quiz · Timeline · Resources · Conclusion · Team.

**Interactive features (React islands):**
- **Calculators** — carbon / water / energy, with a "Get my eco-action plan" button.
- **Quiz** — 10 questions, instant scoring, per-question explanations, score logging.
- **EcoBot** — a floating AI chat assistant on every page.
- **Impact charts** — hand-built animated SVG charts.

**Backend (serverless API routes under `src/pages/api/`):**
- `POST /api/ecobot` — EcoBot chat (streams replies).
- `POST /api/eco-plan` — personalised eco-action plan.
- `POST /api/quiz-log` — logs quiz name + score.

> **Everything works with no setup.** If no API keys are configured, EcoBot and eco-plans
> use a built-in rule-based fallback, and quiz scores save to the browser. Adding keys
> (below) simply upgrades these to the live AI / Google Sheet versions.

---

## 🚀 How to run (local)

You need **Node.js 18+** installed. Then, from the project folder:

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the dev server
```

Open the URL it prints (usually **http://localhost:4321**) in your browser. That's it —
the whole site, including the calculators, quiz and EcoBot fallbacks, runs locally.

### Other commands
```bash
npm run build    # production build
npm run preview  # preview the production build locally
npx vitest run   # run the unit tests (calculator/quiz/eco-plan logic)
```

---

## 🔑 Optional API keys (to enable live AI + Sheet logging)

The site is fully functional **without** these. To turn on the live versions, copy
`.env.example` to `.env` and fill in any you want:

```bash
cp .env.example .env
```

| Variable | What it enables | Where to get it |
|----------|-----------------|-----------------|
| `GEMINI_API_KEY` | Live EcoBot chat + AI eco-action plans (Google Gemini) | [Google AI Studio](https://aistudio.google.com/app/apikey) → "Create API key" |
| `GEMINI_MODEL` | _(optional)_ override the model | defaults to `gemini-flash-lite-latest` |
| `SHEETS_WEBAPP_URL` | Logs quiz name + score to a Google Sheet | See "Quiz logging" below |

After editing `.env`, restart `npm run dev`.

### Quiz logging to a Google Sheet (optional)
1. Create a Google Sheet.
2. **Extensions → Apps Script**, paste a small `doPost(e)` script that appends
   `e.postData` (name, score, total) as a new row, and **Deploy → New deployment →
   Web app** (execute as you, access: anyone).
3. Copy the Web App URL into `SHEETS_WEBAPP_URL` in `.env`.

Without this, quiz scores are saved in the visitor's browser (`localStorage`) instead.

---

## ☁️ Deploy to Vercel (free)

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Vercel auto-detects Astro — just click **Deploy**. (No build settings to change.)
4. _(Optional)_ In **Project → Settings → Environment Variables**, add `GEMINI_API_KEY`
   and `SHEETS_WEBAPP_URL` to enable the live features, then redeploy.

The whole app — pages **and** API routes — deploys as one Vercel project.

---

## 🎨 Design

"Forest & Sky" — a glassmorphism design system (deep green + sky blue gradients, frosted
glass cards, dark/light toggle). All colours, fonts and spacing live as design tokens in
`src/styles/global.css` (fonts: **Sora** for display, **Source Sans 3** for body).

## 👥 Team
Ivaan · Shiven · Jaskeerat · Laksh · Darshil
_(Class, School Name and Teacher Name placeholders are on the **Team** page — fill these in.)_

---

## 🗂 Project structure (quick map)
```
src/
  pages/            # every route (.astro) + api/ (serverless endpoints)
  layouts/          # BaseLayout (shared shell)
  components/       # navbar, footer, UI kit, diagrams, React islands
  data/             # site nav, topics, tips, quiz, timeline, impact, resources, sdgs
  lib/              # calculators, quiz scoring, eco-plan, gemini client (tested logic)
  styles/global.css # design tokens + utilities
```
