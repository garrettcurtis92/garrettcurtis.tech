# Portfolio design spec — `garrettcurtis.tech`

> The binding design contract for the rebuild. Every slice references this file. If a slice surfaces a design decision that isn't covered here, work stops and the gap gets resolved by updating this file. Implementation never invents against the spec.

**Status:** v1, ratified 2026-05-20.
**Aesthetic lane:** B — Warm editorial (without the magazine trap).
**Owners:** Garrett Curtis (design). Claude Code (implementation).
**Source artifacts:** `prototypes/lane-a.html`, `prototypes/lane-b.html`, `prototypes/index.html` (Lane B was selected).

---

## 1. Design intent

The site is the work product of an AI-native builder writing for hiring managers at AI-forward product companies. It signals **judgment, restraint, and craft** — the kind of taste that comes from shipping production systems, not from following dev-portfolio templates. The visual system carries one voice in the chrome (geometric sans) and a second, warmer voice in long-form prose (workhorse serif). The split is deliberate: the case studies are the actual evaluation moment, and they should read like writing, not content.

What the site **is**: a thoughtful technical document where the work is the show. Bold readable type, real screenshots, generous spacing, one saturated accent used like punctuation.

What the site **is not**: a generic SaaS landing page, a magazine cosplay, a dev-portfolio template, an AI-startup hero with gradient blurs, or a flashy 3D playground.

---

## 2. Color tokens

All colors expressed in **OKLCH** for perceptual consistency across modes. Neutrals are tinted toward the brand hue (warm, hue ≈ 55) — never pure or cool. Accent is a warm ember; chroma is tuned per mode to hold visual weight without clipping.

### 2.1 Light mode

| Token | OKLCH | Approx hex | Purpose |
|---|---|---|---|
| `--color-bg` | `oklch(0.97 0.005 60)` | `#F8F4EE` | Page background |
| `--color-surface` | `oklch(0.94 0.008 55)` | `#EFE8DD` | Cards, raised panels |
| `--color-surface-2` | `oklch(0.91 0.010 55)` | `#E4DCCF` | Hover state for surface |
| `--color-text` | `oklch(0.20 0.010 55)` | `#2A2622` | Primary body text, headings |
| `--color-text-muted` | `oklch(0.45 0.008 55)` | `#6F665D` | Secondary text, captions |
| `--color-border` | `oklch(0.85 0.008 55)` | `#D5CBBC` | Section dividers, button borders |
| `--color-border-soft` | `oklch(0.91 0.006 55)` | `#E5DDD0` | Card borders, tag borders |
| `--color-accent` | `oklch(0.60 0.15 38)` | `#B14F2A` | Ember. Punctuation, links on hover, focus rings, eyebrow labels |
| `--color-accent-fg` | `oklch(0.97 0.005 60)` | `#F8F4EE` | Text on accent backgrounds |
| `--color-focus-ring` | `oklch(0.60 0.15 38 / 0.40)` | — | Focus outline |

### 2.2 Dark mode

| Token | OKLCH | Approx hex | Purpose |
|---|---|---|---|
| `--color-bg` | `oklch(0.16 0.008 55)` | `#24201B` | Page background |
| `--color-surface` | `oklch(0.21 0.010 55)` | `#322D27` | Cards, raised panels |
| `--color-surface-2` | `oklch(0.25 0.010 55)` | `#3D372F` | Hover state for surface |
| `--color-text` | `oklch(0.95 0.005 60)` | `#F1EDE6` | Primary body text, headings |
| `--color-text-muted` | `oklch(0.70 0.008 55)` | `#B5ACA0` | Secondary text, captions |
| `--color-border` | `oklch(0.30 0.010 55)` | `#4A4239` | Section dividers, button borders |
| `--color-border-soft` | `oklch(0.24 0.008 55)` | `#3A342D` | Card borders, tag borders |
| `--color-accent` | `oklch(0.70 0.16 40)` | `#D26339` | Ember (lifted for dark-mode contrast) |
| `--color-accent-fg` | `oklch(0.16 0.008 55)` | `#24201B` | Text on accent backgrounds |
| `--color-focus-ring` | `oklch(0.70 0.16 40 / 0.45)` | — | Focus outline |

### 2.3 Accent usage budget

The accent appears in roughly the following places and **nowhere else**:

1. The two periods in the headline lockup (`AI-native builder<accent>.</accent> Full-stack engineer<accent>.</accent>`).
2. The `.` after the brand mark in the header (`Garrett Curtis<accent>.</accent>`).
3. Case-study eyebrow links (the small mono `/work/it-helpdesk` style labels).
4. Link hover state on `.case-cta` links (the underline + arrow combo).
5. Focus ring on all interactive elements (replaces the browser default).
6. The "// now" status line in the hero meta block.
7. The featured-side-project badge outline.
8. The active-link indicator in the prototype lane-bar (not shipped to the real site).

That is the entire accent budget. New uses require a spec update.

### 2.4 Mode selection

Both light and dark are first-class. Default behavior:

1. Respect `prefers-color-scheme` on first visit.
2. Provide an explicit toggle in the header.
3. Persist the user's chosen mode to `localStorage` with key `gc:theme` (`"light"` | `"dark"`).
4. Set `<html data-theme="...">` to drive the tokens.

---

## 3. Typography

### 3.1 Pairing

| Role | Family | Source | Use |
|---|---|---|---|
| Sans (UI chrome, hero, project cards, buttons, nav) | **Hanken Grotesk** | Google Fonts | Default for everything that isn't long-form prose or a case-study heading. |
| Serif (case-study headings, case-study body, subhead, featured-card heading) | **Spectral** | Google Fonts | Editorial moments. Long-form reading. Italics for emphasis. |
| Mono (eyebrows, tags, code blocks, hero meta, debug labels) | **JetBrains Mono** | Google Fonts | Small metadata, code, terminal-style labels. |

Why this pairing, in one sentence each: Hanken Grotesk is a humanist grotesque with warmth that Inter doesn't have and is not on impeccable's reflex-reject list; Spectral was designed by Production Type for on-screen long-form reading and avoids the Fraunces/Cormorant magazine-cosplay reflex; JetBrains Mono has slight humanist character without IBM Plex's ubiquity.

**Where the serif lives** (and only where):

- `h1`–`h3` inside case-study MDX pages
- `h3` (project title) inside the featured project card
- The hero subhead on the home page (a single block, set in serif at 1.125–1.3125rem)
- All body prose inside `/work/*` case studies
- The case-study card summary on the work index (the paragraph next to the screenshot frame)

The chrome (nav, buttons, project cards, tags, all H1/H2 on non-case-study pages) stays sans. **Never use the serif as an italic display headline** — that's the magazine trap.

### 3.2 Scale

Modular scale, ratio **1.333 (perfect fourth)**. Six steps plus a fluid display step for the hero.

| Token | Value | Pixel equivalent | Use |
|---|---|---|---|
| `--text-xs` | `0.78rem` | 12.5px | Mono eyebrows, tags, captions, debug labels |
| `--text-sm` | `0.875rem` | 14px | Small UI text, footer, hero meta |
| `--text-base` | `1rem` | 16px | Body default |
| `--text-md` | `1.125rem` | 18px | Hero subhead, case summary, featured card body |
| `--text-lg` | `1.5rem` | 24px | Section headings on chrome pages, h3 on case studies |
| `--text-xl` | `2rem` | 32px | Case-study card titles, case-study h2 |
| `--text-2xl` | `2.667rem` | 42.7px | Case-study top-of-page headlines |
| `--text-display` | `clamp(3.25rem, 7vw + 1rem, 6.25rem)` | 52–100px | Hero headline only |

Body line-height: **1.6** for sans body, **1.65** for serif body (light type on light bg needs more breathing room). Hero line-height: **1.0**. Heading line-height: **1.05–1.2** (tighter for larger sizes).

Body line-length: capped at **62–65ch**.

### 3.3 Weights and features

| Element | Family | Weight |
|---|---|---|
| Hero `h1` | Hanken Grotesk | 700 |
| Case-study `h1` | Spectral | 600 |
| Section `h2` (chrome) | Hanken Grotesk | 600 |
| Case-study `h2` | Spectral | 600 |
| Case-study `h3` | Spectral | 600 |
| Body sans | Hanken Grotesk | 400, 500 for emphasis |
| Body serif | Spectral | 400, italic for emphasis |
| Project card title | Hanken Grotesk | 600 |
| Featured project card title | Spectral | 600 |
| Buttons / nav links | Hanken Grotesk | 500 |
| Tags / eyebrows | JetBrains Mono | 500 |

Letter-spacing: `-0.025em` on the hero, `-0.015em` on h2/h3, `0` on body. Mono tags get `+0.04em` to `+0.08em` (tracked) when uppercase.

No font-weight below 400 anywhere. No italic on the sans (italic is reserved for serif emphasis, so the italic moment carries meaning).

---

## 4. Spacing and layout

### 4.1 Spacing scale

Seven steps. Use these only — no arbitrary pixel values in components.

| Token | Value | Use |
|---|---|---|
| `--space-1` | `0.5rem` (8px) | Tight groupings, tag gaps |
| `--space-2` | `0.875rem` (14px) | Within-paragraph margin, small gaps |
| `--space-3` | `1.25rem` (20px) | Card padding, vertical rhythm |
| `--space-4` | `2rem` (32px) | Section internal gaps, card-to-card |
| `--space-5` | `3.5rem` (56px) | Between sections |
| `--space-6` | `5.5rem` (88px) | Hero top margin, major separations |
| `--space-7` | `8rem` (128px) | Page bottom, deliberate empty space |

Spacing is deliberately varied. Same padding everywhere is the monotony failure mode (impeccable). Tight inside a card; generous between sections; very generous around the hero.

### 4.2 Container and grid

- **Container max-width:** `1100px`. Reading content max-width: `65ch`.
- Page-level alignment is **left**, never centered. Centered-stack heroes are a template.
- Asymmetric grid for case studies: `7fr | 9fr` and alternates `9fr | 7fr` (text/frame switch sides each row).
- 12-column grid for project cards: standard cards are `span 6`, featured card is `span 12` with internal `5fr | 4fr` split (text left, image right).

### 4.3 Breakpoints

Audit at: **375 / 768 / 1024 / 1440**.

- Below `720px`: collapse asymmetric case-study layout to single column (text first, frame second). Project grid becomes single column. Hero meta drops below subhead, left-aligned.
- `720px` and up: full grid behavior.

### 4.4 Radii

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `6px` | Tags, small buttons, focus outline offset |
| `--radius` | `12px` | Cards, screenshot frames |
| `--radius-lg` | `18px` | Larger panels (rare) |

No fully rounded corners (`999px`) except on tag pills and the theme-toggle button.

---

## 5. Motion

### 5.1 Principles

- Motion serves comprehension, never decoration.
- `prefers-reduced-motion: reduce` collapses all transitions to 0.01ms and disables animations.
- No infinite loops. No parallax. No 3D background.
- No animation of CSS layout properties. Animate `opacity`, `transform`, `color`, `background-color`, `border-color`.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No bounce, no elastic. No ease-in alone.
- Default duration: **280ms**. Page-level transitions max **480ms**.

### 5.2 Allowed moves

| Move | Trigger | Duration | Property |
|---|---|---|---|
| Hover color shift on links and cards | `:hover` | 280ms | `color`, `border-color`, `background-color` |
| Arrow nudge on `.case-cta` | `:hover` | 280ms | `transform: translateX(3px)` |
| Card lift on hover (subtle) | `:hover` | 280ms | `transform: translateY(-2px)` |
| Theme toggle transition | toggle | 280ms | `background-color`, `color` on `body` |
| Focus ring appearance | `:focus-visible` | instant | `outline` |
| First-load fade-in (optional, hero only) | page load | 480ms | `opacity` 0 → 1 |

### 5.3 Banned moves

- Framer Motion or any animation library on the home page. Vanilla CSS only for chrome.
- Page transitions between routes (jarring, fights the browser).
- Decorative background motion (blobs, particles, 3D).
- Letter-by-letter typewriter effects on the headline.
- Scroll-triggered reveals on every section. If used, only once per page max.

---

## 6. Component patterns

Each pattern below states its structure, the tokens it uses, and any constraints. The prototype at `prototypes/lane-b.html` is the visual reference.

### 6.1 Header / nav

- Sticky? **No** at launch. Standard document flow.
- Structure: brand left, primary links + theme toggle right.
- Brand: `Garrett Curtis<accent>.</accent>` in sans 600, `--text-md`.
- Links: sans 500, `--text-sm`, color `--color-text-muted`, hover `--color-text`. Padding `0.4rem 0.6rem`, `--radius-sm`.
- Theme toggle: pill button with mono label. `1px` border `--color-border`. Says the OTHER mode (`"dark"` when in light, `"light"` when in dark).
- No dropdowns, no hamburger menu. Three links + toggle is the entire nav.

### 6.2 Hero

- Two-column grid: headline+subhead left, hero-meta right. Collapses to single column below 720px.
- `h1`: sans 700, `--text-display`, `letter-spacing: -0.025em`, `line-height: 1.0`, `max-width: 14ch`. Two periods are accent-colored.
- Subhead: serif 400, `--text-md` to `clamp(1.125rem, 0.5vw + 1rem, 1.3125rem)`, `max-width: 54ch`. Italic on *when to use AI and when not to* (the phrase that does the work).
- Hero-meta: mono `--text-sm`, right-aligned (left-aligned on mobile). Three lines: `// now` (accent), current focus, location.

### 6.3 Case-study card (work index)

- Asymmetric two-column: `7fr | 9fr`, alternates each row.
- Body order: eyebrow → h3 → summary → stack tags → CTA.
- Eyebrow: mono `--text-xs`, accent color, `letter-spacing: 0.06em`, uppercase, mimics a URL (`/work/it-helpdesk`).
- h3: serif 600, `--text-xl`, `letter-spacing: -0.015em`.
- Summary: serif 400, `--text-md`, color `--color-text` (not muted — this paragraph carries the pitch). `max-width: 54ch`.
- Stack tags: row of mono pills (see 6.7).
- CTA: sans 500, `--text-sm` to `--text-base`, single bottom border that goes accent on hover, arrow nudges right.
- Frame: see 6.10.

### 6.4 Project card (standard)

- Grid: `span 6` on the 12-col project grid.
- Card: `--color-surface` background, `1px` border `--color-border-soft`, `--radius`, `--space-3` padding.
- Structure: image (16:10) → h4 (sans 600, `--text-md`) → summary (sans 400, `--text-sm`, muted) → stack tags.
- Hover: border shifts to `--color-border`, bg to `--color-surface-2`, optional 2px upward translate.

### 6.5 Project card (featured — LiftOS treatment)

- Grid: `span 12`. Internal `5fr | 4fr` split: meta left, image right.
- Image: 4:5 portrait aspect ratio (showcases the iOS app).
- Eyebrow: pill badge `Featured side project` in mono, accent-outlined.
- Title: **serif** 600, `--text-xl`.
- Summary: serif 400, `--text-md`, color `--color-text`, `max-width: 46ch`.
- Stack tags below.
- Card padding bumped to `--space-4`.

### 6.6 Buttons and links

- Primary button: sans 500, `--text-sm`, accent background, `--color-accent-fg` text, `--radius-sm`. No primary buttons on the home page at launch (the case-study CTAs are link-style, not button-style).
- Secondary / ghost button: transparent bg, `1px` border `--color-border`, sans 500. Used for the theme toggle.
- Inline links in prose: underline always present (`text-decoration: underline; text-underline-offset: 3px`), accent color on hover. No "color-only" links.
- `.case-cta` style: sans 500, single bottom border that shifts to accent + an arrow that nudges 3px right on hover.

### 6.7 Tags

- Mono `--text-xs`, color `--color-text-muted`, bg `--color-surface`, `1px` border `--color-border-soft`, `--radius` of `999px` (pill).
- Padding `0.22rem 0.6rem`, line-height 1.4.
- Used for: tech stack lists, never for status indicators or filtering UI.

### 6.8 MDX prose (case study body)

- Container: `max-width: 65ch`, centered within the article.
- All body paragraphs: serif 400, `--text-md`, line-height 1.65.
- `h2`: serif 600, `--text-2xl`, margin-top `--space-5`, margin-bottom `--space-2`. Letter-spacing `-0.015em`.
- `h3`: serif 600, `--text-lg`, margin-top `--space-4`, margin-bottom `--space-1`.
- `blockquote`: 4px left border `--color-accent`, italic prose, padding-left `--space-3`. (Side-stripe note: this is the ONE allowed use of a colored left border in the system. Reserved for blockquote semantics, never for callouts.)
- `strong`: weight 600, no color change.
- `em`: italic, no color change. The italic moment is meaningful.
- `ul` / `ol`: `--space-1` between items, hanging indent.
- Inline `code`: mono `--text-sm`, `--color-surface` background, `0.18rem 0.4rem` padding, `--radius-sm`.

### 6.9 Code blocks

- `pre`: mono `--text-sm`, `--color-surface` background, `1px` border `--color-border-soft`, `--radius`, padding `--space-3`.
- Overflow: horizontal scroll, never wrap.
- No syntax highlighting library bundled at launch — defer to a later slice if it earns its place.
- Optional caption above the block (mono `--text-xs`, muted): `// src/lib/extract-ticket.ts`.

### 6.10 Screenshot frame

- `--color-surface` background, `1px` border `--color-border-soft`, `--radius`.
- Default aspect ratio: **16:10** for desktop captures, **4:5** for mobile/featured.
- Image inside: `object-fit: cover`, fills the frame, inherits the inner radius (`calc(var(--radius) - 1px)`).
- **Frosted-blur treatment** for IT Helpdesk screenshots: a CSS mask or `backdrop-filter: blur(10px)` localized to the company wordmark region. The rest of the UI is intact. Implementation detail deferred to Slice 2; the spec just establishes that the blur is on the wordmark only, not the whole image.
- **Lawn Games screenshots**: no treatment. Direct render.
- **Placeholder treatment** (when no real screenshot exists yet): subtle 40px crosshatch pattern in `--color-border-soft` at 50% opacity, with a small mono label pinned bottom-left in a bordered chip. Used in Slice 1/2 if real screenshots are not yet captured.

### 6.11 Contact form (Slice 3)

- Single-column form, max-width `560px`, left-aligned.
- Inputs: sans 400, `--text-base`, `1px` border `--color-border`, `--radius-sm`, padding `0.7rem 0.85rem`. Background `--color-bg`.
- Labels: sans 500, `--text-sm`, `--color-text`. Above the input, not floated. `margin-bottom: 0.4rem`.
- Error state: text in dark-mode-aware error color (TBD in Slice 3 spec — defaults to `oklch(0.55 0.18 25)` for light, `oklch(0.70 0.18 25)` for dark), border in same hue.
- Submit button: primary button style (see 6.6). Loading state replaces label with a small mono `sending...`.
- Success state: replace form with a single sentence of serif body confirming the message was received.
- No Turnstile/captcha at launch unless spam is an actual problem (carry-over from current site, which has Turnstile — decide in Slice 3).

### 6.12 Footer

- Single row, justified between. `--color-text-muted`, `--text-sm`.
- Left: `© {year} Garrett Curtis`.
- Right: GitHub, LinkedIn, email links. Sans 500, hover to accent.
- Top border `1px` `--color-border-soft`.

---

## 7. Imagery

### 7.1 Profile photo

- Source: `/public/me.jpeg` (carries over from the current site).
- Usage: About page primary image, ~280–360px on desktop.
- No cropping into a circle by default. Square or 4:5 crop with `--radius`. The current circular treatment is dropped.

### 7.2 Case-study screenshots

- IT Helpdesk: frosted blur on company wordmark only. See 6.10.
- Lawn Games: untreated.
- Other future case studies: treatment decision is made when the case study is written.

### 7.3 Project card images

- Use the existing assets in `/public` (`LiftOS.png`, `alpha-christians.png`, `thehouseministry.jpg`, etc.).
- All cards display the image at a consistent aspect ratio (16:10 for standard, 4:5 for featured).
- `object-fit: cover`. Position center.

### 7.4 OG images

- Per-page, generated via `@vercel/og` in Slice 5.
- Layout: brand mark + page title + ember accent dot.
- Sans 700 title, serif kicker if it's a case study, mono URL footer.
- 1200×630.

### 7.5 No decorative imagery

- No background blobs.
- No particle systems.
- No 3D scenes.
- No SVG illustrations of robots, brains, or generic "tech" iconography.
- No iso-view laptop mockups.

The page has the work, the typography, and the photograph of Garrett. That is the entire imagery vocabulary.

---

## 8. Accessibility

### 8.1 Floor

- **WCAG 2.1 AA** is the minimum. Where AAA is feasible without compromise, prefer it.
- All text colors paired with their backgrounds must meet at least **4.5:1** contrast (normal text) or **3:1** (large text, ≥24px or ≥18.66px bold).
- Focus ring: 2px solid `--color-focus-ring`, 2px offset, on every interactive element. Never `outline: none` without a custom replacement.
- All interactive elements keyboard-reachable in document order. No `tabindex="-1"` on link/button content.
- All images have meaningful `alt` text. Decorative-only elements get `alt=""` plus `aria-hidden="true"`.

### 8.2 Verification

Concrete contrast pairs to validate during Slice 0/1 implementation (verify with a tool, do not estimate):

- Light mode: `--color-text` on `--color-bg`, `--color-text-muted` on `--color-bg`, `--color-accent` on `--color-bg`.
- Dark mode: `--color-text` on `--color-bg`, `--color-text-muted` on `--color-bg`, `--color-accent` on `--color-bg`.
- All four `--color-accent` × `--color-bg` combinations must pass AA. If any fail, lift the accent's L value in that mode.

### 8.3 Motion

- `prefers-reduced-motion: reduce` is honored everywhere. Transitions drop to 0.01ms; no animation loops.

### 8.4 Semantics

- Single `h1` per page.
- Use `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` semantically.
- Form inputs always have a visible `<label>`.

---

## 9. Anti-patterns (refuse to ship)

Restated verbatim from `docs/PORTFOLIO_SPEC.md` and impeccable's shared design laws. Any of these in a PR is a blocker.

### 9.1 Visual

- Generic AI/SaaS gradients (purple-to-blue, particle backgrounds, "AI orb" decorations).
- Faux-glass / glassmorphism cards used decoratively.
- Iso-view laptop mockups.
- Fake-terminal hero or generic placeholder code blocks on a hero.
- Stock dev-portfolio tropes (skill icon wall, "tech I've used" grids of logos).
- Side-stripe borders (`border-left` > 1px) on cards, callouts, or list items. *Exception: blockquote prose (see 6.8).*
- Gradient text (`background-clip: text` on a gradient background).
- Hero-metric template (giant number + small label + gradient accent).
- Identical card grids: same-sized icon + heading + text repeated endlessly.
- Modal as a first-thought UI pattern. Exhaust inline / progressive disclosure first.
- Large rounded-corner icons above every heading (template tell).
- Repeated tiny uppercase tracked labels above every section heading.
- All-caps body copy.
- Editorial-magazine cosplay: italic display-serif headlines, drop caps, ruled three-column metadata. *We use serif for case-study prose only.*

### 9.2 Copy

- Aspirational or transition language: "learning," "becoming," "transitioning to," "aspiring to be."
- "Corporate Infrastructure Specialist → Software Engineer" framing.
- Buzzwords: "passionate," "innovative," "synergize," "leverage" as a verb, "transformative."
- "I had the opportunity to..." hedging. Garrett owns work directly.
- Em dashes (`—` or `--`). Use commas, colons, semicolons, periods, or parentheses.

### 9.3 Motion

- Framer Motion or any motion library on chrome pages.
- Page transitions between routes.
- Decorative loops (drifting blobs, animated particles, idle 3D scenes).
- Letter-by-letter typewriter effects on the headline.

### 9.4 Type

- Inter, IBM Plex Sans/Mono/Serif, DM Sans, DM Serif Display, DM Serif Text, Outfit, Plus Jakarta Sans, Instrument Sans, Instrument Serif, Fraunces, Newsreader, Lora, Crimson, Crimson Pro, Crimson Text, Playfair Display, Cormorant, Cormorant Garamond, Syne, Space Mono, Space Grotesk. All on impeccable's reflex-reject list.
- System fonts as the default for production (only as a fallback while web fonts load).

---

## 10. Workflow rules for implementation

1. Every slice references this file at the start.
2. If a slice surfaces a UI need not covered here: stop. Surface the gap to Garrett. Resolve by updating this spec, not by improvising in code.
3. Per-slice specs (e.g. `docs/specs/2026-05-21-slice-0-foundation-design.md`) extend this file; they don't override it.
4. Tokens land in CSS custom properties in `src/app/globals.css` (Slice 0) using the names in §2 and §4.1. Tailwind v4's `@theme` block maps them.
5. Component patterns from §6 are the source of truth for the corresponding implementation. If a built component diverges, either the component is wrong or the spec is wrong — never both right.
6. Any new color, font, or pattern that doesn't appear above requires updating this spec **first**, then implementing.

---

## 11. References

- `docs/PORTFOLIO_SPEC.md` — locked product/positioning spec
- `prototypes/lane-b.html` — visual reference for this spec
- `prototypes/lane-a.html` — rejected alternative, kept for diff
- impeccable plugin (`brand` register reference) — shared design laws this spec inherits

---

## 12. Changelog

| Date | Change |
|---|---|
| 2026-05-20 | v1 ratified. Lane B (Spectral + Hanken Grotesk + JetBrains Mono, ember accent). |
