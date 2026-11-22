
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/project";
import {
  Search,
  Plus,
  Clock3,
  Phone,
  MessageSquare,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Trash2,
  MoreVertical,
  Bell,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  X,
  LogOut,
  UserRound,
  Send,
} from "lucide-react";

interface ProjectWithDays extends Project {
  last_sent_at?: string | null;
}

interface ProjectExistProps {
  projects: ProjectWithDays[];

  user?: {
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  };

  onDelete?: (projectId: string) => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
}

export default function ProjectExist({
  projects,
  user,
  onDelete,
  onSignOut,
}: ProjectExistProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return projects;

    return projects.filter((project) =>
      [
        project.name,
        project.description,
        project.phone_number,
        project.message,
        project.status,
        ...(project.days ?? []).map((day) => day.days),
      ].some((value) => value?.toLowerCase().includes(query))
    );
  }, [projects, search]);

  const toggleDays = (id: string) => {
    setExpanded((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const formatTime = (value?: string | null) => {
    if (!value) return "Not scheduled";

    const date = new Date(
      value.includes("T") ? value : `1970-01-01T${value}`
    );

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "sent":
        return {
          label: "Sent",
          icon: CheckCircle2,
          style: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        };

      case "processing":
        return {
          label: "Processing",
          icon: LoaderCircle,
          style: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        };

      case "failed":
        return {
          label: "Failed",
          icon: AlertCircle,
          style: "bg-red-500/10 text-red-300 border-red-500/20",
        };

      default:
        return {
          label: "Pending",
          icon: Clock3,
          style: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
        };
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;

    try {
      setDeleting(true);
      await onDelete(id);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSignOut = async () => {
    if (!onSignOut) return;

    try {
      setSigningOut(true);
      await onSignOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
    }
  };

  const initials = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  const totalSent = projects.filter(
    (project) => project.status === "sent"
  ).length;

  const totalPending = projects.filter(
    (project) => project.status === "pending"
  ).length;

  return (
    <section className="min-h-[100dvh] w-full bg-[#050816] px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

      {/* HEADER */}
      <header className="mb-8 flex items-center justify-between gap-4">

        {/* SEARCH */}
        <div className="relative w-full max-w-md">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your reminders..."
            aria-label="Search reminders"
            className="w-full rounded-2xl border border-white/[0.08] bg-[#080d1b] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/[0.06]"
          />
        </div>

        {/* PROFILE */}
        <div className="relative shrink-0">

          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            className="flex size-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0b1020] transition hover:border-blue-400/50"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user?.name ? `${user.name}'s profile` : "Profile"}
                className="size-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="font-semibold text-blue-200">
                {initials}
              </span>
            )}
          </button>

          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-30 cursor-default"
              />

              <div className="absolute right-0 top-14 z-40 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">

                <div className="border-b border-white/10 p-4">
                  <p className="truncate text-sm font-semibold text-white">
                    {user?.name || "Your Account"}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {user?.email || "Authenticated user"}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    disabled={!onSignOut || signingOut}
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <LogOut size={17} />
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* PAGE TITLE */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Bell size={19} className="text-blue-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
              Reminder dashboard
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Reminders
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage and keep track of your scheduled reminders.
          </p>
        </div>

        <Link
          href="/project"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95 sm:self-center"
        >
          <Plus size={19} />
          Create Reminder
        </Link>
      </div>

      {/* OVERVIEW */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

        <div className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Total reminders</span>
            <Bell size={18} className="text-blue-300" />
          </div>

          <p className="mt-3 text-2xl font-bold tabular-nums">
            {projects.length}
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            All your created reminders
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Pending</span>
            <Clock3 size={18} className="text-blue-300" />
          </div>

          <p className="mt-3 text-2xl font-bold tabular-nums">
            {totalPending}
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            Waiting to be sent
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Successfully sent</span>
            <Send size={18} className="text-blue-300" />
          </div>

          <p className="mt-3 text-2xl font-bold tabular-nums">
            {totalSent}
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            Completed reminders
          </p>
        </div>
      </div>

      {/* PROJECTS SECTION */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Your Projects</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {filteredProjects.length} reminder
            {filteredProjects.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* PROJECT CARDS */}
      {filteredProjects.length > 0 ? (

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {filteredProjects.map((project) => {
            const isExpanded = expanded.includes(project.id);
            const isDeleting = deleteId === project.id;
            const status = statusStyle(project.status);
            const StatusIcon = status.icon;

            const days = project.days || [];

            return (
              <article
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1020] transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5"
              >

                {/* BLUE TOP ACCENT */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />

                <div className="p-5">

                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
                        <Bell size={23} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold">
                          {project.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5">
                          <StatusIcon
                            size={13}
                            className={
                              status.label === "Processing"
                                ? "animate-spin text-blue-300"
                                : ""
                            }
                          />

                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.style}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DELETE MENU */}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => setDeleteId(project.id)}
                        aria-label={`Delete ${project.name}`}
                        className="rounded-xl p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  {project.description && (
                    <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      {project.description}
                    </p>
                  )}

                  {/* REMINDER INFORMATION */}
                  <div className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-4">

                    <div className="flex items-start gap-3">
                      <Clock3 size={18} className="mt-0.5 shrink-0 text-blue-300" />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          {formatTime(project.schedule_time)}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          Schedule time
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone size={18} className="mt-0.5 shrink-0 text-blue-300" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {project.phone_number}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          Phone number
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-start gap-3">
                      <MessageSquare size={18} className="mt-0.5 shrink-0 text-blue-300" />

                      <div className="min-w-0">
                        <p className="text-sm leading-6 text-zinc-300">
                          {project.message || "No reminder message provided."}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          Reminder message
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* REMINDER TIMESTAMPS */}
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div>
                      <p className="text-[11px] text-zinc-400">
                        Created on
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                        <CalendarDays size={13} className="text-blue-300" />
                        {formatDate(project.created_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-zinc-400">
                        Last sent
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                        <Send size={13} className="text-blue-300" />
                        {formatDate(
                          project.last_sent_at || project.sent_at
                        )}
                      </p>
                    </div>
                  </div>

                  {/* EXPAND DAYS */}
                  <div className="mt-5 border-t border-white/10 pt-4">

                    <button
                      type="button"
                      onClick={() => toggleDays(project.id)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between rounded-xl py-2 text-sm font-semibold transition hover:text-blue-300"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarDays size={17} className="text-blue-300" />
                        Scheduled days

                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                          {days.length}
                        </span>
                      </span>

                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        {isExpanded ? "Hide days" : "Show days"}

                        {isExpanded ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </span>
                    </button>

                    {/* ANIMATED DAYS CONTENT */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pb-2 pt-3">

                          {days.length > 0 ? (
                            days.map((day) => (
                              <span
                                key={day.id}
                                className="rounded-xl border border-blue-400/20 bg-blue-400/5 px-3 py-2 text-xs font-medium text-blue-300"
                              >
                                {day.days}
                              </span>
                            ))
                          ) : (
                            <p className="py-2 text-xs text-zinc-400">
                              No scheduled days found.
                            </p>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* DELETE CONFIRMATION */}
                {isDeleting && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#080d1b]/95 p-5 backdrop-blur-sm">

                    <div className="w-full max-w-xs text-center">

                      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <Trash2 size={23} />
                      </div>

                      <h3 className="font-bold">
                        Delete reminder?
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-white">
                          {project.name}
                        </span>
                        ? This action cannot be undone.
                      </p>

                      <div className="mt-5 flex gap-2">

                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => setDeleteId(null)}
                          className="flex-1 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold transition hover:bg-white/5 disabled:opacity-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => handleDelete(project.id)}
                          className="flex-1 rounded-xl bg-red-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>

                      </div>
                    </div>
                  </div>
                )}

              </article>
            );
          })}

        </div>

      ) : (

        /* EMPTY SEARCH STATE */
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#0b1020] py-16 text-center">

          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
            {search ? <Search size={25} /> : <Bell size={25} />}
          </div>

          <h3 className="text-base font-bold">
            {search ? "No reminders found" : "No reminders yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            {search
              ? "Try searching with another name, phone number or message."
              : "You haven't created any reminders. Create your first reminder and let Easeway handle the scheduling."}
          </p>

          {!search && (
            <Link
              href="/project"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              <Plus size={17} />
              Create Reminder
            </Link>
          )}

        </div>
      )}

      </div>
    </section>
  );
}