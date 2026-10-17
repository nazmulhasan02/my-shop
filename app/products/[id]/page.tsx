
import { Suspense } from "react";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import ProductReviews from "./ProductReviews";
import { products } from "../../data/products";

export const instant = false;

async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md text-center">
          <div className="text-5xl">🔎</div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Product Not Found
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Sorry, we could not find the product you are looking for.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-indigo-600"
          >
            MyShop<span className="text-slate-800"></span>
          </Link>

          <Link
            href="/#products"
            className="rounded-xl border border-slate-400 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-600 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-5">
        {/* Breadcrumb */}
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Link
            href="/"
            className="text-slate-500 transition hover:text-indigo-600"
          >
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href="/#products"
            className="text-slate-500 transition hover:text-indigo-600"
          >
            Products
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-800">{product.name}</span>
        </nav>

        {/* Product Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            {/* Product Image */}
            <div className="relative flex min-h-[250px] items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-100 p-5 sm:min-h-[300px] sm:p-6">
              <span className="absolute left-4 top-4 rounded-full border border-indigo-100 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 shadow-sm sm:left-5 sm:top-5 sm:text-xs">
                {product.category}
              </span>

              <div className="flex aspect-square w-full max-w-[235px] items-center justify-center overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 sm:max-w-[250px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain transition duration-300 hover:scale-105"
                />
              </div>

              <span className="absolute bottom-3 text-[9px] font-bold tracking-[0.2em] text-indigo-400">
                MYSHOP COLLECTION
              </span>
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                {product.category} Collection
              </p>

              <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                {product.name}
              </h1>

              {/* Customer Rating Notice */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm text-amber-500">★★★★★</span>
                <span className="text-xs text-slate-500">
                  See customer ratings below
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  ৳{product.price.toLocaleString("en-BD")}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  <span>✓</span> Available
                </span>
              </div>

              <div className="my-4 h-px bg-slate-100" />

              {/* Description */}
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Product Description
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                Discover our {product.name}, from the MyShop{" "}
                {product.category} collection. A great choice for your everyday
                needs, with a practical style and excellent value.
              </p>

              {/* Add to Cart */}
              <div className="mt-4">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    emoji: product.emoji,
                  }}
                />
              </div>

              {/* Shopping Benefits */}
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-base">
                    🚚
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Delivery
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Delivery details coming soon
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-base">
                    🛡️
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Shopping Support
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      More details coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews & Ratings */}
        <ProductReviews productId={String(product.id)} />

        {/* Continue Shopping */}
        <section className="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Looking for something else?
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Explore more products in our collection.
            </p>
          </div>

          <Link
            href="/#products"
            className="inline-flex items-center justify-center rounded-xl border border-slate-400 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-600"
          >
            Browse All Products
          </Link>
        </section>
      </div>

      {/* Professional Full-Width Footer */}
      <footer className="mt-5 border-t border-indigo-400 bg-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
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

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm font-medium text-slate-500">
            Loading product details...
          </p>
        </main>
      }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}
