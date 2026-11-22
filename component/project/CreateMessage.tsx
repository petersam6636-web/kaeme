
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MessageSquare,
  Phone,
  Sparkles,
  Check,
} from "lucide-react";

import { supabase } from "@/lib/supabase-client";
import type { ProjectDetails } from "./CreateProject";
import type { ProjectInsert } from "@/types/project";

interface CreateMessageProps {
  project: ProjectDetails;
  onBack: () => void;
}

interface ReminderDetails {
  time: string;
  phone: string;
  message: string;
}

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [daysOpen, setDaysOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const scene = useRef<HTMLDivElement>(null);
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);
  const centerIcon = useRef<HTMLDivElement>(null);
  const saving = useRef(false);
  const savedProjectId = useRef<string | null>(null);

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

  function toggleDay(day: string) {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((selectedDay) => selectedDay !== day)
        : [...previous, day]
    );
  }

  function handleCreate(e: FormEvent<HTMLFormElement>) {
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

    setShowConfirmation(true);
  }

  async function confirmCreate() {
    if (saving.current) return;

    saving.current = true;
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Please sign in to create your reminder.");
      }

      const newProject: ProjectInsert = {
        user_id: user.id,
        name: project.name.trim(),
        description: project.description.trim(),
        schedule_time: reminder.time,
        phone_number: reminder.phone.trim(),
        message: reminder.message.trim(),
      };

      if (!savedProjectId.current) {
        const { data: createdProject, error: insertError } = await supabase
          .from("projects")
          .insert(newProject)
          .select("id")
          .single();

        if (insertError) {
          throw insertError;
        }

        savedProjectId.current = createdProject.id;
      }

      if (selectedDays.length > 0) {
        const { error: daysError } = await supabase.from("days").insert(
          selectedDays.map((day) => ({
            project_id: savedProjectId.current,
            day,
          }))
        );

        if (daysError) {
          throw new Error(
            `Your project was saved, but its selected days could not be saved: ${daysError.message}`
          );
        }
      }

      setShowConfirmation(false);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        setError(err.message);
      } else {
        setError("Unable to create your reminder. Please try again.");
      }
    } finally {
      saving.current = false;
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

      <section className="relative z-10 flex h-full min-h-0 w-full items-center justify-center p-4">

        <div className="flex h-full min-h-0 w-full max-h-[100dvh] max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b1020]/95 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:max-h-[min(740px,calc(100dvh-40px))] lg:flex-row lg:rounded-[28px]">

          {/* LEFT: REMINDER FORM */}
          <div className="flex min-h-0 w-full flex-1 flex-col justify-center overflow-y-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [@media(max-height:760px)]:justify-start sm:px-8 sm:py-5 lg:w-1/2 lg:px-10 lg:py-4">

            <div className="mx-auto mb-3 w-full max-w-xl ">

              <div className="mb-4 flex items-center justify-between sm:mb-5">
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

              <div className="mb-3 flex items-center gap-2">
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

              <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Set your reminder.
              </h1>

              <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-400 sm:text-sm">
                Add the phone number, message, reminder time, and any days you
                want it to repeat.
              </p>
            </div>

            {/* Project preview */}

            <form
              onSubmit={handleCreate}
              className="mx-auto flex w-full max-w-xl flex-col gap-3"
            >

              {/* Phone */}
              <div>
                <label
                  htmlFor="reminder-phone"
                  className="mb-2 block text-xs font-semibold text-zinc-300"
                >
                  Phone number
                </label>

                <div className="group relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400"
                  />

                  <input
                    id="reminder-phone"
                    type="tel"
                    value={reminder.phone}
                    onChange={(e) =>
                      updateReminder("phone", e.target.value)
                    }
                    placeholder="+233 XX XXX XXXX"
                    maxLength={20}
                    required
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="reminder-message"
                  className="mb-2 block text-xs font-semibold text-zinc-300"
                >
                  Chat message
                </label>

                <div className="relative">
                  <MessageSquare
                    size={17}
                    className="absolute left-4 top-4 text-zinc-500 transition-colors"
                  />

                  <textarea
                    id="reminder-message"
                    value={reminder.message}
                    onChange={(e) =>
                      updateReminder("message", e.target.value)
                    }
                    placeholder="What would you like to be reminded about?"
                    rows={4}
                    maxLength={1000}
                    required
                    className="min-h-28 w-full resize-y rounded-xl border border-white/[0.09] bg-white/[0.035] py-3 pl-11 pr-4 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
                  />
                </div>
              </div>

              {/* Reminder time */}
              <div>
                <label
                  htmlFor="reminder-time"
                  className="mb-2 block text-xs font-semibold text-zinc-300"
                >
                  Reminder time
                </label>

                <div className="group relative">
                  <Clock3
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400"
                  />

                  <input
                    id="reminder-time"
                    type="time"
                    value={reminder.time}
                    onChange={(e) =>
                      updateReminder("time", e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 [color-scheme:dark] hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
                  />
                </div>
              </div>

              {/* Custom days */}
              <div className="relative">
                <span className="mb-2 block text-xs font-semibold text-zinc-300">
                  Custom days
                </span>
                <button
                  type="button"
                  aria-expanded={daysOpen}
                  aria-controls="custom-days-options"
                  onClick={() => setDaysOpen((open) => !open)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-left text-sm outline-none transition-all hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <CalendarDays
                      size={17}
                      className="shrink-0 text-blue-300"
                    />
                    <span
                      className={
                        selectedDays.length > 0
                          ? "truncate text-white"
                          : "truncate text-zinc-500"
                      }
                    >
                      {selectedDays.length > 0
                        ? selectedDays.join(", ")
                        : "Choose days (optional)"}
                    </span>
                  </span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-zinc-500 transition-transform ${daysOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {daysOpen && (
                  <div
                    id="custom-days-options"
                    className="absolute inset-x-0 top-full z-30 mt-2 rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-[0_16px_50px_rgba(0,0,0,0.55)]"
                  >
                    <div className="mb-2 flex items-center justify-between px-1">
                      <p className="text-xs font-semibold text-zinc-200">
                        Repeat on
                      </p>
                      <span className="text-[10px] text-zinc-500">
                        Select any days
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                      {WEEKDAYS.map((day) => {
                        const checked = selectedDays.includes(day);

                        return (
                          <label
                            key={day}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                              checked
                                ? "border-blue-400/30 bg-blue-400/10 text-blue-200"
                                : "border-transparent text-zinc-300 hover:bg-white/[0.05]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDay(day)}
                              className="h-4 w-4 accent-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                            />
                            {day}
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-2 px-1 text-[10px] leading-4 text-zinc-500">
                      Leave all days unchecked for a one-time reminder.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_10px_35px_rgba(37,99,235,0.3)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
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

            <p className="mx-auto mt-3 w-full max-w-xl text-center text-[10px] tracking-[0.18em] text-zinc-600 sm:mt-4">
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

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-reminder-title"
            aria-describedby="confirm-reminder-description"
            className="max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-blue-400/20 bg-[#0b1020] p-6 shadow-[0_20px_100px_rgba(0,0,0,0.6)] sm:p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
              <CheckCircle2 size={24} />
            </div>

            <h2
              id="confirm-reminder-title"
              className="text-xl font-bold text-white"
            >
              Confirm your reminder
            </h2>
            <p
              id="confirm-reminder-description"
              className="mt-3 text-sm leading-6 text-zinc-400"
            >
              Review these details before saving your project and reminder.
            </p>


            {error && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                disabled={loading || Boolean(savedProjectId.current)}
                onClick={() => {
                  setShowConfirmation(false);
                  setError("");
                }}
                className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/[0.09] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savedProjectId.current ? "Project saved" : "Review details"}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={confirmCreate}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : savedProjectId.current
                    ? "Retry day save"
                    : "Confirm and save"}
                {!loading && <Check size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => router.push("/")}
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
