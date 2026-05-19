import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, CheckCircle2, Truck, Home, Clock, XCircle } from "lucide-react";
import { listOrders } from "../services/ordersApi";

const TIMELINE = [
  { status: "PENDING",    label: "Order Placed",       icon: Package },
  { status: "CONFIRMED",  label: "Order Confirmed",    icon: CheckCircle2 },
  { status: "PROCESSING", label: "Being Packed",       icon: Clock },
  { status: "SHIPPED",    label: "Shipped",            icon: Truck },
  { status: "DELIVERED",  label: "Delivered",          icon: Home },
];

const STATUS_ORDER = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const TrackOrderPage = () => {
  const { id } = useParams();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: listOrders,
  });

  const order = id ? orders.find((item) => item.id === String(id)) : orders[0];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <Package size={24} className="mx-auto text-slate-400" />
        <p className="mt-3 text-sm text-slate-500">Order not found.</p>
        <Link to="/orders" className="mt-3 inline-block text-sm font-semibold text-emerald-600 hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const currentStatusIdx = STATUS_ORDER.indexOf(String(order.status).toUpperCase());
  const isCancelled = String(order.status).toUpperCase() === "CANCELLED";

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Track Order</h2>
            <p className="mt-1 text-xs font-mono text-slate-500">#{order.id.toUpperCase()}</p>
          </div>
          <Link
            to="/orders"
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            ← All Orders
          </Link>
        </div>

        {/* Order Meta */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Item</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800 truncate">{order.item}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Amount</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">₹{order.amount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Date</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">{order.date}</p>
          </div>
        </div>
      </section>

      {/* Tracking Timeline */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Shipment Timeline</h3>

        {isCancelled ? (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <XCircle size={20} className="text-rose-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Order Cancelled</p>
              <p className="text-xs text-rose-500 mt-0.5">This order has been cancelled.</p>
            </div>
          </div>
        ) : (
          <ol className="relative space-y-4 pl-6">
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-100" />
            {TIMELINE.map((step, idx) => {
              const Icon = step.icon;
              const done = idx <= currentStatusIdx;
              const current = idx === currentStatusIdx;
              return (
                <li key={step.status} className="relative flex items-start gap-3">
                  {/* Dot */}
                  <span
                    className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border-2 transition
                      ${done ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"}`}
                  >
                    {done && <Icon size={10} className="text-white" />}
                  </span>
                  <div className={`${current ? "text-emerald-700" : done ? "text-slate-700" : "text-slate-400"}`}>
                    <p className={`text-sm font-semibold ${current ? "text-emerald-700" : ""}`}>
                      {step.label}
                      {current && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Current
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
};

export default TrackOrderPage;
