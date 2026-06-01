# Design System: BMW Showcase

## 1. Visual Theme & Atmosphere
A restrained yet aggressive "Aggressive Sport" atmosphere. It blends museum-grade editorial layout with the kinetic energy of a racetrack. High-contrast transitions between deep charcoal surfaces and bright chrome-fog backgrounds create a dramatic spatial rhythm.

## 2. Color Palette & Roles
- **Carbon Deep** (#020305) — Primary background, Vantablack depth.
- **Carbon Soft** (#10151d) — Secondary surface, nested containers.
- **Chrome Fog** (#e8edf2) — Primary ink, highlight text.
- **BMW Blue** (#0066b1) — Strategic accent, heritage brand color.
- **Crimson Peak** (#b11f2a) — Secondary accent, performance indicators.
- **Whisper Border** (rgba(255,255,255,0.06)) — Hairline structural lines.

## 3. Typography Rules
- **Display:** Frick (Self-hosted) — Track-tight (-0.04em), uppercase. A high-impact headline font for aggressive branding.
- **Condensed Display:** Frick Condensed — For technical highlights and high-density labels.
- **Body:** Satoshi — Relaxed leading (1.6), 65ch max-width, medium weight for legibility.
- **Mono:** Geist Mono — For technical specs, engine codes, and coordinate metadata.
- **Banned:** Inter, Roboto, generic system serifs, Cabinet Grotesk (replaced by Frick).

## 4. Component Stylings
* **Buttons:** "Island" architecture. Pill-shaped outer shell with a circular inner trailing icon. Solid Carbon fill for secondary, BMW Blue for primary.
* **Containers:** "Double-Bezel" (Doppelrand) nested architecture. Outer shell with `rounded-[2.5rem]` and 8px padding, Inner core with `rounded-[2rem]`.
* **Media:** Video and images must be wrapped in a `media-frame` with a hairline white/10 ring and subtle background tint.
* **Eyebrows:** Microscopic, uppercase, tracking-[0.58em], preceded by a 40px horizontal line.

## 5. Layout Principles
- **Bento Grid:** Asymmetric grid for feature showcases. No equal 3-column rows.
- **Cinematic Split:** Hero sections use a 60/40 or 70/30 split between massive typography and edge-to-edge media.
- **Spatial Rhythm:** Minimum `py-24` for macro-whitespace between chapters.

## 6. Motion & Interaction
- **Physics:** GSAP/Framer Motion using `stiffness: 100, damping: 20` or `cubic-bezier(0.32, 0.72, 0, 1)`.
- **Entrance:** Heavy fade-up with blur-md to blur-0 interpolation.
- **Hover:** Active scale-down (0.98) on buttons; magnetic diagonal translate on nested icons.
- **Banned:** Hover animations on `<img>` elements.

## 7. Anti-Patterns (Banned)
- No emojis.
- No purple/neon glows.
- No `Inter` font.
- No centered Hero sections.
- No generic "Learn More" links; use specific verb + object (e.g., "Explore Engineering").
- No thin, gray body text on dark backgrounds.
