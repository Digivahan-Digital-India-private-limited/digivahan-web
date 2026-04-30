import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listVehicles } from "../../vehicles/services/vehiclesApi";

const MyVirtualQRListPage = () => {
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["user-vehicles"],
    queryFn: listVehicles,
  });

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My Virtual QR List</h2>
        <p className="text-sm text-slate-500">Select a vehicle to open its virtual QR details.</p>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading virtual QR list...</div>
      ) : vehicles.length ? (
        <section className="space-y-3">
          {vehicles.map((vehicle) => (
            <article key={vehicle.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{vehicle.name}</h3>
                  <p className="text-xs text-slate-500">{vehicle.plate}</p>
                </div>
                <Link to={`/virtual-qr/${vehicle.id}`} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                  Open QR
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm">No vehicles found for virtual QR.</div>
      )}
    </div>
  );
};

export default MyVirtualQRListPage;
