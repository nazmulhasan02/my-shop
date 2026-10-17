
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
const [cancellingId, setCancellingId] = useState<string | null>(null);
const [message, setMessage] = useState("");


  useEffect(() => {
    async function getOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/account");
        return;
      }

      
const { data, error } = await supabase
  .from("orders")
  .select("*")
  .eq("user_id", user.id)
  .neq("status", "cancelled")
  .order("created_at", { ascending: false });


      if (error) {
        console.error("Orders fetch error:", error.message);
      } else {
        setOrders(data || []);
      }

      setLoading(false);
    }

    getOrders();
  }, [router]);

  
async function cancelOrder(orderId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  setCancellingId(orderId);
  setMessage("");

  try {
    const { data, error } = await supabase.rpc("cancel_order", {
      p_order_id: orderId,
    });

    if (error) {
      setMessage("Failed to cancel order: " + error.message);
    } else if (data) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "cancelled" }
            : order
        )
      );

      setMessage("Order cancelled successfully.");
    } else {
      setMessage(
        "This order cannot be cancelled. It may already be cancelled."
      );
    }
  } catch {
    setMessage("Something went wrong. Please try again.");
  } finally {
    setCancellingId(null);
  }
}


  return (
    
<main className="min-h-screen bg-gradient-to-br from-slate-300 via-blue-200 to-indigo-300 px-4 py-8 font-sans text-slate-800 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-5xl">

        {/* Top Navigation */}
        <Link
          href="/customer"
          className="group inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-blue-700 hover:shadow-md"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Dashboard
        </Link>

        {/* Page Header */}
        <section className="relative mt-7 overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 p-7 text-white shadow-xl shadow-blue-900/15 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-50">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Customer Center
              </span>

              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                My Orders<span className="text-cyan-300"></span>
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-blue-100 sm:text-base">
                All your purchases, together in one place.
                Review your order history anytime.
              </p>
            </div>

            <div className="flex w-fit items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:min-w-48">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-inner">
                📦
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
                  Total Orders
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight">
                  {loading ? "..." : String(orders.filter((order) => order.status !== "cancelled").length).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Title */}
        <div className="mb-5 mt-9 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-800 sm:text-2xl">
              Order History
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Your latest purchases and payment totals
            </p>
          </div>
          <span className="rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
            {orders.filter((order) => order.status !== "cancelled").length} {orders.filter((order) => order.status !== "cancelled").length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="rounded-3xl border border-white/80 bg-white/75 p-16 text-center shadow-lg shadow-slate-300/30 backdrop-blur">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-5 text-sm font-bold tracking-wide text-slate-600">
              Loading your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-white/80 bg-white/70 px-6 py-16 text-center shadow-lg shadow-slate-300/30 backdrop-blur">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-200 text-5xl shadow-inner">
              🛍️
            </div>

            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-800">
              Your journey starts here
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              You haven't placed an order yet. Explore our collection
              and find something you'll love.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-700/25 transition-all duration-200 hover:-translate-y-1 hover:from-blue-800 hover:to-indigo-700 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            >
              Explore Products <span>→</span>
            </Link>
          </div>
        ) : (
          /* Order Cards */
          <div className="space-y-5">
            
{message && (
  <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-medium text-blue-800">
    {message}
  </div>
)}

            {orders.map((order) => (
              <article
                key={order.id}
                className="group overflow-hidden rounded-3xl border border-white/90 bg-white/80 shadow-md shadow-slate-300/30 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/10"
              >
                {/* Order Card Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200/70 bg-gradient-to-r from-slate-100/90 to-blue-50/80 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl text-white shadow-md shadow-blue-600/20">
                      📦
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                        Order Number
                      </p>
                      <h3 className="mt-1 break-all text-base font-black tracking-tight text-slate-800 sm:text-lg">
                        #{order.id}
                      </h3>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                      Placed On
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {new Date(order.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Order Information */}
                <div className="p-5 sm:p-7">
                    
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-blue-50/60 p-4 transition-colors hover:border-blue-200">
                      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        <span>👤</span> Customer Details
                      </p>
                      <p className="mt-3 break-words text-base font-extrabold text-slate-800">
                        {order.customer_name}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {order.phone}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-indigo-50/60 p-4 transition-colors hover:border-indigo-200">
                      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        <span>📍</span> Delivery Address
                      </p>
                      <p className="mt-3 break-words text-sm font-semibold leading-6 text-slate-700">
                        {order.address}
                      </p>
                    </div>
                  </div>

                  {/* Items and Total */}
                  <div className="mt-6 flex flex-col justify-between gap-5 border-t border-dashed border-slate-200 pt-5 sm:flex-row sm:items-center">
                    <details className="group/items">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-extrabold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 active:scale-[0.98]">
                        <span>🧾</span>
                        View Ordered Items
                        <span className="text-xs transition-transform group-open/items:rotate-180">
                          ▼
                        </span>
                      </summary>

                      
<div className="mt-4 space-y-3">
  {Array.isArray(order.items) &&
    order.items.map((item: any, index: number) => (
      <div
        key={`${item.id}-${index}`}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:gap-4 sm:p-4"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-3xl sm:h-16 sm:w-16">
          {item.emoji || "🛍️"}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="break-words text-sm font-extrabold text-slate-800 sm:text-base">
            {item.name}
          </h4>

          <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
            ৳{Number(item.price).toFixed(2)} × {item.quantity}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
            Subtotal
          </p>

          <p className="mt-1 text-sm font-black text-emerald-700 sm:text-base">
            ৳
            {(
              Number(item.price) * Number(item.quantity)
            ).toFixed(2)}
          </p>
        </div>
      </div>
    ))}
</div>

                    </details>

                    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-teal-100/70 px-5 py-4 shadow-sm sm:min-w-52 sm:text-right">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                        Order Total
                      </p>
                      <p className="mt-1 text-3xl font-black tracking-tight text-emerald-800">
                        ৳{Number(order.total_amount).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-emerald-700/80">
                        Total amount
                      </p>
                    
                    </div>

                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="mt-4 rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}

                    {order.status === "cancelled" && (
                      <p className="mt-4 font-semibold text-red-600">
                        Order Cancelled
                      </p>
                    )}
                  </div>
                </div>
              </article>

            ))}
          </div>
        )}

        {/* Bottom Action */}
        <footer className="mt-8 flex flex-col justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:px-7">
          <div>
            <p className="font-extrabold tracking-tight text-slate-800">
              Looking for something new?
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Discover more products in our store.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
          >
            Continue Shopping <span>→</span>
          </Link>
        </footer>

      </div>
    </main>
  );
}
