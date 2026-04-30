import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listOrders } from "../services/ordersApi";

const TrackOrderPage = () => {
  const { id } = useParams();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: listOrders,
  });

  const order = id
    ? orders.find((item) => item.id === String(id))
    : orders[0];

  if (isLoading || !order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading order tracking...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Track Order</h2>
        <p className="text-sm text-slate-500">Order #{order.id.toUpperCase()} • {order.item}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <ol className="space-y-3">
          <li className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Order placed successfully</li>
          <li className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">Packed and ready for dispatch</li>
          <li className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">Out for delivery</li>
        </ol>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/orders/${order.id}/review`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Review Order
          </Link>
          <Link to={`/orders/${order.id}/delivery`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Edit Delivery Address
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TrackOrderPage;
