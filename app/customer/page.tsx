
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const BUCKET_NAME = "profile-picture";

export default function CustomerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCustomer() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    }

    loadCustomer();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session?.user) {
        router.replace("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Logout failed: " + error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  async function handlePhotoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    setMessage("");
    setUploadSuccess(false);

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `${user.id}/profile.${extension}`;
      const oldPath = user.user_metadata?.avatar_path;

      if (oldPath && oldPath !== filePath) {
        const { error: removeError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([oldPath]);

        if (removeError) throw removeError;
      }

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      const avatarUrl = `${publicData.publicUrl}?v=${Date.now()}`;

      const { data, error: updateError } =
        await supabase.auth.updateUser({
          data: {
            avatar_url: avatarUrl,
            avatar_path: filePath,
          },
        });

      if (updateError) throw updateError;

      if (data.user) setUser(data.user);

      setMessage("Profile picture updated successfully!");
      setUploadSuccess(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      setMessage("Photo upload failed: " + errorMessage);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 font-sans text-slate-800">
        <div className="rounded-xl border border-indigo-100 bg-white px-6 py-4 shadow-sm">
          <p className="font-semibold">
            Loading customer dashboard...
          </p>
        </div>
      </main>
    );
  }

  const customerName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Customer";

  const avatarUrl = user.user_metadata?.avatar_url;

  const menuItems = [
    {
      title: "My Orders",
      description: "View your order history and order details.",
      icon: "📦",
      href: "/customer/my-orders",
      accent: "from-blue-500 to-indigo-600",
    },
    {
      title: "Cancelled Orders",
      description: "View your cancelled orders.",
      icon: "❌",
      href: "/customer/cancelled-orders",
      accent: "from-rose-500 to-red-600",
    },
    {
      title: "My Addresses",
      description: "Manage your delivery addresses.",
      icon: "📍",
      href: "/customer/addresses",
      accent: "from-emerald-500 to-teal-600",
    },
    {
      title: "My Wishlist",
      description: "View and manage your favourite products.",
      icon: "❤️",
      href: "/customer/wishlist",
      accent: "from-pink-500 to-rose-600",
    },
    {
      title: "Order Tracking",
      description: "Track your order from Pending to Delivered.",
      icon: "🚚",
      href: "/customer/order-tracking",
      accent: "from-violet-500 to-purple-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header - unchanged */}
      <header className="border-b border-indigo-300/70 bg-indigo-100/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-2 py-1">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-indigo-800"
          >
            MyShop<span className="text-blue-900"></span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-indigo-700 bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition duration-200 hover:scale-[0.97] hover:bg-indigo-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
            MyShop Account
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Customer Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Welcome back, {customerName}!
          </p>
        </div>

        {/* Left: Profile | Right: Account Buttons */}
        <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.9fr_1.5fr]">
          {/* Profile Section - Left */}
          <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-md">
            <div className="bg-gradient-to-r from-indigo-700 to-violet-700 px-5 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-200">
                Account Information
              </p>

              <h2 className="mt-1 text-xl font-extrabold">
                My Profile
              </h2>

              <p className="mt-1 text-sm text-indigo-100">
                Manage your personal information.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              {/* Profile image and details */}
              <div className="flex items-start gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Customer profile"
                    className="h-24 w-24 shrink-0 rounded-2xl border-2 border-indigo-100 object-cover shadow-sm sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-100 to-violet-100 text-5xl shadow-sm sm:h-28 sm:w-28">
                    👤
                  </div>
                )}

                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Full Name
                  </p>

                  <h3 className="mt-1 break-words text-lg font-extrabold text-slate-900">
                    {customerName}
                  </h3>

                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-600">
                      {user.email || "No email available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Change picture button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex w-24 items-center justify-center rounded-lg border border-indigo-700 bg-indigo-600 px-2 py-2.5 text-xs font-bold text-white shadow-sm transition duration-200 hover:scale-[0.97] hover:bg-indigo-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-28"
                >
                  {uploading
                    ? "Uploading..."
                    : avatarUrl
                      ? "Change Picture"
                      : "Upload Picture"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                  Image files only. Maximum size: 5 MB.
                </p>
              </div>

              {/* Customer ID */}
              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Customer ID
                </p>

                <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-700">
                  {user.id}
                </p>
              </div>

              {message && (
                <p
                  role="status"
                  className={`mt-4 break-words rounded-lg border px-3 py-2 text-sm font-medium ${
                    uploadSuccess
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </section>

          {/* Right: Account Menu */}
          <section>
        

            {/* Buttons arranged vertically */}
            <div className="ml-auto flex w-full max-w-md flex-col gap-3 lg:mr-0">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition-all duration-200 ease-out hover:scale-[0.98] hover:border-indigo-400 hover:bg-indigo-50/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-4"
                >
                  <div
                    className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${item.accent} transition-all duration-200 group-hover:w-1.5`}
                  />

                  <div
                    className={`ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.accent} text-xl shadow-sm transition-transform duration-200 group-hover:scale-95`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-slate-900 transition-colors group-hover:text-indigo-700 sm:text-base">
                      {index + 1}. {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-500 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                    →
                  </span>
                </Link>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-5 flex justify-end">
              <Link
                href="/"
                className="group inline-flex w-full items-end justify-items-end gap-2 rounded-xl border border-indigo-700 bg-gradient-to-r from-indigo-700 to-violet-700 px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition-all duration-200 hover:scale-[0.98] hover:from-indigo-800 hover:to-violet-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                🛍️ Continue Shopping
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Footer - unchanged */}
      <footer className="mt-8 border-t border-indigo-400 bg-indigo-600 text-white">
        <div className="w-full px-5 py-7 sm:px-8">
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
    </main>
  );
}
