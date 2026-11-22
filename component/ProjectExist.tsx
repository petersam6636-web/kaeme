
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
            className="rounded-2xl border border-black/10 bg-white p-5 text-black dark:border-white/10 dark:bg-black dark:text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold">
                {project.name}
              </h2>

              <span className="rounded-full border border-black/10 px-2.5 py-1 text-xs capitalize dark:border-white/15">
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="mt-3 text-sm leading-6 text-black/55 dark:text-white/55">
                {project.description}
              </p>
            )}

            <div className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm dark:border-white/10">
              <p>
                <span className="text-black/50 dark:text-white/50">
                  Scheduled:
                </span>{" "}
                {new Date(project.schedule_time).toLocaleString()}
              </p>

              <p>
                <span className="text-black/50 dark:text-white/50">
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