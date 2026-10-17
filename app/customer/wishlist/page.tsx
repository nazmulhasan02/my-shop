
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { products } from "../../data/products";


export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("myshop-wishlist");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (id) => typeof id === "number" && Number.isFinite(id)
          )
        ) {
          setWishlist(parsed);
        }
      }
    } catch {
      console.error("Could not load wishlist.");
    } finally {
      setLoaded(true);
    }
  }, []);

  function removeFromWishlist(id: number) {
    setWishlist((current) =>
      current.filter((itemId) => itemId !== id)
    );

    const updatedWishlist = wishlist.filter(
      (itemId) => itemId !== id
    );

    localStorage.setItem(
      "myshop-wishlist",
      JSON.stringify(updatedWishlist)
    );
  }

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f3f5fb] p-8">
        <p className="text-center text-slate-600">
          Loading wishlist...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#f3f5fb] px-4 py-8 text-slate-900 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-950">
            My Wishlist ❤️
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your favourite products in one place.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
          <p className="text-5xl">♡</p>
          <h2 className="mt-4 text-xl font-bold">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Browse products and add your favourites here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Explore Products
          </Link>
        </section>
      ) : (
        <>
          <p className="mb-4 text-sm font-semibold text-slate-600">
            {wishlistProducts.length} favourite product(s)
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlistProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="block"
                >
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-3">
                  <Link href={`/products/${product.id}`}>
                    <h2 className="line-clamp-2 min-h-10 font-bold hover:text-indigo-700">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-2 font-extrabold text-indigo-700">
                    ৳{product.price.toLocaleString("en-BD")}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="mt-3 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                  >
                    ♥ Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
