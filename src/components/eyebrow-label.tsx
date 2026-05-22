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
