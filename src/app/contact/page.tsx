// src/app/contact/page.tsx
"use client";
import { Mail, Github, Linkedin, Copy } from "lucide-react";
import { useState } from "react";
import  GlassCard from "@/components/GlassCard";

export default function ContactPage() {
  const email = "gcurtis1092@gmail.com";
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">Get in touch</h1>
          <p className="text-slate-600 dark:text-slate-300">
            I’m open to chatting about infrastructure, internal tools, and software roles.
          </p>
        </div>

        {/* GLASS PANEL */}
        <div className="glass p-6 space-y-6 shadow-sm">
          {/* Email row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <a className="underline" href={`mailto:${email}`}>{email}</a>
            </div>
            <button className="btn-glass" onClick={async () => {
              await navigator.clipboard.writeText(email);
              setCopied(true); setTimeout(() => setCopied(false), 1200);
            }}>
              <Copy className="h-4 w-4 mr-2 inline" />
              <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Social cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a className="glass px-4 py-3 flex items-center justify-between hover:shadow-md transition"
               href="https://github.com/garrettcurtis92" target="_blank" rel="noreferrer">
              <span className="flex items-center gap-3"><Github className="h-5 w-5" />
                <span><div className="font-medium">GitHub</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">@garrettcurtis92</div></span>
              </span><span aria-hidden>↗</span>
            </a>

            <a className="glass px-4 py-3 flex items-center justify-between hover:shadow-md transition"
               href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              <span className="flex items-center gap-3"><Linkedin className="h-5 w-5" />
                <span><div className="font-medium">LinkedIn</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Let’s connect</div></span>
              </span><span aria-hidden>↗</span>
            </a>
          </div>

          {/* Form */}
          
          <form className="space-y-3" onSubmit={(e)=>e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input-glass" placeholder="Your name" />
              <input className="input-glass" placeholder="Your email" type="email" />
            </div>
            <textarea rows={4} className="input-glass" placeholder="Message…" />
            <button className="btn-glass">Send (disabled)</button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This button is a demo. Use the email link above to reach me directly.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
