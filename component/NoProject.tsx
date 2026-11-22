
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase-client";

export default function NoProject() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleCreateReminder() {
    setCheckingAuth(true);
    setAuthError("");

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setAuthError("Unable to verify your sign-in. Please try again.");
        return;
      }

      router.push(user ? "/project" : "/register");
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to verify your sign-in. Please try again."
      );
    } finally {
      setCheckingAuth(false);
    }
  }

  return (
    <section className="flex min-h-[100dvh] w-full items-center justify-center px-1.5 md:px-3">
      <div className="glass-panel flex min-h-[300px] w-full max-w-xl flex-col items-center justify-center rounded-2xl px-5 text-center text-zinc-100">

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/30 bg-blue-400/15 text-blue-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
            <path d="M12 14v4M10 16h4" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-white">
          No projects yet
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-300">
          You have not created any reminder yet.
          Your projects will appear here once you create one.
        </p>

        {authError && (
          <p className="mt-4 text-sm text-red-300" role="alert">
            {authError}
          </p>
        )}

        <button
          type="button"
          onClick={handleCreateReminder}
          disabled={checkingAuth}
          aria-busy={checkingAuth}
          className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          {checkingAuth ? "Checking..." : "Create reminder"}
        </button>
      </div>
    </section>
  );
}