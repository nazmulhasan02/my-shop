
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"user" | "admin">("user");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            account_type: accountType,
          },
        },
      });

      if (error) {
        setIsError(true);
        setMessage(error.message);
        return;
      }

      if (accountType === "admin") {
        setMessage(
          "Admin registration submitted! Your account requires approval before you can access the Admin Dashboard. Check your email if confirmation is required."
        );
      } else {
        setMessage(
          "Account created! Check your email if confirmation is required."
        );
      }
    } catch {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60";

  const labelStyle = "block text-sm font-semibold text-slate-700";

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-indigo-50 to-blue-100 px-4 py-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-black text-white shadow-lg shadow-indigo-600/25">
            M
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My<span className="text-indigo-600">Shop</span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Your shopping journey starts here.
          </p>
        </div>

        {/* Registration Card */}
        <section className="rounded-2xl border border-white bg-white/95 p-6 shadow-xl shadow-slate-300/40 sm:p-7">
          <Link
            href="/"
            className="flex items-center justify-center gap-1 text-base font-bold text-indigo-600 transition hover:text-indigo-800 sm:text-lg"
          >
            Back to Homepage
          </Link>

          <div className="mb-5 mt-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your details to join MyShop.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className={labelStyle}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={inputStyle}
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelStyle}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputStyle}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelStyle}>
                Password
              </label>

              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  className={`${inputStyle} mt-0 pr-16`}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-slate-500 hover:text-indigo-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Use at least 6 characters.
              </p>
            </div>

            {/* Account Type */}
            <div>
              <label
                htmlFor="accountType"
                className={labelStyle}
              >
                Account Type
              </label>

              <select
                id="accountType"
                value={accountType}
                onChange={(e) =>
                  setAccountType(e.target.value as "user" | "admin")
                }
                disabled={loading}
                className={inputStyle}
              >
                <option value="user">User — Shop and place orders</option>
                <option value="admin">Admin — Request admin access</option>
              </select>

              {accountType === "admin" && (
                <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  Admin access requires approval. You cannot access the Admin
                  Dashboard until your request is approved.
                </p>
              )}
            </div>

            {/* Feedback */}
            {message && (
              <div
                role={isError ? "alert" : "status"}
                className={`break-words rounded-xl border p-3 text-sm leading-5 ${
                  isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                <p className="font-semibold">
                  {isError ? "Registration failed" : "Registration status"}
                </p>
                <p className="mt-1">{message}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 transition hover:text-indigo-800 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>

        <p className="mt-4 text-center text-xs text-slate-400">
          MyShop · Create your account securely
        </p>
      </div>
    </main>
  );
}
