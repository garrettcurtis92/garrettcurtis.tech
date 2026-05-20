# Slice 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy `garrettcurtis.tech` codebase with a Next.js 16 + React 19 + Tailwind v4 foundation that ships brand design tokens, the chrome (header / footer / theme toggle with `data-theme` persistence), three Google fonts via `next/font/google`, a Lane-B placeholder page, CI gates (lint / typecheck / test / docs:check), and Vercel staging from `rebuild/v2`. No content pages — those are Slices 1–3.

**Architecture:** App Router Server Components for chrome and the placeholder page; one Client Component for `<ThemeToggle>`. Raw OKLCH brand tokens live as unprefixed CSS custom properties in `:root` / `[data-theme="dark"]`, mapped through Tailwind v4's `@theme inline` block to the public `--color-*` namespace consumers reference. A pre-hydration inline script reads `localStorage('gc:theme')` + `prefers-color-scheme` and sets `<html data-theme>` before paint — no FOUC, no theme library. CI is a single workflow with four sequential gates; docs:check is the lawn-games script ported without the database-schema check.

**Tech Stack:** Next.js 16.2.4, React 19.2.4, TypeScript 5 (strict), Tailwind v4 (CSS-first config), ESLint 9 flat config + `eslint-config-next` + `eslint-plugin-tsdoc`, Prettier 3, Vitest 4 + happy-dom + Testing Library, `next/font/google` (Hanken Grotesk, Spectral, JetBrains Mono), Vercel for deploy, GitHub Actions for CI.

**Authoritative inputs:**
- Slice spec: `docs/specs/2026-05-20-slice-0-foundation-design.md` (binding for this plan)
- Design spec: `docs/design-spec.md` (binding visual contract)
- Product spec: `docs/PORTFOLIO_SPEC.md`
- Precedent: `/Users/garrett.curtis/Projects/cwan-lawn-games` (working stack)

---

## File map

| Path | Action | Source / pattern |
|---|---|---|
| `src/app/contact/`, `src/app/projects/`, `src/components/*`, `src/lib/projects.ts`, `src/types/r3f.d.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` | DELETE | Slice spec §3 |
| `tailwind.config.js`, `postcss.config.js`, `next.config.mjs` | DELETE | Slice spec §3 |
| `public/WorkOrders.jpg`, `public/movie-search.png` | DELETE | Slice spec §3 |
| `package.json` | REWRITE | Slice spec §2; new deps |
| `tsconfig.json` | REWRITE | Port from lawn-games |
| `next.config.ts` | CREATE | Lawn-games style |
| `postcss.config.mjs` | CREATE | Tailwind v4 plugin |
| `eslint.config.mjs` | CREATE | Lawn-games verbatim |
| `.prettierrc` | CREATE | Defaults |
| `vitest.config.ts` | CREATE | Lawn-games minus DB alias |
| `scripts/docs-check.mjs` | CREATE | Lawn-games minus schema check |
| `.github/workflows/ci.yml` | CREATE | New (Slice spec §9.1) |
| `src/lib/theme.ts` | CREATE | Slice spec §7.5 |
| `src/components/header.tsx` | CREATE | Slice spec §7.2 |
| `src/components/footer.tsx` | CREATE | Slice spec §7.3 |
| `src/components/theme-toggle.tsx` | CREATE | Slice spec §7.4 |
| `src/components/theme-toggle.test.tsx` | CREATE | Unit test for toggle |
| `src/app/globals.css` | CREATE (was deleted) | Slice spec §4.2 |
| `src/app/layout.tsx` | CREATE (was deleted) | Slice spec §7.1 |
| `src/app/page.tsx` | CREATE (was deleted) | Slice spec §8 |
| `src/app/layout.test.tsx` | CREATE | Smoke test for layout |
| `docs/PORTFOLIO_SPEC.md` | EDIT | Slice spec §13.1 |
| `docs/design-spec.md` | EDIT | Slice spec §13.2 (v1.1 changelog) |

**Note on favicon:** `src/app/favicon.ico` is intentionally not included in Slice 0. Next will serve a default 404 for `/favicon.ico` until Slice 5 ships the real icon. This avoids shipping a placeholder binary just to be replaced later.

---

## Task 0: Branch off `rebuild/v2`

**Files:** none (git only)

- [ ] **Step 1: Confirm starting state**

```bash
git status
git log --oneline -3
git branch --show-current
```

Expected: clean working tree, current branch `rebuild/v2`, last commit `cfc1e30 docs: slice 0 foundation design spec`.

- [ ] **Step 2: Create and switch to `slice-0-foundation`**

```bash
git checkout -b slice-0-foundation
git branch --show-current
```

Expected: output `slice-0-foundation`.

---

## Task 1: Wipe legacy `src/`, root configs, and unused public assets

**Files:**
- Delete: `src/` (entire tree)
- Delete: `tailwind.config.js`
- Delete: `postcss.config.js`
- Delete: `next.config.mjs`
- Delete: `public/WorkOrders.jpg`
- Delete: `public/movie-search.png`

- [ ] **Step 1: Remove `src/` and old configs**

```bash
rm -rf src
rm tailwind.config.js postcss.config.js next.config.mjs
rm public/WorkOrders.jpg public/movie-search.png
```

- [ ] **Step 2: Verify the wipe**

```bash
ls src 2>&1 | head -3
ls tailwind.config.js postcss.config.js next.config.mjs 2>&1
ls public/WorkOrders.jpg public/movie-search.png 2>&1
ls public/
```

Expected:
- `ls src` → `ls: cannot access 'src': No such file or directory`
- Each config file → `cannot access`
- `public/` lists only: `LiftOS.png`, `Oktoberfest.png`, `RebeccaKelly.png`, `StayWise.png`, `alpha-christians.png`, `me.jpeg`, `thehouseministry.jpg`

- [ ] **Step 3: Drop legacy deps and scripts from `package.json`**

Open `package.json` and replace its entire content with this minimal interim shell (we'll fill in real deps in Task 2):

```json
{
  "name": "garrett-portfolio",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

(Version bumped 0.1.0 → 0.2.0 to mark the rebuild; semantically a major rewrite.)

- [ ] **Step 4: Remove the regeneratable lockfile**

```bash
rm -f package-lock.json
rm -rf node_modules
```

- [ ] **Step 5: Stage and commit the wipe**

```bash
git add -A
git status
```

Expected: `git status` shows deletions of `src/...`, the three config files, the two public files, and a modification of `package.json`.

```bash
git commit -m "$(cat <<'EOF'
chore: wipe src/ and remove old configs

Slice 0 starts from a blank slate. Delete the legacy site sources, the
Tailwind 3 / PostCSS / Next 14 configs, and the two unused public assets
(WorkOrders.jpg, movie-search.png). Trim package.json to a minimal interim
shell — Task 2 lands the new dependency set.

The design tokens, chrome components, fonts, and theme persistence land in
later tasks per docs/specs/2026-05-20-slice-0-foundation-design.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Verify: `git log --oneline -1` shows the new commit.

---

## Task 2: Pin Next 16 + React 19 + Tailwind 4 stack

**Files:**
- Modify: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `.prettierrc`
- Create: `vitest.config.ts`

- [ ] **Step 1: Write `package.json`**

Replace the file's contents with:

```json
{
  "name": "garrett-portfolio",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "docs:check": "node scripts/docs-check.mjs"
  },
  "dependencies": {
    "next": "^16.2.4",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitest/ui": "^4.1.5",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "eslint-plugin-tsdoc": "^0.5.2",
    "happy-dom": "^20.9.0",
    "prettier": "^3.8.3",
    "tailwindcss": "^4",
    "tinyglobby": "^0.2.16",
    "tsx": "^4.21.0",
    "typescript": "^5",
    "vitest": "^4.1.5"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`** (ported from lawn-games)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

- [ ] **Step 4: Write `postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Write `eslint.config.mjs`** (verbatim from lawn-games)

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "next-env.d.ts",
    ".claude/**",
  ]),
]);

export default eslintConfig;
```

- [ ] **Step 6: Write `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2
}
```

- [ ] **Step 7: Write `vitest.config.ts`** (lawn-games minus the DB-only aliases)

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      // Mirror tsconfig.json `paths` so tests can import `@/lib/...`.
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 8: Write `vitest.setup.ts`** (for `@testing-library/jest-dom` matchers)

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 9: Install dependencies**

```bash
npm install
```

Expected: install completes without errors. A new `package-lock.json` is created. `node_modules/next` exists and reports version `16.2.4` (or matching `^16.2.4`).

```bash
node -e "console.log(require('./node_modules/next/package.json').version)"
```

Expected: `16.2.4` (or 16.2.x).

- [ ] **Step 10: Verify typecheck passes on an empty project**

```bash
npm run typecheck
```

Expected: exits 0 with no output. `tsc` has nothing to check (no `.ts`/`.tsx` files in src yet) but the config itself parses cleanly.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs .prettierrc vitest.config.ts vitest.setup.ts
git commit -m "$(cat <<'EOF'
chore: pin Next 16 + React 19 + Tailwind 4 stack

Lock the stack: Next 16.2.4, React 19.2.4, TypeScript 5 strict, Tailwind v4,
ESLint 9 flat config + eslint-config-next + eslint-plugin-tsdoc, Prettier 3,
Vitest 4 + happy-dom + Testing Library. Configs ported from cwan-lawn-games
verbatim where it has a working pattern (tsconfig, eslint.config.mjs,
postcss.config.mjs, next.config.ts), trimmed for this repo where lawn-games
has DB-only bits we don't need (vitest.config.ts).

No source code yet — that lands in Tasks 3–7.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Design tokens + `@theme` block in `globals.css`

**Files:**
- Create: `src/app/globals.css`

- [ ] **Step 1: Create `src/app/` directory**

```bash
mkdir -p src/app
```

- [ ] **Step 2: Write `src/app/globals.css`**

```css
@import "tailwindcss";

/* ============================================================================
   Light defaults — design-spec.md §2.1, raw OKLCH values.
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
   Dark overrides — design-spec.md §2.2.
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
   See slice spec §4 for the rationale of the `--color-*` rename.
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

  /* Spacing → p-1..p-7, m-1..m-7, gap-1..gap-7 per design-spec §4.1 */
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

  /* Fonts — wired to next/font/google CSS variables in layout.tsx */
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

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
feat: design tokens and @theme block in globals.css

Implement design-spec.md §2 (color tokens for light + dark), §3.2 (type
scale), §4.1 (spacing scale), and §4.4 (radii) as CSS custom properties.
Raw OKLCH values live under unprefixed names (--bg, --text, --accent, ...)
in :root and [data-theme="dark"]; the @theme inline block maps them to
--color-* / --spacing-* / --text-* / --radius-* for Tailwind v4 utility
generation. Body opts into the sans family from next/font/google by default;
reduced-motion media query collapses transitions to 0.01ms.

See slice spec §4 for the --color-* rename rationale.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Theme constants and type (`src/lib/theme.ts`)

**Files:**
- Create: `src/lib/theme.ts`

- [ ] **Step 1: Create `src/lib/` directory**

```bash
mkdir -p src/lib
```

- [ ] **Step 2: Write `src/lib/theme.ts`**

```ts
/** Shared theme storage key referenced by the layout bootstrap script and ThemeToggle. */
export const THEME_STORAGE_KEY = "gc:theme";

/** Resolved theme; bootstrap guarantees one of these two values lives on `<html data-theme>`. */
export type Theme = "light" | "dark";
```

- [ ] **Step 3: Verify typecheck still passes**

```bash
npm run typecheck
```

Expected: exits 0 with no output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/theme.ts
git commit -m "$(cat <<'EOF'
feat: theme constants and Theme type

Single source of truth for the localStorage key and the Theme literal-union
type. Referenced by both the inline bootstrap script (string literal) and
the ThemeToggle component (TS import).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Header, Footer, ThemeToggle components

**Files:**
- Create: `src/components/header.tsx`
- Create: `src/components/footer.tsx`
- Create: `src/components/theme-toggle.tsx`
- Create: `src/components/theme-toggle.test.tsx`

- [ ] **Step 1: Create `src/components/` directory**

```bash
mkdir -p src/components
```

- [ ] **Step 2: Write `src/components/theme-toggle.test.tsx`** (TDD — test first)

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders a non-breaking space label before mount sync (stable width)", () => {
    // First render is server-equivalent: mounted=false, label=" ".
    // After useEffect runs (synchronous in happy-dom), label is set.
    // We assert the button exists and has accessible aria-label after mount.
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("defaults to light when no attribute and no stored value", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Label says the OTHER mode; default light → label is "dark".
    expect(button).toHaveTextContent("dark");
    expect(button).toHaveAccessibleName("Switch to dark mode");
  });

  it("reads existing data-theme=dark on mount", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Current is dark → label says "light".
    expect(button).toHaveTextContent("light");
    expect(button).toHaveAccessibleName("Switch to light mode");
  });

  it("toggles attribute and writes localStorage on click", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    // Start in light (no attribute).
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();

    fireEvent.click(button);

    // Now dark.
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(button).toHaveTextContent("light");

    fireEvent.click(button);

    // Back to light.
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(button).toHaveTextContent("dark");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm test -- --run src/components/theme-toggle.test.tsx
```

Expected: FAIL with `Cannot find module './theme-toggle'` (the file doesn't exist yet).

- [ ] **Step 4: Write `src/components/theme-toggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * Pill button that toggles `data-theme` on `<html>` between "light" and "dark".
 * Reads the bootstrap-set attribute on mount, writes both the attribute and
 * `localStorage` on click, renders the OTHER mode's name as label per
 * design-spec §6.1.
 *
 * The pre-mount label is a non-breaking space so the button has stable
 * width — prevents layout shift when the real label appears post-hydration.
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
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage may throw in Safari private mode or strict CSP contexts.
      // The attribute change still applies for the session.
    }
    setTheme(next);
  };

  const label: Theme = theme === "light" ? "dark" : "light";

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

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test -- --run src/components/theme-toggle.test.tsx
```

Expected: 4 tests pass, exit 0.

- [ ] **Step 6: Write `src/components/header.tsx`**

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Top chrome. Brand mark on the left, theme toggle on the right.
 * Nav links land in Slice 1 once /about exists. Slice 0 ships brand + toggle
 * only so the foundation doesn't visibly link to dead routes.
 */
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

- [ ] **Step 7: Write `src/components/footer.tsx`**

```tsx
/**
 * Bottom chrome per design-spec §6.12. Copyright on the left, social/contact
 * links on the right. Stacks vertically below the sm breakpoint (640px).
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border-soft">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Garrett Curtis</p>
        <nav className="flex gap-4" aria-label="Social and contact">
          <a
            href="https://github.com/garrettcurtis92"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/garrettcurtis92"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href="mailto:gcurtis1092@gmail.com"
            className="font-medium transition-colors hover:text-accent"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Verify lint and typecheck pass**

```bash
npm run typecheck
npm run lint
```

Expected: both exit 0 with no output (or "0 problems" from eslint).

- [ ] **Step 9: Commit**

```bash
git add src/components/
git commit -m "$(cat <<'EOF'
feat: header, footer, and theme-toggle components

Three chrome components per slice spec §7.2-§7.4 / design-spec §6.1, §6.12.
Header for Slice 0 is brand + theme toggle only; nav links land in Slice 1
once /about exists (avoids visibly linking to dead routes on day one).
ThemeToggle reads data-theme on mount, writes attribute + localStorage on
click, uses a non-breaking-space pre-mount label to keep button width stable.
Footer's LinkedIn URL is /in/garrettcurtis92 (matches GitHub handle); email
carries over from the old site. Four-test Vitest suite covers attribute
read, default state, toggle behavior, and localStorage write.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Root layout with fonts and theme bootstrap

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/layout.test.tsx`

- [ ] **Step 1: Write `src/app/layout.test.tsx`** (smoke test — TDD)

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders chrome and children without throwing", () => {
    // RootLayout returns an <html> tree, which can't render inside another
    // <html> in jsdom/happy-dom. We assert the component is callable and
    // returns a non-null element instead of rendering it into the DOM.
    const tree = RootLayout({ children: <span data-testid="child">hi</span> });
    expect(tree).not.toBeNull();
    expect(tree.type).toBe("html");
  });

  it("attaches data-theme suppression to <html>", () => {
    const tree = RootLayout({ children: null });
    expect(tree.props.suppressHydrationWarning).toBe(true);
    expect(tree.props.lang).toBe("en");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --run src/app/layout.test.tsx
```

Expected: FAIL with `Cannot find module './layout'`.

- [ ] **Step 3: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import {
  Hanken_Grotesk,
  Spectral,
  JetBrains_Mono,
} from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

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

/**
 * Pre-hydration script that resolves the theme before first paint.
 * Reads `localStorage.gc:theme` first; falls back to the user's OS
 * preference. Sets `<html data-theme="light|dark">` so the CSS overrides
 * apply immediately. Kept as a raw string so it inlines into the server
 * HTML and runs synchronously before React hydrates. The key string here
 * mirrors `THEME_STORAGE_KEY` in `@/lib/theme` — change both together.
 */
const themeBootstrap = `(function(){try{var s=localStorage.getItem('gc:theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

/** Default page metadata. Per-page exports override on a per-route basis. */
export const metadata: Metadata = {
  title: "Garrett Curtis",
  description: "AI-native builder. Full-stack engineer.",
};

/**
 * Root layout. Server Component. Loads the three font families as CSS
 * variables, injects the pre-hydration theme bootstrap, and renders the
 * chrome (header, main, footer).
 *
 * `suppressHydrationWarning` is required on `<html>` because the bootstrap
 * mutates `data-theme` before React hydrates. The explicit `<head>` is
 * required because Next 16's metadata API doesn't cover pre-hydration
 * scripts (and placing the script outside `<html>` produces a hydration
 * error).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hankenGrotesk.variable} ${spectral.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --run src/app/layout.test.tsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/layout.test.tsx
git commit -m "$(cat <<'EOF'
feat: root layout with fonts and theme bootstrap

Server-side root layout per slice spec §7.1. Loads Hanken Grotesk (sans),
Spectral (serif), and JetBrains Mono via next/font/google with display:swap
and exposes each as a CSS variable consumed by the @theme inline block in
globals.css. Inlines the pre-hydration theme bootstrap into <head> so
<html data-theme> is set before first paint — no FOUC. Renders Header,
<main>, Footer. min-h-screen + flex-col on body sticks the footer to the
bottom on short pages.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Lane-B placeholder home page

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Write `src/app/page.tsx`**

```tsx
/**
 * Slice 0 placeholder home page. Verifies the design tokens, fonts, and
 * chrome render correctly. Replaced by the real home page in Slice 1.
 *
 * Each typographic role appears once: mono eyebrow (accent color), sans
 * display headline (with accent period), serif body paragraph. If any of
 * these don't render with the expected family, the next/font/google wiring
 * or the @theme block is wrong.
 */
export default function Home() {
  return (
    <section className="mx-auto max-w-[1100px] px-4 pt-7 pb-7">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">
        // slice 0
      </p>
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
        This is a placeholder. The site is being rebuilt. The real home page
        lands in Slice 1.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Run `npm run dev` and visually verify**

Open a separate terminal:

```bash
npm run dev
```

In a browser open `http://localhost:3000`. Verify:

- Mono `// slice 0` eyebrow renders in JetBrains Mono, accent color (warm ember in light mode, lifted ember in dark)
- `Foundation.` headline renders in Hanken Grotesk 700 at display size
- The period after `Foundation` is the accent color
- Body paragraph renders in Spectral 400, dark text on warm cream background (light mode) or light text on dark warm background (dark mode)
- Header shows `Garrett Curtis.` brand (with accent period) and a small uppercase "dark" or "light" pill button on the right
- Footer shows copyright on the left and GitHub / LinkedIn / Email links on the right, separated by a top border
- Clicking the theme toggle pill flips background, text, and accent shade
- Reloading the page preserves the chosen mode (stored in `localStorage.gc:theme`)
- In an incognito window with no stored value, the page respects the OS theme preference

Stop the dev server (Ctrl+C in the dev terminal).

- [ ] **Step 3: Verify build succeeds**

```bash
npm run build
```

Expected: build completes with no warnings. Output ends with the route summary listing `/` and the layout.

- [ ] **Step 4: Verify gates pass**

```bash
npm run typecheck
npm run lint
npm test -- --run
```

Expected: all three pass with exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "$(cat <<'EOF'
feat: slice 0 placeholder home page

Lane-B aesthetic placeholder per slice spec §8. One mono eyebrow, one sans
display headline with accent period, one Spectral body paragraph. Verifies
the design tokens, fonts, and chrome render correctly. Replaced wholesale
by the real home page in Slice 1.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Port `docs:check` script from lawn games

**Files:**
- Create: `scripts/docs-check.mjs`

- [ ] **Step 1: Create `scripts/` directory**

```bash
mkdir -p scripts
```

- [ ] **Step 2: Write `scripts/docs-check.mjs`**

This is the lawn-games script with the `checkSchemaTableComments()` function and its call removed (no Drizzle schema in this repo). Keep `checkTsdocSyntax()` and `checkTsdocPresence()`.

```js
#!/usr/bin/env node
// docs:check — documentation gate. Two checks:
//   1. TSDoc syntax (eslint-plugin-tsdoc) on every .ts/.tsx file under src/
//   2. TSDoc presence on every exported symbol under src/
// Ported from cwan-lawn-games minus the Drizzle schema-comment check.

import { ESLint } from "eslint";
import nextTs from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";
import tsdoc from "eslint-plugin-tsdoc";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { globSync } from "tinyglobby";

const results = [];
let overallOk = true;

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  if (!ok) overallOk = false;
}

async function checkTsdocSyntax() {
  // Pull only the parser/`languageOptions` block out of `eslint-config-next`
  // (the same config `npm run lint` uses). Without a TS parser the default
  // espree parser fails on every TS-only token before the tsdoc rule ever
  // runs. We skip the rest of nextTs to avoid noisy non-tsdoc rule output.
  const tsBase = nextTs.find((c) => c.languageOptions?.parser);
  if (!tsBase) {
    throw new Error(
      "docs:check could not locate a TS parser in eslint-config-next/typescript",
    );
  }
  // Register the plugins `npm run lint` knows about — without turning their
  // rules on — so inline `eslint-disable-next-line` directives that
  // reference real-but-not-enabled rules don't get reported as
  // "Definition for rule X was not found." The tsdoc check stays the only
  // active rule.
  const knownPlugins = {};
  for (const c of nextVitals) {
    if (c.plugins) Object.assign(knownPlugins, c.plugins);
  }
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      tsBase,
      {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        plugins: { ...knownPlugins, tsdoc },
        rules: { "tsdoc/syntax": "error" },
        linterOptions: { reportUnusedDisableDirectives: "off" },
      },
    ],
  });
  const runs = await eslint.lintFiles(["src/**/*.ts", "src/**/*.tsx"]);
  const violations = runs.flatMap((r) =>
    r.messages.map(
      (m) => `${r.filePath}:${m.line} ${m.ruleId ?? ""} ${m.message}`,
    ),
  );
  if (violations.length === 0) {
    record("TSDoc syntax", true);
  } else {
    record("TSDoc syntax", false, violations.join("\n    "));
  }
}

function checkTsdocPresence() {
  const files = globSync(["src/**/*.ts", "src/**/*.tsx"], {
    ignore: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "src/**/*.d.ts",
    ],
  });

  const missing = [];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const sf = ts.createSourceFile(
      file,
      src,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    ts.forEachChild(sf, (node) => visit(node, sf, file, missing));
  }

  if (missing.length === 0) {
    record("TSDoc presence on exports", true);
  } else {
    record("TSDoc presence on exports", false, missing.join("\n    "));
  }
}

function visit(node, sf, file, missing) {
  if (!isExportedDeclaration(node)) return;
  const name = getDeclarationName(node) ?? "(anonymous)";
  if (!hasTsdocBlock(node, sf)) {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    missing.push(`${file}:${line + 1} exported \`${name}\` has no TSDoc block`);
  }
}

function isExportedDeclaration(node) {
  const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  const hasExportModifier = mods?.some(
    (m) => m.kind === ts.SyntaxKind.ExportKeyword,
  );
  if (!hasExportModifier) return false;
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node) ||
    ts.isVariableStatement(node)
  );
}

function getDeclarationName(node) {
  if (ts.isVariableStatement(node)) {
    return node.declarationList.declarations
      .map((d) => (ts.isIdentifier(d.name) ? d.name.text : ""))
      .filter(Boolean)
      .join(",");
  }
  if (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node)
  ) {
    return node.name?.text;
  }
  return undefined;
}

function hasTsdocBlock(node, sf) {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? [];
  return ranges.some((r) => {
    if (r.kind !== ts.SyntaxKind.MultiLineCommentTrivia) return false;
    return sf.text.slice(r.pos, r.pos + 3) === "/**";
  });
}

function printSummary() {
  console.log("\n=== docs:check ===");
  for (const r of results) {
    const tag = r.ok ? "PASS" : "FAIL";
    console.log(`${tag}  ${r.name}`);
    if (!r.ok && r.detail) console.log(`    ${r.detail}`);
  }
  console.log("");
}

await checkTsdocSyntax();
checkTsdocPresence();
printSummary();
process.exit(overallOk ? 0 : 1);
```

- [ ] **Step 3: Run docs:check locally**

```bash
npm run docs:check
```

Expected output:

```
=== docs:check ===
PASS  TSDoc syntax
PASS  TSDoc presence on exports

```

If any FAIL appears, the offending file and symbol are listed. Add a TSDoc block to that export and re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/docs-check.mjs
git commit -m "$(cat <<'EOF'
chore: port docs:check from lawn games

Two-check documentation gate: TSDoc syntax (eslint-plugin-tsdoc) and TSDoc
presence on every exported symbol. Ported from cwan-lawn-games verbatim
minus the Drizzle schema-comment check (no DB in this repo). Wired through
the npm script in package.json; CI runs this as the fourth gate.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/` directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Write `.github/workflows/ci.yml`**

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
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --run
      - run: npm run docs:check
```

- [ ] **Step 3: Verify YAML parses**

```bash
node -e "const yaml=require('js-yaml'); try { yaml.load(require('fs').readFileSync('.github/workflows/ci.yml','utf8')); console.log('ok'); } catch(e) { console.error(e.message); process.exit(1); }" 2>/dev/null || echo "js-yaml not installed — relying on GitHub to validate"
```

(If `js-yaml` isn't installed, skip — GitHub will validate when the file lands.)

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "$(cat <<'EOF'
ci: add lint/typecheck/test/docs:check workflow

Single GitHub Actions workflow runs the four gates on PRs and pushes
targeting main or rebuild/v2. Sequential steps; first failure short-circuits.
npm test -- --run forces Vitest out of watch mode for CI. Branch protection
on rebuild/v2 will be enabled after the first run succeeds (see slice spec §9.2).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Update `PORTFOLIO_SPEC.md`

**Files:**
- Modify: `docs/PORTFOLIO_SPEC.md`

The slice spec §13.1 dictates three edits. Open the file in your editor and apply each.

- [ ] **Step 1: Update the Current status block at the top of the file**

Find the block beginning with `## Current status` near line 7. Replace its body with:

```markdown
**Phase:** Slice 0 complete. Ready to begin Slice 1 (Home + About).
**Branch strategy:** Slice 0 merged to `rebuild/v2`. Continue slicing PRs into `rebuild/v2`; `main` keeps the legacy site until Slice 5 cutover.
**Next action:** In Claude Code, invoke `superpowers:brainstorming` for Slice 1 — Home + About.
**Last updated:** 2026-05-20 (Slice 0 completion).

Slice 0 spec: `docs/specs/2026-05-20-slice-0-foundation-design.md`.
Staging URL: `https://garrett-portfolio-rebuild.vercel.app` (deploys from `rebuild/v2`).
```

- [ ] **Step 2: Mark Slice 0 done and remove the shadcn bullet**

Find the `### Slice 0 — Foundation` heading. Immediately after the heading and the *Scaffolding, design tokens, layout primitives, deploy pipeline.* italic subtitle, prepend a new line:

```markdown
**Status:** Complete (merged via Slice 0 PR; deployed to https://garrett-portfolio-rebuild.vercel.app).
```

Then find the bullet `- shadcn/ui set up with custom tokens (tokens pulled from the design spec produced via `/superpowers` + `impeccable.style`)` inside that same Slice 0 subsection and **delete it entirely**. shadcn moves to Slice 3.

- [ ] **Step 3: Add the shadcn bullet to Slice 3**

Find the `### Slice 3 — Contact` heading. In the bullet list under that section, append a new bullet at the bottom:

```markdown
- shadcn/ui set up with custom tokens (deferred from Slice 0)
```

- [ ] **Step 4: Verify the diff**

```bash
git diff docs/PORTFOLIO_SPEC.md
```

Inspect the diff — should show exactly three logical edits: status block rewrite, Slice 0 status + shadcn removal, Slice 3 bullet addition. Nothing else changed.

- [ ] **Step 5: Commit**

```bash
git add docs/PORTFOLIO_SPEC.md
git commit -m "$(cat <<'EOF'
docs: update PORTFOLIO_SPEC for shadcn deferral and slice 0 completion

Slice 0 is done — mark it complete in the implementation-plan section,
remove the shadcn bullet from Slice 0 (it didn't earn its place at the
foundation), and add it to Slice 3 where the form components actually need
it. Advance the Current status block to point at Slice 1. Recorded the
staging URL.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Update `design-spec.md` v1.1 changelog

**Files:**
- Modify: `docs/design-spec.md`

- [ ] **Step 1: Update §1 Status block**

At the top of the file, find:

```markdown
**Status:** v1, ratified 2026-05-20.
```

Replace with:

```markdown
**Status:** v1.1, ratified 2026-05-20. Slice 0 implementation rename applied (see §12 Changelog).
```

- [ ] **Step 2: Append the v1.1 row to §12 Changelog**

Find the Changelog table at the bottom of the file. Append a new row:

```markdown
| 2026-05-20 | v1.1 — Raw token CSS-var names normalized to unprefixed form (`--bg`, `--text`, `--accent`, …) to avoid collision with Tailwind v4 `@theme` `--color-*` utility namespace. The exposed token names (`--color-bg`, `--color-text`, …) consumers reference are unchanged; the rename is purely internal. OKLCH values and design intent are unchanged. See `docs/specs/2026-05-20-slice-0-foundation-design.md` §4 for the implementation rationale. |
```

- [ ] **Step 3: Verify the diff**

```bash
git diff docs/design-spec.md
```

Expected: two changes — status line bumped from v1 to v1.1, and one new row appended to the Changelog table.

- [ ] **Step 4: Commit**

```bash
git add docs/design-spec.md
git commit -m "$(cat <<'EOF'
docs: design-spec v1.1 changelog entry for token rename

Document the internal token name change applied during Slice 0
implementation: raw CSS custom properties dropped their --color- prefix
(--color-bg → --bg, etc.) to avoid collision with Tailwind v4's @theme
--color-* utility namespace. Exposed token names that consumers reference
(--color-bg, --color-text, ...) are unchanged. OKLCH values and design
intent are unchanged.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Final local verification sweep

**Files:** none (verification only)

- [ ] **Step 1: Run all four gates in order**

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run docs:check
```

Expected: each exits 0. The test command reports passing test counts.

- [ ] **Step 2: Verify build still succeeds**

```bash
npm run build
```

Expected: build completes, route summary lists `/`.

- [ ] **Step 3: Verify the git log**

```bash
git log --oneline rebuild/v2..HEAD
```

Expected: 11 commits, newest at top, matching this list (commit hashes will differ):

```
docs: design-spec v1.1 changelog entry for token rename
docs: update PORTFOLIO_SPEC for shadcn deferral and slice 0 completion
ci: add lint/typecheck/test/docs:check workflow
chore: port docs:check from lawn games
feat: slice 0 placeholder home page
feat: root layout with fonts and theme bootstrap
feat: header, footer, and theme-toggle components
feat: theme constants and Theme type
feat: design tokens and @theme block in globals.css
chore: pin Next 16 + React 19 + Tailwind 4 stack
chore: wipe src/ and remove old configs
```

- [ ] **Step 4: Verify the working tree is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

---

## Task 13: Push branch and open PR

**Files:** none (git + GitHub UI)

- [ ] **Step 1: Push the branch**

```bash
git push -u origin slice-0-foundation
```

Expected: push succeeds; GitHub responds with a "Create a pull request" suggestion URL.

- [ ] **Step 2: Open the PR via `gh` CLI**

```bash
gh pr create --base rebuild/v2 --head slice-0-foundation --title "Slice 0 — Foundation" --body "$(cat <<'EOF'
## Summary

Replaces the legacy `garrettcurtis.tech` codebase with a Next.js 16 + React 19 + Tailwind v4 foundation. Ships brand design tokens, three Google fonts, the chrome (header, footer, theme toggle with persisted `data-theme`), a Lane-B placeholder page, and CI gates. No content pages — those land in Slices 1–3.

Spec: [`docs/specs/2026-05-20-slice-0-foundation-design.md`](../blob/rebuild/v2/docs/specs/2026-05-20-slice-0-foundation-design.md)

Staging URL: https://garrett-portfolio-rebuild.vercel.app (deploys from `rebuild/v2` after merge)

## Definition of Done

- [ ] `npm run dev` renders the placeholder page at localhost:3000
- [ ] Page shows mono eyebrow, display headline with accent period, serif body paragraph
- [ ] Header renders brand + theme toggle; footer renders copyright + 3 social links
- [ ] Theme toggle: click flips `data-theme` + writes `localStorage`; reload preserves choice
- [ ] No `data-theme` and no `localStorage`: site respects `prefers-color-scheme`
- [ ] `prefers-reduced-motion: reduce`: transitions drop to 0.01ms (verify in DevTools)
- [ ] All four `--color-accent × --color-bg` pairs verified at AA via WebAIM contrast checker
- [ ] `npm run build` succeeds without warnings
- [ ] `npm run lint` / `typecheck` / `test` / `docs:check` all pass locally
- [ ] Vercel staging URL deployed and noted
- [ ] CI green on the PR
- [ ] Merged into `rebuild/v2`
- [ ] `PORTFOLIO_SPEC.md` updated per slice spec §13.1
- [ ] `design-spec.md` v1.1 changelog entry added
- [ ] GitHub branch-protection rule for `rebuild/v2` enabled (after first CI run completes)
- [ ] LinkedIn footer link opens `https://www.linkedin.com/in/garrettcurtis92` and lands on Garrett's profile

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Capture the PR URL printed by `gh`.

- [ ] **Step 3: Wait for CI to run**

The GitHub Actions workflow triggers on PR creation. Watch:

```bash
gh pr checks --watch
```

Expected: the `gates` job goes from queued → in_progress → success. Takes ~60–120 seconds.

If a step fails: read the failure, fix locally, push, the workflow re-runs.

- [ ] **Step 4: Visit the Vercel preview**

Vercel auto-creates a preview deployment for the PR branch. The PR page on GitHub will show a "Vercel" check with a "Preview" link. Open it. Verify the placeholder page loads, the theme toggle works, fonts load correctly.

---

## Task 14: Manual UI — enable branch protection (Garrett does this in the browser)

**Files:** none (GitHub Settings)

Required because protection rules can't be set via the standard `gh pr create` flow.

- [ ] **Step 1: Open Branch protection rules**

In the GitHub repo for `garrettcurtis.tech`, navigate to **Settings → Branches → Branch protection rules → Add classic branch protection rule** (or "Add rule").

- [ ] **Step 2: Configure the rule**

- Branch name pattern: `rebuild/v2`
- Tick **Require status checks to pass before merging**
- In the status checks list, search for and tick `gates` (the job name from `ci.yml` — only appears after at least one workflow run has completed)
- Save / Create

- [ ] **Step 3: Verify the rule applies**

Back on the PR page, the merge button should now indicate it requires the `gates` check. If the check is already green, merge remains available.

---

## Task 15: Manual UI — WCAG contrast verification (Garrett does this)

**Files:** none (browser + WebAIM contrast checker)

Per design-spec §8.2, four pairs must verify at AA:

- [ ] **Light mode `--color-text` (`#2A2622`) on `--color-bg` (`#F8F4EE`)**
- [ ] **Light mode `--color-muted` (`#6F665D`) on `--color-bg`**
- [ ] **Light mode `--color-accent` (`#B14F2A`) on `--color-bg`**
- [ ] **Dark mode `--color-text` (`#F1EDE6`) on `--color-bg` (`#24201B`)**
- [ ] **Dark mode `--color-muted` (`#B5ACA0`) on `--color-bg`**
- [ ] **Dark mode `--color-accent` (`#D26339`) on `--color-bg`**

Use https://webaim.org/resources/contrastchecker/ . Enter the foreground and background hex values (approximations from design-spec §2 tables). Verify each pair shows "Normal Text: AA Pass" (ratio ≥ 4.5:1).

If any pair fails, lift the L value of the accent in that mode per design-spec §8.2 instruction, update both `globals.css` and `design-spec.md` §2 tables, and re-test. (Unlikely — design spec was already calibrated — but the verification is required by DoD.)

---

## Task 16: Merge and mark Slice 0 done

**Files:** none (GitHub UI + local cleanup)

- [ ] **Step 1: Confirm DoD complete**

In the PR body, every DoD checkbox should be ticked. CI is green. Branch protection is on. Contrast pairs verified.

- [ ] **Step 2: Merge the PR**

In the GitHub PR page, click **Merge pull request**. Use either "Create a merge commit" (preserves the 11-commit history visibly in `rebuild/v2`) or "Squash and merge" (one fat commit on `rebuild/v2`). Recommendation: **merge commit** — the 11-commit slice history is valuable as a bisect surface later.

- [ ] **Step 3: Verify the production deploy on Vercel**

After merge, Vercel auto-deploys `rebuild/v2` to `garrett-portfolio-rebuild.vercel.app`. The Production Deployment page should now show the new Lane-B placeholder, not the old portfolio.

- [ ] **Step 4: Sync local `rebuild/v2`**

```bash
git checkout rebuild/v2
git pull
git log --oneline -3
```

Expected: most recent commit is the merge of `slice-0-foundation`.

- [ ] **Step 5: Delete the slice branch (local + remote)**

```bash
git branch -d slice-0-foundation
git push origin --delete slice-0-foundation
```

- [ ] **Step 6: Record outcome**

Slice 0 is done. Next action: Garrett invokes `superpowers:brainstorming` for Slice 1 — Home + About.

---

## Risks and stop conditions

The plan assumes the slice spec is the design contract. If during execution you hit a UI/UX decision that isn't covered in:

1. The slice spec (`docs/specs/2026-05-20-slice-0-foundation-design.md`)
2. The design spec (`docs/design-spec.md`)
3. This plan

**stop and surface the gap.** Do not improvise. Per the slice spec §0, gaps get resolved by updating the design spec, not by writing code that diverges.

Known dependencies on Garrett (non-blocking to most tasks; required for completion):

- Vercel production branch is already on `rebuild/v2` (verified)
- GitHub branch protection rule for `rebuild/v2` requires Garrett's manual UI click after the first CI run (Task 14)
- WCAG contrast verification requires Garrett's manual browser-based check (Task 15)
- Merge requires Garrett's click on the merge button (Task 16)

---

## Self-review notes

This plan covers every line item in the slice spec's §1 In-scope list and §12 DoD list. Each of the 11 commits proposed in slice spec §11 maps 1:1 to a task here (Tasks 1–11), plus Tasks 0 (branch creation), 12 (verification sweep), 13 (push + PR), and 14–16 (manual finalization). Test code is provided in Tasks 5 and 6 — no `"add tests for this"` placeholders. Every config file is shown in full. Token rename rationale is captured both in the spec (§4) and reinforced in commit messages.
