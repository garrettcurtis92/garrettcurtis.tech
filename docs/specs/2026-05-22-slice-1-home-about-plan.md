# Slice 1 — Home + About Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Slice 0 placeholder home page with the real Home; add `/about` and a branded 404; add the About nav link to the header; introduce one new shared component (`<EyebrowLabel>`); set up Playwright with one happy-path end-to-end test covering home → about → theme persistence; extend CI with a Playwright job.

**Architecture:** Three Server Components (Home, About, NotFound) own their JSX inline. One new Server Component (`EyebrowLabel`) is extracted because three pages reuse it. Header gets one `<Link href="/about">` added inside a new `<nav aria-label="Primary">` landmark. All copy is verbatim from the slice spec §5. Playwright runs against `npm start` (production build), chromium-only, with retries in CI and trace-on-first-retry. The new CI `e2e` job depends on the existing `gates` job — cheap failures stay cheap.

**Tech Stack:** Next.js 16.2.4, React 19.2.4, TypeScript 5 (strict), Tailwind v4 (CSS-first config, no `tailwind.config.js`), Vitest 4 + happy-dom + Testing Library (existing from Slice 0), `@playwright/test` (new), `next/image` (already a Next dependency), `next/link` (already a Next dependency). No new global CSS.

**Authoritative inputs:**
- Slice spec: `docs/specs/2026-05-22-slice-1-home-about-design.md` (binding for this plan)
- Design spec: `docs/design-spec.md` v1.1 (binding visual contract)
- Product spec: `docs/PORTFOLIO_SPEC.md`
- Slice 0 spec (precedent patterns): `docs/specs/2026-05-20-slice-0-foundation-design.md`
- Slice 0 plan (test-shape precedent): `docs/specs/2026-05-20-slice-0-foundation-plan.md`

**Deviation from slice spec §9 commit list:** The slice spec lists "per-page metadata exports" as commit #3, before the pages exist. In Next 16 App Router, a page file must export a default React component — exporting `metadata` alone is not valid. This plan therefore folds metadata into each page's creation commit (Tasks 3, 4, 5), giving 9 total commits instead of 10. The work is identical; only the commit numbering shifts.

---

## File map

| Path | Action | Source / pattern |
|---|---|---|
| `src/components/eyebrow-label.tsx` | CREATE | Slice spec §4.1 |
| `src/components/eyebrow-label.test.tsx` | CREATE | Slice spec §7.1 (EyebrowLabel row) |
| `src/components/header.tsx` | MODIFY | Slice spec §4.2 |
| `src/components/header.test.tsx` | CREATE | Slice spec §7.1 (Header row) |
| `src/app/page.tsx` | REWRITE | Slice spec §3.1, §5.1, §6 |
| `src/app/page.test.tsx` | CREATE | Slice spec §7.1 (Home row) |
| `src/app/about/page.tsx` | CREATE | Slice spec §3.2, §5.2, §6 |
| `src/app/about/page.test.tsx` | CREATE | Slice spec §7.1 (About row) |
| `src/app/not-found.tsx` | CREATE | Slice spec §3.3, §5.3, §6 |
| `src/app/not-found.test.tsx` | CREATE | Slice spec §7.1 (NotFound row) |
| `playwright.config.ts` | CREATE | Slice spec §7.3 |
| `e2e/home-about.spec.ts` | CREATE | Slice spec §7.2 |
| `package.json` | MODIFY | Slice spec §2 (add `@playwright/test`, two new scripts) |
| `.github/workflows/ci.yml` | MODIFY | Slice spec §8 (add `e2e` job) |
| `eslint.config.mjs` | MODIFY (if needed) | Ignore `e2e/` if it conflicts with project rules |
| `docs/PORTFOLIO_SPEC.md` | EDIT | Slice spec §11.1 |

**Files NOT touched (chrome from Slice 0 stays as-is):**

- `src/app/layout.tsx` — fonts, theme bootstrap, header/footer/main shell already correct
- `src/app/globals.css` — design tokens, base styles, `@theme` block all correct
- `src/components/footer.tsx` — unchanged
- `src/components/theme-toggle.tsx` — unchanged
- `src/components/theme-toggle.test.tsx` — unchanged
- `src/lib/theme.ts` — unchanged
- `src/app/layout.test.tsx` — unchanged
- `docs/design-spec.md` — no new visual patterns introduced
- `docs/specs/2026-05-22-slice-1-home-about-design.md` — already committed
- `scripts/docs-check.mjs` — unchanged

---

## Task 0: Create the `slice-1-home-about` branch

**Files:** none (git only)

- [ ] **Step 1: Confirm starting state**

Run:
```bash
git status
git log --oneline -3
git branch --show-current
```

Expected:
- Working tree clean
- Current branch: `rebuild/v2`
- Last commit: `4d86252 docs: lock slice 1 spec self-review decisions`

If the working tree is not clean, stash or commit before proceeding.

- [ ] **Step 2: Create and switch to the slice branch**

Run:
```bash
git checkout -b slice-1-home-about
git branch --show-current
```

Expected output:
```
slice-1-home-about
```

---

## Task 1: EyebrowLabel component + tests

**Files:**
- Create: `src/components/eyebrow-label.tsx`
- Create: `src/components/eyebrow-label.test.tsx`

- [ ] **Step 1: Write the failing test file**

Create `src/components/eyebrow-label.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EyebrowLabel } from "./eyebrow-label";

describe("EyebrowLabel", () => {
  it("renders its children as text", () => {
    render(<EyebrowLabel>// now</EyebrowLabel>);
    expect(screen.getByText("// now")).toBeInTheDocument();
  });

  it("uses a <p> tag (paragraph semantics for a labeled eyebrow)", () => {
    const { container } = render(<EyebrowLabel>// 404</EyebrowLabel>);
    const p = container.querySelector("p");
    expect(p).not.toBeNull();
    expect(p?.textContent).toBe("// 404");
  });

  it("applies mono, uppercase, tracked, and accent classes per design-spec §6", () => {
    const { container } = render(<EyebrowLabel>/about</EyebrowLabel>);
    const p = container.querySelector("p");
    expect(p).toHaveClass("font-mono");
    expect(p).toHaveClass("text-xs");
    expect(p).toHaveClass("uppercase");
    expect(p).toHaveClass("tracking-wider");
    expect(p).toHaveClass("text-accent");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --run src/components/eyebrow-label.test.tsx
```

Expected: FAIL with `Cannot find module './eyebrow-label'` (file does not exist yet).

- [ ] **Step 3: Write the minimal implementation**

Create `src/components/eyebrow-label.tsx`:

```tsx
/**
 * Small mono-accent label used as a section eyebrow. Renders the children
 * in JetBrains Mono, uppercase, with positive letter-tracking and accent
 * color. Used on the about page (`/about`) and 404 page (`// 404`). The
 * home page has no eyebrow — its hero meta block's `// now` line carries
 * the metadata-eyebrow role instead (see slice spec §3.1, §12.1 Q2).
 *
 * Accent usage follows the pragmatic reading of design-spec §2.3 locked
 * in slice spec §12.1 Q3 — small mono URL-like labels qualify as accent
 * uses even though they are not enumerated by name in §2.3.
 *
 * @param children - The label text. Caller decides whether to include the
 *   leading `//` glyph or a `/` prefix; the component does not add markup.
 */
export function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-wider text-accent">
      {children}
    </p>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- --run src/components/eyebrow-label.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Verify TSDoc coverage gate**

Run:
```bash
npm run docs:check
```

Expected: passes (the `export function EyebrowLabel` has a TSDoc block above it).

- [ ] **Step 6: Commit**

```bash
git add src/components/eyebrow-label.tsx src/components/eyebrow-label.test.tsx
git commit -m "$(cat <<'EOF'
feat: EyebrowLabel component + tests

Shared mono-accent eyebrow used on /about and /not-found per slice spec
§4.1. Pragmatic reading of design-spec §2.3 accent budget retained per
spec §12.1 Q3.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: About link in header + header test

**Files:**
- Create: `src/components/header.test.tsx`
- Modify: `src/components/header.tsx`

- [ ] **Step 1: Write the failing test file**

Create `src/components/header.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";

describe("Header", () => {
  it("renders the brand mark with 'Garrett Curtis' text", () => {
    render(<Header />);
    expect(screen.getByText(/Garrett Curtis/)).toBeInTheDocument();
  });

  it("renders the About nav link with href='/about'", () => {
    render(<Header />);
    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("renders the theme toggle as a button", () => {
    render(<Header />);
    // The toggle has aria-label "Switch to dark mode" or "Switch to light mode".
    // Either matches a name regex; we just need a button to exist.
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("wraps About link and theme toggle in a navigation landmark labeled 'Primary'", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toBeInTheDocument();
    // Sanity: the About link should live inside that landmark.
    expect(nav).toContainElement(screen.getByRole("link", { name: "About" }));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --run src/components/header.test.tsx
```

Expected: 2 tests pass (brand mark, theme toggle button) and 2 tests fail:
- `renders the About nav link with href='/about'` — FAIL (no `About` link yet)
- `wraps About link and theme toggle in a navigation landmark` — FAIL (no `<nav>` yet)

- [ ] **Step 3: Modify the Header implementation**

Overwrite `src/components/header.tsx` with:

```tsx
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Top chrome. Brand mark on the left, primary nav (About link) plus theme
 * toggle on the right. The Work and Contact nav links land in Slices 2
 * and 3 respectively; the foundation discipline ("never link to dead
 * routes") still applies. The `<nav aria-label="Primary">` landmark
 * groups the right-side cluster semantically — the theme toggle is a
 * `<button>` inside `<nav>`, which is valid HTML.
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

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- --run src/components/header.test.tsx
```

Expected: all 4 tests pass.

- [ ] **Step 5: Run the full test suite to confirm no regressions**

Run:
```bash
npm test -- --run
```

Expected: all tests pass (theme-toggle, layout, eyebrow-label from Task 1, header).

- [ ] **Step 6: Verify lint + typecheck + docs:check**

Run:
```bash
npm run lint && npm run typecheck && npm run docs:check
```

Expected: all three pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/header.tsx src/components/header.test.tsx
git commit -m "$(cat <<'EOF'
feat: about link in header + header test

Adds the About nav link inside a new <nav aria-label="Primary"> landmark
that also wraps the theme toggle. Work and Contact links remain deferred
to Slices 2 and 3.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Home page — hero, about teaser, contact CTA (with metadata)

**Files:**
- Rewrite: `src/app/page.tsx`
- Create: `src/app/page.test.tsx`

- [ ] **Step 1: Write the failing test file**

Create `src/app/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders exactly one <h1>", () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the verbatim headline 'AI-native builder. Full-stack engineer.'", () => {
    render(<Home />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("AI-native builder. Full-stack engineer.");
  });

  it("renders the subhead with italicized 'when to use AI and when not to'", () => {
    render(<Home />);
    expect(screen.getByText(/I ship software\./)).toBeInTheDocument();
    expect(
      screen.getByText(/The result is production systems built faster/)
    ).toBeInTheDocument();
    const em = screen.getByText("when to use AI and when not to");
    expect(em.tagName).toBe("EM");
  });

  it("renders the hero meta block with three lines", () => {
    render(<Home />);
    expect(screen.getByText("// now")).toBeInTheDocument();
    expect(screen.getByText("Clearwater Analytics")).toBeInTheDocument();
    expect(screen.getByText("Boise, ID")).toBeInTheDocument();
  });

  it("renders the about teaser paragraph verbatim", () => {
    render(<Home />);
    expect(
      screen.getByText(/I'm not a developer who picked up AI/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/grounded in enough infrastructure experience/)
    ).toBeInTheDocument();
  });

  it("renders the about teaser link pointing to /about", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /Read the full about/i });
    expect(link).toHaveAttribute("href", "/about");
  });

  it("renders the mailto contact link", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /gcurtis1092@gmail\.com/i });
    expect(link).toHaveAttribute("href", "mailto:gcurtis1092@gmail.com");
  });

  it("renders the contact CTA preamble line", () => {
    render(<Home />);
    expect(
      screen.getByText(/Best place to reach me is email/i)
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --run src/app/page.test.tsx
```

Expected: most assertions FAIL (the Slice 0 placeholder home renders `"Foundation."` headline, no hero meta, no about teaser, no mailto).

- [ ] **Step 3: Rewrite the Home page**

Overwrite `src/app/page.tsx` with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Home page metadata. Browser tab title and the description used in
 * search engine + social share previews. The description is the locked
 * hero subhead with the em-dash replaced by a period per slice spec
 * §12.1 Q1.
 */
export const metadata: Metadata = {
  title: "Garrett Curtis — AI-native builder. Full-stack engineer.",
  description:
    "I ship software. I work with AI like it's a teammate, not a tool. The result is production systems built faster, with more discipline, and better judgment about when to use AI and when not to.",
};

/**
 * Home page. Hero with the locked headline + subhead + meta block, an
 * about teaser linking to /about, and a single-line mailto contact CTA.
 * No featured-work cards — those land in Slice 2. Server Component.
 *
 * Hero grid collapses to single-column below 720px per design-spec §6.2
 * (Tailwind v4 `min-[720px]:` arbitrary breakpoint chosen over the default
 * `md:` 768px breakpoint to match the spec exactly; see slice spec §3.1).
 */
export default function Home() {
  return (
    <section className="mx-auto max-w-[1100px] px-4 pt-7 pb-7">
      {/* Hero — two-column at ≥720px, stacked below. */}
      <div className="grid grid-cols-1 min-[720px]:grid-cols-[1fr_auto] gap-4 min-[720px]:gap-6">
        <div>
          <h1
            className="font-sans text-display font-bold text-text"
            style={{ letterSpacing: "-0.025em", lineHeight: 1 }}
          >
            AI-native builder<span className="text-accent">.</span>{" "}
            Full-stack engineer<span className="text-accent">.</span>
          </h1>
          <p
            className="mt-4 max-w-[54ch] font-serif text-md text-text"
            style={{ lineHeight: 1.65 }}
          >
            I ship software. I work with AI like it&apos;s a teammate, not a
            tool. The result is production systems built faster, with more
            discipline, and better judgment about{" "}
            <em>when to use AI and when not to</em>.
          </p>
        </div>
        <div className="font-mono text-sm text-text min-[720px]:text-right">
          <p className="text-accent">// now</p>
          <p>Clearwater Analytics</p>
          <p>Boise, ID</p>
        </div>
      </div>

      {/* About teaser. */}
      <div className="mt-5">
        <p
          className="max-w-[54ch] font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          I&apos;m not a developer who picked up AI. I&apos;m an AI-native
          builder, grounded in enough infrastructure experience to take
          production seriously.
        </p>
        <Link
          href="/about"
          className="group mt-3 inline-block border-b border-border font-sans text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
        >
          Read the full about{" "}
          <span className="inline-block transition-transform group-hover:translate-x-[3px]">
            →
          </span>
        </Link>
      </div>

      {/* Contact CTA. */}
      <div className="mt-5">
        <p
          className="font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          Best place to reach me is email:{" "}
          <a
            href="mailto:gcurtis1092@gmail.com"
            className="underline underline-offset-[3px] transition-colors hover:text-accent"
          >
            gcurtis1092@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the home test to verify it passes**

Run:
```bash
npm test -- --run src/app/page.test.tsx
```

Expected: all 8 tests pass.

- [ ] **Step 5: Run the full test suite to confirm no regressions**

Run:
```bash
npm test -- --run
```

Expected: all tests pass (eyebrow-label, header, theme-toggle, layout, home).

- [ ] **Step 6: Manual visual check**

Run:
```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Verify:
- Headline reads "AI-native builder. Full-stack engineer." in large sans display type
- Both periods are accent-orange
- Subhead is serif, italicized phrase visible
- Hero meta on the right (desktop) shows `// now` in accent, `Clearwater Analytics`, `Boise, ID`
- Resize browser narrower than 720px wide: hero meta drops below subhead, left-aligned
- "Read the full about →" link has a bottom border and the arrow nudges right on hover
- "Best place to reach me is email: gcurtis1092@gmail.com" with the email as an underlined link
- Theme toggle still works (click → dark mode → reload → still dark)

Stop the dev server (Ctrl+C) when done.

- [ ] **Step 7: Verify lint + typecheck + docs:check**

Run:
```bash
npm run lint && npm run typecheck && npm run docs:check
```

Expected: all three pass.

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx src/app/page.test.tsx
git commit -m "$(cat <<'EOF'
feat: home page (hero, about teaser, contact CTA)

Replaces the Slice 0 placeholder home with the locked positioning hero,
about-teaser paragraph + .case-cta-style link to /about, and a single
mailto contact CTA. Includes per-page metadata (title + description).
Hero grid uses min-[720px]: to match design-spec §6.2's 720px collapse
point exactly.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: About page — photo, body, how-i-work (with metadata)

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/about/page.test.tsx`

- [ ] **Step 1: Verify the photo source exists**

Run:
```bash
ls -la public/me.jpeg
```

Expected: file exists. If not, halt — Slice 0's `public/` audit should have kept it.

- [ ] **Step 2: Write the failing test file**

Create the directory `src/app/about/` and then `src/app/about/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./page";

describe("About page", () => {
  it("renders exactly one <h1>", () => {
    const { container } = render(<About />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the profile photo with alt='Garrett Curtis'", () => {
    render(<About />);
    expect(screen.getByAltText("Garrett Curtis")).toBeInTheDocument();
  });

  it("renders the /about eyebrow", () => {
    render(<About />);
    expect(screen.getByText("/about")).toBeInTheDocument();
  });

  it("renders the H1 as 'About.'", () => {
    render(<About />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("About.");
  });

  it("renders the verbatim first About paragraph", () => {
    render(<About />);
    expect(
      screen.getByText(/I came up through corporate IT/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all of it production-grade\./)
    ).toBeInTheDocument();
  });

  it("renders the verbatim second About paragraph", () => {
    render(<About />);
    expect(
      screen.getByText(/I'm not a developer who picked up AI/)
    ).toBeInTheDocument();
  });

  it("renders the 'How I work.' H2", () => {
    render(<About />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.textContent).toBe("How I work.");
  });

  it("renders all five principle lead phrases", () => {
    render(<About />);
    expect(screen.getByText("Vertical slices.")).toBeInTheDocument();
    expect(screen.getByText("Spec before code.")).toBeInTheDocument();
    expect(screen.getByText("The repo tells the story.")).toBeInTheDocument();
    expect(screen.getByText("Tradeoffs out loud.")).toBeInTheDocument();
    expect(
      screen.getByText("AI does the typing; I do the judgment.")
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:
```bash
npm test -- --run src/app/about/page.test.tsx
```

Expected: FAIL with `Cannot find module './page'` (file does not exist yet).

- [ ] **Step 4: Write the About page**

Create `src/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { EyebrowLabel } from "@/components/eyebrow-label";

/**
 * About page metadata. The description is the locked second About
 * paragraph (the most "elevator-pitch" sentence of the two).
 */
export const metadata: Metadata = {
  title: "About — Garrett Curtis",
  description:
    "I'm not a developer who picked up AI. I'm an AI-native builder, grounded in enough infrastructure experience to take production seriously.",
};

/**
 * About page. Photo at top (4:5, ~320px wide, --radius), then eyebrow,
 * H1, two-paragraph body, and the "How I work" section with five
 * principle paragraphs. Server Component.
 *
 * The em-dash in the first paragraph of the locked PORTFOLIO_SPEC About
 * copy is replaced with a period per slice spec §12.1 Q1.
 */
export default function About() {
  return (
    <article className="mx-auto max-w-[1100px] px-4 pt-7 pb-7">
      {/* Photo. next/image with priority — above-the-fold LCP. */}
      <div
        className="overflow-hidden rounded-[var(--radius)]"
        style={{ width: "320px", maxWidth: "100%" }}
      >
        <Image
          src="/me.jpeg"
          alt="Garrett Curtis"
          width={320}
          height={400}
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Eyebrow + H1. */}
      <div className="mt-5">
        <EyebrowLabel>/about</EyebrowLabel>
        <h1
          className="mt-2 font-sans text-2xl font-bold text-text"
          style={{ letterSpacing: "-0.015em", lineHeight: 1.1 }}
        >
          About<span className="text-accent">.</span>
        </h1>
      </div>

      {/* Body — two paragraphs. */}
      <div className="mt-4 max-w-[65ch]">
        <p
          className="font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          I came up through corporate IT, learned how enterprise software
          really works, and then started building my own. Now I ship
          full-stack products with AI as a core part of how I work. Internal
          tools at a large company, side projects on my own time, all of it
          production-grade.
        </p>
        <p
          className="mt-3 font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          I&apos;m not a developer who picked up AI. I&apos;m an AI-native
          builder, grounded in enough infrastructure experience to take
          production seriously.
        </p>
      </div>

      {/* How I work. */}
      <h2
        className="mt-6 font-sans text-lg font-semibold text-text"
        style={{ letterSpacing: "-0.015em" }}
      >
        How I work<span className="text-accent">.</span>
      </h2>
      <div className="mt-3 flex max-w-[65ch] flex-col gap-3">
        <p
          className="font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          <strong className="font-sans font-semibold">Vertical slices.</strong>{" "}
          Every release ships an end-to-end working feature. Foundation, then
          a read-only demo, then auth, then real interactions. I always have
          something to show and never something stuck mid-build.
        </p>
        <p
          className="font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          <strong className="font-sans font-semibold">Spec before code.</strong>{" "}
          Every slice gets a brainstorm, a written design spec, an
          implementation plan, and an ADR for any decision worth keeping. The
          spec is the source of truth. If the build diverges, the spec is
          wrong or the build is wrong, never both right.
        </p>
        <p
          className="font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          <strong className="font-sans font-semibold">
            The repo tells the story.
          </strong>{" "}
          Conventional Commits. TSDoc on every exported symbol. lint,
          typecheck, test, and docs:check as CI gates. Audit log tables when
          mutations matter. A git bisect should always land somewhere
          readable.
        </p>
        <p
          className="font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          <strong className="font-sans font-semibold">
            Tradeoffs out loud.
          </strong>{" "}
          I&apos;ll cut a feature when the use case doesn&apos;t exist (lawn
          games&apos; realtime layer). I&apos;ll pick the model that holds the
          format reliably even if it costs more (Sonnet over Haiku in the IT
          helpdesk). Decisions belong in the repo, in ADRs, in PR
          descriptions.
        </p>
        <p
          className="font-serif text-md text-text"
          style={{ lineHeight: 1.65 }}
        >
          <strong className="font-sans font-semibold">
            AI does the typing; I do the judgment.
          </strong>{" "}
          Claude writes the first pass of most code, specs, and tests in my
          repos. I read every line, debug every assumption, and own the
          result. The skill isn&apos;t generating code, it&apos;s knowing what
          to keep.
        </p>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Run the about test to verify it passes**

Run:
```bash
npm test -- --run src/app/about/page.test.tsx
```

Expected: all 8 tests pass.

- [ ] **Step 6: Run the full test suite to confirm no regressions**

Run:
```bash
npm test -- --run
```

Expected: all tests pass across all test files.

- [ ] **Step 7: Manual visual check**

Run:
```bash
npm run dev
```

Open `http://localhost:3000/about` in a browser. Verify:
- Photo at top, 4:5 portrait, rounded corners, left-aligned (not centered)
- `/about` eyebrow in small mono-accent text
- "About." H1 with the period in accent color
- Two body paragraphs in serif
- "How I work." H2 with accent period
- Five principle paragraphs, each with a sans-bold lead phrase
- Click "Garrett Curtis." brand mark in header → returns to home
- Theme toggle still works on this page

Also click About from the home page to confirm header navigation works.

Stop the dev server when done.

- [ ] **Step 8: Verify lint + typecheck + docs:check**

Run:
```bash
npm run lint && npm run typecheck && npm run docs:check
```

Expected: all three pass.

- [ ] **Step 9: Commit**

```bash
git add src/app/about/
git commit -m "$(cat <<'EOF'
feat: about page (photo, body, how-i-work)

Photo at top (4:5, --radius, next/image with priority for LCP), /about
eyebrow, About. H1, two-paragraph verbatim body, How I work. H2 with
five principle paragraphs. Per-page metadata included. Em-dash in the
locked PORTFOLIO_SPEC About paragraph 1 replaced with a period per
slice spec §12.1 Q1.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: 404 page (not-found.tsx) with metadata

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/not-found.test.tsx`

- [ ] **Step 1: Write the failing test file**

Create `src/app/not-found.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound page", () => {
  it("renders exactly one <h1>", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the // 404 eyebrow", () => {
    render(<NotFound />);
    expect(screen.getByText("// 404")).toBeInTheDocument();
  });

  it("renders the H1 as 'Not here.'", () => {
    render(<NotFound />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Not here.");
  });

  it("renders the verbatim body text", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/This URL doesn't resolve\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The site is small\. Start at home/)
    ).toBeInTheDocument();
  });

  it("renders the Home wayfinding link with href='/'", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the About wayfinding link with href='/about'", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --run src/app/not-found.test.tsx
```

Expected: FAIL with `Cannot find module './not-found'` (file does not exist yet).

- [ ] **Step 3: Write the 404 page**

Create `src/app/not-found.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/eyebrow-label";

/**
 * 404 page metadata. No `description` — a 404 page shouldn't appear in
 * search results, so there's nothing to optimize.
 */
export const metadata: Metadata = {
  title: "Not found — Garrett Curtis",
};

/**
 * Global 404 page. Next 16's `app/not-found.tsx` convention is the
 * built-in catch-all for URLs that don't resolve to any route.
 *
 * Hero-shaped: mono eyebrow, display-sized H1 with accent period, serif
 * body, two wayfinding links. Server Component. Three sentences in the
 * body deliberately (no em-dash) per design-spec §9.2.
 */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1100px] px-4 pt-7 pb-7">
      <EyebrowLabel>// 404</EyebrowLabel>
      <h1
        className="mt-2 font-sans text-2xl font-bold text-text"
        style={{ letterSpacing: "-0.015em", lineHeight: 1.1 }}
      >
        Not here<span className="text-accent">.</span>
      </h1>
      <p
        className="mt-4 max-w-[54ch] font-serif text-md text-text"
        style={{ lineHeight: 1.65 }}
      >
        This URL doesn&apos;t resolve. The site is small. Start at home, or
        read about.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/"
          className="font-sans text-sm font-medium text-text underline underline-offset-[3px] transition-colors hover:text-accent"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="font-sans text-sm font-medium text-text underline underline-offset-[3px] transition-colors hover:text-accent"
        >
          About
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the 404 test to verify it passes**

Run:
```bash
npm test -- --run src/app/not-found.test.tsx
```

Expected: all 6 tests pass.

- [ ] **Step 5: Run the full test suite to confirm no regressions**

Run:
```bash
npm test -- --run
```

Expected: every test across every test file passes.

- [ ] **Step 6: Manual 404 check**

Run:
```bash
npm run dev
```

Visit `http://localhost:3000/this-route-does-not-exist`. Verify:
- `// 404` eyebrow in accent mono
- `Not here.` headline (sans, accent period)
- Body line: "This URL doesn't resolve. The site is small. Start at home, or read about."
- Two links (Home, About) on separate lines, each underlined; click each one and verify navigation.
- Header still renders at the top; footer still renders at the bottom (the 404 page nests inside the root layout).

Stop the dev server when done.

- [ ] **Step 7: Verify lint + typecheck + docs:check**

Run:
```bash
npm run lint && npm run typecheck && npm run docs:check
```

Expected: all three pass.

- [ ] **Step 8: Commit**

```bash
git add src/app/not-found.tsx src/app/not-found.test.tsx
git commit -m "$(cat <<'EOF'
feat: 404 page (not-found.tsx)

Hero-shaped 404 with mono eyebrow, "Not here." H1 (accent period), serif
body, and two wayfinding links to home and about. Per-page metadata
(title only — descriptions are wasted on 404s). Uses Next 16's
app/not-found.tsx built-in convention.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Install Playwright + base config

**Files:**
- Modify: `package.json` (add dependency + scripts)
- Modify: `package-lock.json` (regenerated by `npm install`)
- Create: `playwright.config.ts`
- Modify: `.gitignore` (add Playwright output directories)

- [ ] **Step 1: Install `@playwright/test`**

Run:
```bash
npm install --save-dev @playwright/test
```

Expected:
- Adds `@playwright/test` to `package.json` `devDependencies` with the latest stable version
- Regenerates `package-lock.json`
- No errors

- [ ] **Step 2: Verify the installed version**

Run:
```bash
node -e "console.log(require('./package.json').devDependencies['@playwright/test'])"
```

Expected: prints a version string starting with `^` (e.g. `^1.49.1` or similar). Note this version for the commit message.

- [ ] **Step 3: Install Chromium browser binaries**

Run:
```bash
npx playwright install --with-deps chromium
```

Expected: downloads chromium for the current OS. On Linux this also installs system dependencies via apt; on macOS no apt step (the `--with-deps` flag is a no-op). Takes 30–120 seconds depending on network.

- [ ] **Step 4: Add npm scripts to `package.json`**

Open `package.json` and add two scripts to the `"scripts"` block (alphabetical order, between `"test"` and `"typecheck"`):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install --with-deps chromium",
    "docs:check": "node scripts/docs-check.mjs"
  }
}
```

- [ ] **Step 5: Create `playwright.config.ts` at the project root**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for end-to-end (real-browser) tests.
 *
 * Tests live in `e2e/`. Chromium-only at launch — multi-browser matrix
 * can be added later if a specific regression earns the CI minutes.
 *
 * `webServer.command: "npm start"` runs against the production build.
 * In CI we run `npm run build` before `npx playwright test`; locally,
 * Playwright reuses an already-running server if one is on port 3000.
 *
 * `retries: 2` in CI absorbs occasional environment flake. Locally we
 * fail fast so issues surface immediately.
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

- [ ] **Step 6: Add Playwright output directories to `.gitignore`**

Open `.gitignore`. Add these lines at the bottom (or anywhere sensible, after the existing `.superpowers/` line):

```gitignore
# Playwright
/test-results/
/playwright-report/
/playwright/.cache/
```

- [ ] **Step 7: Sanity-check that Playwright is wired in**

Create a temporary smoke test to confirm Playwright is callable. Run:

```bash
mkdir -p e2e
echo 'import { test } from "@playwright/test"; test("smoke", () => {});' > e2e/_smoke.spec.ts
npx playwright test e2e/_smoke.spec.ts --reporter=list
```

Expected: 1 test passes ("smoke"). After confirming, delete the smoke file:

```bash
rm e2e/_smoke.spec.ts
```

- [ ] **Step 8: Verify lint + typecheck still pass**

Run:
```bash
npm run lint && npm run typecheck
```

Expected: both pass. (The empty `playwright.config.ts` is valid TS; `e2e/` is empty so no lint targets there.)

If lint complains about the `e2e/` directory existing without files matching its globs, that's fine — it just means no lint targets. If lint *errors* on the directory, fix `eslint.config.mjs` to ignore `e2e/` for now (e2e tests get their own lint pass via Playwright's eslint plugin if/when we add one).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json playwright.config.ts .gitignore
git commit -m "$(cat <<'EOF'
chore: install playwright and base config

Adds @playwright/test as a dev dependency, two npm scripts (test:e2e,
test:e2e:install), and the base playwright.config.ts. Chromium-only,
sequential, retries in CI. Runs against npm start (production build).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Playwright happy-path e2e test

**Files:**
- Create: `e2e/home-about.spec.ts`

- [ ] **Step 1: Write the e2e test**

Create `e2e/home-about.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

/**
 * Happy-path coverage for Slice 1:
 * 1. Load the home page. Headline renders.
 * 2. Click the About nav link. Lands on /about with the photo visible.
 * 3. Toggle the theme to dark. `<html data-theme>` becomes "dark".
 * 4. Reload. The bootstrap script reads localStorage and the theme
 *    persists across the reload.
 *
 * We assert against the `data-theme` attribute on `<html>` instead of
 * computed CSS color — the attribute is the source of truth and is
 * available the instant the bootstrap script runs, before paint.
 */

test("home → about navigation and theme persistence", async ({ page }) => {
  // 1. Home loads and shows the locked headline.
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("AI-native builder");

  // 2. About link navigates to /about, photo is visible.
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByAltText("Garrett Curtis")).toBeVisible();

  // 3. Toggle from light (default) to dark.
  const toggle = page.getByRole("button", { name: /switch to dark mode/i });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  // 4. Reload — bootstrap script must re-apply the persisted theme.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
```

- [ ] **Step 2: Make sure no dev server is running on port 3000**

Run:
```bash
lsof -i :3000 || echo "port 3000 is free"
```

If something is bound to 3000, stop it (Ctrl+C in that terminal or `kill <PID>`). Playwright's `webServer` config will spin up `npm start` itself.

- [ ] **Step 3: Run a fresh production build**

Run:
```bash
npm run build
```

Expected: `next build` produces a clean production build. No errors. If the build fails, fix the issue before continuing — Playwright won't have a server to run against otherwise.

- [ ] **Step 4: Run the Playwright test**

Run:
```bash
npm run test:e2e
```

Expected:
- Playwright starts `npm start` in the background
- Waits for `http://localhost:3000` to respond
- Runs the single test
- All 4 assertions pass
- Reporter prints `1 passed`
- Server is torn down

If the test fails:
- If "Switch to dark mode" can't be found, double-check the theme toggle's `aria-label` in `src/components/theme-toggle.tsx` matches the regex.
- If the `data-theme` attribute isn't set after reload, double-check `src/app/layout.tsx`'s `themeBootstrap` inline script — it should fire synchronously in `<head>`.

- [ ] **Step 5: Commit**

```bash
git add e2e/home-about.spec.ts
git commit -m "$(cat <<'EOF'
test: playwright happy-path e2e (home -> about -> theme)

Single e2e covering: load /, headline renders, click About, land on
/about with photo, toggle theme to dark, reload, theme persists. Asserts
against html[data-theme] (source of truth), not computed color.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Playwright job in CI workflow

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Open the existing workflow and add the `e2e` job**

Replace the contents of `.github/workflows/ci.yml` with:

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

Notes for the engineer:
- `needs: gates` means the `e2e` job only starts after `gates` finishes successfully — cheap failures stay cheap.
- The CI job builds the production bundle (`npm run build`) and then Playwright's `webServer.command: "npm start"` (from `playwright.config.ts`) starts the production server before running tests.
- `--with-deps chromium` installs both the browser and the Ubuntu system libraries Playwright needs (the system-libs portion is the slow part, ~30 seconds).

- [ ] **Step 2: Verify YAML syntax locally**

Run:
```bash
node -e "const yaml = require('js-yaml'); try { yaml.load(require('fs').readFileSync('.github/workflows/ci.yml','utf8')); console.log('OK'); } catch(e) { console.error(e.message); process.exit(1); }" 2>/dev/null || echo "(js-yaml not installed locally; syntax check skipped — GitHub will validate on push)"
```

Either output is acceptable; this is a syntax sanity check, not a hard gate.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "$(cat <<'EOF'
ci: playwright job in CI workflow

Adds an e2e job that depends on the existing gates job. Installs
chromium with system deps, builds the app, runs playwright test.
Failure attribution stays clean: gates failures point to lint/type/unit/docs,
e2e failures point to e2e.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Update PORTFOLIO_SPEC.md for Slice 1 completion

**Files:**
- Modify: `docs/PORTFOLIO_SPEC.md`

> Note: This task is committed now but actually edited again right before the merge — the `<staging URL>` and PR number aren't known until the PR opens. Step 4 below makes the initial edit; the final substitutions happen at Task 12 Step 3.

- [ ] **Step 1: Open `docs/PORTFOLIO_SPEC.md`**

The file's "Current status" block currently reads (paraphrased — actual text may differ slightly post-Slice 0):

```
**Phase:** Slice 0 complete. Ready to begin Slice 1 (Home + About).
**Next action:** In Claude Code, invoke `superpowers:brainstorming` for Slice 1 scope.
**Last updated:** 2026-05-21 (or similar, from Slice 0 merge).
```

- [ ] **Step 2: Update the Current status block**

Replace the Current status block with (preserving any surrounding context):

```
**Phase:** Slice 1 complete. Ready to begin Slice 2 (Work index + case studies).
**Next action:** In Claude Code, invoke `superpowers:brainstorming` for Slice 2 scope.
**Last updated:** <date of Slice 1 merge>.

> Slice 0 spec: `docs/specs/2026-05-20-slice-0-foundation-design.md`. Slice 0 plan: `docs/specs/2026-05-20-slice-0-foundation-plan.md`. Staging URL: `https://garrett-portfolio-rebuild.vercel.app`.
> Slice 1 spec: `docs/specs/2026-05-22-slice-1-home-about-design.md`. Slice 1 plan: `docs/specs/2026-05-22-slice-1-home-about-plan.md`. PR: #<N>.
```

For now (this Task 9 commit), `<date of Slice 1 merge>` should read `2026-05-22` (today) and `#<N>` should read `#TBD` — these get fixed up in Task 12 Step 3 once the PR exists and merges.

- [ ] **Step 3: Update the Slice 1 subsection in the Implementation plan**

Find the `### Slice 1 — Home + About` heading. Prepend a status line directly under it:

```
**Status:** Complete (PR #TBD, deployed to <https://garrett-portfolio-rebuild.vercel.app>).
```

The PR number gets corrected in Task 12 Step 3.

- [ ] **Step 4: Verify the edits in-place**

Run:
```bash
git diff docs/PORTFOLIO_SPEC.md
```

Expected:
- "Phase:" line shows new Slice 1 complete text
- "Next action:" line points at Slice 2
- "Last updated:" shows today's date
- Slice 0 + Slice 1 spec/plan references added
- `### Slice 1 — Home + About` section gains a `**Status:** Complete (...)` line

- [ ] **Step 5: Commit**

```bash
git add docs/PORTFOLIO_SPEC.md
git commit -m "$(cat <<'EOF'
docs: update PORTFOLIO_SPEC for slice 1 completion

Advances the Current status block to "Slice 1 complete, ready for Slice 2"
and prepends a Status line to the Slice 1 subsection in the implementation
plan. PR # and final merge date are reconciled at merge time (Task 12).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Pre-PR verification sweep

**Files:** none (read-only verification)

- [ ] **Step 1: Confirm all expected commits exist**

Run:
```bash
git log --oneline rebuild/v2..HEAD
```

Expected output (exactly 9 commits, most recent first):

```
<sha> docs: update PORTFOLIO_SPEC for slice 1 completion
<sha> ci: playwright job in CI workflow
<sha> test: playwright happy-path e2e (home -> about -> theme)
<sha> chore: install playwright and base config
<sha> feat: 404 page (not-found.tsx)
<sha> feat: about page (photo, body, how-i-work)
<sha> feat: home page (hero, about teaser, contact CTA)
<sha> feat: about link in header + header test
<sha> feat: EyebrowLabel component + tests
```

If any commits are out of order or missing, halt and reconcile before opening the PR.

- [ ] **Step 2: Run every CI gate locally**

Run, in order:
```bash
npm run lint
npm run typecheck
npm test -- --run
npm run docs:check
```

Expected: all four pass with zero errors.

- [ ] **Step 3: Build and run e2e against the production build**

Run:
```bash
npm run build
npm run test:e2e
```

Expected: build succeeds, 1 e2e test passes.

- [ ] **Step 4: Manual breakpoint audit (DoD §10)**

Run `npm run dev` and load `http://localhost:3000/` in a browser. Use DevTools' responsive mode to verify at three viewport widths:

- **375px** (mobile): hero meta stacks below subhead, left-aligned. Photo on /about shrinks to fit. Footer stacks vertically.
- **768px** (tablet): hero meta is right-aligned beside the headline. Layout looks balanced.
- **1440px** (desktop): same as 768 but with more breathing room around the hero. Photo on /about is ~320px wide on a wide page.

Stop the dev server.

- [ ] **Step 5: Manual theme + 404 audit (DoD §10)**

Still in the browser (or restart `npm run dev`):

- Load `/`. Toggle to dark. Navigate to `/about`. Theme persists. Reload `/about`. Still dark. Toggle back to light. Reload. Light persists.
- Visit `/some-route-that-doesnt-exist`. 404 page renders with the verbatim copy and two working links.
- Click each link in the footer — GitHub, LinkedIn, Email — they open the expected URLs in a new tab (where applicable).

Stop the dev server.

- [ ] **Step 6: Check `prefers-reduced-motion`**

In DevTools, enable "Emulate CSS prefers-reduced-motion: reduce" (Rendering tab). Click the theme toggle. The transition should be near-instant (0.01ms) per the `globals.css` rule. Disable the emulation when done.

---

## Task 11: Push branch + open PR

**Files:** none (git + GitHub)

- [ ] **Step 1: Push the branch to origin**

Run:
```bash
git push -u origin slice-1-home-about
```

Expected: branch created on origin, tracking set up.

- [ ] **Step 2: Open the PR via `gh`**

Run:
```bash
gh pr create \
  --base rebuild/v2 \
  --head slice-1-home-about \
  --title "Slice 1 — Home + About" \
  --body "$(cat <<'EOF'
## Summary

Slice 1 ships the real Home page (locked positioning hero, about teaser, mailto CTA), the new About page (photo, two-paragraph body, How I work section with five principle paragraphs), and a branded 404. Adds the About nav link to the header. Introduces Playwright with one happy-path e2e covering home → about → theme persistence.

**Spec:** `docs/specs/2026-05-22-slice-1-home-about-design.md`
**Plan:** `docs/specs/2026-05-22-slice-1-home-about-plan.md`

## Definition of done

- [x] `npm run dev` renders Home with the verbatim headline, subhead, hero meta, about teaser, and mailto CTA
- [x] `npm run dev` renders `/about` with photo, eyebrow, "About." H1, both paragraphs, "How I work." H2, and five principles
- [x] Any unknown URL renders the 404 with verbatim copy and working links
- [x] Header shows brand + About link + theme toggle; About link navigates to /about
- [x] Theme persists across navigation and reload (verified manually + by Playwright)
- [x] Hero meta layout audited at 375, 768, 1440
- [x] All Vitest tests pass (`npm test -- --run`)
- [x] Playwright e2e passes locally (`npm run test:e2e`)
- [x] `npm run lint`, `npm run typecheck`, `npm run docs:check` all pass
- [x] No `any`, no `@ts-ignore`, no raw `console.log`
- [x] Every exported symbol has a TSDoc block (verified by `docs:check`)
- [ ] CI green on the PR: both `gates` and `e2e` jobs pass _(verify after CI completes)_
- [ ] Branch protection on `rebuild/v2` updated to require the new `e2e` status check _(post-merge)_
- [ ] Vercel staging URL deploys the merged branch and shows the new Home, About, and 404 _(post-merge)_
- [ ] Merged into `rebuild/v2`
- [ ] `PORTFOLIO_SPEC.md` updated per spec §11 _(final PR # + merge date filled in)_

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: gh prints the PR URL. Note the PR number (e.g., `#2`).

- [ ] **Step 3: Wait for CI to run**

Run:
```bash
gh pr checks --watch
```

This blocks until both `gates` and `e2e` complete. Expected: both pass (green check marks).

If `e2e` fails:
- Run `gh run view --log-failed` to see the failure output
- Most likely causes: chromium install timing out on a slow runner (rerun), or the `npm start` server failing to bind (check the build output)
- Reproduce locally with `npm run build && npm run test:e2e`

If `gates` fails:
- Same diagnosis pattern. Lint, typecheck, and docs:check all run locally too, so any failure was caught earlier — investigate accordingly.

---

## Task 12: Manual finalization (post-CI-green)

**Files:**
- Edit (final pass): `docs/PORTFOLIO_SPEC.md`
- GitHub UI: branch protection rule

> Garrett performs these steps. They are not subagent-automatable because they involve GitHub web UI clicks and merge timing.

- [ ] **Step 1: Update branch protection on `rebuild/v2` to require the `e2e` check**

In GitHub web UI:

1. Go to repository **Settings → Branches**
2. Find the existing branch protection rule for `rebuild/v2` (created during Slice 0)
3. Click **Edit**
4. Under "Require status checks to pass before merging", in the status checks list, add `e2e` (it appears in the available list now that the workflow has run at least once)
5. Click **Save changes**

- [ ] **Step 2: Reconcile the PORTFOLIO_SPEC PR number + merge date**

Before merging, update the `#TBD` placeholders in `docs/PORTFOLIO_SPEC.md` with the actual PR number. This can be a small final commit on the slice branch:

```bash
# Replace #TBD with the actual PR number (e.g., #2)
# Edit docs/PORTFOLIO_SPEC.md in your editor:
#   - "PR: #TBD." → "PR: #2."
#   - "**Status:** Complete (PR #TBD, ..." → "**Status:** Complete (PR #2, ..."
#   - "**Last updated:** 2026-05-22." → "**Last updated:** <actual merge date>"
git add docs/PORTFOLIO_SPEC.md
git commit -m "docs: fill in slice 1 PR number and merge date"
git push
```

Or wait until after merge and do it directly on `rebuild/v2`:

```bash
git checkout rebuild/v2
git pull
# Edit docs/PORTFOLIO_SPEC.md
git add docs/PORTFOLIO_SPEC.md
git commit -m "docs: fill in slice 1 PR number and merge date"
git push origin rebuild/v2
```

Either approach is fine.

- [ ] **Step 3: Merge the PR**

Once CI is green and branch protection is satisfied:

```bash
gh pr merge --squash --delete-branch
```

`--squash` produces a single clean merge commit on `rebuild/v2` rather than preserving the 9 individual feat/test/ci/docs commits — the individual commits remain on the closed branch for `git log --all` traceability, but `rebuild/v2`'s linear history stays scannable.

`--delete-branch` removes the `slice-1-home-about` branch from origin after merge.

- [ ] **Step 4: Confirm Vercel redeploys**

In the Vercel dashboard (or via `vercel ls` if the CLI is installed):

- Confirm `rebuild/v2` gets a new deployment within ~2 minutes of the merge
- Visit `https://garrett-portfolio-rebuild.vercel.app/` — new Home page loads
- Visit `https://garrett-portfolio-rebuild.vercel.app/about` — About page loads
- Visit `https://garrett-portfolio-rebuild.vercel.app/no-such-route` — 404 page loads
- Toggle theme; reload; theme persists

If the staging URL still shows the Slice 0 placeholder, the Vercel project's Production Branch setting isn't pointing at `rebuild/v2`. Slice 0 spec §10 documents the fix (Project → Settings → Git → Production Branch).

- [ ] **Step 5: Final DoD checkbox sweep on the PR**

Reopen the merged PR on GitHub. Tick the remaining boxes:
- [x] CI green
- [x] Branch protection updated
- [x] Vercel staging deploys
- [x] Merged into `rebuild/v2`
- [x] `PORTFOLIO_SPEC.md` updated

Slice 1 done.
