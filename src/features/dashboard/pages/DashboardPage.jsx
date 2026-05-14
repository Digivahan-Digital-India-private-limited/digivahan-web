import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bell, Car, ClipboardList, QrCode } from "lucide-react";
import { listVehicles } from "../../vehicles/services/vehiclesApi";
import { listNotifications } from "../../notifications/services/notificationsApi";
import { listOrders } from "../../orders/services/ordersApi";

const DashboardPage = () => {
  const { data: vehicles = [] } = useQuery({
    queryKey: ["user-vehicles"],
    queryFn: listVehicles,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: listNotifications,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["user-orders"],
    queryFn: listOrders,
  });

  const unread = notifications.filter((item) => item.unread).length;

  const cards = [
    { label: "My Vehicles", value: vehicles.length, icon: Car, to: "/vehicles" },
    { label: "Unread Alerts", value: unread, icon: Bell, to: "/notifications" },
    { label: "My Orders", value: orders.length, icon: ClipboardList, to: "/orders" },
    { label: "Virtual QRs", value: vehicles.length, icon: QrCode, to: "/virtual-qr" },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-linear-to-r from-emerald-600 to-green-500 p-6 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.16em] text-white/80">My Account</p>
        <h2 className="mt-1 text-2xl font-bold">Welcome to DigiVahan</h2>
        <p className="mt-1 text-sm text-white/90">
          Manage vehicles, virtual QR, alerts, profile and emergency contacts from one place.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.label}</p>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon size={17} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default DashboardPage;
