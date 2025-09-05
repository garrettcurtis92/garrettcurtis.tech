import Link from "next/link";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import Image from "next/image"
import BackgroundBlobs from "@/components/BackgroundBlobs";
import SkillGalaxy from "@/components/SkillGalaxy";

export default function Page() {
  return (
    <div className="relative space-y-10 overflow-visible pb-8 md:pb-32">
      <BackgroundBlobs variant="home" />
      
      {/* Full-page 3D background */}
      <SkillGalaxy />

      {/* Your sections go here */}
<div className="space-y-10 relative z-10">
      <section className="text-center space-y-4">
        {/* Profile image */}
        <div className="flex justify-center relative z-20">
          <Link
            href="https://youtu.be/Aq5WXmQQooo?si=he-LD_B8LM-beBZp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-transform duration-200 hover:scale-105 active:scale-95 relative z-20"
          >
            <Image
              src="/me.jpeg"
              alt="Garrett Curtis"
              width={160}
              height={160}
              className="rounded-full object-cover border shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            />
          </Link>
        </div>
      </section>

      <div className="space-y-10">
        <section className="text-center space-y-4 overflow-visible relative z-20">
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

        <section className="space-y-6 overflow-visible px-4 py-8">
</section>

      </div>
    </div>
    </div>
  );
}
