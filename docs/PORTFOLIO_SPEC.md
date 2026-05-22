# Portfolio Site Spec — `garrettcurtis.tech`

> This is the living build plan for the rebuild of Garrett Curtis's portfolio site. It captures every decision made during planning so that build sessions can pick up without re-litigating the foundations.

---

## Current status

**Phase:** Slice 1 complete. Ready to begin Slice 2 (Work index + case studies).
**Branch strategy:** Slice 0 + Slice 1 merged to `rebuild/v2`. Continue slicing PRs into `rebuild/v2`; `main` keeps the legacy site until Slice 5 cutover.
**Next action:** In Claude Code, invoke `superpowers:brainstorming` for Slice 2 scope.
**Last updated:** 2026-05-22.

Slice 0 spec: `docs/specs/2026-05-20-slice-0-foundation-design.md`. Slice 0 plan: `docs/specs/2026-05-20-slice-0-foundation-plan.md`. Staging URL: `https://garrett-portfolio-rebuild.vercel.app` (deploys from `rebuild/v2`).
Slice 1 spec: `docs/specs/2026-05-22-slice-1-home-about-design.md`. Slice 1 plan: `docs/specs/2026-05-22-slice-1-home-about-plan.md`. PR: #TBD.

> **When picking up a new session:** read this Current status block first. If a slice has moved on, treat the slice table and any per-slice spec files as authoritative — older conversation context may be stale.

---

## How design work happens on this project

**Garrett produces the design specs. Claude Code implements them.**

- Design exploration runs through `/superpowers` brainstorming and `impeccable.style` workflows, driven by Garrett.
- The output of those workflows is a written design spec (palette, typography, motion, layout principles, component patterns) committed to the repo at `docs/design-spec.md` or similar.
- Claude Code does not invent design decisions. If a slice needs a design choice that isn't covered in the design spec yet, Claude Code should stop, surface the gap, and wait for Garrett to run the spec workflow rather than improvising.
- Anti-patterns Claude Code should refuse to ship even before the design spec exists: generic AI/SaaS gradients (purple-to-blue blurs, particle backgrounds, faux-glass cards), stock dev-portfolio tropes (iso-view laptop mockups, fake terminal hero, generic placeholder code), and any aspirational or transition language anywhere in the design.

---

## Project context

### Who this site is for

A working portfolio for **Garrett Curtis**, positioned as an **AI-native builder and full-stack engineer**.

### Audience priority

1. **Primary — Hiring managers at AI-forward product companies** (full-time engineering roles)
2. **Secondary — Founders / CTOs looking for early or founding engineers** (smaller orgs, more range expected)
3. **Future — Potential consulting clients** (do not optimize for this audience yet; the site should be portable enough to pivot toward this later without restructuring)

### The narrative shift this rebuild executes

The current site (`garrettcurtis.tech`) positions Garrett as transitioning ("Corporate Infrastructure Specialist → Software Engineer"). That framing is wrong and is the central thing this rebuild fixes. Garrett has been building with LLMs for 4-5 years, has shipped two non-trivial production systems at an enterprise SaaS company in 2026, and operates with senior-quality engineering discipline. The new site reflects that identity directly. **The transition narrative dies in this rebuild. It is not present anywhere in copy, design, or structure.**

---

## Positioning (locked, verbatim)

### Headline

> **AI-native builder. Full-stack engineer.**

Use as `<h1>` or display-size headline on the home page. Two declarative phrases separated by a period. Confident, identity-first, not aspirational. SEO-friendly because "Full-stack engineer" appears verbatim.

### Hero copy (subhead under headline)

> I ship software. I work with AI like it's a teammate, not a tool — the result is production systems built faster, with more discipline, and better judgment about when to use AI and when not to.

The "when not to" phrase is essential and intentional. It separates Garrett from generic "I use AI to be productive" framing by signaling judgment.

### About copy

> I came up through corporate IT, learned how enterprise software really works, and then started building my own. Now I ship full-stack products with AI as a core part of how I work — internal tools at a large company, side projects on my own time, all of it production-grade.
>
> I'm not a developer who picked up AI. I'm an AI-native builder, grounded in enough infrastructure experience to take production seriously.

Used on `/about`. Can also be condensed to the second paragraph alone for a home-page "about teaser" if needed.

### Voice and tone notes for any future copy

- Plain, confident, builder-coded. Specific over generic.
- No buzzwords (no "passionate," "innovative," "synergize," "leverage" as a verb, "transformative," etc.).
- Technical specifics are credibility, not decoration — name real stacks, real decisions, real tradeoffs.
- Owns work directly without hedging ("I built X" not "I had the opportunity to contribute to X").
- Acknowledges tradeoffs honestly, including when projects didn't ship.
- Anti-voice: McKinsey deck, generic AI startup landing page, junior bootcamp grad.

---

## Information architecture

### Sitemap

| Route | Purpose | Status at launch |
|---|---|---|
| `/` | Home — hero, featured case studies (2), brief about, contact CTA | Ships in Slice 1 |
| `/work` | Index of all projects; case studies linked from cards | Ships in Slice 2 |
| `/work/it-helpdesk` | Full case study (MDX) | Ships in Slice 2 |
| `/work/lawn-games` | Full case study (MDX) | Ships in Slice 2 |
| `/about` | Longer About story + "how I work" section | Ships in Slice 1 |
| `/contact` | Contact form + direct links | Ships in Slice 3 |
| `/writing` | Posts list (route exists, hidden from nav until first post) | Architecture in Slice 4, content post-launch |
| `/writing/[slug]` | Individual posts (MDX) | Architecture in Slice 4, content post-launch |

### Nav structure

- Header nav (visible at launch): **Work**, **About**, **Contact**
- Theme toggle (light/dark) in header
- `/writing` nav link is hidden until the first post lands, then flipped on
- Footer: short copy, social/GitHub/LinkedIn links, copyright

### Home page composition

1. Hero (headline + hero copy, theme-respecting)
2. Featured work — two cards linking to the full case studies (IT Helpdesk + Lawn Games)
3. About teaser (second paragraph of About + link to `/about`)
4. Contact CTA (warm, not "hire me" — open-ended)

### Work index composition

- IT Helpdesk and Lawn Games as flagship cards at top, linking to their case study pages
- **LiftOS as an upgraded featured side project** — bigger card than standard, 2-3 screenshots if available, paragraph of context, signals native iOS range + engineering discipline. Links to GitHub. No full case study yet.
- All other existing projects (Alpha Christians, The House Ministry, CZK Oktoberfest, StayWise, Rebecca Kelly Photography) as standard cards: title, short description, stack tags, GitHub link. No case studies.

---

## Case study content

Both case studies below are written in Garrett's voice and are ready to drop into MDX files. Headings and structure are intentional — both case studies follow the same shape for easier scanning across projects.

### `/work/it-helpdesk` — AI-Powered IT Helpdesk

```markdown
# AI-Powered IT Helpdesk

**A chat-based ticket intake that submits real Jira tickets as the user, with full context, classification, and screenshot analysis built in.**

`Next.js 16` · `Claude Sonnet 4` · `NextAuth v5` · `Atlassian OAuth 3LO` · `Microsoft Graph` · `Jira Service Management`

---

## The problem

IT was drowning in tickets that lacked context. Users would submit a vague description, technicians would spend time chasing them for clarification, and meanwhile users were stuck navigating a long portal just to ask for help with something simple. Both sides were losing time.

I wanted a way for users to describe their problem in plain language, get back to work fast, and have the technicians actually receive a ticket with all the context they'd normally have to ask for — who the user is, what device they're on, what they were doing, and a screenshot if one helps.

A few things mattered to me up front:

- **Entra SSO** — users shouldn't have to log in separately, and I could use Graph to pull their info automatically (manager, device, profile) instead of asking
- **Jira OAuth as the user** — not as a service bot. Tickets had to come *from* the user so they'd show up in their portal and they'd keep visibility into status. Another anonymous bot submitting tickets just becomes white noise IT learns to ignore.
- **Real classification** — not just dumping everything into a Generic queue. The AI had to pick the right request type, component, and priority so tickets routed correctly the first time.

## How it works

The user signs in with Microsoft, describes their issue in chat, and can drop in screenshots. Claude reads the conversation (and any images), asks follow-up questions when it needs to, and produces a fully-formed Jira ticket — request type, component, priority, description — that gets created as the authenticated user via Atlassian OAuth.

Behind the scenes, all the Jira metadata (service desk IDs, request types, components) is pulled at runtime and cached for 15 minutes. Nothing is hardcoded. If admins rename a component or add a new request type, the app picks it up automatically.

## Decisions I made along the way

**Structured output through the prompt, not tool use.** I had Claude end every response with a `json:ticket` code block, then yanked it out with a regex on the frontend and validated it with Zod. I tried tool-calling first, but it broke the streaming chat feel — tool use is a separate round trip, so the AI stops "typing" while it goes and does its tool thing. With the JSON-block approach, one stream carries both the chat *and* the ticket data. I also wrote a utility to hide the JSON block while it's streaming in, so users never see raw JSON building up character by character.

**Try the right ticket type first, fall back if Jira rejects it.** My first version tried to be clever — I'd pre-check whether the specialized request type accepted a `summary` field, and only use it if it did. Turns out the portal field list (what users see on the form) isn't the same as the API field list (what JSM actually accepts). My "safety check" was rejecting valid request types and forcing everything into Generic. Simpler approach won: just attempt the specialized type, and if Jira rejects it, retry with Generic. Let the API tell you what works.

**Sonnet over Haiku.** Vision capability was non-negotiable for screenshots, and Sonnet is way more reliable at consistently producing the JSON block at the end. Haiku misses the format often enough that the cost of failed extractions outweighs the per-token savings.

## The hardest part: teaching Claude what it could do

The image pipeline broke in four different places, and each one taught me something.

First, the send button silently dropped image-only messages because the handler required text. Fixed.

Second, the backend wasn't passing images to Claude — just text. Wired up multipart content blocks. Now Claude could see the image.

Third — and this is where it got interesting — Claude could see the image but kept telling users *"I'm just an intake assistant, I can't attach files to tickets."* The backend attachment pipeline existed. The model didn't know it existed. Two-line fix in the system prompt: *"Screenshots shared during the conversation are always attached to the ticket."* Suddenly Claude knew what it could do.

Fourth, even after that fix, Claude wouldn't *volunteer* the information. Users would upload a screenshot and not be told it was being used. The fix was prompting Claude not just on what was true, but on *how to communicate it*: "Let the user know their screenshots will be included."

The lesson: the model behaves based on what it believes about itself. There's no debugger for that. When the model says "I can't do that," the bug is in the prompt, not the code.

## Why it didn't ship

The app is feature-complete and fully working in sandbox. It didn't go to production, and the reasons are part of the story.

I built this as a solo project in a help desk role, not as an engineer with backing. IT didn't have the engineering coverage to maintain a Node/TypeScript stack long-term — if I left, they'd have a custom-built dependency with no one to own it. That's a legitimate call, and the right one. Taking on a custom build needs committed engineering support.

The other factor: while I was building, Atlassian shipped Rovo — their native AI inside Jira — which covers a chunk of the same problem natively in the platform. Build-vs-buy flipped while I was mid-build. Pushing forward with a custom solution when the platform vendor solves the core problem natively would have been the wrong call.

What I'm proud of is what the project proved out — that you can build real, production-quality AI features on top of existing enterprise systems, with the right auth, the right structured data going downstream, and a UX that feels like a teammate instead of a form.

## Tech stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind v4 · Claude Sonnet 4 (vision) · NextAuth v5 + Microsoft Entra ID · Atlassian OAuth 3LO (AES-256-GCM encrypted tokens) · Microsoft Graph API · Jira Service Management API · Zod 4 · WCAG 2.1 AA compliant
```

**Screenshot treatment:** Real screenshots from the app, with a frosted blur applied to the company wordmark/logo only. The rest of the UI remains intact. Industry-standard "employer discretion" treatment.

**Architecture diagrams (to be produced by Garrett, dropped in later):**
1. End-to-end request flow (User → Next.js → Claude API w/ vision → JSM Discovery → Jira)
2. Dual-OAuth architecture (NextAuth for Microsoft SSO + separate Atlassian 3LO with encrypted token chunking)
3. Streaming + structured-output extraction pattern (SSE stream → strip incomplete JSON → extract `json:ticket` block → Zod validation)

### `/work/lawn-games` — CWAN Lawn Games 2026

```markdown
# CWAN Lawn Games 2026

**A tournament platform replacing a paper bracket — 50 teams, ~500 viewers, built solo from spec to ship.**

`Next.js 16` · `React 19` · `Server Actions` · `PostgreSQL + Drizzle` · `Auth.js v5` · `Microsoft Graph` · `Tailwind v4`

---

## The problem

CWAN has run a summer lawn games tournament for years. Our General Counsel Manager, Jake, put it on every year — scores tracked in Excel, results emailed around, and the bracket itself was butcher paper taped up on the 9th floor. It worked, and people loved it, but it was held together by one person doing it by hand.

I wanted to give Jake his time back and give the rest of the company something better than refreshing an email thread to see who was winning. ~50 teams, ~500 viewers across a multi-week league. Self-service for captains, live-ish leaderboard for everyone else, and an audit trail behind every score so nobody could quietly fix the bracket in their favor.

## How it works

Anyone with CWAN SSO can register a team and becomes its captain. Captains invite teammates through directory search (Microsoft Graph), self-schedule matches with opponents, and enter scores after the fact. The bracket and leaderboard update from those inputs. Admins (Jake and a small group) can override anything if needed.

The whole app is built around the rhythm of how the tournament actually runs — matches get scheduled, played, then scored later. There's no live moment to broadcast, which turned out to be an important realization (more on that below).

## Decisions I made along the way

**Vertical slicing, end-to-end every time.** Every release ships a working feature, not a half-finished layer. Foundation → public read-only demo → IA pivot + landing → auth + admin shell → score entry → team registration & invites. Each slice has a brainstorm, a spec doc, an implementation plan, and an ADR for any decision worth remembering later. Working this way means I always have something to show, and I never have a "stuck in the middle" build.

**Cut realtime. Kept the interface.** My original plan had Postgres LISTEN/NOTIFY to push live score updates to the leaderboard. About halfway through I realized scores get entered post-hoc — matches are scheduled, played, then someone enters the result later. There's no live moment to broadcast. So I cut the realtime slice and replaced it with 10-second polling on the leaderboard. But I kept the `RealtimePublisher` interface in place, so if I ever do need real-time push (live finals night, say), it can land without an API rewrite. Don't build for use cases that don't exist — but leave the seam open in case they do.

**Captain-led permission model.** Anyone with SSO can register a team and becomes its captain. Captains own invite, remove, edit name/color, and team transfer. Match scheduling and score entry stay roster-wide (anyone on the team can do it). This walks the line between trust-based and locked-down — CWAN's culture is collegial enough that you can give people real control without it turning into chaos, but the captain layer means there's always one accountable person per team.

**Audit log on every server action.** Every mutation writes a row to an audit table — who did what, before and after, with user attribution. This is overkill for a lawn games app and exactly right for a lawn games app. People take their tournaments seriously. If a score gets corrected, everyone knows who corrected it and what it used to be.

**PR sequencing for an earlier announcement.** Standard order would have been captain controls first, then registration invites. I flipped it — shipped registration and the email invite ahead of the captain controls, so the "registration is open" email could go out a week earlier. Trade: some links in the email pointed at stub pages temporarily. That was worth it. Getting the announcement in front of CWAN sooner mattered more than UX completeness on day one.

## Working with the org, not just the code

A real chunk of this project wasn't writing code — it was navigating CWAN's reality. Three pieces stand out.

**Entra app registration.** I needed `Mail.Send` (for invite emails) and `User.ReadBasic.All` (for directory search). Tayler in identity admin and I went through a couple rounds before we got it right — the initial setup failed because I'd asked for Delegated permissions when the app actually needed Application permissions for outbound mail. Diagnosed the difference, came back with the corrected ask, and we scoped `Mail.Send` to a single shared mailbox via `ApplicationAccessPolicy` so the app couldn't send mail as anyone else even if it wanted to. That's the kind of security boundary that doesn't show up in a demo but matters in a real enterprise.

**The Platform team conversation.** CWAN runs an internal self-service deployment platform called Incubator that requires Python or Java backends. Mine is Node/TS. I wrote a positioning brief, sent architectural-fit questions to the platform lead, and we're working through whether the app deploys as-is on alternate hosting, gets rebuilt for the platform, or finds some other path. It's not resolved yet. The interesting part is that the conversation is happening at all — the engineering decision can't just be "I'll use what I know," it has to make sense for the org over time.

**Jake.** The previous paper-bracket owner. He's still the product owner — I'm building the tool, but the tournament is his. Working through demo gates and the transition plan with him, making sure he's never blindsided by the app changing something he'd been doing by hand.

## Design direction (committed in an ADR)

"ESPN meets Linear." Sports-league professional, not generic SaaS. Poppins + Barlow Condensed for typography. Deep turf green for primary, amber for live/leader states. CWAN corporate blue rejected for chrome and reserved for the logo only. Dark mode first-class. Custom SVG bracket connectors after the CSS pseudo-element version had sub-pixel gap issues.

Most engineers don't write ADRs for design. I wrote one because design decisions need the same "why" trail that architectural ones do — otherwise you end up six weeks later wondering why everything is green.

## Where it is now

Slices 0 through 5A merged to main, feature-complete on localhost. About 5 weeks of build time. Tournament window starts in 3 weeks. Currently blocked on the hosting decision — the registration email is built, but its links only resolve on localhost, so the announcement is parked until deploy.

326 tests passing. TSDoc on every exported symbol. Drizzle `.comment()` on every table. No `any`, no `@ts-ignore`, no raw `console.log`. The repo itself tells the story of how it was built.

## Tech stack

Next.js 16 (App Router, Server Components, Server Actions) · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui with custom tokens · PostgreSQL + Drizzle ORM (~21KB of typed schema, audit log invariants) · Auth.js v5 (Microsoft Entra ID, JWT sessions, role-based authorization) · Microsoft Graph (Mail.Send scoped via ApplicationAccessPolicy, User.ReadBasic.All) · Vitest + Playwright · WCAG-conscious, breakpoint-audited
```

**Screenshot treatment:** Real screenshots from the app are fine to use directly — the lawn games design is already public-facing inside CWAN and the visual identity is distinct enough that no anonymization is needed. The company wordmark in the top-left of the app may be blurred or cropped at Garrett's discretion.

---

## Design direction

Design specs are produced by Garrett via `/superpowers` brainstorming and `impeccable.style` workflows. Claude Code implements against those specs, not the other way around.

### Constraints (set here, non-negotiable)

- **Audience priority:** hiring managers first, founders second.
- **Tone:** confident, human, builder-identity. Never aspirational or transitional.
- **Accessibility:** WCAG 2.1 AA, `prefers-reduced-motion` respected, keyboard navigable, focus-visible.
- **Responsive:** 375 / 768 / 1024 / 1440 breakpoints audited.
- **Dark mode and light mode both first-class** — neither is an afterthought.
- **One saturated accent color, used sparingly.** Typography does the heavy lifting; visual chrome stays restrained.

### Anti-patterns (refuse to ship)

- Generic AI/SaaS visual tropes — purple-to-blue gradients, particle backgrounds, faux-glass cards, "AI orb" decorations.
- Stock dev-portfolio tropes — iso-view laptop mockups, fake terminal hero, generic placeholder code on a hero.
- Aspirational or transition language anywhere in the design — "learning," "becoming," "transitioning to," "aspiring to be."
- Heavy motion that distracts from content. Subtle, purposeful motion is fine.

### References

- **Existing site (`garrettcurtis.tech`):** keep what survives (project list content, contact structure, the `/me.jpeg` photo). Cut entirely: the "Corporate Infrastructure Specialist → Software Engineer" framing and any related transition copy.
- **Lawn games app** (`docs/screenshots/lawn-games/*`): reference for *taste* — bold typographic hierarchy over evocative imagery, restrained palette with single saturated accent, condensed display face paired with clean body — but not for *visual copy*. The portfolio site should be its own design artifact, not a sibling.

### Design workflow

1. Garrett runs `/superpowers` brainstorming scoped to the portfolio's design system.
2. Garrett runs `impeccable.style` workflows to produce concrete design tokens, type pairings, and component patterns.
3. The output is committed to `docs/design-spec.md` (or similar) before Slice 1 begins.
4. Subsequent slices reference and extend that design spec; Claude Code implements only against the committed spec.
5. If a slice surfaces a design gap, Claude Code stops and surfaces it. Garrett resolves via the spec workflow rather than improvising.

---

## Technical decisions

| Concern | Choice | Reasoning |
|---|---|---|
| Framework | Next.js 16 (App Router, RSC, Server Actions) | Same as lawn games; deep familiarity |
| Language | TypeScript strict | Non-negotiable |
| Styling | Tailwind v4 + shadcn/ui with custom tokens | Same as lawn games; consistent muscle memory |
| Content | MDX for case studies and writing posts | Co-located content + components, no CMS overhead |
| Auth | None | Public portfolio; no logged-in users |
| Database | None | Static-ish content |
| Forms | Server Actions + Zod (contact form) | Same pattern as lawn games |
| Email | Resend (or similar) | Lightweight, free tier sufficient |
| Analytics | Vercel Analytics | One-line addition, privacy-respecting |
| Testing | Vitest for utilities, Playwright for happy-path e2e | Not over-investing for a portfolio |
| Linting | Hard bans: no `any`, no `@ts-ignore` without justification, no raw `console.log` | Same discipline as lawn games |
| Documentation | TSDoc on exported symbols, `docs:check` in CI | Same pattern as lawn games |
| Deployment | Vercel | Native Next.js, no Incubator politics to navigate |
| SEO | Proper `<meta>` tags, per-page OG images (`@vercel/og`), `sitemap.xml`, `robots.txt` | Table stakes |

### Repo conventions (carried over from lawn games)

- **Vertical slicing.** Each release ships an end-to-end working feature.
- **Spec-driven.** Every slice gets a brainstorm → spec → implementation plan → code.
- **ADRs in the repo** for any decision worth remembering later.
- **TSDoc on every exported symbol.**
- **Conventional Commits** for git history.
- **GitHub Flow** with short-lived feature branches off `main`.

---

## Implementation plan

### Slice 0 — Foundation

*Scaffolding, design tokens, layout primitives, deploy pipeline.*
**Status:** Complete (merged via Slice 0 PR; deployed to https://garrett-portfolio-rebuild.vercel.app).

- Next.js 16 + Tailwind v4 + TS strict scaffold
- Root layout, header, footer, theme toggle (dark/light)
- Typography pairing applied per design spec
- Vercel project connected, deploys from `main` to a staging URL (NOT `garrettcurtis.tech` yet)
- Lint, type, test, docs gates wired into CI

**Definition of done:** A "Hello world" page deploys to a staging Vercel URL. Theme toggle works. Type, lint, test, and docs gates all pass. The design spec is committed in the repo before any UI work happens.

### Slice 1 — Home + About

**Status:** Complete (PR #TBD, deployed to <https://garrett-portfolio-rebuild.vercel.app>).

*The new positioning, live.*

- Home page: hero (headline + hero copy), about teaser, featured-work teaser placeholders (not the real cards yet — those land in Slice 2), contact CTA
- About page: full About content + a "how I work" section
- 404 page

**Definition of done:** Home and About deployed to staging. Headline reads *AI-native builder. Full-stack engineer.* All copy from the Positioning section above is in place verbatim. 404 exists.

### Slice 2 — Work index + case studies

*The actual proof.*

- `/work` index with project cards
- `/work/it-helpdesk` and `/work/lawn-games` as full MDX-rendered case studies (content above is verbatim)
- **LiftOS as an upgraded featured side project card** — bigger than standard cards, with 2-3 screenshots if Garrett has them, a paragraph of context. Links to GitHub. No full case study yet.
- All other side projects (Alpha Christians, The House Ministry, CZK Oktoberfest, StayWise, Rebecca Kelly Photography) as standard cards: title, short description, stack tags, GitHub link.
- Image components, screenshot treatment (frosted blur on the wordmark for helpdesk shots; lawn games shots untreated).

**Definition of done:** All work content is on the site. Both case studies render correctly from MDX. Cards link correctly. Screenshots are blurred where needed. LiftOS card is visibly differentiated from the other side projects.

### Slice 3 — Contact

*The funnel destination.*

- `/contact` page with form (Server Action + Zod validation + Resend for delivery)
- Warm, open-ended copy — NOT "available for hire" or "open to consulting" (that signals freelance work and is wrong for current audience priority)
- Direct links to GitHub, LinkedIn, email
- Form submits successfully and emails Garrett
- shadcn/ui set up with custom tokens (deferred from Slice 0)

**Definition of done:** Form works end to end. Garrett receives a test submission. Validation errors render correctly.

### Slice 4 — Writing scaffolding (architecture only)

*Ship the architecture, not the content.*

- `/writing` route exists but the nav link is hidden until first post lands
- `/writing/[slug]` route ready for MDX posts
- Empty-state UX for `/writing` if reached directly ("Writing in progress" or similar) — but no visible nav entry to find it

**Definition of done:** When Garrett writes the first post, dropping in an MDX file and flipping a feature flag adds it to the site with zero infrastructure work needed.

### Slice 5 — Polish + ship

*The version that goes to `garrettcurtis.tech`.*

- Open Graph images per page (generated via `@vercel/og`)
- `sitemap.xml`, `robots.txt`
- Vercel Analytics wired
- Accessibility audit pass (WCAG 2.1 AA targets)
- Performance audit (Lighthouse scores documented in the repo)
- Mobile audit at 375 / 768 / 1024 / 1440
- DNS cutover from current site to new site

**Definition of done:** New site lives at `garrettcurtis.tech`. Old site retired. Garrett posts about the launch on LinkedIn.

### Slice 6 — First writing post (post-launch, separate session)

*Not part of v1 launch. Tracked here so it doesn't get lost.*

- Write the first post (candidate: "engineering the model's beliefs about its own capabilities" — drawn from the IT Helpdesk image-pipeline war story)
- Drop into `/writing/[slug]`, flip the nav-link flag
- Cross-post a teaser to LinkedIn pointing back at the post on the site

**Definition of done:** First post lives at `garrettcurtis.tech/writing/[slug]`. LinkedIn teaser is live. Nav link is visible.

### Slice 7 — LiftOS case study upgrade (conditional, deferred)

*Only if/when LiftOS reaches a state with real screenshots and a story arc worth a long-form case study.*

- Promote LiftOS from featured side project card to full case study at `/work/liftos`
- Write the case study using the same shape as IT Helpdesk and Lawn Games

**Definition of done:** LiftOS case study renders at `/work/liftos`. The featured-card-only treatment from Slice 2 is replaced.

### Why this order

- Slice 0 is unglamorous but unblocking; once it's done, every other slice ends in a real deploy.
- Slice 1 ships the corrected positioning fast. Even if work stopped here, the site would already be a meaningful improvement.
- Slice 2 is the heaviest lift but the content is fully drafted in this spec — work is layout and render, not writing.
- Slice 3 (contact) before Slice 4 (writing) because contact funnels the hiring-manager traffic that's the primary audience. Writing is a long-game compounding play.
- Slice 4 ships architecture only; the empty-section anti-pattern can't happen because the nav link doesn't appear until content exists.
- Slice 5 is the cutover. Everything before this lives at a staging URL. Cutover happens only when v1 is genuinely better than what's currently live.
- Slice 6 is the next priority post-launch; tracked here so it isn't lost.
- Slice 7 is conditional and may never land.

---

## How to update this file

- **At the start of a slice:** update the Current status block — current slice, next action, blockers if any. Link the slice's spec file once it's written.
- **Mid-slice:** update Blockers if one appears. Don't use this file as a task tracker — implementation plans are for that.
- **At the end of a slice:** mark the slice done in the slice table, advance Current status to the next slice, append any decisions worth remembering.
- **Never** rewrite past slice rows to reflect what you'd do differently today. If the approach changes, write a superseding design spec in the repo.

---

## Just-in-time slice workflow

At the start of each slice:

1. Read the Current status block at the top of this file.
2. Invoke `superpowers:brainstorming` scoped to the upcoming slice.
3. Commit the slice spec to `docs/specs/YYYY-MM-DD-slice-N-<name>-design.md`.
4. Invoke `superpowers:writing-plans` to produce the implementation plan.
5. Execute via `superpowers:executing-plans` or `superpowers:subagent-driven-development`.
6. Update this file at the end of the slice.
