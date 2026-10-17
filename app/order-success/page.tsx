
export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-blue-100 to-indigo-100 px-5 py-8 text-slate-900">
      <div className="w-full max-w-lg rounded-3xl border border-indigo-100 bg-white/85 p-7 text-center shadow-xl shadow-indigo-900/5 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-50 text-4xl font-extrabold text-green-600 shadow-sm">
          ✓
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
          Thank you for choosing us
        </p>

        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-indigo-950 sm:text-3xl">
          Order Placed Successfully!
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
          Thank you for shopping with MyShop. Your order has been placed
          successfully. We appreciate your trust in us!
        </p>

        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3">
          <p className="text-sm font-medium text-indigo-900">
            🛍️ Your shopping journey continues with MyShop.
          </p>
        </div>

        <a
          href="/"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white shadow-md shadow-indigo-900/10 transition duration-200 hover:bg-indigo-700 hover:shadow-lg"
        >
          <span aria-hidden="true">⌂</span>
          Back to Home
        </a>

        <p className="mt-6 text-xs font-medium text-slate-400">
          MyShop · Happy Shopping!
        </p>
      </div>
    </main>
  );
}
