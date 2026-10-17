
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { supabase } from "@/lib/supabase";
import { products } from "./data/products";


const categories = [
  { name: "All Products", emoji: "🛍️" },
  { name: "Fashion", emoji: "👕" },
  { name: "Electronics", emoji: "🎧" },
  { name: "Shoes", emoji: "👟" },
  { name: "Bags", emoji: "🎒" },
  { name: "Accessories", emoji: "🕶️" },
  { name: "Home & Living", emoji: "🏠" },
];

export default function Home() {
  const { cart, setCart, addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");
  const [search, setSearch] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<number | null>(
    null
  );

  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("myshop-wishlist");

      if (savedWishlist) {
        const parsedWishlist: unknown = JSON.parse(savedWishlist);

        if (
          Array.isArray(parsedWishlist) &&
          parsedWishlist.every(
            (id) => typeof id === "number" && Number.isFinite(id)
          )
        ) {
          setWishlist(parsedWishlist);
        }
      }
    } catch {
      console.error("Could not load wishlist.");
    } finally {
      setWishlistLoaded(true);
    }
  }, []);

  // Save only after the initial wishlist load
  useEffect(() => {
    if (!wishlistLoaded) return;

    localStorage.setItem(
      "myshop-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist, wishlistLoaded]);

  // Load logged-in user and listen for authentication changes
  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (active) {
          setUserEmail(user?.email ?? null);
        }
      } catch {
        if (active) {
          setUserEmail(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUserEmail(session?.user?.email ?? null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

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

  // Add or remove a product from wishlist
  function toggleWishlist(id: number) {
    setWishlist((currentWishlist) =>
      currentWishlist.includes(id)
        ? currentWishlist.filter((itemId) => itemId !== id)
        : [...currentWishlist, id]
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen w-full bg-[#f3f5fb] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-indigo-100 bg-white/95 shadow-sm backdrop-blur">
   

        <div className="flex w-full flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-2">
          <Link
            href="/"
            className="shrink-0 text-2xl font-extrabold tracking-tight text-indigo-950"
          >
            MyShop<span className="text-indigo-600"></span>
          </Link>

          <div className="order-3 w-full sm:order-none sm:ml-5 sm:flex-1">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
              <span aria-hidden="true">🔍</span>

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or categories..."
                aria-label="Search products"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-bold text-slate-500 hover:text-indigo-700"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/cart"
              className="relative rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-800 transition hover:bg-indigo-100"
            >
              🛒 <span className="hidden sm:inline">Cart</span>

              {totalQuantity > 0 && (
                <span className="ml-1 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {!loading &&
              (userEmail ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/customer"
                    className="hidden max-w-36 truncate rounded-xl px-2 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-50 sm:block"
                  >
                    My Account
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/account"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              ))}
          </div>
        </div>
      </header>

      {/* Full-width page content */}
      <div className="w-full px-1 py-1 sm:px-6 sm:py-1 lg:px-1">
        {/* Hero */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-indigo-800 via-indigo-700 to-blue-700 px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
            Welcome to MyShop
          </p>

          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Find Something You Love
          </h1>

          <p className="mt-2 max-w-xl text-sm text-indigo-100 sm:text-base">
            Explore everyday essentials, fashion, electronics and more.
          </p>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All Products");
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-800 transition hover:bg-indigo-50"
          >
            Explore Products →
          </button>
        </section>

        {/* Category Sidebar + Products */}
        <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24">
            <h2 className="px-3 pb-3 pt-2 text-base font-extrabold text-slate-900">
              Shop by Category
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {categories.map((category) => {
                const isActive =
                  selectedCategory === category.name;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(category.name)
                    }
                    aria-pressed={isActive}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition lg:w-full ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-800"
                    }`}
                  >
                    <span className="text-lg">{category.emoji}</span>
                    <span>{category.name}</span>

                    {isActive && (
                      <span className="ml-auto hidden lg:inline">
                        ›
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <section id="products" className="min-w-0">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Discover
                </p>

                <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                  {search
                    ? "Search Results"
                    : selectedCategory === "All Products"
                      ? "Popular Products"
                      : selectedCategory}
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <p className="text-4xl">🔎</p>

                <h3 className="mt-3 font-bold text-slate-800">
                  No products found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try another search or select a different category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All Products");
                  }}
                  className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredProducts.map((product) => {
                  const cartItem = cart.find(
                    (item) => item.id === product.id
                  );

                  const isWishlisted = wishlist.includes(product.id);

                  return (
                    <article
                      key={product.id}
                      className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-slate-100">
                        <Link
                          href={`/products/${product.id}`}
                          className="absolute inset-0 block"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={
                            isWishlisted
                              ? `Remove ${product.name} from wishlist`
                              : `Add ${product.name} to wishlist`
                          }
                          aria-pressed={isWishlisted}
                          className={`absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full text-xl shadow-sm transition hover:scale-110 ${
                            isWishlisted
                              ? "bg-rose-500 text-white"
                              : "bg-white/95 text-slate-600 hover:text-rose-500"
                          }`}
                        >
                          {isWishlisted ? "❤️" : "♡"}
                        </button>

                        {/* Category Badge */}
                        <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-indigo-800 shadow-sm sm:text-xs">
                          {product.category}
                        </span>
                      </div>

                      {/* Product Information */}
                      <div className="p-3 sm:p-3.5">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-slate-800 transition hover:text-indigo-700 sm:text-base">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="mt-2 text-base font-extrabold text-indigo-700 sm:text-lg">
                          ৳{product.price.toLocaleString("en-BD")}
                        </p>

                        {cartItem ? (
                          <div className="mt-3 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(product.id)
                              }
                              aria-label={`Decrease ${product.name} quantity`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-indigo-700 shadow-sm hover:bg-indigo-100"
                            >
                              −
                            </button>

                            <span className="text-sm font-extrabold text-indigo-950">
                              {cartItem.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(product.id)
                              }
                              aria-label={`Increase ${product.name} quantity`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white hover:bg-indigo-700"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(product);
                              setAddedProductId(product.id);

                              window.setTimeout(
                                () => setAddedProductId(null),
                                1200
                              );
                            }}
                            className="mt-3 w-full rounded-xl bg-indigo-600 px-2 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 sm:text-sm"
                          >
                            {addedProductId === product.id
                              ? "✓ Added to Cart"
                              : "+ Add to Cart"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
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
