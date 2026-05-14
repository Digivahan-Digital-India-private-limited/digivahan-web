import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSellerFlowDraft, setSellerFlowDraft } from "../services/sellerFlowStorage";

const SellerFinalOfferPage = () => {
  const navigate = useNavigate();
  const draft = getSellerFlowDraft();

  const offerValue = useMemo(() => {
    const base = Number(draft.quoteValue || 0);
    const kms = Number(draft.kmsDriven || 0);
    const adjustment = Math.max(-0.06, 0.02 - kms / 2000000);
    return Math.round(base * (1 + adjustment));
  }, [draft.kmsDriven, draft.quoteValue]);

  if (!draft.quoteValue || !draft.inspectionDate || !draft.inspectionSlot) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Inspection step is incomplete. Please complete quote and inspection first.
        <button
          type="button"
          onClick={() => navigate("/marketplace/sell/inspection")}
          className="ml-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Go to Inspection
        </button>
      </section>
    );
  }

  const acceptOffer = () => {
    setSellerFlowDraft({ acceptedAt: new Date().toISOString(), quoteValue: offerValue });
    toast.success("Final offer accepted");
    navigate("/marketplace/sell/transfer-tracker");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Seller Flow: Final Offer</h2>
        <p className="text-sm text-slate-500">Review offer details and confirm sale to move into payment and RC transfer tracking.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Offer ID</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{draft.offerId || "DV-OFFER"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Inspection Slot</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{draft.inspectionDate} • {draft.inspectionSlot}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Offer Validity</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">24 hours</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-4">
          <p className="text-xs uppercase tracking-wide text-emerald-700">Final Offer Value</p>
          <p className="mt-1 text-3xl font-bold text-emerald-800">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(offerValue)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={acceptOffer}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Accept Offer
          </button>
          <button
            type="button"
            onClick={() => navigate("/marketplace/sell/inspection")}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Rebook Inspection
          </button>
        </div>
      </section>
    </div>
  );
};

export default SellerFinalOfferPage;
