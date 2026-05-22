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
      <EyebrowLabel>{"// 404"}</EyebrowLabel>
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
