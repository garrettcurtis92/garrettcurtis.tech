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
