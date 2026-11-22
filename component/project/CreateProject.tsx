"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
} from "lucide-react";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");

  const scene = useRef<HTMLDivElement>(null);
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);
  const centerIcon = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      [
        { element: orb1.current, y: -22, x: 12, duration: 4 },
        { element: orb2.current, y: 22, x: -12, duration: 5 },
        { element: orb3.current, y: -15, x: 10, duration: 3.5 },
      ].forEach(({ element, y, x, duration }) => {
        if (!element) return;

        gsap.to(element, {
          y,
          x,
          duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      if (centerIcon.current) {
        gsap.to(centerIcon.current, {
          y: -10,
          rotate: -4,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (scene.current) {
        gsap.fromTo(
          scene.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }
    });

    return () => context.revert();
  }, []);

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!project.name.trim() || !project.description.trim()) {
      setError("Please enter a project name and description.");
      return;
    }

    setShowConfirmation(true);
  }

  function confirmProjectDetails() {
    setShowConfirmation(false);
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
    <main className="relative flex h-[100dvh] max-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-500/[0.12] blur-[130px]" />
        <div className="absolute -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-sky-500/[0.1] blur-[140px]" />
      </div>

      <section className="relative z-10 flex h-full min-h-0 w-full items-center justify-center p-4">
        <div className="flex h-full min-h-0 w-full max-w-6xl max-h-[100dvh] flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-transparent shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:max-h-[min(740px,calc(100dvh-40px))] lg:flex-row lg:rounded-[28px] lg:bg-[#0b1020]/90">
          <div className="relative flex min-h-0 w-full flex-1 flex-col justify-center overflow-y-auto bg-[#0b1020]/90 px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [@media(max-height:760px)]:justify-start sm:px-8 sm:py-6 lg:w-1/2 lg:bg-transparent lg:px-10 lg:py-5">
            <div className="mx-auto mb-3 w-full max-w-xl ">
              <div className="mb-3 flex items-center gap-3 ">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
                  <Bell size={19} />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Kaeme
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
                  Step 01 / 02
                </span>
                <span className="text-xs text-zinc-500">
                  Project information
                </span>
              </div>

              <div className="flex gap-2" aria-label="Step 1 of 2">
                <div className="h-1 flex-1 rounded-full bg-blue-400" />
                <div className="h-1 flex-1 rounded-full bg-white/10" />
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Create your project.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                Give your reminder a name and tell us what you want to remember.
              </p>
            </div>

            <form
              onSubmit={handleContinue}
              className="mx-auto flex w-full max-w-xl flex-col gap-4"
            >
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400"
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
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
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
                  rows={3}
                  maxLength={1000}
                  required
                  className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-zinc-600 hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
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
                className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_10px_35px_rgba(37,99,235,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                Continue
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="mx-auto mt-2.5 w-full max-w-xl text-center text-[10px] tracking-[0.18em] text-zinc-600 sm:mt-5">
              YOUR TIME MATTERS. LET EASEWAY HELP YOU REMEMBER.
            </p>
          </div>

          <div
            ref={scene}
            className="relative hidden w-1/2 items-center justify-center overflow-hidden border-l border-white/[0.06] bg-[#080d1b] lg:flex"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.12] blur-[110px]" />
              <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-sky-400/[0.08] blur-[100px]" />
              <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-indigo-700/[0.12] blur-[100px]" />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(147,197,253,0.35)_1px,transparent_1px)] bg-[size:25px_25px] opacity-[0.17]" />

            <div
              ref={orb1}
              className="absolute left-[15%] top-[17%] h-24 w-24 rounded-full border border-blue-300/20 bg-blue-300/[0.07] shadow-[inset_0_0_25px_rgba(96,165,250,0.12),0_0_50px_rgba(37,99,235,0.08)] backdrop-blur-xl"
            />
            <div
              ref={orb2}
              className="absolute bottom-[17%] right-[12%] h-36 w-36 rounded-full border border-blue-300/20 bg-blue-400/[0.06] shadow-[inset_0_0_35px_rgba(96,165,250,0.14),0_0_70px_rgba(37,99,235,0.1)] backdrop-blur-xl"
            />
            <div
              ref={orb3}
              className="absolute right-[15%] top-[23%] h-12 w-12 rounded-full border border-sky-200/30 bg-sky-200/10 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
            />

            <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-8 text-center">
              <div
                ref={centerIcon}
                className="relative mb-10 flex h-40 w-40 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border border-blue-300/10" />
                <div className="absolute inset-3 rounded-full border border-blue-300/15" />
                <div className="absolute inset-7 rounded-full border border-blue-300/20 bg-blue-400/[0.04] shadow-[0_0_70px_rgba(37,99,235,0.12)]" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-blue-300/30 bg-gradient-to-br from-blue-300/20 to-blue-900/40 text-blue-300 shadow-[0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
                  <CalendarClock size={38} strokeWidth={1.3} />
                </div>
                <div className="absolute right-1 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-300/20 bg-[#111c33] text-blue-300 shadow-lg">
                  <Sparkles size={16} />
                </div>
                <div className="absolute bottom-3 left-0 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-300/20 bg-[#111c33] text-blue-300 shadow-lg">
                  <CheckCircle2 size={17} />
                </div>
              </div>

              <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300/80">
                Never miss what matters
              </span>
              <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white">
                Your moments,
                <span className="block text-blue-300">
                  always remembered.
                </span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
                A simple reminder today can make tomorrow a little easier. Let
                Easeway keep you on track.
              </p>

              <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-4 shadow-2xl backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                  <MessageSquare size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white">
                    A reminder that matters.
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Your time. Your priorities.
                  </p>
                </div>
                <div className="ml-4 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
              </div>
            </div>

            <div className="absolute bottom-7 text-center text-[9px] tracking-[0.3em] text-zinc-600">
              SIMPLE. SMART. EFFORTLESS.
            </div>
          </div>
        </div>
      </section>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-project-title"
            aria-describedby="confirm-project-description"
            className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-blue-400/20 bg-[#0b1020] p-6 shadow-[0_20px_100px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
              <CheckCircle2 size={24} />
            </div>

            <h2
              id="confirm-project-title"
              className="text-xl font-bold text-white"
            >
              Confirm project details
            </h2>
            <p
              id="confirm-project-description"
              className="mt-3 text-sm leading-6 text-zinc-400"
            >
              Review your project information before setting up the reminder.
            </p>

            <div className="mt-5 space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
              <div>
                <p className="text-xs text-zinc-500">Project name</p>
                <p className="mt-1 break-words text-sm font-medium text-white">
                  {project.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Description</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-300">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/[0.09] hover:text-white"
              >
                Review details
              </button>
              <button
                type="button"
                onClick={confirmProjectDetails}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-500"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
