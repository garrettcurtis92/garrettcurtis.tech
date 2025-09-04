# Garrett Curtis — Portfolio (Next.js + Tailwind)

A clean, modern portfolio with pages for **Home**, **Projects**, **About**, and **Contact**.
Ships with reusable components and a small data file for your featured projects.

## ✅ Features
- Next.js App Router + TypeScript
- Tailwind CSS
- Reusable components: `Nav`, `Footer`, `ProjectCard`
- Simple project data in `src/lib/projects.ts`
- Ready for Vercel

## 🧰 Getting Started
```bash
npm i
npm run dev
# open http://localhost:3000
```

## 🔧 Tech Stack
- Next.js 14, React 18, TypeScript
- TailwindCSS 3, PostCSS, Autoprefixer

## 🚀 Deploy (Vercel)
1. Push this repo to GitHub (public or private)
2. Go to https://vercel.com → `New Project`
3. Import your repo, accept defaults → Deploy
4. Add a custom domain later if you want

## ✍️ Customize
- Update site text in `src/app/page.tsx` and others
- Add/edit project entries in `src/lib/projects.ts`
- Replace favicon in `public/` (optional)

## 🗂 Project Structure
```
src/
  app/
    (routes)...
  components/
    Nav.tsx, Footer.tsx, ProjectCard.tsx
  lib/
    projects.ts
public/
  (static assets)
tailwind.config.js
postcss.config.js
next.config.mjs
package.json
```

---

Built by Kevin (ChatGPT) with ❤️ for Garrett.
# garrettcurtis.tech
