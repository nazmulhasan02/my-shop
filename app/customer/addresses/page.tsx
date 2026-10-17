
"use client";

import { useState } from "react";

export default function AddressesPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const inputStyle =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const labelStyle = "block text-sm font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-4 sm:py-5">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => (window.location.href = "/customer")}
          className="mb-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Dashboard
        </button>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <div className="bg-linear-to-r from-blue-700 to-indigo-700 px-5 py-4 text-white">
            <h1 className="text-2xl font-bold">My Addresses</h1>
            <p className="mt-1 text-sm text-blue-100">
              Manage your delivery information.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              alert("Address saving will be added in the next step.");
            }}
            className="space-y-3 p-4 sm:p-5"
          >
            <h2 className="text-base font-bold text-slate-900">
              Delivery Information
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelStyle}>
                  Full Name *
                </label>
                <input
                  id="fullName"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter full name"
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelStyle}>
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="01XXXXXXXXX"
                  className={inputStyle}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelStyle}>
                  Full Delivery Address *
                </label>
                <textarea
                  id="address"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={2}
                  placeholder="House, road, area and district"
                  className={`${inputStyle} resize-y`}
                />
              </div>

              <div>
                <label htmlFor="city" className={labelStyle}>
                  City / District *
                </label>
                <input
                  id="city"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Enter city or district"
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="postalCode" className={labelStyle}>
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  autoComplete="postal-code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Enter postal code"
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <p className="text-xs text-slate-500">* Required fields</p>
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 focus:ring-2 focus:ring-blue-300"
              >
                Save Address →
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}