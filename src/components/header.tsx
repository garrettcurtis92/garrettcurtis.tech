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
