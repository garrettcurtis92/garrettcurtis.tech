# Slice 0 — Foundation (design)

> The build spec for Slice 0 of the `garrettcurtis.tech` rebuild. Extends `docs/PORTFOLIO_SPEC.md` (product spec) and `docs/design-spec.md` (visual contract); does not override either. If a decision in this file contradicts the design spec, the design spec wins and this file gets updated.

**Status:** Approved 2026-05-20 (brainstorm session). Ready to hand off to `superpowers:writing-plans`.
**Slice scope:** Foundation only. No home/about/work/contact content.
**Target branch:** `slice-0-foundation` → PR into `rebuild/v2`.
**Staging URL (once deploy is live):** `garrett-portfolio-rebuild.vercel.app` (production branch must be set to `rebuild/v2`; default after `vercel link` is `main` and needs switching in Project → Settings → Git).

---

## 1. Scope

### In scope

- Wipe legacy `src/` and root configs from the old site.
- Pin a new stack: Next.js 16 + React 19 + Tailwind v4 + TypeScript strict.
- Implement brand design tokens from `design-spec.md` (§2 colors, §3.2 type scale, §4.1 spacing, §4.4 radii) as CSS custom properties + Tailwind v4 `@theme` mapping.
- Three Google fonts loaded via `next/font/google`: Hanken Grotesk (sans), Spectral (serif), JetBrains Mono (mono).
- Theme persistence: `<html data-theme="light|dark">` attribute, `localStorage` key `gc:theme`, `prefers-color-scheme` fallback, pre-hydration bootstrap script to prevent flash-of-wrong-theme.
- Four chrome components: `RootLayout`, `Header`, `Footer`, `ThemeToggle`. Header at Slice 0 is brand + theme toggle only (nav links land in Slice 1).
- Lane-B placeholder home page that visually verifies tokens + fonts + theme work.
- New Vercel project deploying `rebuild/v2` to a staging URL. The existing project serving `garrettcurtis.tech` from `main` is untouched until Slice 5 cutover.
- GitHub Actions CI workflow running four gates on PRs: `lint`, `typecheck`, `test`, `docs:check`.
- Port `scripts/docs-check.mjs` from the lawn-games project.
- Update `PORTFOLIO_SPEC.md` to reflect: shadcn deferred from Slice 0 to Slice 3, Slice 0 marked complete, Current status block advanced to Slice 1.
- Add a `v1.1` changelog entry to `design-spec.md` documenting the raw token rename described in §4.

### Out of scope

- Home, About, Work, Contact, Writing — content lands in Slices 1–4.
- Case-study MDX rendering — Slice 2.
- shadcn/ui — deferred to Slice 3 (forms slice).
- OG images, `sitemap.xml`, `robots.txt`, Vercel Analytics — Slice 5.
- Pre-commit hooks (Husky / lint-staged) — not added.
- DNS cutover to `garrettcurtis.tech` — Slice 5.

---

## 2. Stack and pinned versions

Match the lawn-games working stack. All versions GA at time of writing.

### Runtime dependencies

| Package | Version |
|---|---|
| `next` | `^16.2.4` |
| `react` | `^19.2.4` |
| `react-dom` | `^19.2.4` |

### Dev dependencies

| Package | Version | Purpose |
|---|---|---|
| `typescript` | `^5` | Type system, strict mode |
| `@types/node` | `^20` | Node typings |
| `@types/react` | `^19` | React typings |
| `@types/react-dom` | `^19` | ReactDOM typings |
| `tailwindcss` | `^4` | CSS-first config |
| `@tailwindcss/postcss` | `^4` | Tailwind v4 PostCSS plugin |
| `eslint` | `^9` | Flat-config era |
| `eslint-config-next` | `16.2.4` | Pinned to Next minor |
| `eslint-plugin-tsdoc` | `^0.5.2` | docs:check gate |
| `prettier` | `^3.8.3` | Formatter |
| `vitest` | `^4.1.5` | Test runner |
| `@vitest/ui` | `^4.1.5` | Dev UX |
| `happy-dom` | `^20.9.0` | DOM env for tests |
| `@testing-library/react` | latest stable | Component rendering |
| `@testing-library/jest-dom` | latest stable | DOM assertions |
| `tinyglobby` | `^0.2.16` | docs:check globbing |
| `tsx` | `^4.21.0` | TS script runner |

### Not installed at Slice 0

`shadcn`, `lucide-react`, `framer-motion`, `class-variance-authority`, `clsx`, `tailwind-merge`. Each lands in the slice that first needs it (likely `clsx` + `tailwind-merge` in Slice 1 if a `cn()` helper becomes useful; `shadcn` in Slice 3; the rest only if earned).

---

## 3. Repo hygiene

### Files wiped from `src/`

Every file in `src/` is replaced. Listed for completeness so reviewers know the wipe is deliberate, not accidental.

| Path | Why it goes |
|---|---|
| `src/app/layout.tsx`, `page.tsx`, `globals.css` | Replaced; old chrome + home |
| `src/app/contact/page.tsx` | Slice 3 replaces |
| `src/app/projects/page.tsx` | Slice 2 replaces |
| `src/components/Nav.tsx`, `Footer.tsx`, `ProjectCard.tsx`, `ThemeToggle.tsx` | Replaced with new versions matching the design spec |
| `src/components/GlassCard.tsx` | Glassmorphism is anti-pattern (`design-spec.md` §9.1) |
| `src/components/BackgroundBlobs.tsx` | Decorative motion is anti-pattern (§9.3) |
| `src/components/SkillGalaxy.tsx` | 3D scene is anti-pattern (§7.5, §9.3) |
| `src/components/RouteTransition.tsx` | Page transitions are anti-pattern (§9.3) |
| `src/lib/projects.ts` | Slice 2 reimagines |
| `src/types/r3f.d.ts` | No more Three.js |

### Root-config replacements

| Path | Action |
|---|---|
| `next.config.mjs` | Replace with `next.config.ts` (Next 16 + lawn-games convention) |
| `postcss.config.js` | Replace with `postcss.config.mjs` using only `@tailwindcss/postcss` |
| `tsconfig.json` | Port from lawn-games (target ES2017, jsx react-jsx, paths `@/*` → `./src/*`) |
| `tailwind.config.js` | **Delete.** Tailwind v4 is CSS-first; no JS config |
| `package.json` | Rewrite dependencies and scripts |
| `package-lock.json` | Regenerated by `npm install` |

### Root files added

- `.github/workflows/ci.yml`
- `.prettierrc`
- `eslint.config.mjs` (flat config)
- `scripts/docs-check.mjs` (ported)
- `vitest.config.ts`

### `public/` audit

Keep: `me.jpeg`, `LiftOS.png`, `alpha-christians.png`, `thehouseministry.jpg`, `Oktoberfest.png`, `RebeccaKelly.png`, `StayWise.png`. All referenced in `design-spec.md` §7 / spec §2 (Slice 2 card images). Image optimization is Slice 2's responsibility.

Drop: `WorkOrders.jpg`, `movie-search.png`. Neither is referenced in the rebuild plan; both are legacy.

### What survives untouched

- `README.md` (rewrite is a Slice 5 deliverable, not Slice 0)
- `docs/PORTFOLIO_SPEC.md` (edited at end of slice; not wiped)
- `docs/design-spec.md` (changelog entry appended; body untouched)
- `prototypes/index.html`, `lane-a.html`, `lane-b.html` (visual reference)
- `.gitignore`, `next-env.d.ts`

### Final repo layout at end of Slice 0

```text
garrettcurtis.tech/
├── .github/workflows/ci.yml
├── docs/
│   ├── PORTFOLIO_SPEC.md           (edited)
│   ├── design-spec.md              (changelog appended)
│   └── specs/
│       └── 2026-05-20-slice-0-foundation-design.md   (this file)
├── prototypes/                      (unchanged)
├── public/                          (pruned to 7 survivors)
├── scripts/
│   └── docs-check.mjs               (ported from lawn games)
├── src/
│   ├── app/
│   │   ├── globals.css              (tokens + base styles)
│   │   ├── layout.tsx               (fonts + theme bootstrap + chrome)
│   │   ├── page.tsx                 (Lane-B placeholder)
│   │   └── favicon.ico              (placeholder; replaced in Slice 5)
│   ├── components/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   └── lib/
│       └── theme.ts                 (storage key + Theme type)
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Design token implementation

### 4.1 The naming collision and the fix

`design-spec.md` §2 names exposed tokens `--color-bg`, `--color-text`, `--color-accent`, etc. Tailwind v4's `@theme` block reserves the `--color-X` namespace to generate `bg-X`, `text-X`, `border-X` utilities. If raw OKLCH values live under `--color-bg`, the `@theme` block has nowhere to point at them without self-reference.

**Decision:** raw OKLCH values use unprefixed CSS variable names (`--bg`, `--text`, `--accent`, …). The `@theme inline` block maps them to `--color-bg`, `--color-text`, etc., which are the names consumers reference and the names Tailwind uses for utility generation. The semantic intent (which color, which mode, which OKLCH value) is unchanged from the design spec.

This is documented as a `v1.1` changelog entry in `design-spec.md` (see §13 of this file).

### 4.2 Shape of `src/app/globals.css`

```css
@import "tailwindcss";

/* ============================================================================
   Light defaults — design-spec.md §2.1, raw values
   ============================================================================ */
:root {
  --bg: oklch(0.97 0.005 60);
  --surface: oklch(0.94 0.008 55);
  --surface-2: oklch(0.91 0.010 55);
  --text: oklch(0.20 0.010 55);
  --muted: oklch(0.45 0.008 55);
  --border: oklch(0.85 0.008 55);
  --border-soft: oklch(0.91 0.006 55);
  --accent: oklch(0.60 0.15 38);
  --accent-fg: oklch(0.97 0.005 60);
  --focus-ring: oklch(0.60 0.15 38 / 0.40);
}

/* ============================================================================
   Dark overrides — design-spec.md §2.2
   ============================================================================ */
[data-theme="dark"] {
  --bg: oklch(0.16 0.008 55);
  --surface: oklch(0.21 0.010 55);
  --surface-2: oklch(0.25 0.010 55);
  --text: oklch(0.95 0.005 60);
  --muted: oklch(0.70 0.008 55);
  --border: oklch(0.30 0.010 55);
  --border-soft: oklch(0.24 0.008 55);
  --accent: oklch(0.70 0.16 40);
  --accent-fg: oklch(0.16 0.008 55);
  --focus-ring: oklch(0.70 0.16 40 / 0.45);
}

/* ============================================================================
   Tailwind v4 token mapping. `inline` keeps these as var() references so the
   [data-theme="dark"] overrides flow through to utility classes at runtime.
   ============================================================================ */
@theme inline {
  /* Colors → bg-*, text-*, border-*, outline-*, ring-* utilities */
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-border-soft: var(--border-soft);
  --color-accent: var(--accent);
  --color-accent-fg: var(--accent-fg);

  /* Spacing → p-1..p-7, m-1..m-7, gap-1..gap-7, etc. per design-spec §4.1 */
  --spacing-1: 0.5rem;
  --spacing-2: 0.875rem;
  --spacing-3: 1.25rem;
  --spacing-4: 2rem;
  --spacing-5: 3.5rem;
  --spacing-6: 5.5rem;
  --spacing-7: 8rem;

  /* Type sizes → text-xs..text-display per design-spec §3.2 */
  --text-xs: 0.78rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.125rem;
  --text-lg: 1.5rem;
  --text-xl: 2rem;
  --text-2xl: 2.667rem;
  --text-display: clamp(3.25rem, 7vw + 1rem, 6.25rem);

  /* Radii → rounded-sm, rounded, rounded-lg per design-spec §4.4 */
  --radius-sm: 6px;
  --radius: 12px;
  --radius-lg: 18px;

  /* Fonts — wired to next/font/google CSS variables from layout.tsx */
  --font-sans: var(--font-hanken-grotesk);
  --font-serif: var(--font-spectral);
  --font-mono: var(--font-jetbrains-mono);
  --default-font-family: var(--font-sans);
}

@layer base {
  html {
    color-scheme: light;
  }
  html[data-theme="dark"] {
    color-scheme: dark;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    line-height: 1.6;
    transition:
      background-color 280ms cubic-bezier(0.16, 1, 0.3, 1),
      color 280ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  *:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 4.3 Resulting Tailwind utilities

The above generates (non-exhaustive):

- Background: `bg-bg`, `bg-surface`, `bg-surface-2`, `bg-accent`
- Text color: `text-text`, `text-muted`, `text-accent`, `text-accent-fg`
- Borders: `border-border`, `border-border-soft`, `border-accent`
- Spacing (padding/margin/gap): `p-1` through `p-7`, `m-1` through `m-7`, `gap-1` through `gap-7`, plus all directional variants
- Type: `text-xs`, `text-sm`, `text-base`, `text-md`, `text-lg`, `text-xl`, `text-2xl`, `text-display`
- Radius: `rounded-sm`, `rounded`, `rounded-lg`
- Font family: `font-sans`, `font-serif`, `font-mono`

Tailwind's default spacing scale beyond `--spacing-7` is unaffected — arbitrary values like `p-[1rem]` continue to work for one-off needs.

---

## 5. Theme persistence

### 5.1 Bootstrap script (inlined in `<head>`, runs pre-hydration)

Readable form, shown here for review. The shipped form in `layout.tsx` is single-line minified to keep the inlined `<script>` small in the server HTML.

```js
(function(){
  try {
    var s = localStorage.getItem('gc:theme');
    var t = (s === 'light' || s === 'dark')
      ? s
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
```

**Precedence:** explicit user choice (`localStorage.gc:theme`) wins over OS preference. Once the user toggles, the choice sticks across OS-preference flips.

**Why inline:** the script must execute synchronously before first paint to set `data-theme` on `<html>`. A normal external script would race with paint and produce a flash. The `dangerouslySetInnerHTML` injection puts the script inline in the server-rendered HTML.

### 5.2 `<ThemeToggle>` component behavior

- Mounts on the client. On first effect, reads `document.documentElement.getAttribute('data-theme')` (already set by the bootstrap), stores in local state, sets `mounted = true`.
- On click: computes the opposite theme, calls `setAttribute('data-theme', next)`, writes to `localStorage.gc:theme`, updates state.
- Renders the OTHER mode's name as label per `design-spec.md` §6.1 ("dark" when current is light, "light" when current is dark).
- Pre-mount label is ` ` (non-breaking space) so the button has stable width — prevents layout shift when the real label appears post-hydration.

### 5.3 Shared constants in `src/lib/theme.ts`

```ts
/** Shared theme storage key referenced by the layout bootstrap script and ThemeToggle. */
export const THEME_STORAGE_KEY = "gc:theme";

/** Resolved theme; bootstrap guarantees one of these two values lives on `<html data-theme>`. */
export type Theme = "light" | "dark";
```

The string literal `'gc:theme'` appears in two places: the inline bootstrap script (must be a plain string for inlining; can't reference a JS constant) and the `<ThemeToggle>` component (imports `THEME_STORAGE_KEY`). Both are documented; if one changes, the other must change too. The const is the source of truth for any future TypeScript consumer.

---

## 6. Font loading

All three families load through `next/font/google`. Next downloads woff2 at build time and self-hosts them — no Google CDN call at runtime, no FOUC, better privacy, better Lighthouse score.

```tsx
// src/app/layout.tsx
import { Hanken_Grotesk, Spectral, JetBrains_Mono } from "next/font/google";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});
```

**Family notes:**

- **Hanken Grotesk** is a variable font on Google Fonts. Next handles weight axes automatically; the four declared weights (400/500/600/700) all come from one variable file.
- **Spectral** is static-only on Google Fonts. The `weight: ["400", "600"]` × `style: ["normal", "italic"]` cross-product loads four cuts (~40KB total). We use 400 normal, 400 italic, 600 normal per `design-spec.md` §3.3; 600 italic ships unused but is the cost of using cross-product syntax. Acceptable.
- **JetBrains Mono** is a variable font on Google Fonts. Only weight 500 is needed at launch.

The three CSS variables (`--font-hanken-grotesk`, `--font-spectral`, `--font-jetbrains-mono`) are attached to `<html>`'s `className` and pulled into Tailwind's namespace in the `@theme inline` block (see §4.2).

---

## 7. Components

### 7.1 `src/app/layout.tsx` (Server Component)

```tsx
import type { Metadata } from "next";
import { Hanken_Grotesk, Spectral, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({ variable: "--font-hanken-grotesk", subsets: ["latin"], weight: ["400","500","600","700"], display: "swap" });
const spectral = Spectral({ variable: "--font-spectral", subsets: ["latin"], weight: ["400","600"], style: ["normal","italic"], display: "swap" });
const jetBrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["500"], display: "swap" });

const themeBootstrap = `
(function(){try{var s=localStorage.getItem('gc:theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
`;

/** Default page metadata. Per-page exports override on a per-route basis. */
export const metadata: Metadata = {
  title: "Garrett Curtis",
  description: "AI-native builder. Full-stack engineer.",
};

/** Root layout. Wires fonts, the pre-hydration theme bootstrap, and the chrome (header, main, footer). */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hankenGrotesk.variable} ${spectral.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Notes:**

- `suppressHydrationWarning` on `<html>` is required because the bootstrap script mutates `data-theme` before React hydrates; without it, React logs a mismatch warning.
- Explicit `<head>` is required because the inline script must be a child of `<html>` (placing it elsewhere produces a hydration error). Next 16's metadata API does not cover pre-hydration scripts.
- `<main className="flex-1">` so the footer sticks to the bottom on short pages.
- Default `metadata.description` uses the locked positioning headline. Slice 1 refines per-page.

### 7.2 `src/components/header.tsx` (Server Component)

**Slice 0 contract:** brand + theme toggle only. Nav links are deliberately deferred to Slice 1 (when `/about` exists). Linking to four nonexistent routes from day one would make the foundation look broken.

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

/** Top chrome. Brand mark on the left, theme toggle on the right. Nav links land in Slice 1. */
export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-4">
        <a href="/" className="font-sans text-md font-semibold text-text">
          Garrett Curtis<span className="text-accent">.</span>
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
```

- Brand mark links to `/`.
- The accent period implements `design-spec.md` §2.3 item 2 (the explicit accent budget).
- Container `max-w-[1100px]` per `design-spec.md` §4.2.

### 7.3 `src/components/footer.tsx` (Server Component)

```tsx
/** Bottom chrome. Copyright left, social/contact links right. Stacks below 640px. */
export function Footer() {
  return (
    <footer className="w-full border-t border-border-soft">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Garrett Curtis</p>
        <nav className="flex gap-4" aria-label="Social and contact">
          <a href="https://github.com/garrettcurtis92" target="_blank" rel="noreferrer noopener" className="font-medium transition-colors hover:text-accent">GitHub</a>
          <a href="https://www.linkedin.com/in/garrettcurtis92" target="_blank" rel="noreferrer noopener" className="font-medium transition-colors hover:text-accent">LinkedIn</a>
          <a href="mailto:gcurtis1092@gmail.com" className="font-medium transition-colors hover:text-accent">Email</a>
        </nav>
      </div>
    </footer>
  );
}
```

- Implements `design-spec.md` §6.12.
- Stacks vertically below 640px, row above.
- External links carry `rel="noreferrer noopener"` for tab-nabbing protection.

### 7.4 `src/components/theme-toggle.tsx` (Client Component)

```tsx
"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * Pill button that toggles `data-theme` on `<html>` between "light" and "dark".
 * Reads the bootstrap-set attribute on mount, writes both the attribute and
 * `localStorage` on click, renders the OTHER mode's name as label.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch {}
    setTheme(next);
  };

  const label = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${label} mode`}
      className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-text hover:text-text"
    >
      {mounted ? label : " "}
    </button>
  );
}
```

- ` ` pre-mount label keeps button width stable, prevents layout shift on hydration.
- Mono + uppercase + tracked-wider per `design-spec.md` §6.1.
- `rounded-full` is one of the two explicit exceptions to the radius scale (`design-spec.md` §4.4).

### 7.5 `src/lib/theme.ts`

```ts
/** Shared theme storage key referenced by the layout bootstrap script and ThemeToggle. */
export const THEME_STORAGE_KEY = "gc:theme";

/** Resolved theme; bootstrap guarantees one of these two values lives on `<html data-theme>`. */
export type Theme = "light" | "dark";
```

### 7.6 Data flow

1. Server renders HTML. No `data-theme` attribute yet. CSS `:root` light defaults are in place.
2. Browser parses `<head>`; bootstrap script executes synchronously, reads `localStorage` + `matchMedia`, calls `setAttribute('data-theme', ...)`. If `dark`, `[data-theme="dark"]` overrides win.
3. First paint uses the resolved theme. No flash.
4. React hydrates. `<ThemeToggle>` mounts → `useEffect` reads attribute → sets local state → label renders.
5. User clicks toggle → attribute + `localStorage` + state update → label re-renders → body transitions colors over 280ms.

---

## 8. Placeholder home page

`src/app/page.tsx` is a Lane-B-aesthetic placeholder. Verifies tokens and fonts at a glance. Replaced wholesale by the real home page in Slice 1.

```tsx
/** Slice 0 placeholder. Verifies tokens, fonts, and chrome render correctly. Replaced in Slice 1. */
export default function Home() {
  return (
    <section className="mx-auto max-w-[1100px] px-4 pt-7 pb-7">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">// slice 0</p>
      <h1
        className="mt-2 font-sans text-display font-bold text-text"
        style={{ letterSpacing: "-0.025em", lineHeight: 1 }}
      >
        Foundation<span className="text-accent">.</span>
      </h1>
      <p
        className="mt-4 max-w-[54ch] font-serif text-md text-text"
        style={{ lineHeight: 1.65 }}
      >
        This is a placeholder. The site is being rebuilt. The real home page lands in Slice 1.
      </p>
    </section>
  );
}
```

What this verifies in one look: tokens loaded (display size, accent period, body color), three fonts loaded (mono eyebrow, sans headline, serif paragraph), spacing tokens render (`pt-7`, `pb-7` = 8rem), reading width respected (54ch), `text-display`'s `clamp()` works across viewports.

---

## 9. CI

### 9.1 Workflow file (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  pull_request:
    branches: [main, rebuild/v2]
  push:
    branches: [main, rebuild/v2]

jobs:
  gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --run
      - run: npm run docs:check
```

- Triggers on PRs and pushes targeting `main` or `rebuild/v2`.
- One job (`gates`) runs the four checks sequentially. First failure short-circuits.
- `npm test -- --run` forces Vitest out of watch mode (CI must terminate).

### 9.2 Required status check

After the first workflow run succeeds, enable a branch-protection rule. **Manual UI step Garrett performs:**

1. GitHub → repo Settings → Branches → "Add branch protection rule".
2. Rule pattern: `rebuild/v2` (later `main` too at Slice 5).
3. Tick "Require status checks to pass before merging".
4. Pick the `gates` check from the list (only appears after the workflow has run at least once).
5. Save.

PRs into `rebuild/v2` become un-mergeable until CI is green. Documented under DoD §12 as a verification step.

### 9.3 `scripts/docs-check.mjs`

Ported verbatim from `/Users/garrett.curtis/Projects/cwan-lawn-games/scripts/docs-check.mjs`. The script uses ESLint's programmatic API to apply `eslint-plugin-tsdoc` to all TS/TSX files under `src/`, plus a small AST walker that flags exported symbols without TSDoc blocks. Failure modes documented in script comments.

### 9.4 npm scripts in `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "docs:check": "node scripts/docs-check.mjs"
  }
}
```

---

## 10. Vercel deploy

Manual setup (UI clicks Garrett performs):

1. **Add New → Project** in the Vercel dashboard.
2. Import `garrettcurtis92/garrettcurtis.tech`.
3. **Project name:** `garrett-portfolio-rebuild`.
4. **Framework Preset:** Next.js (auto-detected).
5. **Root Directory:** `./`.
6. **Production Branch:** `rebuild/v2`. If the New Project form does not expose this, deploy from `main` first, then go to **Project → Settings → Git → Production Branch** and switch to `rebuild/v2`.
7. Deploy.

Vercel returns a staging URL like `garrett-portfolio-rebuild.vercel.app`. The existing project serving `garrettcurtis.tech` from `main` is untouched; cutover decisions live in the Slice 5 brainstorm.

---

## 11. Branching, commits, and PR

- Branch off `rebuild/v2`: `slice-0-foundation`.
- Conventional Commits. The slice breaks into approximately these commits, in this order:

| # | Type | Subject |
|---|---|---|
| 1 | chore | wipe src/ and remove old configs |
| 2 | chore | pin Next 16 + React 19 + Tailwind 4 stack |
| 3 | feat | design tokens + @theme block in globals.css |
| 4 | feat | theme constants and types (`src/lib/theme.ts`) |
| 5 | feat | header, footer, theme toggle components |
| 6 | feat | root layout with fonts and theme bootstrap |
| 7 | feat | slice 0 placeholder home page |
| 8 | chore | port docs:check script from lawn games |
| 9 | ci | add lint/typecheck/test/docs:check workflow |
| 10 | docs | update PORTFOLIO_SPEC for shadcn deferral and slice 0 completion |
| 11 | docs | design-spec v1.1 changelog entry for token rename |

Order matters: components (`#5`) before the layout (`#6`) that imports them, so each commit (besides the unavoidable wipe in `#1`) ends in a state that at least type-checks if not necessarily renders. Bisect remains useful.

- PR title: `Slice 0 — Foundation`.
- PR body: link to this spec, deployed staging URL, DoD checklist (from §12).
- Merge into `rebuild/v2` once CI is green.

---

## 12. Definition of done

The PR cannot merge until every box is ticked. Items belong in the PR description as a GitHub task list.

- [ ] `npm run dev` renders the placeholder page at localhost:3000
- [ ] Page shows mono eyebrow, display headline with accent period, serif body paragraph
- [ ] Header renders brand + theme toggle; footer renders copyright + 3 social links
- [ ] Theme toggle: click flips `data-theme` + writes `localStorage`; reload preserves choice
- [ ] No `data-theme` and no `localStorage`: site respects `prefers-color-scheme`
- [ ] `prefers-reduced-motion: reduce`: transitions drop to 0.01ms (verify in DevTools)
- [ ] All four `--color-accent × --color-bg` pairs verified at AA via WebAIM contrast checker (`design-spec.md` §8.2)
- [ ] `npm run build` succeeds without warnings
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes (zero errors)
- [ ] `npm test -- --run` passes (smoke test on `RootLayout`)
- [ ] `npm run docs:check` passes (every exported symbol has a TSDoc block)
- [ ] Vercel staging URL deployed and noted in PR description
- [ ] CI green on the PR
- [ ] Merged into `rebuild/v2`
- [ ] `PORTFOLIO_SPEC.md` updated per §13.1
- [ ] `design-spec.md` updated per §13.2
- [ ] GitHub branch-protection rule for `rebuild/v2` enabled per §9.2 (after first CI run completes)
- [ ] LinkedIn footer link opens `https://www.linkedin.com/in/garrettcurtis92` and lands on Garrett's profile (manual click-through)

---

## 13. Spec updates at end of Slice 0

### 13.1 `PORTFOLIO_SPEC.md` edits

1. **Current status block** (top of file):
   - "Phase:" → "Slice 0 complete. Ready to begin Slice 1 (Home + About)."
   - "Next action:" → revise to Slice 1 — invoke `superpowers:brainstorming` for Slice 1 scope.
   - "Last updated:" → date of merge.
   - Append: "Slice 0 spec: `docs/specs/2026-05-20-slice-0-foundation-design.md`. Staging URL: `<vercel URL>`."
2. **Slice 0 subsection** in Implementation plan:
   - Prepend `**Status:** Complete (PR #<N>, deployed to <staging URL>)`.
   - Remove the "shadcn/ui set up with custom tokens" bullet (it lives in Slice 3 now).
3. **Slice 3 subsection** in Implementation plan:
   - Append new bullet: "shadcn/ui set up with custom tokens (deferred from Slice 0)".

### 13.2 `design-spec.md` edits

Append a row to §12 Changelog:

| Date | Change |
|---|---|
| 2026-05-20 | v1.1 — Raw token CSS-var names normalized to unprefixed form (`--bg`, `--text`, `--accent`, …) to avoid collision with Tailwind v4 `@theme` `--color-*` utility namespace. The exposed token names (`--color-bg`, `--color-text`, …) are unchanged; consumers reference them as before. OKLCH values and design intent are unchanged. See `docs/specs/2026-05-20-slice-0-foundation-design.md` §4 for the implementation rationale. |

---

## 14. Risks and open questions

- **Next 16 RC vs stable surface:** lawn games has been running on 16.2.4 stable for weeks without issue. Risk is low.
- **Tailwind v4 + Next 16 plugin compatibility:** verified working in lawn games. No expected friction.
- **Variable-font fallbacks:** if Hanken Grotesk's variable file fails to load on an older browser, the `font-family: system-ui` chain kicks in. Display: swap minimizes any FOIT.
- **OS theme detection in privacy modes:** Safari Private Browsing may not expose `prefers-color-scheme`. The bootstrap defaults to `light` in that case — acceptable. The user can toggle from there.
- **Vercel branch-config user error:** if `rebuild/v2` isn't set as the production branch, the Slice 0 PR merging won't trigger a redeploy. Caught by the DoD step "Vercel staging URL deployed and noted in PR description" — if the URL still shows the old site, the branch isn't set right.
- **LinkedIn URL assumption:** the footer uses `https://www.linkedin.com/in/garrettcurtis92` based on Garrett's GitHub handle. If the actual LinkedIn handle differs, the URL is one-line fix during implementation. Tracked as a DoD verification step (open the deployed footer link and confirm it lands on Garrett's profile).

---

## 15. References

- `docs/PORTFOLIO_SPEC.md` — product/positioning spec
- `docs/design-spec.md` — binding visual contract
- `/Users/garrett.curtis/Projects/cwan-lawn-games` — precedent stack and patterns
- `prototypes/lane-b.html` — visual reference for the chrome-and-tokens look
