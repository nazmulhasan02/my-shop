
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    emoji?: string;
  }[];
  total_amount: number;
  status: string;
  created_at: string;
};

export default function CancelledOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCancelledOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/account");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "cancelled")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load cancelled orders:", error.message);
      } else {
        setOrders((data ?? []) as Order[]);
      }

      setLoading(false);
    }

    fetchCancelledOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-300 via-blue-200 to-indigo-300">
        <p className="text-lg font-bold text-slate-700">
          Loading cancelled orders...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-300 via-blue-200 to-indigo-300 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-red-600 to-rose-500 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-black sm:text-4xl">
            Cancelled Orders
          </h1>
          <p className="mt-2 text-red-50">
            View your previously cancelled orders.
          </p>
          <p className="mt-5 font-bold">
            Total Cancelled Orders: {orders.length}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white/90 p-10 text-center shadow-lg">
            <p className="text-xl font-bold text-slate-800">
              No Cancelled Orders
            </p>
            <p className="mt-2 text-slate-600">
              You haven't cancelled any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Order ID
                    </p>
                    <p className="mt-1 break-all font-bold text-slate-800">
                      {order.id}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                    Cancelled
                  </span>
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {item.emoji || "🛍️"}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            ৳{Number(item.price).toFixed(2)} ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 font-bold text-slate-800">
                        ৳
                        {(
                          Number(item.price) * Number(item.quantity)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-5">
                  <p className="text-sm text-slate-600">
                    Customer: {order.customer_name}
                  </p>
                  <p className="text-xl font-black text-red-700">
                    Total: ৳{Number(order.total_amount).toFixed(2)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push("/customer")}
          className="mt-8 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-700"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}
