/**
 * Bottom chrome per design-spec §6.12. Copyright on the left, social/contact
 * links on the right. Stacks vertically below the sm breakpoint (640px).
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border-soft">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Garrett Curtis</p>
        <nav className="flex gap-4" aria-label="Social and contact">
          <a
            href="https://github.com/garrettcurtis92"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/garrettcurtis92"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href="mailto:gcurtis1092@gmail.com"
            className="font-medium transition-colors hover:text-accent"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
