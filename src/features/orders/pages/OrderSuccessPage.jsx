import React from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={34} />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">Order Successful</h2>
      <p className="mt-2 text-sm text-slate-500">Your order {id?.toUpperCase()} has been placed successfully.</p>

      <div className="mt-5 flex justify-center gap-2">
        <Link to="/orders" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          Go to Orders
        </Link>
        <Link to={`/orders/${id}/track`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Track Order
        </Link>
      </div>
    </section>
  );
};

export default OrderSuccessPage;
