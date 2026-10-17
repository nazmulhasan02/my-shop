
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetRequest(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage(
        "If an account exists for this email, a password reset link will be sent. Please check your inbox."
      );
    } catch {
      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white shadow-lg shadow-blue-700/25">
            M
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My<span className="text-blue-700">Shop</span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Shopping made simple.
          </p>
        </div>

        {/* Main Card */}
        <section className="rounded-2xl border border-white bg-white/95 p-6 shadow-xl shadow-slate-300/40 sm:p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            🔐
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Forgot Password?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            No worries! Enter your registered email address and
            we’ll help you reset your password.
          </p>

          <form onSubmit={handleResetRequest} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {message && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
              >
                <p className="mb-1 font-bold">Request submitted</p>
                {message}
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                <p className="mb-1 font-bold">Unable to send link</p>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending Reset Link...
                </>
              ) : (
                <>Send Reset Link <span>→</span></>
              )}
            </button>
          </form>

          <div className="my-6 border-t border-slate-100" />

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              <span>←</span> Back to Sign In
            </Link>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-400">
          © MyShop · Secure account recovery
        </p>
      </div>
    </main>
  );
}
