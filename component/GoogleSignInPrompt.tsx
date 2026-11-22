"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { supabase } from "@/lib/supabase-client";

const dismissedKey = "kaeme-google-sign-in-prompt-dismissed";

export default function GoogleSignInPrompt() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const isAuthRoute =
      pathname === "/register" || pathname.startsWith("/auth/");

    if (isAuthRoute) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsVisible(false);
      }
    });

    async function checkAuthentication() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Could not check the sign-in prompt session:", error.message);
          return;
        }

        let wasDismissed = false;
        try {
          wasDismissed =
            window.localStorage.getItem(dismissedKey) === "true";
        } catch (storageError) {
          console.error(
            "Could not read the sign-in prompt dismissal:",
            storageError
          );
        }

        if (isMounted && !user && !wasDismissed) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Could not check the sign-in prompt session:", error);
      }
    }

    void checkAuthentication();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  function dismissPrompt() {
    try {
      window.localStorage.setItem(dismissedKey, "true");
    } catch (error) {
      console.error("Could not save the sign-in prompt dismissal:", error);
    }

    setIsVisible(false);
  }

  async function signInWithGoogle() {
    setIsSigningIn(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in could not be started. Please try again."
      );
      setIsSigningIn(false);
    }
  }

  if (!isVisible || pathname === "/register" || pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <aside
      aria-label="Google sign-in suggestion"
      className="glass-panel fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-2xl p-4 text-zinc-100 shadow-2xl lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-6 lg:top-6 lg:mx-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            Sign in with Google
          </h2>
          <p className="mt-1 text-sm leading-5 text-zinc-300">
            Choose an account for quick, secure access.
          </p>
        </div>
        <button
          type="button"
          onClick={dismissPrompt}
          aria-label="Dismiss Google sign-in suggestion"
          className="rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {errorMessage && (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isSigningIn}
        aria-busy={isSigningIn}
        className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-wait disabled:opacity-70"
      >
        {isSigningIn ? "Opening Google..." : "Continue with Google"}
      </button>

      <button
        type="button"
        onClick={dismissPrompt}
        className="mt-2 w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
      >
        Not now
      </button>
    </aside>
  );
}
