import React, { useMemo, useState } from "react";
import { CarFront, Wrench } from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const brandBaseCost = {
  maruti: 17000,
  hyundai: 19000,
  tata: 20000,
  mahindra: 22000,
  honda: 23000,
  kia: 24000,
  toyota: 26000,
  other: 21000,
};

const cityMultiplier = {
  delhi: 1.08,
  gurugram: 1.1,
  noida: 1.05,
  bangalore: 1.12,
  mumbai: 1.14,
  pune: 1.07,
  hyderabad: 1.06,
  chennai: 1.06,
  default: 1,
};

const currentYear = new Date().getFullYear();

const MarketplaceServiceCostCalculatorPage = () => {
  const [brand, setBrand] = useState("hyundai");
  const [modelYear, setModelYear] = useState(2021);
  const [city, setCity] = useState("delhi");
  const [annualKm, setAnnualKm] = useState(12000);

  const estimate = useMemo(() => {
    const base = brandBaseCost[brand] || brandBaseCost.other;
    const age = Math.max(0, currentYear - Number(modelYear || currentYear));
    const ageMultiplier = 1 + Math.max(0, age - 2) * 0.06;
    const kmMultiplier =
      Number(annualKm) > 12000
        ? 1 + ((Number(annualKm) - 12000) / 10000) * 0.08
        : 1;
    const locationMultiplier = cityMultiplier[city] || cityMultiplier.default;

    const annualEstimate = Math.round(base * ageMultiplier * kmMultiplier * locationMultiplier);

    return {
      annualEstimate,
      periodicService: Math.round(annualEstimate * 0.42),
      wearAndTear: Math.round(annualEstimate * 0.23),
      tyreAndBrake: Math.round(annualEstimate * 0.2),
      misc: Math.round(annualEstimate * 0.15),
    };
  }, [annualKm, brand, city, modelYear]);

  return (
    <div className="space-y-6 pb-6">
      <section className="mp-grid-bg relative overflow-hidden rounded-4xl border border-rose-100 bg-linear-to-br from-white via-rose-50 to-orange-100 p-5 shadow-[0_18px_40px_-24px_rgba(190,24,93,0.3)] sm:p-7">
        <div className="absolute -right-16 top-2 h-44 w-44 rounded-full bg-rose-200/35 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-orange-200/35 blur-3xl" />

        <div className="relative z-10 space-y-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
            <Wrench size={14} />
            Service Cost Calculator
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Estimate annual service and upkeep cost before purchase
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Configure brand, year, city, and running usage to estimate ownership service costs.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-900">Vehicle profile</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Brand</span>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
              >
                <option value="maruti">Maruti</option>
                <option value="hyundai">Hyundai</option>
                <option value="tata">Tata</option>
                <option value="mahindra">Mahindra</option>
                <option value="honda">Honda</option>
                <option value="kia">Kia</option>
                <option value="toyota">Toyota</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Model year</span>
              <input
                type="number"
                min="2005"
                max={String(currentYear)}
                value={modelYear}
                onChange={(event) => setModelYear(Number(event.target.value || currentYear))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">City</span>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
              >
                <option value="delhi">Delhi</option>
                <option value="gurugram">Gurugram</option>
                <option value="noida">Noida</option>
                <option value="bangalore">Bangalore</option>
                <option value="mumbai">Mumbai</option>
                <option value="pune">Pune</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Annual running (km)</span>
              <input
                type="number"
                min="1000"
                value={annualKm}
                onChange={(event) => setAnnualKm(Number(event.target.value || 1000))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
              />
            </label>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-900">Estimated annual cost</h2>
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">Total estimate</p>
            <p className="mt-1 text-2xl font-extrabold text-rose-800">{formatCurrency(estimate.annualEstimate)}</p>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              Periodic service: <span className="font-semibold text-slate-900">{formatCurrency(estimate.periodicService)}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              Wear and tear: <span className="font-semibold text-slate-900">{formatCurrency(estimate.wearAndTear)}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              Tyre and brake: <span className="font-semibold text-slate-900">{formatCurrency(estimate.tyreAndBrake)}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              Miscellaneous: <span className="font-semibold text-slate-900">{formatCurrency(estimate.misc)}</span>
            </div>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
            <CarFront size={14} />
            Indicative estimate for planning purposes only.
          </p>
        </article>
      </section>
    </div>
  );
};

export default MarketplaceServiceCostCalculatorPage;
