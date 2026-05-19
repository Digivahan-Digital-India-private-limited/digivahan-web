import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Package, Plus, MapPin, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { listOrders, cancelOrder } from "../services/ordersApi";

const STATUS_MAP = {
  PENDING:    { label: "Pending",     cls: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMED:  { label: "Confirmed",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  PROCESSING: { label: "Processing",  cls: "bg-purple-50 text-purple-700 border-purple-200" },
  SHIPPED:    { label: "Shipped",     cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  DELIVERED:  { label: "Delivered",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED:  { label: "Cancelled",   cls: "bg-rose-50 text-rose-700 border-rose-200" },
  FAILED:     { label: "Failed",      cls: "bg-slate-100 text-slate-500 border-slate-200" },
};

const getStatus = (status) =>
  STATUS_MAP[String(status).toUpperCase()] ||
  { label: status || "Unknown", cls: "bg-slate-100 text-slate-600 border-slate-200" };

const OrdersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState(null);

  const { data: orders = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["user-orders"],
    queryFn: listOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      toast.success("Order cancelled successfully.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to cancel order.");
    },
    onSettled: () => setCancellingId(null),
  });

  const handleCancel = (order) => {
    const confirmed = window.confirm(`Cancel order ${order.id.toUpperCase()}? This cannot be undone.`);
    if (!confirmed) return;
    setCancellingId(order.id);
    cancelMutation.mutate(order.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-emerald-600" />
              My Orders
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track and manage your physical QR sticker orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </button>
            <Link
              to="/orders/checkout"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={15} />
              New Order
            </Link>
          </div>
        </div>
      </section>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 shadow-sm" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => {
            const { label, cls } = getStatus(order.status);
            const canCancel = !["DELIVERED", "SHIPPED", "CANCELLED"].includes(
              String(order.status).toUpperCase()
            );
            return (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon + Info */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Package size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{order.item}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Order ID: <span className="font-mono font-medium text-slate-700">{order.id.toUpperCase()}</span>
                      </p>
                      <p className="text-xs text-slate-400">{order.date}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
                    {label}
                  </span>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="text-sm font-bold text-slate-900">₹{order.amount}</p>

                  <div className="flex items-center gap-2">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order)}
                        disabled={cancellingId === order.id}
                        className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                    <Link
                      to={`/orders/${order.id}/track`}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <ShoppingBag size={24} className="text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-700">No orders yet</h3>
          <p className="mt-1 text-xs text-slate-400">
            Order a DigiVahan Smart QR sticker for your vehicle.
          </p>
          <Link
            to="/orders/checkout"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus size={15} />
            Order QR Sticker
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
