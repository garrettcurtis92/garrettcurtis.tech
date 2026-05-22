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
          <p className="text-accent">{"// now"}</p>
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
