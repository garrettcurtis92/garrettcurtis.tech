export function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="container py-6 text-sm opacity-70 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p>© {new Date().getFullYear()} Garrett Curtis</p>
        <p>Built with Next.js + Tailwind</p>
      </div>
    </footer>
  );
}
