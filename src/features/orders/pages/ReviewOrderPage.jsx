import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listOrders } from "../services/ordersApi";

const ReviewOrderPage = () => {
  const { id } = useParams();

  const { data: orders = [] } = useQuery({
    queryKey: ["user-orders"],
    queryFn: listOrders,
  });

  const order = id
    ? orders.find((item) => item.id === String(id))
    : orders[0];

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        No order found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Review Order</h2>
        <p className="text-sm text-slate-500">Verify item details before payment.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-2 text-sm text-slate-700">
          <p><span className="font-semibold">Item:</span> {order.item}</p>
          <p><span className="font-semibold">Order ID:</span> {order.id.toUpperCase()}</p>
          <p><span className="font-semibold">Status:</span> {order.status}</p>
          <p><span className="font-semibold">Amount:</span> Rs {order.amount}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/orders/${order.id}/payment`} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Continue to Payment
          </Link>
          <Link to={`/orders/${order.id}/delivery`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Edit Address
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReviewOrderPage;
