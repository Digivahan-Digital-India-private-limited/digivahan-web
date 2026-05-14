import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const howToOrder = [
  {
    id: 1,
    title: "Login to DigiVahan",
    detail:
      "Use User Login to access your account. If you are new, complete OTP and create your profile first.",
  },
  {
    id: 2,
    title: "Add your vehicle",
    detail:
      "Open My Garage and add vehicle details like RC number, fuel type, and model year.",
  },
  {
    id: 3,
    title: "Continue to order",
    detail:
      "Open My Orders and place your QR order with delivery information and preferred payment mode.",
  },
  {
    id: 4,
    title: "Track and activate QR",
    detail:
      "Track delivery status from dashboard and attach QR on your vehicle once it arrives.",
  },
];

const OrderQrPage = () => {
  const hasUserSession = Boolean(Cookies.get("user_token"));
  const orderStartPath = hasUserSession ? "/vehicles/add" : "/login";
  const orderStartLabel = hasUserSession ? "Start QR Order Flow" : "Login To Order QR";

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-6">
      <section className="rounded-3xl border border-yellow-200 bg-linear-to-br from-yellow-50 via-white to-amber-50 p-6 md:p-8 shadow-sm">
        <p className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
          DigiVahan QR Ordering
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">Order QR for your vehicle from our website</h1>
        <p className="mt-3 text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
          DigiVahan Smart QR helps people contact you securely in parking alerts, emergency situations, and vehicle
          support cases without exposing your private phone number.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={orderStartPath}
            className="rounded-full bg-linear-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-bold text-slate-900 hover:from-yellow-500 hover:to-amber-600"
          >
            {orderStartLabel}
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Open My Account
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">How to use our website to order QR</h2>
          <p className="mt-2 text-sm text-slate-600">
            Follow these simple steps to place your order quickly and correctly.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {howToOrder.map((step) => (
            <article key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Step {step.id}</p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            to={orderStartPath}
            className="rounded-full bg-linear-to-r from-yellow-400 to-amber-500 px-8 py-3 text-sm font-bold text-slate-900 shadow-[0_10px_25px_-15px_rgba(245,158,11,0.9)] hover:from-yellow-500 hover:to-amber-600"
          >
            Order QR In 2 Minutes
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrderQrPage;
