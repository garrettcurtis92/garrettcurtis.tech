import Link from "next/link";
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
        <Link href="/" className="font-sans text-md font-semibold text-text">
          Garrett Curtis<span className="text-accent">.</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
