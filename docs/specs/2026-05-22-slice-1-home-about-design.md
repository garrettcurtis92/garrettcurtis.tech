# Slice 1 — Home + About (design)

> The build spec for Slice 1 of the `garrettcurtis.tech` rebuild. Extends `docs/PORTFOLIO_SPEC.md` (product spec), `docs/design-spec.md` (visual contract, v1.1), and `docs/specs/2026-05-20-slice-0-foundation-design.md` (foundation patterns). If a decision here contradicts the design spec or product spec, those win and this file is updated.

**Status:** Approved 2026-05-22 (brainstorm session). Ready to hand off to `superpowers:writing-plans`.
**Slice scope:** Home, About, 404. Header gains the `/about` nav link. One new shared component (`EyebrowLabel`). Playwright introduced as the e2e ("end-to-end," meaning real-browser) test runner with one happy-path test.
**Target branch:** `slice-1-home-about` → PR into `rebuild/v2`.
**Staging URL on merge:** `garrett-portfolio-rebuild.vercel.app` (same Vercel project as Slice 0; redeploys automatically when `rebuild/v2` advances).

---

## 1. Scope

### In scope

- Replace the Slice 0 placeholder home (`src/app/page.tsx`) with the real Home page: hero (verbatim headline, verbatim subhead, hero meta block), an "about teaser" paragraph linking to `/about`, and a single-line mailto contact CTA.
- New About page (`src/app/about/page.tsx`): photo at top (4:5 crop, ~320px wide on desktop), `/about` mono eyebrow, `"About."` H1, both verbatim About paragraphs from `PORTFOLIO_SPEC.md`, then a `"How I work."` H2 with five short principle paragraphs (draft in this spec; Garrett edits before implementation).
- New 404 page (`src/app/not-found.tsx`, Next 16's built-in convention for "this URL doesn't resolve" pages): mono eyebrow `// 404`, `"Not here."` H1 with accent period, one-line serif body, two wayfinding links to Home and About.
- Header gains a single nav link — `About` — between the brand mark and the theme toggle. `/work` and `/contact` links remain deferred until their respective slices, matching the Slice 0 "never link to dead routes" discipline.
- One new shared component: `<EyebrowLabel>` — the mono uppercase tracked accent text used on all three pages (`// now`, `/about`, `// 404`). Pages own all other JSX inline.
- Per-page metadata exports (`title`, `description`) on Home, About, and 404. No `@vercel/og` image generation — that's Slice 5.
- Playwright (the browser-automation testing tool) installed as a dev dependency, configured at the repo root, with one happy-path e2e test that loads `/`, asserts the headline renders, clicks the About link, asserts navigation and the photo render on `/about`, toggles the theme, reloads, and asserts the theme persisted.
- A new GitHub Actions job (the auto-running test pipeline on every push) named `e2e` that runs after the existing `gates` job passes. Failure attribution stays clean: if e2e fails, you know it's e2e, not lint/type/unit-test.
- End-of-slice edits to `PORTFOLIO_SPEC.md`: advance the Current Status block to "Slice 1 complete, ready to begin Slice 2," and prepend a status line to the Slice 1 subsection in the implementation plan.

### Out of scope

- Featured-work card section on Home — explicitly cut from Slice 1. Lands in Slice 2 alongside the work index.
- `/work`, `/contact`, `/writing` routes — Slice 2, 3, 4 respectively.
- Contact form — Slice 3.
- Open Graph image generation, `sitemap.xml`, `robots.txt`, Vercel Analytics — Slice 5.
- shadcn/ui — still deferred to Slice 3 (forms slice).
- Multi-browser Playwright matrix (firefox, webkit) — chromium only at launch, sufficient for portfolio.
- Visual horizontal-rule (`<hr>`) divider patterns — design-spec defines no `<hr>` pattern; section separation uses spacing (`--space-5`, `--space-6`) and headings only. Introducing an `<hr>` pattern would require a design-spec amendment first.
- DNS cutover to `garrettcurtis.tech` — Slice 5.

---

## 2. Stack additions

Only one new package. Everything else is already pinned from Slice 0.

| Package | Version | Purpose |
|---|---|---|
| `@playwright/test` | install via `npm install --save-dev @playwright/test`; whatever version that resolves to becomes the slice's pinned version | E2E (real-browser) test runner. Single dependency — Playwright bundles its own assertion library, test runner, and browser bindings. |

Plus two new npm scripts in `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install --with-deps chromium"
  }
}
```

`test:e2e:install` runs once locally + in CI to download chromium and its system dependencies. `test:e2e` runs the actual tests. Both run against `npm start` (production-built Next server) — not `npm run dev` — because the dev server has hot-reload overhead Playwright doesn't need and that occasionally causes flake.

---

## 3. Pages and routes

| Route | File | Type | Status before Slice 1 | Status after Slice 1 |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Server Component | Slice 0 placeholder ("Foundation.") | Real Home page |
| `/about` | `src/app/about/page.tsx` | Server Component | Does not exist | New |
| 404 (any unmatched) | `src/app/not-found.tsx` | Server Component | Default Next 16 fallback | Custom branded page |

All three are Server Components — no `"use client"`. The only interactive thing on these pages is the header's `<ThemeToggle>` (already a client component from Slice 0), and `<Link>` (already client-managed by Next).

### 3.1 Home (`/`) — composition

In top-to-bottom order:

1. **Hero section.**
   - Two-column at and above 720px: `[ eyebrow + H1 + subhead ]` on the left, `[ hero meta block ]` on the right.
   - Single-column below 720px: eyebrow → H1 → subhead → hero meta (left-aligned, not right-aligned).
   - Implementation: `grid grid-cols-1 min-[720px]:grid-cols-[1fr_auto] gap-4 min-[720px]:gap-6`. The hero meta block gets `min-[720px]:text-right`. The 720px breakpoint is design-spec §6.2's specified hero collapse point; using Tailwind v4's arbitrary breakpoint syntax `min-[720px]:` matches the spec exactly (Tailwind's default `md:` is 768px, which would leave a 48px window where the layout doesn't match spec).
   - Spacing: `mt-7` (8rem top) and `mb-5` (3.5rem bottom) to give the hero generous breathing room per design-spec §4.1 ("very generous around the hero").
2. **About teaser section.**
   - Single-column, max-width `54ch`.
   - Renders the second paragraph of the locked About copy from `PORTFOLIO_SPEC.md` as a serif paragraph (`font-serif text-md`), followed by a `.case-cta`-style link to `/about` ("Read the full about →") on its own line below.
   - Separated from hero by `mt-5` (3.5rem). Separated from contact CTA below by `mt-5` again.
3. **Contact CTA section.**
   - Single-column, single short paragraph + mailto link.
   - Bottom margin: `mb-7` (8rem) so the footer has room.

### 3.2 About (`/about`) — composition

In top-to-bottom order:

1. **Photo.** 4:5 portrait crop, ~320px wide on desktop, fluid (shrinks with viewport) on narrow screens, `--radius` (12px) border-radius, left-aligned (not centered). Rendered via `next/image` with `priority` — Next's hint that this image is above-the-fold and should preload — improves Lighthouse's LCP (the "Largest Contentful Paint" metric, which measures when the biggest visible thing finishes loading).
2. **Eyebrow:** `<EyebrowLabel>` rendering `/about` (mono, uppercase, tracked, accent color).
3. **H1:** `"About."` — sans 700, `text-2xl` (42.7px from the design-spec scale, not `text-display` because display is hero-only per §3.2), letter-spacing `-0.015em`, accent period.
4. **Body — two paragraphs.** Verbatim from `PORTFOLIO_SPEC.md` "About copy" block. Serif 400, `text-md`, line-height 1.65, max-width `65ch`.
5. **H2:** `"How I work."` — sans 600, `text-lg` (24px), letter-spacing `-0.015em`, accent period. Top margin `mt-6` (5.5rem) so it visually separates from the body without needing an `<hr>`.
6. **Principle paragraphs.** Five short paragraphs, serif 400, `text-md`. Each principle has a strong-tagged lead phrase (sans-weighted within the serif paragraph via `<strong>`) followed by the explanation. Spacing `gap-3` (1.25rem) between paragraphs.

### 3.3 404 (`not-found.tsx`) — composition

In top-to-bottom order, all single-column, left-aligned:

1. **Eyebrow:** `<EyebrowLabel>` rendering `// 404`.
2. **H1:** `"Not here."` — sans 700, `text-2xl`, accent period.
3. **Body:** `"This URL doesn't resolve. The site is small. Start at home, or read about."` — serif 400, `text-md`, line-height 1.65.
4. **Wayfinding links:** Two plain inline underlined links ("Home" pointing to `/`, "About" pointing to `/about`), on their own lines with `gap-2` between them.

Both link styles use the inline-prose link treatment from design-spec §6.6: `text-decoration: underline; text-underline-offset: 3px; hover → accent color`. Not `.case-cta` style, because the 404 isn't trying to feel like a call-to-action; it's wayfinding.

---

## 4. Component additions

### 4.1 `src/components/eyebrow-label.tsx`

The only new shared component in Slice 1. Used on three pages with three different bits of text.

```tsx
/**
 * Small mono-accent label used as a section eyebrow. Renders the children
 * in JetBrains Mono, uppercase, with positive letter-tracking and accent
 * color. Used on the home page (`// now`), about page (`/about`), and 404
 * page (`// 404`). One of the seven explicit accent uses in design-spec §2.3.
 *
 * @param children - The label text. Caller decides whether to include the
 *   leading `//` glyph or a `/` prefix — the component does not add markup.
 */
export function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-wider text-accent">
      {children}
    </p>
  );
}
```

Notes:
- No additional props. The component is intentionally narrow. If a future page needs a non-accent variant or a different size, the spec gets updated first.
- The `tracking-wider` class is Tailwind's `letter-spacing: 0.05em`, close to the design-spec §3.3 mono tags range of `+0.04em` to `+0.08em`.
- The `<p>` semantic (vs. `<span>` or `<div>`) reads as a labeled paragraph, which is what an eyebrow is structurally.
- **Accent color note.** The design-spec §2.3 accent budget lists "the `// now` status line in the hero meta block" (item 6) and "case-study eyebrow links" (item 3) as accent uses, but does not explicitly list page-level eyebrows like `/about` or `// 404`. The Slice 0 placeholder home shipped an accent-colored `// slice 0` eyebrow, establishing a pattern. Slice 1 reads §2.3 as a non-exhaustive list of accent use cases — small mono URL-like labels qualify. If a stricter reading is preferred, the spec would need to either drop the accent on these eyebrows or formally extend §2.3 in a design-spec v1.2 amendment. Surfaced in §12 as an open question.
- TSDoc block present per the project's `docs:check` gate (CI fails if any exported symbol is missing its doc comment).

### 4.2 `src/components/header.tsx` — modification

The Slice 0 header renders `<brand> | <ThemeToggle>`. Slice 1 inserts a single nav link between them:

```tsx
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Top chrome. Brand left, single nav link (About) in the middle, theme
 * toggle right. Work and Contact nav links land in Slices 2 and 3
 * respectively — the foundation discipline ("never link to dead routes")
 * still applies.
 */
export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-4">
        <Link href="/" className="font-sans text-md font-semibold text-text">
          Garrett Curtis<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-4" aria-label="Primary">
          <Link
            href="/about"
            className="font-sans text-sm font-medium text-muted transition-colors hover:text-text"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

- The `<nav>` wraps both the About link and the theme toggle so the right-side cluster is semantically grouped under a primary-nav landmark. The theme toggle is still a `<button>` inside `<nav>`, which is valid HTML.
- Link styling follows design-spec §6.1: sans 500, `text-sm`, color `text-muted`, hover `text-text`. No underline on chrome links.
- The TSDoc block is updated to reflect the new nav link.

---

## 5. Copy (verbatim, locked)

All copy below ships verbatim. Implementation does not re-word, restructure, or improvise. Drift between this section and the rendered page is a bug, caught by Vitest content assertions and the user-review-spec gate.

### 5.1 Home page copy

```
[Hero — eyebrow + headline + subhead, left of grid]

EYEBROW (mono accent):    // home

H1 (sans 700, display):   AI-native builder. Full-stack engineer.
                          (Both periods are accent-colored.)

SUBHEAD (serif 400, md):  I ship software. I work with AI like it's a
                          teammate, not a tool. The result is production
                          systems built faster, with more discipline, and
                          better judgment about *when to use AI and when
                          not to*.
                          (The italicized phrase "when to use AI and when
                          not to" is rendered as <em>; the surrounding
                          text is regular weight. Note: the locked
                          PORTFOLIO_SPEC copy uses an em-dash before "the
                          result"; Slice 1 replaces it with a period per
                          design-spec §9.2 ban on em-dashes in copy.)
```

```
[Hero meta — right of grid on desktop, below subhead on mobile]

(mono, text-sm)           // now              ← accent color
                          Clearwater Analytics
                          Boise, ID
```

```
[About teaser section]

(serif 400, text-md)      I'm not a developer who picked up AI. I'm an
                          AI-native builder, grounded in enough
                          infrastructure experience to take production
                          seriously.

(.case-cta link to /about)  Read the full about →
```

```
[Contact CTA section]

(serif 400, text-md)      Best place to reach me is email:
                          gcurtis1092@gmail.com

                          ("gcurtis1092@gmail.com" is an inline underlined
                          mailto link, accent on hover.)
```

### 5.2 About page copy

```
[Eyebrow]                 /about

[H1]                      About.

[Body — paragraph 1, serif]
I came up through corporate IT, learned how enterprise software really
works, and then started building my own. Now I ship full-stack products
with AI as a core part of how I work. Internal tools at a large company,
side projects on my own time, all of it production-grade.

(Note: the locked PORTFOLIO_SPEC about copy uses an em-dash before
"internal tools." Slice 1 replaces it with a period per design-spec §9.2.)

[Body — paragraph 2, serif]
I'm not a developer who picked up AI. I'm an AI-native builder, grounded
in enough infrastructure experience to take production seriously.

[H2]                      How I work.

[Principle 1, serif]
**Vertical slices.** Every release ships an end-to-end working feature.
Foundation, then a read-only demo, then auth, then real interactions. I
always have something to show and never something stuck mid-build.

[Principle 2, serif]
**Spec before code.** Every slice gets a brainstorm, a written design
spec, an implementation plan, and an ADR for any decision worth keeping.
The spec is the source of truth. If the build diverges, the spec is
wrong or the build is wrong, never both right.

[Principle 3, serif]
**The repo tells the story.** Conventional Commits. TSDoc on every
exported symbol. lint, typecheck, test, and docs:check as CI gates.
Audit log tables when mutations matter. A git bisect should always land
somewhere readable.

[Principle 4, serif]
**Tradeoffs out loud.** I'll cut a feature when the use case doesn't
exist (lawn games' realtime layer). I'll pick the model that holds the
format reliably even if it costs more (Sonnet over Haiku in the IT
helpdesk). Decisions belong in the repo, in ADRs, in PR descriptions.

[Principle 5, serif]
**AI does the typing; I do the judgment.** Claude writes the first pass
of most code, specs, and tests in my repos. I read every line, debug
every assumption, and own the result. The skill isn't generating code,
it's knowing what to keep.
```

**Voice review gate.** Before implementation begins, Garrett reads through the five principles above and edits any that read more in Claude's voice than his own. Edits land in this file, not in code. Implementation reads from the edited spec.

### 5.3 404 copy

```
[Eyebrow]                 // 404

[H1]                      Not here.

[Body — serif]
This URL doesn't resolve. The site is small. Start at home, or read
about.

[Links — inline underlined]
  Home
  About
```

---

## 6. Per-page metadata

Each page exports a Next.js `Metadata` object. These power the browser tab title and the social-share / search-result description.

```tsx
// src/app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garrett Curtis — AI-native builder. Full-stack engineer.",
  description:
    "I ship software. I work with AI like it's a teammate, not a tool. The result is production systems built faster, with more discipline, and better judgment about when to use AI and when not to.",
};
```

```tsx
// src/app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Garrett Curtis",
  description:
    "I'm not a developer who picked up AI. I'm an AI-native builder, grounded in enough infrastructure experience to take production seriously.",
};
```

```tsx
// src/app/not-found.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found — Garrett Curtis",
};
```

Notes:
- `description` is omitted on the 404 deliberately — a 404 page shouldn't appear in search results, so there's no description to optimize.
- Both descriptions use the em-dash-free version of the locked copy.
- `Metadata` is typed via Next's exported type; no `any`, no casts.

---

## 7. Test matrix

Vitest (the small-scope test runner — runs in Node, no real browser) covers components and pages individually. Playwright (real browser, runs against a started production server) covers one happy-path flow that touches multiple pages.

### 7.1 Vitest coverage

| File | Test file | Assertions |
|---|---|---|
| `components/eyebrow-label.tsx` | `eyebrow-label.test.tsx` | (1) renders children as a `<p>`; (2) applies `font-mono`, `uppercase`, `tracking-wider`, `text-accent` classes; (3) renders different children (slash-prefix, double-slash-prefix) correctly |
| `components/header.tsx` | `header.test.tsx` (new in Slice 1) | (1) brand mark with accent period; (2) About link present with `href="/about"`; (3) theme toggle button present; (4) `<nav>` has `aria-label="Primary"` |
| `app/page.tsx` (Home) | `app/page.test.tsx` (new) | (1) renders verbatim H1 text including both accent periods; (2) renders verbatim subhead with `<em>` around the "when to use AI and when not to" phrase; (3) renders hero meta with all three lines; (4) renders about-teaser paragraph verbatim; (5) renders `.case-cta` link with `href="/about"`; (6) renders mailto link with `href="mailto:gcurtis1092@gmail.com"`; (7) exactly one `<h1>` |
| `app/about/page.tsx` | `app/about/page.test.tsx` (new) | (1) photo present with `alt="Garrett Curtis"`; (2) "/about" eyebrow rendered; (3) H1 = `"About."`; (4) both verbatim About paragraphs present; (5) H2 = `"How I work."`; (6) five principle paragraphs each containing their lead `<strong>` phrase; (7) exactly one `<h1>` |
| `app/not-found.tsx` | `app/not-found.test.tsx` (new) | (1) "// 404" eyebrow rendered; (2) H1 = `"Not here."`; (3) verbatim body text; (4) Home link with `href="/"`; (5) About link with `href="/about"`; (6) exactly one `<h1>` |

All tests are written **before** the implementation per TDD law. Each test is committed in a failing state, the implementation lands in the next commit, the test passes. Reviewers can see the spec → test → code chain at each commit.

### 7.2 Playwright coverage

Single happy-path test, `e2e/home-about.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home → about navigation and theme persistence", async ({ page }) => {
  // Load home, assert headline renders
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("AI-native builder");

  // Click About in nav, land on /about
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByAltText("Garrett Curtis")).toBeVisible();

  // Toggle theme to dark
  const toggle = page.getByRole("button", { name: /switch to dark mode/i });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  // Reload, theme should persist
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
```

The test asserts against the `data-theme` attribute on `<html>` rather than visual color — the attribute is the source of truth and is faster + more reliable to assert than color.

### 7.3 `playwright.config.ts` shape

```ts
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for end-to-end (real-browser) tests.
 * Chromium-only at launch — multi-browser matrix can be added if specific
 * regressions ever justify the CI minutes.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

`webServer.command` is `npm start` (production build) — Playwright will run `npm run build` before tests if no server is already running. In CI we wire that explicitly (see §8).

---

## 8. CI changes

The existing `.github/workflows/ci.yml` has one job, `gates`, that runs lint, typecheck, test, docs:check. Slice 1 adds a second job, `e2e`, that depends on the first.

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

  e2e:
    needs: gates
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test
```

- `needs: gates` means e2e only runs if lint/typecheck/unit-tests/docs all passed first. Cheap failures stay cheap.
- `npx playwright install --with-deps chromium` downloads the chromium binary plus the Ubuntu system libraries Playwright needs. Adds ~30–60 seconds per CI run.
- `npm run build` produces the production bundle Playwright then runs against via `playwright.config.ts`'s `webServer.command: "npm start"`.

The required-status-checks branch protection rule on `rebuild/v2` is updated post-first-CI-run to include the new `e2e` check (manual UI step in GitHub, same procedure as Slice 0 §9.2).

---

## 9. Branching, commits, and PR

Branch off `rebuild/v2`: `slice-1-home-about`.

Conventional Commits, in this order (option A from the brainstorm — Playwright last so chrome work merges independently if e2e setup hits friction):

| # | Type | Subject |
|---|---|---|
| 1 | feat | EyebrowLabel component + tests |
| 2 | feat | about link in header + header test |
| 3 | feat | per-page metadata exports |
| 4 | feat | home page (hero, about teaser, contact CTA) |
| 5 | feat | about page (photo, body, how-i-work) |
| 6 | feat | 404 page (not-found.tsx) |
| 7 | chore | install playwright and base config |
| 8 | test | playwright happy-path e2e (home → about → theme) |
| 9 | ci | playwright job in CI workflow |
| 10 | docs | update PORTFOLIO_SPEC for slice 1 completion |

TDD discipline applies per commit: each `feat:` commit lands its test file in the same commit as the implementation, with the test having been written and run-to-fail first locally before the implementation was added. Commit messages reference the relevant design-spec section where applicable (e.g., `feat: home page hero (design-spec §6.2)`).

PR title: `Slice 1 — Home + About`.
PR body: link to this spec, deployed staging URL once Vercel finishes, DoD checklist from §10.
Merge into `rebuild/v2` once both `gates` and `e2e` CI checks are green.

---

## 10. Definition of done

The PR cannot merge until every box is ticked. Items belong in the PR description as a GitHub task list.

- [ ] `npm run dev` renders Home with the verbatim headline, subhead (with italicized phrase), hero meta block, about teaser, and mailto CTA
- [ ] `npm run dev` renders `/about` with photo, eyebrow, "About." H1, both verbatim paragraphs, "How I work." H2, and five principle paragraphs
- [ ] Navigating to an unknown URL (e.g. `/asdfgh`) renders the 404 with the verbatim copy
- [ ] Header shows brand + About link + theme toggle. About link navigates to `/about`
- [ ] Theme persists across page navigation (home → about → reload) — verified manually and by the Playwright test
- [ ] Hero meta block reads correctly at 375px (stacked, left-aligned), 768px (two-column), and 1440px (two-column, right-aligned) breakpoints — eyeballed manually
- [ ] All Vitest tests pass (`npm test -- --run`)
- [ ] Playwright e2e passes locally (`npm run test:e2e`)
- [ ] `npm run lint`, `npm run typecheck`, `npm run docs:check` all pass
- [ ] No `any`, no `@ts-ignore`, no raw `console.log` (these are blocked by lint config — listed here as a reminder)
- [ ] Every exported symbol has a TSDoc block (verified by `docs:check`)
- [ ] CI green on the PR: both `gates` and `e2e` jobs pass
- [ ] Branch protection on `rebuild/v2` updated to require the new `e2e` status check
- [ ] Vercel staging URL (`garrett-portfolio-rebuild.vercel.app`) deploys the merged branch and shows the new Home, About, and 404
- [ ] Merged into `rebuild/v2`
- [ ] `PORTFOLIO_SPEC.md` updated per §11

---

## 11. Spec updates at end of Slice 1

### 11.1 `PORTFOLIO_SPEC.md` edits

1. **Current status block** (top of file):
   - "Phase:" → "Slice 1 complete. Ready to begin Slice 2 (Work index + case studies)."
   - "Next action:" → revise to: in Claude Code, invoke `superpowers:brainstorming` for Slice 2 scope.
   - "Last updated:" → date of merge.
   - Append: "Slice 1 spec: `docs/specs/2026-05-22-slice-1-home-about-design.md`."
2. **Slice 1 subsection** in Implementation plan:
   - Prepend `**Status:** Complete (PR #<N>, deployed to <staging URL>).`

No edits required to `design-spec.md`: Slice 1 introduces no new visual patterns. Every component used appears in the existing design-spec §6.x.

---

## 12. Risks and open questions

- **Photo aspect ratio.** `/public/me.jpeg` was used as a circle on the current live site. If the source file isn't already 4:5, implementation either: (a) crops the file once and commits the cropped version, or (b) uses `next/image`'s `width`/`height` + `object-fit: cover` to crop on render. Decision deferred to implementation; either approach satisfies the design-spec.
- **Playwright reload-and-assert flake.** The theme persistence test does `toggle → reload → assert dark`. The pre-hydration bootstrap script in `layout.tsx` runs synchronously before paint, but Playwright's `page.reload()` resolution timing depends on `waitUntil` strategy. Mitigation: assert against the `data-theme` attribute (instantly available after document parse) rather than computed color (which depends on font + style load). Already encoded in the test as written in §7.2.
- **"How I work" voice drift.** The five principles in §5.2 are Claude's draft. They get a Garrett-edit pass in this spec file before implementation begins. The user-review gate after this file is committed is the place to do that. If edits are extensive, this section is the canonical source — implementation reads from it, not from the brainstorm transcript.
- **Hero meta mobile layout edge cases.** The reorder behavior (right-aligned on desktop, below subhead on mobile) is straightforward CSS but is the kind of thing that occasionally surprises at narrow viewports. The DoD includes manual checks at 375 / 768 / 1440.
- **Next 16 `not-found.tsx` convention.** A file at `app/not-found.tsx` is Next 16's built-in mechanism for the global 404 page. Stable, documented, no special metadata API quirks. Lowest-risk item on this list.
- **Branch protection toggle.** After CI runs once with the new `e2e` job, the GitHub branch-protection rule for `rebuild/v2` needs the new check added to its required list. Same manual UI step as Slice 0; documented in §10 DoD.

### 12.1 Open questions surfaced by spec self-review

These are questions the self-review pass surfaced that need Garrett's explicit decision before implementation begins. Each has a tentative answer that the spec currently assumes, but both deserve confirmation.

- **Q1: Em-dashes in the locked PORTFOLIO_SPEC copy.** The product spec's "Positioning (locked, verbatim)" section contains em-dashes in the hero subhead (`"...not a tool — the result is..."`) and in the About body paragraph 1 (`"...how I work — internal tools at..."`). The design-spec §9.2 explicitly bans em-dashes in copy. The Slice 1 §5 copy block currently replaces them with periods. Tentative answer: this is a minor editorial change consistent with the design-spec's stated discipline, and the PORTFOLIO_SPEC's "locked, verbatim" status applies to the *content* of the copy, not the punctuation glyphs. **Garrett to confirm: edit the em-dashes (current draft), or restore them and amend design-spec §9.2 to allow em-dashes in locked copy specifically?**
- **Q2: Home page `// home` eyebrow — keep or drop?** The Slice 1 §5.1 draft includes a `// home` eyebrow above the H1 on the home page (mirroring the `// slice 0` pattern from the Slice 0 placeholder). The hero meta block to the right already has `// now` as its first line in the same mono+accent style. Two mono+accent eyebrows in the same hero may be visually noisy. Tentative answer: drop the `// home` eyebrow on the home page; the hero meta block's `// now` carries the same metadata-eyebrow role. About and 404 still get their `/about` and `// 404` eyebrows (no competing label nearby). **Garrett to confirm: drop the `// home` eyebrow, keep it, or replace it with something else?**
- **Q3: Accent on `/about` and `// 404` eyebrows — strict or pragmatic reading of design-spec §2.3?** See §4.1 notes. Tentative answer: pragmatic reading — accent stays on these eyebrows. **Garrett to confirm: pragmatic (current draft) or strict (drop the accent / spec amendment)?**

---

## 13. References

- `docs/PORTFOLIO_SPEC.md` — product/positioning spec (locked copy)
- `docs/design-spec.md` v1.1 — binding visual contract
- `docs/specs/2026-05-20-slice-0-foundation-design.md` — foundation patterns to mirror
- `prototypes/lane-b.html` — visual reference for chrome and tokens
- Slice 0 PR: `garrettcurtis92/garrettcurtis.tech#1`
