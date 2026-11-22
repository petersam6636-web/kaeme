"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Bell, FileText } from "lucide-react";

import CreateMessage from "./CreateMessage";

export interface ProjectDetails {
  name: string;
  description: string;
}

export default function CreateProject() {
  const [project, setProject] = useState<ProjectDetails>({
    name: "",
    description: "",
  });
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [error, setError] = useState("");

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!project.name.trim() || !project.description.trim()) {
      setError("Please enter a project name and description.");
      return;
    }

    setShowReminderForm(true);
  }

  if (showReminderForm) {
    return (
      <CreateMessage
        project={project}
        onBack={() => setShowReminderForm(false)}
      />
    );
  }

  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050b08] px-4 py-10 text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-emerald-500/[0.09] blur-[130px]" />
        <div className="absolute -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-green-500/[0.08] blur-[140px]" />
      </div>

      <section className="relative z-10 w-full max-w-xl rounded-3xl border border-white/[0.08] bg-[#08120d]/90 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <Bell size={19} />
          </div>
          <span className="text-lg font-bold tracking-tight">Easeway</span>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Step 1 of 2
          </span>
          <span className="text-xs text-zinc-500">Project information</span>
        </div>

        <div className="mt-4 flex gap-2" aria-label="Step 1 of 2">
          <div className="h-1 flex-1 rounded-full bg-emerald-400" />
          <div className="h-1 flex-1 rounded-full bg-white/10" />
        </div>

        <h1 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
          Create your project.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Give your reminder a name and tell us what you want to remember.
        </p>

        <form onSubmit={handleContinue} className="mt-8 flex flex-col gap-5">
          <div>
            <label
              htmlFor="project-name"
              className="mb-2 block text-xs font-semibold text-zinc-300"
            >
              Project name
            </label>
            <div className="group relative">
              <FileText
                size={17}
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-400"
              />
              <input
                id="project-name"
                type="text"
                value={project.name}
                onChange={(event) =>
                  setProject((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Weekly meeting"
                maxLength={100}
                required
                className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.06]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-2 block text-xs font-semibold text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={project.description}
              onChange={(event) =>
                setProject((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="What is this reminder about?"
              rows={4}
              maxLength={1000}
              required
              className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 text-sm leading-6 text-white outline-none transition-all placeholder:text-zinc-600 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.06]"
            />
            <p className="mt-2 text-right text-[10px] text-zinc-600">
              {project.description.length}/1000
            </p>
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-[#041009] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            Continue
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </form>
      </section>
    </main>
  );
}
