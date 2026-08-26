# Trails — Design Notes

## What it is

Trails is a trip-planning app for Enugu, Nigeria, expanding into wider Nigeria. Tagline (hero copy): **"Plan a smarter adventure through Enugu."** Subhead: "Browse waterfalls, hotels, restaurants, and cultural stops, then hand off to the Trails agent to shape a practical itinerary with local context."

Two core surfaces:
- **Explore** (`/explore`) — browsable catalog of places: attractions, hotels, resorts, restaurants, plus a Nigeria-wide extension tier.
- **Planner / Agent** (`/`, `/agent`) — a form (duration, travelers, budget, pace, interests) that hands off to an AI chat agent ("Trails agent") which builds the actual itinerary. Two entry modes: `guided` (form answers passed as query params) and `open` (blank chat).

Nav is just two items: **Explore**, **Planner**.

## Critical files

- `app/page.tsx` — homepage: hero + planner form + featured places + Nigeria extensions.
- `app/explore/*` — place catalog + detail pages.
- `app/agent/page.tsx` — the AI chat surface itineraries are actually generated in.
- `lib/enugu-data.ts` — source of truth for all places. Each `Place` has `slug, name, category (attraction | hotel | restaurant | resort | nigeria), area, kind, time?, priceLevel?, address?, image, images?, note, description`. Exports `allPlaces`, `findPlaceBySlug`.
- `lib/budget-tiers.ts` — the budget model (see below).
- `components/site-header.tsx` — shared nav, `overlay` (hero, white text on photo) vs `solid` variant.
- `components/place-card.tsx`, `components/place-image-carousel.tsx` — catalog card + detail-page gallery.
- `app/globals.css` — all design tokens.

## Product logic worth knowing

**Budget tiers** (`lib/budget-tiers.ts`), priced in ₦/person/day:
- **Lean** — ₦65k–100k. "Comfortable essentials, practical accommodation, affordable dining."
- **Mid-range** — ₦100k–150k. "Comfortable hotels, good restaurants, convenient transport."
- **Premium** — ₦150k+. "Premium accommodation, private transport, upscale dining."

Baseline cost = tier rate × travelers × days, formatted compact (`₦1.4m`, `₦230k`).

**Place data** is the native shape of the product — a flat catalog with category + area, not a itinerary/timeline structure. The planner doesn't build itineraries itself; it collects constraints (days, travelers, budget, pace, interests) and hands them to the agent, which does the actual sequencing.

## Visual identity (from `globals.css` / `app/page.tsx`)

**Type:**
- Headings: Instrument Sans (`--font-heading`), heavy tracking-normal, big sizes (hero goes `text-5xl` → `text-8xl` at `lg`).
- Body: Geist (`--font-sans`).
- Mono: Geist Mono.
- Section eyebrows are uppercase, letter-spaced (`tracking-[.16em]`, `text-xs`), muted color — e.g. "TRAILS AI", "FEATURED ENUGU", "ESTIMATED BASELINE".

**Color** — oklch tokens, standard shadcn slots (`background`, `foreground`, `primary`, `muted`, `border`, etc.), light + `.dark` variants defined. Primary is a blue (`oklch(0.488 0.243 264.376)` light / `oklch(0.424 0.199 265.638)` dark). Neutral background/foreground otherwise — color is not the brand device, layout and photography are.

**Shape:** `--radius: 0.625rem` base, but most UI (cards, tags, panels) is drawn with plain `border` and *no* rounding — sharp rectangles, not rounded-corner cards. Radius scale exists (`sm` → `4xl`) for components that opt in (buttons, inputs via shadcn defaults) but the page's own layout deliberately stays square-edged.

**Hero pattern:** full-bleed photo, dark-to-transparent left-to-right gradient overlay (`linear-gradient(90deg, rgba(8,12,18,.9), .5, .18)`), white text on top, glass panel (`border-white/18 bg-black/30 backdrop-blur-md`) floating on the right for the planner form.

**Cards/tags:** plain `border`, no shadow, no radius — e.g. interest pills (`border px-3 py-1.5 text-xs`), selected state flips to solid `bg-white text-black`.

**Icons:** Hugeicons (`@hugeicons/react` + `core-free-icons`), stroke-style, used sparingly next to headings/buttons — never decorative filler.

## What the README leads with

Repo `README.md` is the generic Next.js/shadcn template README — it has no product copy. The real "what this leads with" signal comes from `app/page.tsx`'s hero: **place-browsing first, AI planning second** ("Generate trip" and "Explore places" are the two hero CTAs, in that order), then a three-up value strip (**Adventure fit** / **Local context** / **Food, stays, and stops**), then the live planner-request summary handed to the agent.
