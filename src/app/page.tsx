import Link from "next/link";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import Image from "next/image"
import BackgroundBlobs from "@/components/BackgroundBlobs";

export default function Page() {
  return (
    <div className="relative min-h-screen space-y-10">
      <BackgroundBlobs variant="home" />

      {/* Your sections go here */}
<div className="space-y-10">
      <section className="text-center space-y-4">
        {/* Profile image */}
        <div className="flex justify-center">
          <Image
            src="/me.jpeg"
            alt="Garrett Curtis"
            width={160}
            height={160}
            className="rounded-full object-cover border shadow-md"
          />
        </div>
      </section>

      <div className="space-y-10">
        <section className="text-center space-y-4">
          <p className="text-sm tracking-wider uppercase">Hello, I’m</p>
          <h1 className="text-4xl md:text-6xl font-bold">Garrett Curtis</h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300">
  Corporate Infrastructure Specialist → Software Engineer
</p>

          <p className="max-w-2xl mx-auto">
           
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/projects" 
            className=" outline px-5 py-2 rounded-2xl border transform transition duration-150 ease-out hover:-translate-y-1 active:translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              View Projects</Link>
            <Link href="/contact" className=" outline px-5 py-2 rounded-2xl border transform transition duration-150 ease-out hover:-translate-y-1 active:translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Contact</Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>

          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.slice(0, 2).map((p) => (
              <ProjectCard key={p.slug} project={p as any} />
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
