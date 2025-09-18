
export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200/40 dark:border-white/10 mt-10 backdrop-blur-md bg-white/60 dark:bg-slate-900/60">
      <div className="container py-6 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p>© {new Date().getFullYear()} Garrett Curtis</p>
        <p>Built with Next.js + Tailwind</p>
      </div>
    </footer>
  );
}
