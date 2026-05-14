import React, { useMemo, useState } from "react";
import { MessageCircleHeart, Star } from "lucide-react";

const reviewData = [
  {
    id: "r1",
    name: "Rohit B.",
    city: "Delhi",
    journeyType: "buy",
    rating: 5,
    car: "2021 Hyundai Creta",
    note: "Inspection details were very clear. I reserved confidently after compare view.",
  },
  {
    id: "r2",
    name: "Anjali M.",
    city: "Bengaluru",
    journeyType: "sell",
    rating: 4,
    car: "2018 Honda City",
    note: "Quote to inspection was smooth and final offer explanation was transparent.",
  },
  {
    id: "r3",
    name: "Farhan K.",
    city: "Gurugram",
    journeyType: "buy",
    rating: 5,
    car: "2020 Baleno",
    note: "Filter and compare flow saved time. Reservation process felt structured.",
  },
  {
    id: "r4",
    name: "Sakshi T.",
    city: "Noida",
    journeyType: "sell",
    rating: 4,
    car: "2019 Nexon",
    note: "Transfer tracker updates gave confidence after handover.",
  },
  {
    id: "r5",
    name: "Vikas R.",
    city: "Pune",
    journeyType: "buy",
    rating: 5,
    car: "2022 Tata Nexon",
    note: "Pricing and ownership info were visible right on listing details.",
  },
  {
    id: "r6",
    name: "Neha S.",
    city: "Hyderabad",
    journeyType: "sell",
    rating: 4,
    car: "2017 Maruti Swift",
    note: "Seller checklist and staged process made it easy to prepare documents.",
  },
];

const cityOptions = ["all", "Delhi", "Gurugram", "Noida", "Bengaluru", "Pune", "Hyderabad"];

const MarketplaceReviewsPage = () => {
  const [journeyType, setJourneyType] = useState("all");
  const [city, setCity] = useState("all");

  const filteredReviews = useMemo(() => {
    return reviewData.filter((item) => {
      const journeyMatch = journeyType === "all" || item.journeyType === journeyType;
      const cityMatch = city === "all" || item.city === city;
      return journeyMatch && cityMatch;
    });
  }, [city, journeyType]);

  const averageRating = useMemo(() => {
    if (!filteredReviews.length) {
      return 0;
    }
    const total = filteredReviews.reduce((sum, item) => sum + item.rating, 0);
    return total / filteredReviews.length;
  }, [filteredReviews]);

  return (
    <div className="space-y-6 pb-6">
      <section className="mp-grid-bg relative overflow-hidden rounded-4xl border border-violet-100 bg-linear-to-br from-white via-violet-50 to-fuchsia-100 p-5 shadow-[0_18px_40px_-24px_rgba(109,40,217,0.35)] sm:p-7">
        <div className="absolute -right-16 top-4 h-44 w-44 rounded-full bg-fuchsia-200/35 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-violet-200/35 blur-3xl" />

        <div className="relative z-10 space-y-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
            <MessageCircleHeart size={14} />
            Verified Stories
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Buyer and seller voices from active marketplace journeys
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Use these reviews as trust indicators while evaluating flow improvements and conversion quality.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Visible reviews</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{filteredReviews.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Average rating</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{averageRating.toFixed(1)} / 5</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Journey split</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Buy and sell experience highlights</p>
          </article>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Journey type</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setJourneyType("all")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  journeyType === "all"
                    ? "border-violet-200 bg-violet-100 text-violet-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setJourneyType("buy")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  journeyType === "buy"
                    ? "border-violet-200 bg-violet-100 text-violet-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setJourneyType("sell")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  journeyType === "sell"
                    ? "border-violet-200 bg-violet-100 text-violet-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">City</span>
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-500"
            >
              {cityOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All Cities" : option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredReviews.map((item) => (
          <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-slate-900">{item.name}</p>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  item.journeyType === "buy" ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {item.journeyType}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{item.city} • {item.car}</p>

            <div className="mt-2 flex items-center gap-1 text-amber-500">
              {Array.from({ length: item.rating }).map((_, idx) => (
                <Star key={`${item.id}-${idx}`} size={14} fill="currentColor" />
              ))}
            </div>

            <p className="mt-3 text-sm text-slate-700">{item.note}</p>
          </article>
        ))}
      </section>

      {!filteredReviews.length ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No reviews found for the selected filters.
        </section>
      ) : null}
    </div>
  );
};

export default MarketplaceReviewsPage;
