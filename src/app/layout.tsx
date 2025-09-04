// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import RouteTransition from "@/components/RouteTransition";
import BackgroundBlobs from "@/components/BackgroundBlobs";

export const metadata: Metadata = { title: "Garrett Curtis — Portfolio", description: "…" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <BackgroundBlobs variant="home" />
        <Nav />
        <main className="container flex-1 py-10 overflow-visible">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
