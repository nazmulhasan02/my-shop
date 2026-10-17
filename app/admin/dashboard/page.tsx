
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdminAccess() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (!active) return;

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      const user = authData.user;

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (roleError) {
        setErrorMessage("Unable to verify your account permissions.");
        setChecking(false);
        return;
      }

      if (roleData?.role === "main_admin") {
        router.replace("/admin");
        return;
      }

      if (roleData?.role !== "admin") {
        router.replace("/");
        return;
      }

      setAdminEmail(user.email ?? "");
      setAuthorized(true);
      setChecking(false);
    }

    checkAdminAccess();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage("Sign out failed. Please try again.");
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-indigo-400" />
          <p className="mt-5 text-sm font-medium text-slate-300">
            Verifying admin access...
          </p>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl">
            !
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Dashboard Unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {errorMessage ||
              "You are not authorized to access this page."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to MyShop
          </Link>
        </div>
      </main>
    );
  }

  const dashboardCards = [
    {
      title: "Products",
      description: "Manage your store's product catalog.",
      icon: "▦",
      color: "from-violet-500 to-indigo-600",
      label: "Product Management",
    },
    {
      title: "Orders",
      description: "Review and manage customer orders.",
      icon: "↗",
      color: "from-sky-400 to-blue-600",
      label: "Order Management",
    },
    {
      title: "Storefront",
      description: "View the customer-facing MyShop website.",
      icon: "⌂",
      color: "from-emerald-400 to-teal-600",
      label: "Visit MyShop",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-[#111827] text-white lg:flex">
          <Link href="/" className="flex items-center gap-3 px-7 py-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 text-xl font-black shadow-lg shadow-indigo-950/40">
              M
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">
                MyShop
              </p>
              <p className="text-xs text-slate-400">
                Admin workspace
              </p>
            </div>
          </Link>

          <div className="mx-5 mt-5">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Workspace
            </p>

            <div className="flex items-center gap-3 rounded-xl bg-indigo-500/15 px-4 py-3.5 text-sm font-semibold text-indigo-300 ring-1 ring-indigo-400/20">
              <span className="text-lg">▦</span>
              Dashboard
            </div>

            <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-slate-400">
              <span className="text-lg">▤</span>
              Product Management
            </div>

            <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-slate-400">
              <span className="text-lg">◇</span>
              Order Management
            </div>
          </div>

          <div className="mt-auto p-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
                ✓
              </div>
              <p className="mt-3 text-sm font-semibold">Admin Access</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Your account has been approved by the Main Admin.
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
            >
              <span>↪</span>
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  MyShop / Workspace
                </p>
                <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span className="mr-1.5">↗</span>
                  <span className="hidden sm:inline">View Store</span>
                  <span className="sm:hidden">Store</span>
                </Link>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-indigo-200">
                  A
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            {/* Welcome Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3730a3] via-indigo-700 to-blue-600 p-6 text-white shadow-xl shadow-indigo-200/60 sm:p-9">
              <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[36px] border-white/[0.07]" />
              <div className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

              <div className="relative max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Admin workspace active
                </div>

                <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Welcome back, Admin!
                </h2>

                <p className="mt-3 break-all text-sm leading-6 text-indigo-100 sm:text-base">
                  {adminEmail}
                </p>

                <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100/90">
                  Manage your store operations from one place. Your
                  product and order management tools will live here.
                </p>

                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
                >
                  Explore Store <span>→</span>
                </Link>
              </div>
            </section>

            {/* Section Heading */}
            <section className="mt-9 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Quick access
                </p>
                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Store Management
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a workspace to get started.
                </p>
              </div>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                3 workspaces
              </span>
            </section>

            {/* Dashboard Cards */}
            <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {dashboardCards.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-2xl font-bold text-white shadow-lg transition duration-300 group-hover:scale-105`}
                  >
                    {card.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {card.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold text-slate-400">
                      {card.label}
                    </span>
                    {card.title === "Storefront" ? (
                      <Link
                        href="/"
                        aria-label="Visit MyShop storefront"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-600 transition hover:bg-indigo-600 hover:text-white"
                      >
                        →
                      </Link>
                    ) : (
                      <span
                        aria-label={`${card.title} coming soon`}
                        title="Management tools will be added next"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-400"
                      >
                        →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </section>

            {/* Bottom Info */}
            <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  ✦
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Your workspace is ready
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    This dashboard is the starting point for product and
                    order tools. Main Admin approval controls remain in
                    the separate Main Admin dashboard.
                  </p>
                </div>
              </div>
            </section>

            <footer className="py-8 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} MyShop. Admin Workspace.
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
