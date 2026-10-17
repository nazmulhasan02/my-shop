
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AdminRequest = {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  reviewed_at: string | null;
};

export default function AdminPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleError) {
        throw new Error(roleError.message);
      }

      if (roleData?.role !== "main_admin") {
        setIsError(true);
        setMessage("Access denied. Main Admin permission is required.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_requests")
        .select("id, user_id, status, requested_at, reviewed_at")
        .order("requested_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setRequests((data ?? []) as AdminRequest[]);
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load admin requests."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  async function reviewRequest(
    requestId: string,
    status: "approved" | "rejected"
  ) {
    const action = status === "approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this request?`)) {
      return;
    }

    setReviewingId(requestId);
    setMessage("");
    setIsError(false);

    try {
      const { error } = await supabase.rpc("review_admin_request", {
        p_request_id: requestId,
        p_status: status,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage(
        status === "approved"
          ? "Admin request approved successfully."
          : "Admin request rejected successfully."
      );

      await loadRequests();
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not review this request."
      );
    } finally {
      setReviewingId(null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsError(true);
      setMessage("Sign out failed. Please try again.");
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-[#111827] text-white lg:flex">
          <Link href="/admin" className="flex items-center gap-3 px-7 py-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 text-xl font-black shadow-lg shadow-indigo-950/40">
              M
            </div>

            <div>
              <p className="text-xl font-extrabold tracking-tight">
                MyShop
              </p>
              <p className="text-xs text-slate-400">
                Control center
              </p>
            </div>
          </Link>

          <div className="mx-5 mt-5">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Administration
            </p>

            <div className="flex items-center gap-3 rounded-xl bg-indigo-500/15 px-4 py-3.5 text-sm font-semibold text-indigo-300 ring-1 ring-indigo-400/20">
              <span className="text-lg">▦</span>
              Main Dashboard
            </div>

            <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-slate-400">
              <span className="text-lg">♙</span>
              Admin Requests
              {pendingCount > 0 && (
                <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-bold text-amber-300">
                  {pendingCount}
                </span>
              )}
            </div>

            <Link
              href="/admin/dashboard"
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-lg">◇</span>
              Admin Workspace
            </Link>
          </div>

          <div className="mt-auto p-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
                ✓
              </div>

              <p className="mt-3 text-sm font-semibold">
                Main Admin Access
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Manage admin approval requests from one place.
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
          {/* Top Navigation */}
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  MyShop / Control Center
                </p>

                <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Main Admin Dashboard
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => void loadRequests()}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                >
                  <span className="mr-1.5">↻</span>
                  Refresh
                </button>

                <Link
                  href="/"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <span className="mr-1.5">↗</span>
                  Visit Shop
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="hidden rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 sm:inline-flex"
                >
                  {loggingOut ? "Signing out..." : "Sign Out"}
                </button>
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
                  Main Admin Access Active
                </div>

                <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Welcome to your control center.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                  Review admin applications, control who receives admin
                  access, and monitor requests across your MyShop platform.
                </p>

                <button
                  onClick={() => {
                    document
                      .getElementById("admin-requests")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
                >
                  Review Requests <span>→</span>
                </button>
              </div>
            </section>

            {/* Statistics */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">
                    Total Requests
                  </p>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                    ▦
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                  {loading ? "—" : requests.length}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  All admin applications
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">
                    Pending
                  </p>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
                    ◷
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-amber-600">
                  {loading ? "—" : pendingCount}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Awaiting your review
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">
                    Approved
                  </p>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                    ✓
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-600">
                  {loading ? "—" : approvedCount}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Admin access granted
                </p>
              </div>

              <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">
                    Rejected
                  </p>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                    ×
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-red-600">
                  {loading ? "—" : rejectedCount}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Requests not approved
                </p>
              </div>
            </section>

            {/* Notification */}
            {message && (
              <div
                role={isError ? "alert" : "status"}
                className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${
                  isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                <span className="text-lg">
                  {isError ? "!" : "✓"}
                </span>
                <p className="break-words">{message}</p>
              </div>
            )}

            {/* Requests */}
            <section
              id="admin-requests"
              className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                    Access Management
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    Admin Registration Requests
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Review each application before granting admin permissions.
                  </p>
                </div>

                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                  {loading ? "Loading..." : `${pendingCount} pending`}
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center px-5 py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading admin requests...
                  </p>
                </div>
              ) : requests.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl text-slate-400">
                    ▤
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-800">
                    No requests yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    New admin applications will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-4 sm:p-6">
                  {requests.map((request) => {
                    const isPending = request.status === "pending";

                    const statusStyle =
                      request.status === "pending"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : request.status === "approved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700";

                    return (
                      <article
                        key={request.id}
                        className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:shadow-md sm:p-5"
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 text-lg font-extrabold text-indigo-700">
                              A
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-extrabold text-slate-900">
                                  Admin Application
                                </h3>

                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusStyle}`}
                                >
                                  {request.status}
                                </span>
                              </div>

                              <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-500">
                                User ID: {request.user_id}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                                <p>
                                  <span className="font-semibold text-slate-600">
                                    Requested:
                                  </span>{" "}
                                  {new Date(
                                    request.requested_at
                                  ).toLocaleString()}
                                </p>

                                {request.reviewed_at && (
                                  <p>
                                    <span className="font-semibold text-slate-600">
                                      Reviewed:
                                    </span>{" "}
                                    {new Date(
                                      request.reviewed_at
                                    ).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {isPending ? (
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                              <button
                                onClick={() =>
                                  void reviewRequest(request.id, "approved")
                                }
                                disabled={reviewingId !== null}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {reviewingId === request.id ? (
                                  <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <span>✓</span> Approve
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  void reviewRequest(request.id, "rejected")
                                }
                                disabled={reviewingId !== null}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <span>×</span> Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs font-semibold text-slate-400">
                              Request reviewed
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <footer className="py-8 text-center text-xs text-slate-400">
              © 2026 MyShop. Main Admin Control Center.
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
