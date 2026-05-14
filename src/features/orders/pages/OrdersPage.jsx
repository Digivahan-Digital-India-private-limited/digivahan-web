import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listOrders } from "../services/ordersApi";

const statusClasses = {
  Delivered: "bg-emerald-50 text-emerald-700",
  "In Transit": "bg-amber-50 text-amber-700",
};

const OrdersPage = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: listOrders,
  });

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My Orders</h2>
        <p className="text-sm text-slate-500">Track all physical QR and service orders.</p>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading orders...
        </div>
      ) : orders.length ? (
        orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{order.item}</h3>
                <p className="mt-1 text-xs text-slate-500">Order ID: {order.id.toUpperCase()}</p>
                <p className="text-xs text-slate-500">Placed on {order.date}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[order.status] || "bg-slate-100 text-slate-700"}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <p className="text-sm font-semibold text-slate-900">Rs {order.amount}</p>
              <Link
                to={`/orders/${order.id}/track`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                View Details
              </Link>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No orders found.
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
