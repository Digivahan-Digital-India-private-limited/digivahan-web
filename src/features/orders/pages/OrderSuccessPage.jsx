import React from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, ShoppingBag, Truck } from "lucide-react";

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-2xl opacity-70 pointer-events-none" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-bounce">
          <CheckCircle2 size={44} className="stroke-[1.5]" />
        </div>

        <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">Order Placed!</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Thank you for your order! Your physical Smart QR sticker will be prepared and shipped shortly.
        </p>

        {id && (
          <div className="mt-6 inline-flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3.5 w-full">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Order ID</span>
            <span className="mt-1 text-base font-mono font-bold text-slate-800 tracking-wide">
              {id.toUpperCase()}
            </span>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link
            to={`/orders/${id}/track`}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition shadow-md shadow-emerald-200"
          >
            <Truck size={16} />
            Track Shipment Details
            <ChevronRight size={14} className="ml-1" />
          </Link>
          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition"
          >
            <ShoppingBag size={16} />
            View My Orders
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccessPage;
