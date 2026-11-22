
"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
type AuthMode = "register" | "signin";

export default function RegisterPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegister = mode === "register";


  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("error") ===
      "auth-callback"
    ) {
      setError("Sign in could not be completed. Please try again.");
    }
  }, []);

  useEffect(() => {
    if (!success) return;

    const timeoutId = window.setTimeout(() => setSuccess(""), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [success]);

  useGSAP(() => {
    gsap.from('.register-page', {
        scale: 0,
        opacity: 0,
        duration: 0.13
    })
  }, {dependencies: [mode]})
  
  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister) {
      if (password.length < 8) {
        setError("Your password must contain at least 8 characters.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data, error: authError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

        if (authError) throw authError;

        if (data.session) {
          router.replace("/");
          router.refresh();
          return;
        }

        setSuccess(
          "Your account has been created. Please check your email to verify your account."
        );
      } else {
        const { error: authError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (authError) throw authError;

        router.replace("/");
        router.refresh();
        return;
      }
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

  async function handleGoogleAuth() {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      const { error: authError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

      if (authError) throw authError;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google authentication failed. Please try again."
      );
      setGoogleLoading(false);
    }
  }

  return (
    <main className="register-page p-2 w-full min-h-[100svh] ">
      <div className="register-shell">
        <section className="register-brand">
          <div className="register-illustration-frame">
            <div className="register-illustration-inner">
              <Image
                src="/3d-user-login.avif"
                alt="A 3D illustration of a user signing in"
                fill
                sizes="(min-width: 851px) 40vw, 0px"
                priority
                className="register-illustration"
              />
            </div>
          </div>
        </section>

        <section className="register-form-panel">
          <div className="register-form-content">

            {/* HEADER */}

            <div className="form-heading">

              <h2>
                {isRegister ? (
                  <>
                    Create your <span>account.</span>
                  </>
                ) : (
                  <>
                    Welcome <span>back.</span>
                  </>
                )}
              </h2>

              <p>
                {isRegister
                  ? "Get started and take control of your time."
                  : "Sign in to continue where you left off."}
              </p>

            </div>

            {/* AUTH FORM */}

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="form-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a16 16 0 01-4 4.6M6.2 6.2C3.9 7.8 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.6-.8" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!isRegister && (
                <div className="forgot-password">
                  <a href="/forgot-password">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* FEEDBACK */}

              {error && (
                <div className="auth-feedback auth-error" role="alert">
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <span className="button-spinner" />
                    {isRegister ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    {isRegister ? "Create account" : "Sign in"}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* SWITCH AUTH MODE */}





            <div className="form-separator">
              <span />
              <p>OR</p>
              <span />
            </div>

            {/* GOOGLE AUTH */}

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="google-button"
            >
              {googleLoading ? (
                <span className="button-spinner" />
              ) : (
                <svg viewBox="0 0 48 48" className="h-5 w-5">
                  <path
                    fill="#4285F4"
                    d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4.1 6v5h6.7c3.9-3.6 6-8.7 6-14.7Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2C9.3 39.6 16.1 44 24 44Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12.8 27.9c-.4-1.2-.7-2.5-.7-3.9s.3-2.7.7-3.9v-5.2H5.9C4.5 17.7 3.7 20.8 3.7 24s.8 6.3 2.2 9.1l6.9-5.2Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4 16.1 4 9.3 8.4 5.9 14.9l6.9 5.2c1.6-4.7 6-8.2 11.2-8.2Z"
                  />
                </svg>
              )}

              <span>
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>

            <div className="auth-switch">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                onClick={() =>
                  changeMode(isRegister ? "signin" : "register")
                }
              >
                {isRegister ? "Sign in" : "Create account"}
              </button>
            </div>

                        <p className="form-terms">
              By continuing, you agree to use  Kaeme responsibly.
            </p>
          </div>

        </section>

      </div>

      {success && (
        <div
          className="auth-toast auth-toast-success"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {success}
        </div>
      )}
    </main>
  );
}
