"use client";
import { ReactNode } from "react";

type Tone = "purple" | "green" | "pink" | "neutral";

const toneToColor: Record<Tone, string> = {
  purple: "rgba(167,139,250,0.14)",
  green: "rgba(52,211,153,0.14)",
  pink: "rgba(244,114,182,0.14)",
  neutral: "rgba(148,163,184,0.10)",
};

export default function GlassCard({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const glow = toneToColor[tone];

  return (
    <div
      className={`relative rounded-2xl border ring-1 backdrop-blur-md
                  bg-white/60 border-white/40 ring-slate-200/50
                  dark:bg-white/10 dark:border-white/10 dark:ring-white/10
                  transition transform hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      {/* subtle glow layer */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(120% 80% at 50% 10%, ${glow} 0%, transparent 70%)`,
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 10%, #000 35%, transparent 80%)",
          maskImage:
            "radial-gradient(120% 80% at 50% 10%, #000 35%, transparent 80%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
