import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheckBig, Headset, MessageSquareMore, PhoneCall } from "lucide-react";

const categories = [
  "Buying assistance",
  "Selling assistance",
  "Quote and inspection",
  "Payment and RC transfer",
  "Technical issue",
  "Other",
];

const MarketplaceSupportPage = () => {
  const [formData, setFormData] = useState({
    category: categories[0],
    name: "",
    phone: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError("Please fill name, phone, and message to submit your request.");
      setTicketId("");
      return;
    }

    const generatedId = `DV-SUP-${Date.now().toString().slice(-6)}`;
    setTicketId(generatedId);
    setError("");
    setFormData((prev) => ({ ...prev, message: "" }));
  };

  return (
    <div className="space-y-6 pb-6">
      <section className="mp-grid-bg relative overflow-hidden rounded-4xl border border-emerald-100 bg-linear-to-br from-white via-emerald-50 to-cyan-100 p-5 shadow-[0_18px_40px_-24px_rgba(6,95,70,0.35)] sm:p-7">
        <div className="absolute -right-16 top-2 h-44 w-44 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-emerald-200/35 blur-3xl" />

        <div className="relative z-10 space-y-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <Headset size={14} />
            Marketplace Support
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Need help? Get guided support for buy and sell journeys
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Reach support for quotes, inspection, reservations, payments, RC transfer, or general marketplace guidance.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <PhoneCall size={18} />
          </div>
          <h2 className="mt-3 text-base font-bold text-slate-900">Call support desk</h2>
          <p className="mt-1 text-sm text-slate-600">Talk directly to support for urgent buy or sell concerns.</p>
          <a
            href="tel:7277277275"
            className="mt-3 inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Call 727-727-7275
            <ArrowRight size={14} />
          </a>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900">Quick support shortcuts</h2>
          <p className="mt-1 text-sm text-slate-600">Open the relevant page directly based on current stage.</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link to="/marketplace/sell/quote" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Seller Quote Help</Link>
            <Link to="/marketplace/sell/inspection" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Inspection Booking Help</Link>
            <Link to="/marketplace/sell/transfer-tracker" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Payment and RC Tracker Help</Link>
            <Link to="/marketplace/buy" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Buyer Listing and Compare Help</Link>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <MessageSquareMore size={18} className="text-emerald-700" />
          <h2 className="text-base font-bold text-slate-900">Raise support request</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Category</span>
            <select
              value={formData.category}
              onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Name</span>
            <input
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Enter full name"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Phone</span>
            <input
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value.replace(/[^0-9]/g, "") }))}
              placeholder="Enter mobile number"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Message</span>
            <textarea
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              placeholder="Describe your issue or question"
              className="mt-1.5 h-28 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Submit Request
              <ArrowRight size={15} />
            </button>
          </div>
        </form>

        {error ? (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </p>
        ) : null}

        {ticketId ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            <CircleCheckBig size={16} />
            Request submitted. Reference ID: {ticketId}
          </p>
        ) : null}
      </section>
    </div>
  );
};

export default MarketplaceSupportPage;
