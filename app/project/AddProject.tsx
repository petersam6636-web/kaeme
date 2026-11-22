
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileText,
  MessageSquare,
  Phone,
  Sparkles,
  Zap,
} from "lucide-react";

import { supabase } from "@/lib/supabase-client";

type ProjectDetails = {
  name: string;
  description: string;
};

type ReminderDetails = {
  schedule_time: string;
  phone_number: string;
  message: string;
};

export default function AddPage(){
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [project, setProject] = useState<ProjectDetails>({
    name: "",
    description: "",
  });

  const [reminder, setReminder] = useState<ReminderDetails>({
    schedule_time: "",
    phone_number: "",
    message: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sceneRef = useRef<HTMLDivElement>(null);
  const orbOne = useRef<HTMLDivElement>(null);
  const orbTwo = useRef<HTMLDivElement>(null);
  const orbThree = useRef<HTMLDivElement>(null);
  const mainIcon = useRef<HTMLDivElement>(null);

  // GSAP animated scene
  useEffect(() => {
    const ctx = gsap.context(() => {
      const orbs = [
        { ref: orbOne.current, y: -22, x: 12, duration: 4 },
        { ref: orbTwo.current, y: 25, x: -15, duration: 5 },
        { ref: orbThree.current, y: -16, x: 10, duration: 3.5 },
      ];

      orbs.forEach((orb) => {
        if (!orb.ref) return;

        gsap.to(orb.ref, {
          y: orb.y,
          x: orb.x,
          duration: orb.duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      if (mainIcon.current) {
        gsap.to(mainIcon.current, {
          y: -10,
          rotate: 3,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (sceneRef.current) {
        gsap.fromTo(
          sceneRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
          }
        );
      }
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  // Change project information
  function updateProject(
    field: keyof ProjectDetails,
    value: string
  ) {
    setProject((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Change reminder information
  function updateReminder(
    field: keyof ReminderDetails,
    value: string
  ) {
    setReminder((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // First step: validate and ask for confirmation
  function handleProjectContinue(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!project.name.trim()) {
      setError("Please enter a reminder name.");
      return;
    }

    if (!project.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    setShowConfirmation(true);
  }

  // Confirm first step and move to second step
  function confirmProjectDetails() {
    setShowConfirmation(false);
    setStep(2);
    setError("");
  }

  // Return to first step without losing information
  function handleBack() {
    setStep(1);
    setError("");
  }

  // Final submission: combine both steps and save
  async function handleCreateReminder(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (
      !reminder.schedule_time ||
      !reminder.phone_number.trim() ||
      !reminder.message.trim()
    ) {
      setError("Please complete all reminder details.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const { error: insertError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: project.name.trim(),
          description: project.description.trim(),
          schedule_time: reminder.schedule_time,
          phone_number: reminder.phone_number.trim(),
          message: reminder.message.trim(),
        });

      if (insertError) {
        throw insertError;
      }

      setShowSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050b08] text-white">

      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-emerald-500/[0.09] blur-[130px]" />
        <div className="absolute -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-green-500/[0.08] blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-900/[0.12] blur-[140px]" />
      </div>

      {/* Main split layout */}
      <section className="relative z-10 flex min-h-[100dvh] w-full items-stretch justify-center lg:items-center lg:px-5 lg:py-5">

        <div className="flex min-h-[100dvh] w-full max-w-7xl flex-col overflow-hidden border border-white/[0.08] bg-[#08120d]/90 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:min-h-[min(760px,calc(100dvh-40px))] lg:flex-row lg:rounded-[28px]">

          {/* LEFT: FORM SECTION */}
          <div className="relative flex w-full flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-12 lg:py-12">

            {/* Header */}
            <div className="mb-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  <Bell size={19} />
                </div>

                <span className="text-lg font-bold tracking-tight">
                  Easeway
                </span>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Step {step} of 2
                </span>

                <span className="text-xs text-zinc-500">
                  {step === 1
                    ? "Project information"
                    : "Reminder configuration"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4 flex gap-2">
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    step >= 1 ? "bg-emerald-400" : "bg-white/10"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    step >= 2 ? "bg-emerald-400" : "bg-white/10"
                  }`}
                />
              </div>

              <h1 className="mt-7 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {step === 1
                  ? "Create your project."
                  : "Set your reminder."}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
                {step === 1
                  ? "Give your reminder a name and tell us a little about what you want to remember."
                  : "Configure when your reminder should be scheduled and the message you want to receive."}
              </p>
            </div>

            {/* STEP ONE */}
            {step === 1 && (
              <form
                onSubmit={handleProjectContinue}
                className="flex flex-col gap-5"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-300">
                    Project name
                  </label>

                  <div className="group relative">
                    <FileText
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-400"
                    />

                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) =>
                        updateProject("name", e.target.value)
                      }
                      placeholder="e.g. Weekly meeting"
                      maxLength={100}
                      required
                      className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-white/20 focus:border-emerald-400/50 focus:bg-emerald-400/[0.035] focus:ring-4 focus:ring-emerald-400/[0.06]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-300">
                    Description
                  </label>

                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      updateProject("description", e.target.value)
                    }
                    placeholder="What is this reminder about?"
                    rows={4}
                    maxLength={1000}
                    required
                    className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-white/20 focus:border-emerald-400/50 focus:bg-emerald-400/[0.035] focus:ring-4 focus:ring-emerald-400/[0.06]"
                  />

                  <p className="mt-2 text-right text-[10px] text-zinc-600">
                    {project.description.length}/1000
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-[#041009] shadow-[0_8px_30px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_10px_35px_rgba(16,185,129,0.25)] active:translate-y-0"
                >
                  Continue
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>
            )}

            {/* STEP TWO */}
            {step === 2 && (
              <form
                onSubmit={handleCreateReminder}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-300">
                    Reminder time
                  </label>

                  <div className="group relative">
                    <Clock3
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-400"
                    />

                    <input
                      type="time"
                      value={reminder.schedule_time}
                      onChange={(e) =>
                        updateReminder("schedule_time", e.target.value)
                      }
                      required
                      className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 [color-scheme:dark] hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.06]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-300">
                    Phone number
                  </label>

                  <div className="group relative">
                    <Phone
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-400"
                    />

                    <input
                      type="tel"
                      value={reminder.phone_number}
                      onChange={(e) =>
                        updateReminder("phone_number", e.target.value)
                      }
                      placeholder="+233 XX XXX XXXX"
                      maxLength={20}
                      required
                      className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.06]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-300">
                    Reminder message
                  </label>

                  <div className="relative">
                    <textarea
                      value={reminder.message}
                      onChange={(e) =>
                        updateReminder("message", e.target.value)
                      }
                      placeholder="Write the message you want to receive..."
                      rows={3}
                      maxLength={1000}
                      required
                      className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/[0.06]"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-[#041009] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_10px_35px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create reminder"}
                    {!loading && <Check size={17} />}
                  </button>
                </div>
              </form>
            )}

            <p className="mt-8 text-center text-[10px] tracking-wide text-zinc-600">
              YOUR TIME MATTERS. LET EASEWAY HELP YOU REMEMBER.
            </p>
          </div>

          {/* RIGHT: ANIMATED VISUAL SECTION */}
          <div
            ref={sceneRef}
            className="relative hidden w-1/2 items-center justify-center overflow-hidden border-l border-white/[0.06] bg-[#07140d] lg:flex"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.09] blur-[110px]" />
              <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-green-400/[0.07] blur-[100px]" />
              <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-emerald-700/[0.12] blur-[100px]" />
            </div>

            {/* Dotted texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(110,231,183,0.5) 1px, transparent 1px)",
                backgroundSize: "25px 25px",
              }}
            />

            {/* Floating glass orbs */}
            <div
              ref={orbOne}
              className="absolute left-[15%] top-[17%] h-24 w-24 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] shadow-[inset_0_0_25px_rgba(52,211,153,0.12),0_0_50px_rgba(16,185,129,0.08)] backdrop-blur-xl"
            />

            <div
              ref={orbTwo}
              className="absolute bottom-[17%] right-[12%] h-36 w-36 rounded-full border border-emerald-300/20 bg-emerald-400/[0.06] shadow-[inset_0_0_35px_rgba(52,211,153,0.14),0_0_70px_rgba(16,185,129,0.1)] backdrop-blur-xl"
            />

            <div
              ref={orbThree}
              className="absolute right-[15%] top-[23%] h-12 w-12 rounded-full border border-emerald-200/30 bg-emerald-200/10 shadow-[0_0_30px_rgba(52,211,153,0.2)]"
            />

            {/* Center composition */}
            <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-8 text-center">

              {/* Central icon */}
              <div
                ref={mainIcon}
                className="relative mb-10 flex h-40 w-40 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border border-emerald-300/10" />
                <div className="absolute inset-3 rounded-full border border-emerald-300/15" />
                <div className="absolute inset-7 rounded-full border border-emerald-300/20 bg-emerald-400/[0.04] shadow-[0_0_70px_rgba(16,185,129,0.12)]" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-emerald-300/30 bg-gradient-to-br from-emerald-300/20 to-emerald-900/40 text-emerald-300 shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-2xl">
                  <CalendarClock size={37} strokeWidth={1.3} />
                </div>

                <div className="absolute right-1 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-[#10251a] text-emerald-300 shadow-lg">
                  <Sparkles size={16} />
                </div>

                <div className="absolute bottom-3 left-0 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-[#10251a] text-emerald-300 shadow-lg">
                  <CheckCircle2 size={17} />
                </div>
              </div>

              <span className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
                <Zap size={13} />
                Stay ahead of time
              </span>

              <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white">
                Make every
                <span className="block text-emerald-300">
                  moment count.
                </span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
                Create meaningful reminders, organize your time and
                let Easeway keep you informed when it matters most.
              </p>

              {/* Decorative bottom feature */}
              <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-4 shadow-2xl backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <MessageSquare size={18} />
                </div>

                <div className="text-left">
                  <p className="text-xs font-semibold text-white">
                    Your reminders, organized.
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Never miss what matters.
                  </p>
                </div>

                <div className="ml-4 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </div>
            </div>

            {/* Bottom caption */}
            <div className="absolute bottom-7 left-0 right-0 text-center">
              <p className="text-[9px] tracking-[0.3em] text-zinc-600">
                SIMPLE. SMART. EFFORTLESS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP ONE CONFIRMATION MODAL */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-emerald-400/15 bg-[#0b1710] p-7 shadow-[0_20px_100px_rgba(0,0,0,0.6)]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <CircleHelp size={23} />
            </div>

            <h3 className="text-xl font-bold text-white">
              Continue with this project?
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Your project information will be kept temporarily while
              you configure the reminder. Nothing will be saved to
              your database yet.
            </p>

            <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-emerald-300">
                {project.name}
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-400">
                {project.description}
              </p>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/[0.09] hover:text-white"
              >
                Review
              </button>

              <button
                type="button"
                onClick={confirmProjectDetails}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-[#041009] transition-all hover:bg-emerald-400"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-emerald-400/20 bg-[#0b1710] p-8 text-center shadow-[0_20px_100px_rgba(0,0,0,0.6)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-xl font-bold text-white">
              Reminder created!
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Your reminder has been successfully saved to your
              projects.
            </p>

            <button
              type="button"
              onClick={() => {
                router.push("/home");
              }}
              className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-[#041009] transition-all hover:bg-emerald-400"
            >
              Go to dashboard
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
