
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Phone,
  Sparkles,
  Check,
} from "lucide-react";

import { supabase } from "@/lib/supabase-client";
import type { ProjectDetails } from "./CreateProject";

interface CreateMessageProps {
  project: ProjectDetails;
  onBack: () => void;
}

interface ReminderDetails {
  time: string;
  phone: string;
  message: string;
}

export default function CreateMessage({
  project,
  onBack,
}: CreateMessageProps) {
  const router = useRouter();

  const [reminder, setReminder] = useState<ReminderDetails>({
    time: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const scene = useRef<HTMLDivElement>(null);
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);
  const centerIcon = useRef<HTMLDivElement>(null);

  // Animated scene
  useEffect(() => {
    const ctx = gsap.context(() => {
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

    return () => ctx.revert();
  }, []);

  function updateReminder(
    field: keyof ReminderDetails,
    value: string
  ) {
    setReminder((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Combine both stages and save the project
  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (
      !reminder.time ||
      !reminder.phone.trim() ||
      !reminder.message.trim()
    ) {
      setError("Please complete all reminder information.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Please sign in to create your reminder.");
      }

      const { error: insertError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: project.name.trim(),
          description: project.description.trim(),
          schedule_time: reminder.time,
          phone_number: reminder.phone.trim(),
          message: reminder.message.trim(),
          last_sent_at: new Date()
        });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your reminder. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex h-[100dvh] max-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050816] text-white">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-500/[0.12] blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-sky-500/[0.1] blur-[130px]" />
      </div>

      <section className="relative z-10 flex h-full min-h-0 w-full items-center justify-center">

        <div className="flex h-full min-h-0 w-full max-h-none max-w-none flex-col overflow-hidden border border-white/[0.08] bg-[#0b1020]/95 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:flex-row">

          {/* LEFT: REMINDER FORM */}
          <div className="flex min-h-0 w-full flex-1 flex-col justify-center overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [@media(max-height:700px)]:justify-start sm:px-10 sm:py-8 lg:w-1/2 lg:px-14">

            <div className="mx-auto mb-8 w-full max-w-xl">

              <div className="mb-6 flex items-center justify-between sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
                    <Bell size={19} />
                  </div>

                  <span className="text-lg font-bold tracking-tight">
                    Easeway
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onBack}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-blue-300"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
                  Step 02 / 02
                </span>

                <span className="text-xs text-zinc-500">
                  Reminder configuration
                </span>
              </div>

              <div className="flex gap-2">
                <div className="h-1 flex-1 rounded-full bg-blue-400" />
                <div className="h-1 flex-1 rounded-full bg-blue-400" />
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:mt-7 sm:text-4xl">
                Set your reminder.
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                Configure the time, phone number and message
                for your new reminder.
              </p>
            </div>

            {/* Project preview */}
            <div className="mx-auto mb-4 flex w-full max-w-xl items-center gap-3 rounded-xl border border-blue-400/15 bg-blue-400/[0.045] p-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                <CheckCircle2 size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-blue-300">
                  {project.name}
                </p>
                <p className="mt-1 truncate text-[10px] text-zinc-500">
                  Project information completed
                </p>
              </div>

              <Check size={16} className="ml-auto shrink-0 text-blue-400" />
            </div>

            <form
              onSubmit={handleCreate}
              className="mx-auto flex w-full max-w-xl flex-col gap-4 sm:gap-5"
            >

              {/* Time */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-300">
                  Reminder time
                </label>

                <div className="group relative">
                  <Clock3
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400"
                  />

                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) =>
                      updateReminder("time", e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 [color-scheme:dark] hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-300">
                  Phone number
                </label>

                <div className="group relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400"
                  />

                  <input
                    type="tel"
                    value={reminder.phone}
                    onChange={(e) =>
                      updateReminder("phone", e.target.value)
                    }
                    placeholder="+233 XX XXX XXXX"
                    maxLength={20}
                    required
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-300">
                  Reminder message
                </label>

                <div className="relative">
                  <MessageSquare
                    size={17}
                    className="absolute left-4 top-4 text-zinc-500 transition-colors"
                  />

                  <textarea
                    value={reminder.message}
                    onChange={(e) =>
                      updateReminder("message", e.target.value)
                    }
                    placeholder="What would you like to be reminded about?"
                    rows={3}
                    maxLength={1000}
                    required
                    className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-[0_10px_35px_rgba(37,99,235,0.3)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating reminder..." : "Create reminder"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mx-auto mt-5 w-full max-w-xl text-center text-[10px] tracking-[0.18em] text-zinc-600 sm:mt-8">
              ONE MORE STEP TO A MORE ORGANIZED YOU.
            </p>
          </div>

          {/* RIGHT: ANIMATED SCENE */}
          <div
            ref={scene}
            className="relative hidden w-1/2 items-center justify-center overflow-hidden border-l border-white/[0.06] bg-[#080d1b] lg:flex"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.12] blur-[110px]" />
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

            {/* Center */}
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
                A simple reminder today can make tomorrow
                a little easier. Let Easeway keep you on track.
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

      {/* SUCCESS */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-blue-400/20 bg-[#0b1020] p-8 text-center shadow-[0_20px_100px_rgba(0,0,0,0.6)]">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/25 bg-blue-400/10 text-blue-300 shadow-[0_0_35px_rgba(37,99,235,0.2)]">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-xl font-bold text-white">
              Reminder created!
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Your project and reminder details have been
              successfully saved.
            </p>

            <button
              type="button"
              onClick={() => router.push("/home")}
              className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-500"
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
