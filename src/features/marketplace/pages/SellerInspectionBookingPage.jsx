import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSellerFlowDraft, setSellerFlowDraft } from "../services/sellerFlowStorage";

const slots = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

const SellerInspectionBookingPage = () => {
  const navigate = useNavigate();
  const draft = getSellerFlowDraft();

  const [formData, setFormData] = useState({
    inspectionType: draft.inspectionType || "doorstep",
    inspectionDate: draft.inspectionDate || "",
    inspectionSlot: draft.inspectionSlot || "",
    notes: draft.notes || "",
  });

  const isDraftValid = useMemo(() => Boolean(draft.regNumber && draft.quoteValue), [draft]);

  if (!isDraftValid) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Quote not found. Please start with instant quote first.
        <button
          type="button"
          onClick={() => navigate("/marketplace/sell/quote")}
          className="ml-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Go to Quote
        </button>
      </section>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.inspectionDate || !formData.inspectionSlot) {
      toast.error("Please select inspection date and slot");
      return;
    }

    setSellerFlowDraft(formData);
    toast.success("Inspection booking details saved");
    navigate("/marketplace/sell/final-offer");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Seller Flow: Inspection Booking</h2>
        <p className="text-sm text-slate-500">Choose doorstep or hub inspection for your vehicle evaluation.</p>
      </section>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
            <input
              type="radio"
              name="inspectionType"
              checked={formData.inspectionType === "doorstep"}
              onChange={() => setFormData((prev) => ({ ...prev, inspectionType: "doorstep" }))}
            />
            Doorstep Inspection
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
            <input
              type="radio"
              name="inspectionType"
              checked={formData.inspectionType === "hub"}
              onChange={() => setFormData((prev) => ({ ...prev, inspectionType: "hub" }))}
            />
            Hub Inspection
          </label>

          <input
            type="date"
            value={formData.inspectionDate}
            onChange={(event) => setFormData((prev) => ({ ...prev, inspectionDate: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />

          <select
            value={formData.inspectionSlot}
            onChange={(event) => setFormData((prev) => ({ ...prev, inspectionSlot: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            <option value="">Select slot</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={formData.notes}
          onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="Optional notes for inspection executive"
          className="mt-3 h-24 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
        />

        <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
          Quote reference: <span className="font-semibold text-slate-800">{draft.offerId}</span>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Continue to Final Offer
        </button>
      </form>
    </div>
  );
};

export default SellerInspectionBookingPage;
