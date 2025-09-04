import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export function Nav() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="font-semibold tracking-tight">Garrett Curtis</Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/projects" className="hover:underline">Projects</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
