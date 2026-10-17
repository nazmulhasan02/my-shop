
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../CartContext";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setIsLoggedIn(true);
      setCheckingAuth(false);
    }

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session?.user) {
        setIsLoggedIn(false);
        router.replace("/login");
      } else {
        setIsLoggedIn(true);
        setCheckingAuth(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  async function handlePlaceOrder(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (placingOrder) return;

    setOrderMessage("");

    if (cart.length === 0) {
      setOrderMessage("Your cart is empty!");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setOrderMessage("Please complete all delivery information.");
      return;
    }

    setPlacingOrder(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        emoji: item.emoji,
      }));

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        customer_name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: orderItems,
        total_amount: totalAmount,
      });

      if (error) {
        setOrderMessage("Could not save your order: " + error.message);
        return;
      }

      setCart([]);
      router.push("/order-success");
    } catch {
      setOrderMessage("Something went wrong. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (checkingAuth || !isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-blue-100 to-indigo-100 px-5 text-slate-900">
        <div className="rounded-2xl border border-indigo-100 bg-white/80 px-7 py-6 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="font-semibold text-indigo-950">
            Checking login status...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-blue-100 to-indigo-100 px-4 py-6 text-slate-900 sm:px-6 sm:py-9">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7">
          <a
            href="/"
            className="text-lg font-extrabold tracking-tight text-indigo-950 transition hover:text-indigo-700"
          >
            MyShop<span className="text-indigo-600"></span>
          </a>
        </header>

        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
            Almost yours
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-indigo-950 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Enter your delivery details and review your order.
          </p>

          <div className="mt-6 flex justify-baseline">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-800 shadow-sm transition duration-200 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow"
            >
              <span aria-hidden="true"></span>
              Continue Shopping
            </a>
          </div>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-indigo-100 bg-white/80 p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                📦
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-indigo-950">
                  Delivery Information
                </h2>
                <p className="text-sm text-slate-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            {orderMessage && (
              <p
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700"
              >
                {orderMessage}
              </p>
            )}

            <form className="space-y-4" onSubmit={handlePlaceOrder}>
              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-1.5 block text-sm font-bold text-slate-800"
                >
                  Customer Name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-1.5 block text-sm font-bold text-slate-800"
                >
                  Phone Number
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  maxLength={25}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="delivery-address"
                  className="mb-1.5 block text-sm font-bold text-slate-800"
                >
                  Delivery Address
                </label>

                <textarea
                  id="delivery-address"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, road, area, city..."
                  rows={3}
                  maxLength={1000}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={placingOrder || cart.length === 0}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder
                  ? "Placing Order..."
                  : `Place Order · ৳${totalAmount.toLocaleString("en-BD")}`}
              </button>

              <p className="text-center text-xs text-slate-500">
                Please verify your delivery details before placing the order.
              </p>
            </form>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-white/80 p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                🛒
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-indigo-950">
                  Order Summary
                </h2>

                <p className="text-sm text-slate-500">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} item(s) in your cart
                </p>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/70 px-4 py-8 text-center">
                <p className="text-3xl">🛍️</p>
                <p className="mt-2 font-bold text-indigo-950">
                  Your cart is empty
                </p>

                <a
                  href="/"
                  className="mt-3 inline-block text-sm font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Browse products →
                </a>
              </div>
            ) : (
              <>
                <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold text-slate-900">
                          {item.emoji} {item.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.quantity} × ৳
                          {item.price.toLocaleString("en-BD")}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-extrabold text-indigo-800">
                        ৳
                        {(item.price * item.quantity).toLocaleString("en-BD")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-700">
                      Total Amount
                    </span>

                    <span className="text-2xl font-extrabold text-indigo-700">
                      ৳{totalAmount.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Delivery charges, if applicable, may be confirmed separately.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>

        <p className="mt-5 text-center text-xs font-medium text-slate-500">
          MyShop · Thank you for shopping with us.
        </p>
      </div>
    </main>
  );
}
