
import type { Project } from "@/types/project";

interface ProjectExistProps {
  projects: Project[];
}

export default function ProjectExist({
  projects,
}: ProjectExistProps) {
  return (
    <section className="w-full px-1.5 md:px-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {projects.map((project) => (
          <article
            key={project.id}
            className="glass-panel rounded-2xl p-5 text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300/35"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold">
                {project.name}
              </h2>

              <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs capitalize">
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {project.description}
              </p>
            )}

            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <p>
                <span className="text-zinc-300">
                  Scheduled:
                </span>{" "}
                {new Date(project.schedule_time).toLocaleString()}
              </p>

              <p>
                <span className="text-zinc-300">
                  Phone:
                </span>{" "}
                {project.phone_number}
              </p>
            </div>
          </article>
        ))}

      </div>
    </section>
  );
}