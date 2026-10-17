
import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-white bg-white/95 p-7 text-center shadow-xl shadow-indigo-100/70 sm:p-8">

        {/* Brand */}
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600">
            MyShop<span className="text-slate-800"></span>
          </h1>
        </Link>

        {/* Welcome Message */}
        <div className="mb-7 mt-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome to MyShop!
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to your account or create a new one
            to start shopping.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="flex items-center justify-center rounded-xl border border-indigo-200 bg-white px-6 py-3.5 font-semibold text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            Create New Account
          </Link>

          <Link
            href="/"
            className="mt-3 inline-flex items-center justify-center text-base font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            Back to Homepage
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-slate-400">
          Your shopping journey starts here.
        </p>
      </div>
    </main>
  );
}
