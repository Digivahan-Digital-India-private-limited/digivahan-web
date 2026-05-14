import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { estimateQuote, getSellerFlowDraft, setSellerFlowDraft } from "../services/sellerFlowStorage";

const SellerInstantQuotePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draft = getSellerFlowDraft();

  const [formData, setFormData] = useState({
    regNumber: draft.regNumber,
    brand: draft.brand,
    modelYear: draft.modelYear,
    kmsDriven: draft.kmsDriven,
    city: draft.city,
    expectedPrice: draft.expectedPrice,
  });

  useEffect(() => {
    const regFromQuery = searchParams.get("reg");
    if (regFromQuery && !formData.regNumber) {
      setFormData((prev) => ({ ...prev, regNumber: regFromQuery.toUpperCase() }));
    }
  }, [formData.regNumber, searchParams]);

  const currentQuote = useMemo(() => {
    if (!formData.modelYear && !formData.expectedPrice) {
      return draft.quoteValue || 0;
    }

    return estimateQuote(formData);
  }, [draft.quoteValue, formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetQuote = (event) => {
    event.preventDefault();

    if (!formData.regNumber || !formData.brand || !formData.modelYear || !formData.kmsDriven) {
      toast.error("Please fill all required fields");
      return;
    }

    const quoteValue = estimateQuote(formData);
    const next = setSellerFlowDraft({
      ...formData,
      quoteValue,
      offerId: `DV-OFFER-${Date.now().toString().slice(-6)}`,
      acceptedAt: "",
    });

    toast.success("Instant quote generated");
    navigate("/marketplace/sell/inspection", { state: { quoteValue: next.quoteValue } });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Seller Flow: Instant Quote</h2>
        <p className="text-sm text-slate-500">Part 2 starts here. Fill details to generate your estimated selling quote.</p>
      </section>

      <form onSubmit={handleGetQuote} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            name="regNumber"
            value={formData.regNumber}
            onChange={(event) =>
              handleChange({
                target: {
                  name: "regNumber",
                  value: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                },
              })
            }
            placeholder="Registration Number *"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand (e.g. Hyundai) *"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            name="modelYear"
            value={formData.modelYear}
            onChange={handleChange}
            placeholder="Model Year *"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            name="kmsDriven"
            value={formData.kmsDriven}
            onChange={handleChange}
            placeholder="KMs Driven *"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            name="expectedPrice"
            value={formData.expectedPrice}
            onChange={handleChange}
            placeholder="Expected Price (optional)"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-3">
          <p className="text-xs uppercase tracking-wide text-emerald-700">Estimated Quote</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(currentQuote || 0)}
          </p>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Continue to Inspection Booking
        </button>
      </form>
    </div>
  );
};

export default SellerInstantQuotePage;
