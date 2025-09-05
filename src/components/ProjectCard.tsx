// src/components/ProjectCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";

type Tone = "purple" | "green" | "pink" | "neutral";

type Project = {
  slug: string;
  title: string;
  summary: string;
  tech: string[];
  demo?: string;
  repo: string;
  image?: string;
  tone?: Tone; // ← add
};

const toneStyles: Record<Tone, { ring: string; shadow: string; glow: string }> = {
  purple: {
    ring: "ring-violet-300/50 hover:ring-violet-300/70",
    shadow: "shadow-[0_24px_64px_-24px_rgba(167,139,250,0.45)]",
    glow: "rgba(167,139,250,0.18)",
  },
  green: {
    ring: "ring-emerald-300/50 hover:ring-emerald-300/70",
    shadow: "shadow-[0_24px_64px_-24px_rgba(52,211,153,0.45)]",
    glow: "rgba(52,211,153,0.18)",
  },
  pink: {
    ring: "ring-pink-300/50 hover:ring-pink-300/70",
    shadow: "shadow-[0_24px_64px_-24px_rgba(244,114,182,0.45)]",
    glow: "rgba(244,114,182,0.18)",
  },
  neutral: {
    ring: "ring-slate-200/60 hover:ring-slate-300/70",
    shadow: "shadow-[0_24px_64px_-24px_rgba(15,23,42,0.25)]",
    glow: "rgba(148,163,184,0.12)",
  },
};



export function ProjectCard({ project }: { project: Project }) {
  const tone = project.tone ?? "neutral";

  return (
    <Link
      href={project.repo}
      target="_blank"
      rel="noreferrer"
      className="block group"
    >
      <GlassCard tone={tone}>
        {project.image ? (
          <div className="relative h-44">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          </div>
        ) : null}

        <div className="p-5 space-y-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-1 rounded-full border text-xs bg-white/60 border-white/40
                           dark:bg-white/10 dark:border-white/10 dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            {project.demo && (
              <span
                className="underline text-slate-800 dark:text-slate-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.demo, '_blank', 'noopener,noreferrer');
                }}
              >
                Demo
              </span>
            )}
            <span className="underline text-slate-800 dark:text-slate-200">
              GitHub →
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
