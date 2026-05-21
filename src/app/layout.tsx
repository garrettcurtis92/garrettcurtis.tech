import type { Metadata } from "next";
import {
  Hanken_Grotesk,
  Spectral,
  JetBrains_Mono,
} from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/**
 * Pre-hydration script that resolves the theme before first paint.
 * Reads `localStorage.gc:theme` first; falls back to the user's OS
 * preference. Sets `<html data-theme="light|dark">` so the CSS overrides
 * apply immediately. Kept as a raw string so it inlines into the server
 * HTML and runs synchronously before React hydrates. The key string here
 * mirrors `THEME_STORAGE_KEY` in `@/lib/theme` — change both together.
 */
const themeBootstrap = `(function(){try{var s=localStorage.getItem('gc:theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

/** Default page metadata. Per-page exports override on a per-route basis. */
export const metadata: Metadata = {
  title: "Garrett Curtis",
  description: "AI-native builder. Full-stack engineer.",
};

/**
 * Root layout. Server Component. Loads the three font families as CSS
 * variables, injects the pre-hydration theme bootstrap, and renders the
 * chrome (header, main, footer).
 *
 * `suppressHydrationWarning` is required on `<html>` because the bootstrap
 * mutates `data-theme` before React hydrates. The explicit `<head>` is
 * required because Next 16's metadata API doesn't cover pre-hydration
 * scripts (and placing the script outside `<html>` produces a hydration
 * error).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hankenGrotesk.variable} ${spectral.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
