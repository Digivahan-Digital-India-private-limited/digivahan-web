import React, { useMemo, useState } from "react";
import { Calculator, IndianRupee } from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const MarketplaceEmiCalculatorPage = () => {
  const [carPrice, setCarPrice] = useState(900000);
  const [downPayment, setDownPayment] = useState(180000);
  const [annualRate, setAnnualRate] = useState(10.5);
  const [tenureMonths, setTenureMonths] = useState(60);

  const result = useMemo(() => {
    const principal = Math.max(0, Number(carPrice) - Number(downPayment));
    const months = Math.max(1, Number(tenureMonths));
    const monthlyRate = Number(annualRate) / 1200;

    let emi = 0;
    if (principal > 0) {
      if (monthlyRate === 0) {
        emi = principal / months;
      } else {
        const growth = (1 + monthlyRate) ** months;
        emi = (principal * monthlyRate * growth) / (growth - 1);
      }
    }

    const totalPayable = emi * months;
    const totalInterest = Math.max(0, totalPayable - principal);

    return {
      principal,
      emi,
      totalInterest,
      totalPayable,
    };
  }, [annualRate, carPrice, downPayment, tenureMonths]);

  return (
    <div className="space-y-6 pb-6">
      <section className="mp-grid-bg relative overflow-hidden rounded-4xl border border-amber-100 bg-linear-to-br from-white via-amber-50 to-orange-100 p-5 shadow-[0_18px_40px_-24px_rgba(180,83,9,0.35)] sm:p-7">
        <div className="absolute -right-16 top-2 h-44 w-44 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-amber-200/35 blur-3xl" />

        <div className="relative z-10 space-y-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
            <Calculator size={14} />
            EMI Calculator
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Estimate monthly EMI before reserving a car
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Adjust principal, tenure, and interest to understand financing comfort before final decision.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-900">Loan inputs</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Car price</span>
              <input
                type="number"
                min="0"
                value={carPrice}
                onChange={(event) => setCarPrice(Number(event.target.value || 0))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Down payment</span>
              <input
                type="number"
                min="0"
                value={downPayment}
                onChange={(event) => setDownPayment(Number(event.target.value || 0))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Annual interest rate (%)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={annualRate}
                onChange={(event) => setAnnualRate(Number(event.target.value || 0))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Tenure (months)</span>
              <input
                type="number"
                min="1"
                value={tenureMonths}
                onChange={(event) => setTenureMonths(Number(event.target.value || 1))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500"
              />
            </label>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-900">Estimated output</h2>
          <div className="mt-4 space-y-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Loan amount</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(result.principal)}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Monthly EMI</p>
              <p className="mt-1 text-2xl font-extrabold text-amber-800">{formatCurrency(result.emi)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total interest</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{formatCurrency(result.totalInterest)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total payable</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{formatCurrency(result.totalPayable)}</p>
            </div>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            <IndianRupee size={14} />
            Values are indicative and may vary by lender and profile.
          </p>
        </article>
      </section>
    </div>
  );
};

export default MarketplaceEmiCalculatorPage;
