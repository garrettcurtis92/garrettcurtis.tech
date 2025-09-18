export const projects = [
  {
    slug: "thehouse",
    title: "The House Ministry RSVP & SMS Platform",
    summary:
      "Event RSVP and engagement platform with Twilio-powered SMS updates, donor funnel, and Postgres persistence for attendee tracking.",
    tech: ["Next.js", "Tailwind", "Twilio", "PostgreSQL"],
    demo: "https://thehouseministry.life",
    repo: "https://github.com/garrettcurtis92/thehouse",
    tone: "purple",
    image: "/thehouseministry.jpg", // add screenshot when available
  },
  {
    slug: "workorders",
    title: "WorkOrders (C#/.NET Razor Pages)",
    summary:
      "CRUD-based internal tracker with add/edit/delete/filter. Next step: ASP.NET Identity login and role-based access.",
    tech: ["C#", ".NET", "Razor Pages", "EF Core"],
    demo: "", // optional: host or add a video link
    repo: "https://github.com/garrettcurtis92/WorkOrders",
    image: "/WorkOrders.jpg",
  },
  {
  slug: "czk-oktoberfest",
  title: "CZK Oktoberfest",
  summary:
    "A family event web app with live score tracking, interactive schedule, and admin controls.",
  tech: [
    "Next.js 15",
    "Tailwind CSS",
    "Drizzle ORM",
    "Vercel Postgres"
    
  ],
  demo: "https://czk-oktoberfest.vercel.app", // your deployed Vercel link
  repo: "https://github.com/garrettcurtis92/czk-oktoberfest",
  tone: "neutral",
  image: "/Oktoberfest.png"

}
  ,
  {
    slug: "staywise",
    title: "StayWise (Airbnb-style Clone)",
    summary:
      "Next.js + Tailwind app exploring maps, auth, and listings workflow. Focus on production-grade UI and DX.",
    tech: ["Next.js", "Tailwind", "PostgreSQL", "Prisma"],
    demo: "",
    repo: "https://github.com/garrettcurtis92",
    image: "/StayWise.png",
  },
  {
    slug: "liftos",
    title: "LiftOS (iOS Hypertrophy App)",
    summary:
      "Mobile-focused hypertrophy training tracker with progressive overload planning, workout history, and configurable routines.",
    tech: ["Swift", "SwiftUI", "CloudKit", "CoreData"],
    demo: "",
    repo: "https://github.com/garrettcurtis92/LiftOS",
    image: "/LiftOS.png",
    tone: "green",
  },

  {
  slug: "movie-search",
  title: "Movie Search",
  summary:
    "Search and explore films with instant results and details — a small API-integration app showcasing async data fetching and clean UI.",
  tech: ["JavaScript", "CSS", "HTML", "OMDb/TMDb API"],
  demo: "", // optional: add your deployed URL here
  repo: "https://github.com/garrettcurtis92/movie-search",
  image: "/movie-search.png", // optional: e.g. "/projects/movie-search.png"
  tone: "pink", // choose "purple" | "green" | "pink" | "neutral"
},

{
  slug: "rebecca-kelly-photography",
  title: "Rebecca Kelly Photography",
  summary:
    "A photography portfolio site designed to showcase high-quality images with elegant layouts and modern responsive design.",
  tech: ["JavaScript", "CSS", "HTML", "Image Optimization"],
  demo: "", // add deployed link if available
  repo: "https://github.com/garrettcurtis92/RebeccaKellyPhotography",
  image: "/RebeccaKelly.png", // add screenshot if you have one
  tone: "purple"
},
];
