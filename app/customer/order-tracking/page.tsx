
"use client";

import Link from "next/link";
import { useState } from "react";

type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered";

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
};

const sampleOrders: Order[] = [
  {
    id: "MS-1001",
    date: "14 October 2026",
    status: "Shipped",
    total: 2450,
    items: 2,
  },
  {
    id: "MS-1002",
    date: "15 October 2026",
    status: "Confirmed",
    total: 1200,
    items: 1,
  },
  {
    id: "MS-1003",
    date: "16 October 2026",
    status: "Pending",
    total: 3200,
    items: 3,
  },
  {
    id: "MS-1004",
    date: "10 October 2026",
    status: "Delivered",
    total: 850,
    items: 1,
  },
];

const statusSteps: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-violet-100 text-violet-800 border-violet-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function OrderTrackingPage() {
  const [searchId, setSearchId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const order = sampleOrders.find(
      (item) => item.id.toLowerCase() === searchId.trim().toLowerCase()
    );

    setSelectedOrder(order ?? null);
    setSearched(true);
  }

  function getStatusIndex(status: OrderStatus) {
    return statusSteps.indexOf(status);
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="border-b border-indigo-200 bg-indigo-100/80 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-indigo-800"
          >
            MyShop<span className="text-blue-900"></span>
          </Link>

          <Link
            href="/customer"
            className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-bold text-indigo-800 transition hover:bg-indigo-50"
          >
            My Account
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
            MyShop Account
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Order Tracking
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Enter your order ID to check your order status.
          </p>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="orderId" className="sr-only">
              Order ID
            </label>

            <input
              id="orderId"
              type="text"
              value={searchId}
              onChange={(event) => {
                setSearchId(event.target.value);
                setSearched(false);
                setSelectedOrder(null);
              }}
              placeholder="Enter Order ID (e.g. MS-1001)"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />

            <button
              type="submit"
              className="rounded-lg border border-indigo-800 bg-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Track Order
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-500">
            Demo order IDs: MS-1001, MS-1002, MS-1003, MS-1004
          </p>
        </section>

        {searched && !selectedOrder && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            Order not found. Please check the order ID and try again.
          </div>
        )}

        {selectedOrder && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Order ID
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {selectedOrder.id}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Order date: {selectedOrder.date}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-bold ${statusStyles[selectedOrder.status]}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-slate-900">
                Order Progress
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {statusSteps.map((status, index) => {
                  const completed =
                    index <= getStatusIndex(selectedOrder.status);

                  return (
                    <div key={status} className="relative">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                          completed
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <p
                        className={`mt-3 text-sm font-bold ${
                          completed ? "text-indigo-800" : "text-slate-400"
                        }`}
                      >
                        {status}
                      </p>

                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-12 top-5 hidden h-0.5 w-[calc(100%-1rem)] sm:block ${
                            index < getStatusIndex(selectedOrder.status)
                              ? "bg-indigo-600"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 rounded-lg bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
                {selectedOrder.status === "Pending" &&
                  "Your order has been received and is waiting for confirmation."}

                {selectedOrder.status === "Confirmed" &&
                  "Your order has been confirmed and is being prepared."}

                {selectedOrder.status === "Shipped" &&
                  "Your order has been shipped and is on its way to you."}

                {selectedOrder.status === "Delivered" &&
                  "Your order has been delivered successfully."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="mt-1 text-xl font-extrabold text-slate-900">
                  ৳{selectedOrder.total.toLocaleString("en-BD")}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Items</p>
                <p className="mt-1 text-xl font-extrabold text-slate-900">
                  {selectedOrder.items}
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="mt-6">
          <Link
            href="/customer"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
{/* Footer */}
        <footer className="mt-8 border-t border-indigo-400 bg-indigo-600 text-white">
          <div className="w-full px-5 py-7 sm:px-8">
            <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 sm:gap-8">
              {/* Brand */}
              <div className="col-span-2 sm:col-span-1">
                <Link
                  href="/"
                  className="text-2xl font-extrabold tracking-tight"
                >
                  MyShop<span className="text-indigo-200"></span>
                </Link>

                <p className="mt-2 max-w-xs text-xs leading-5 text-indigo-100">
                  Quality products, great value, and a better shopping
                  experience.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-bold">Quick Links</h3>

                <ul className="mt-3 space-y-2 text-xs text-indigo-100">
                  <li>
                    <Link
                      href="/"
                      className="transition hover:text-white hover:underline"
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/#products"
                      className="transition hover:text-white hover:underline"
                    >
                      All Products
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/cart"
                      className="transition hover:text-white hover:underline"
                    >
                      Shopping Cart
                    </Link>
                  </li>
                </ul>
              </div>

              {/* My Account */}
              <div>
                <h3 className="text-sm font-bold">My Account</h3>

                <ul className="mt-3 space-y-2 text-xs text-indigo-100">
                  <li>
                    <Link
                      href="/account"
                      className="transition hover:text-white hover:underline"
                    >
                      My Account
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/customer/my-orders"
                      className="transition hover:text-white hover:underline"
                    >
                      My Orders
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/customer/addresses"
                      className="transition hover:text-white hover:underline"
                    >
                      My Addresses
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Support */}
              <div>
                <h3 className="text-sm font-bold">Customer Support</h3>

                <ul className="mt-3 space-y-2 text-xs text-indigo-100">
                  <li>
                    <Link
                      href="/#products"
                      className="transition hover:text-white hover:underline"
                    >
                      Browse Products
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/cart"
                      className="transition hover:text-white hover:underline"
                    >
                      Cart & Checkout
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/customer"
                      className="transition hover:text-white hover:underline"
                    >
                      Customer Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-indigo-400/60 pt-4 text-center text-[11px] text-indigo-100 sm:flex-row sm:text-left">
              <p>© 2026 MyShop. All rights reserved.</p>
              <p>Made with care for a better shopping experience.</p>
            </div>
          </div>
        </footer>
    </main>
  );
}
