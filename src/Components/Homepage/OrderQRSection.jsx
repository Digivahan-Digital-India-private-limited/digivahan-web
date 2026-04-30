import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Create or login to your account",
    description:
      "Sign in to DigiVahan so your QR order can be linked to your profile and vehicles.",
  },
  {
    id: 2,
    title: "Add vehicle details",
    description:
      "Enter RC number and vehicle basics from your My Garage screen to start the order flow.",
  },
  {
    id: 3,
    title: "Place QR order",
    description:
      "Choose your QR type, confirm delivery details, and complete secure payment.",
  },
  {
    id: 4,
    title: "Track and activate",
    description:
      "Track shipment from dashboard and activate your QR once it is delivered.",
  },
];

const OrderQRSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="rounded-3xl border border-yellow-200 bg-linear-to-br from-yellow-50 via-white to-amber-50 p-6 md:p-8 shadow-sm">
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
            Order QR For Your Vehicle
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Order your DigiVahan Smart QR in minutes</h2>
          <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
            Your QR helps people connect with you securely in emergencies, incorrect parking, or urgent roadside
            situations without exposing your personal number.
          </p>
        </div>

        <div className="my-6 flex justify-center">
          <Link
            to="/order-qr"
            className="rounded-full bg-linear-to-r from-yellow-400 to-amber-500 px-7 py-3 text-sm font-bold text-slate-900 shadow-[0_10px_25px_-15px_rgba(245,158,11,0.9)] hover:from-yellow-500 hover:to-amber-600"
          >
            Order QR Now
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.id} className="rounded-2xl border border-yellow-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Step {step.id}</p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderQRSection;
