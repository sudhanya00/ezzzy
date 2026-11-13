# ezzzy

**An AI-assisted decision matrix.** Type what you're deciding and the options
you're choosing between; ezzzy proposes the criteria that matter, you weight
them and score each option, and it shows which one comes out ahead.

**Live:** https://ezzzy.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-Flash%20Lite-4285F4?logo=google&logoColor=white)

## How it works

1. **Set up.** Describe the decision and list two or more options, or start
   from a template (job offer, gift, car).
2. **Criteria.** Gemini suggests four to six criteria for that specific
   decision, each with a one-line description. Add your own or remove any.
3. **Weights.** Rate how much each criterion matters to you, from 1 to 5.
4. **Matrix.** Score every option against every criterion from 0 to 5. Totals
   are the weighted sum and update as you type; the leading option lights up,
   and a tie shows no winner.

The AI only proposes criteria. Weights and scores are yours, so the result is
your own judgement laid out clearly, not a model's opinion.

## Engineering notes

- **The API key stays on the server.** The browser calls a Next.js route
  handler (`src/app/api/generate/route.ts`), which calls Gemini. Nothing
  secret is shipped to the client.
- **Works without a key.** With no `GEMINI_API_KEY` set, the route returns a
  fixed set of sample criteria, so the whole flow can be run and developed
  offline.
- **Defensive parsing.** The model is asked for bare JSON; the route strips
  any stray code fences before parsing and returns a clean error if the
  output still isn't JSON. When generation fails, the criteria page says so
  and lets you add criteria by hand.
- **State in one place.** Subject, options, criteria, weights and scores live
  in a single React context (`src/context/DecisionContext.tsx`) shared by the
  four steps.
- **A hardware-panel look.** Brushed-metal panels, corner screws and indicator
  lamps are built from Tailwind utilities and CSS shadows, with no image
  assets.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. To use real AI suggestions, create `.env.local`
with:

```
GEMINI_API_KEY=your-key
```

## Project layout

| Path | What |
|---|---|
| `src/app/page.tsx` | Step 1: subject, options, templates |
| `src/app/criteria/` | Step 2: AI-suggested criteria, editable |
| `src/app/weights/` | Step 3: importance sliders |
| `src/app/matrix/` | Step 4: scoring grid, weighted totals, winner |
| `src/app/api/generate/` | Server route that calls Gemini |
| `src/context/` | Shared decision state |
| `src/components/ui/` | Button, card, input and slider primitives |
