import React from "react";
import { Link } from "react-router-dom";
import { CircleCheckBig, Clock3 } from "lucide-react";
import { getSellerFlowDraft } from "../services/sellerFlowStorage";

const transferSteps = [
  { id: 1, title: "Offer accepted", done: true },
  { id: 2, title: "Payment initiated", done: true },
  { id: 3, title: "RC transfer in progress", done: false },
  { id: 4, title: "RC transfer completed", done: false },
];

const SellerTransferTrackerPage = () => {
  const draft = getSellerFlowDraft();

  if (!draft.acceptedAt) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Final offer is not accepted yet. Please complete the seller flow first.
        <Link
          to="/marketplace/sell/final-offer"
          className="ml-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Go to Final Offer
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Seller Flow: Payment & RC Tracker</h2>
        <p className="text-sm text-slate-500">Track sale closure and RC transfer progress from one place.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Offer ID</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{draft.offerId}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Accepted At</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{new Date(draft.acceptedAt).toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Seller Protection</p>
            <p className="mt-1 text-sm font-semibold text-emerald-700">Active until RC completion</p>
          </div>
        </div>

        <ol className="mt-4 space-y-2">
          {transferSteps.map((step) => (
            <li key={step.id} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
              {step.done ? (
                <CircleCheckBig size={16} className="text-emerald-600" />
              ) : (
                <Clock3 size={16} className="text-amber-600" />
              )}
              <span className={step.done ? "font-semibold text-slate-900" : ""}>{step.title}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/orders"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            View My Orders
          </Link>
          <Link
            to="/marketplace"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Marketplace
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SellerTransferTrackerPage;
