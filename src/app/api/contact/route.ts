import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
  token: z.string().min(1),          // Turnstile token
  bait: z.string().optional().default(""), // honeypot
});

async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY!;
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) })
  });
  const data = await r.json();
  return !!data.success;
}

// (Optional) Tiny per-IP cooldown (replace with Redis for production)
const recent = new Map<string, number>();
const COOLDOWN_MS = 60_000; // 1 min

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { name, email, message, token, bait } = BodySchema.parse(json);

    // Honeypot
    if (bait) return NextResponse.json({ ok: true }, { status: 200 });

    // Cooldown (swap with Redis later)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    if (ip) {
      const last = recent.get(ip) ?? 0;
      if (Date.now() - last < COOLDOWN_MS) {
        return NextResponse.json({ error: "Slow down." }, { status: 429 });
      }
    }

    // Turnstile check
    const ok = await verifyTurnstile(token, ip);
    if (!ok) return NextResponse.json({ error: "Captcha failed" }, { status: 400 });

    // Send email
    const to = process.env.CONTACT_TO!;
    const from = process.env.CONTACT_FROM!;
    await resend.emails.send({
      from,
      to,
      subject: `Portfolio message from ${name}`,
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`
    });

    if (ip) recent.set(ip, Date.now());
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Zod errors get here too
    return NextResponse.json({ error: "Invalid input or server error" }, { status: 400 });
  }
}
