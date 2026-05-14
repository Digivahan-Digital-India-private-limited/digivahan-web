import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  ClipboardCheck,
  Clock3,
  FileSearch,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

const promiseCards = [
  {
    id: "p1",
    title: "Transparent Quote Range",
    description:
      "Every seller quote is shown with a confidence range so users can understand expected variance before inspection.",
    icon: FileSearch,
  },
  {
    id: "p2",
    title: "Same-Day Payment Goal",
    description:
      "Once offer is accepted and verification completes, payout initiation is targeted within the same day.",
    icon: IndianRupee,
  },
  {
    id: "p3",
    title: "Inspection-Based Fairness",
    description:
      "Final offer is linked to measurable inspection outcomes and the reasons are clearly presented to the seller.",
    icon: ClipboardCheck,
  },
  {
    id: "p4",
    title: "Transfer Visibility",
    description:
      "Payment and RC milestones are visible from one timeline so users always know what stage is currently active.",
    icon: Clock3,
  },
];

const inspectionPillars = [
  "Exterior and body condition",
  "Engine and transmission checks",
  "Electricals and safety components",
  "Tyres, suspension, and brakes",
  "Document validity and ownership trail",
  "Road-test behavior and noise markers",
];

const transferTimeline = [
  { id: 1, title: "Offer accepted", eta: "Instant" },
  { id: 2, title: "Payment initiated", eta: "Within hours" },
  { id: 3, title: "RC transfer in progress", eta: "3-10 working days" },
  { id: 4, title: "RC transfer completed", eta: "As per RTO timeline" },
];

const MarketplaceTrustPage = () => {
  return (
    <div className="space-y-6 pb-6">
      <section className="mp-grid-bg relative overflow-hidden rounded-4xl border border-sky-100 bg-linear-to-br from-white via-sky-50 to-cyan-100 p-5 shadow-[0_18px_40px_-24px_rgba(14,116,144,0.35)] sm:p-7">
        <div className="absolute -right-20 top-0 h-52 w-52 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-sky-200/35 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
            <ShieldCheck size={14} />
            Trust and Process Center
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Build confidence before every buy or sell decision
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            This page explains the key marketplace promises, inspection standards, and transfer milestones so the journey stays transparent.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Promise Center</h2>
          <BadgeCheck size={18} className="text-sky-700" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {promiseCards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <Icon size={16} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-slate-900">Inspection methodology</h3>
          <p className="mt-1 text-sm text-slate-600">
            Core checks used for quote and listing confidence.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {inspectionPillars.map((item) => (
              <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-slate-900">Payment and RC timeline</h3>
          <p className="mt-1 text-sm text-slate-600">
            Indicative timeline visible in seller transfer tracker.
          </p>
          <ol className="mt-4 space-y-2">
            {transferTimeline.map((step) => (
              <li key={step.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Step {step.id}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="text-xs font-semibold text-sky-700">{step.eta}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Continue journey</h3>
            <p className="text-sm text-slate-600">Use buy and sell modules with process clarity.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/marketplace/buy"
              className="inline-flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
            >
              Buy Cars
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/marketplace/sell"
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Sell Cars
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/marketplace/support"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Get Support
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceTrustPage;
