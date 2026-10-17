
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      const user = data.user;

      if (!user) {
        setMessage("Unable to identify your account. Please try again.");
        return;
      }

      // Step 1: Check the user's assigned role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleError) {
        await supabase.auth.signOut();
        setMessage("Unable to verify your account role. Please try again.");
        return;
      }

      // Step 2: Redirect Main Admin
      if (roleData?.role === "main_admin") {
        router.replace("/admin");
        router.refresh();
        return;
      }

      // Step 3: Redirect approved Admin
      if (roleData?.role === "admin") {
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }

      // Step 4: Check whether this is a pending/rejected Admin request
      const { data: requestData, error: requestError } = await supabase
        .from("admin_requests")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (requestError) {
        await supabase.auth.signOut();
        setMessage("Unable to verify your admin request. Please try again.");
        return;
      }

      if (requestData?.status === "pending") {
        await supabase.auth.signOut();
        setMessage(
          "Your Admin request is still pending. Please wait for Main Admin approval."
        );
        return;
      }

      if (requestData?.status === "rejected") {
        await supabase.auth.signOut();
        setMessage(
          "Your Admin request was rejected. Please contact the Main Admin."
        );
        return;
      }

      // Step 5: Normal User
      router.replace("/");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white shadow-lg shadow-blue-700/25">
            M
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My<span className="text-blue-700">Shop</span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Sign in to continue.
          </p>
        </div>

        {/* Login Card */}
        <section className="rounded-2xl border border-white bg-white/95 p-6 shadow-xl shadow-slate-300/40 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your account details below.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
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
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-700 transition hover:text-blue-900 hover:underline sm:text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-xs font-semibold text-slate-500 transition hover:text-blue-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                <p className="font-semibold">Sign in notice</p>
                <p className="mt-1">{message}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-4 text-center">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-blue-700"
          >
            ← Back to Account
          </Link>
        </div>

        <p className="mt-2 text-center text-xs text-slate-400">
          MyShop · Secure Sign In
        </p>
      </div>
    </main>
  );
}
