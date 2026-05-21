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
        {"// slice 0"}
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
