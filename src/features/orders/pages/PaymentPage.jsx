import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");

  const handlePay = () => {
    navigate(`/orders/${id}/success`, { replace: true });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Payment</h2>
        <p className="text-sm text-slate-500">Select a payment method and complete your order securely.</p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {[
          { value: "upi", label: "UPI" },
          { value: "card", label: "Debit/Credit Card" },
          { value: "netbanking", label: "Net Banking" },
        ].map((item) => (
          <label key={item.value} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
            <input
              type="radio"
              name="paymentMethod"
              checked={method === item.value}
              onChange={() => setMethod(item.value)}
            />
            {item.label}
          </label>
        ))}

        <button
          type="button"
          onClick={handlePay}
          className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Pay Now
        </button>
      </section>
    </div>
  );
};

export default PaymentPage;
