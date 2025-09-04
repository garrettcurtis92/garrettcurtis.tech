import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import BackgroundBlobs from "@/components/BackgroundBlobs";

export default function Page() {
  return (
    <>
      <BackgroundBlobs variant="projects" />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-slate-600 dark:text-slate-300">
  Selected work that balances CRUD fundamentals, API integrations, UI polish, and automation.
</p>
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {projects.map((p) => (
              <ProjectCard key={p.slug} project={p as any} />
        ))}
      </div>
    </div>
    </>
  );
}
