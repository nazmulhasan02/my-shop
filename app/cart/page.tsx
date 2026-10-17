"use client";

import Link from "next/link";
import { useCart } from "../CartContext";

export default function CartPage() {
  const { cart, setCart } = useCart();

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function increaseQuantity(id: number) {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(id: number) {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    /* পরিবর্তন ১: px-1 (1px padding left/right) এবং pb-[1px] (1px padding bottom) দেওয়া হয়েছে। sm:px-8 বাদ দেওয়া হয়েছে */
    <main className="flex min-h-screen flex-col bg-[#f3f5fb] px-[1px] pt-1 pb-[1px] text-slate-900">
      {/* পরিবর্তন ২: w-full ব্যবহার করা হয়েছে যেন ফুটারটি দুই পাশে স্ক্রিনের ১ পিক্সেল দূর পর্যন্ত পুরো ছড়িয়ে যায় */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        {/* কন্টেন্টের সৌন্দর্যের জন্য ভেতরের এই ডিভে সামান্য ডানে-বামে প্যাডিং (px-4) রাখা হয়েছে, যা ফুটারকে ছড়াতে বাধা দেবে না */}
        <div className="flex flex-1 flex-col px-4 pt-4">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-indigo-950">
                🛒 My Shopping Cart
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Review your products before checkout.
              </p>
            </div>

            <Link
              href="/"
              className="rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Continue Shopping
            </Link>
          </div>

          <section className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm sm:p-6">
            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-5xl">🛍️</p>
                <h2 className="mt-4 text-xl font-bold text-slate-800">
                  Your cart is empty
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add some products from the homepage.
                </p>

                <Link
                  href="/"
                  className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold text-indigo-950">
                    Cart Items ({totalQuantity})
                  </h2>

                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-5"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="wrap-break-word font-bold text-slate-800">
                          {item.emoji} {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          ৳{item.price.toLocaleString("en-BD")} per item
                        </p>

                        <p className="mt-1 font-bold text-indigo-700">
                          Subtotal: ৳
                          {(item.price * item.quantity).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 font-bold hover:bg-slate-100"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-200 font-bold text-indigo-700 hover:bg-indigo-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-600">
                      Total Amount
                    </span>

                    <span className="text-2xl font-extrabold text-indigo-700">
                      ৳{totalAmount.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-5 block rounded-xl bg-indigo-600 px-6 py-3.5 text-center font-bold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Proceed to Checkout →
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>

         {/* Footer */}
        <footer className="mt-8 border-t border-indigo-400 bg-indigo-600 text-white">
          <div className="w-full px-3 py-4 sm:px-8">
            <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 sm:gap-8">
              {/* Brand */}
              <div className="col-span-2 sm:col-span-1">
                <Link
                  href="/"
                  className="text-2xl font-extrabold tracking-tight"
                >
                  MyShop<span className="text-indigo-200">.</span>
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
      </div>
    </main>
  );
}
