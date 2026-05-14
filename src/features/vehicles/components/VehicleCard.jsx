import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, TriangleAlert } from "lucide-react";

const VehicleCard = ({ vehicle }) => {
  const insuranceExpired = vehicle.insuranceStatus !== "Active";
  const pucExpired = vehicle.pucStatus !== "Active";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-20 w-28 rounded-xl border border-slate-200 object-contain bg-slate-50"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">{vehicle.name}</h3>
          <p className="text-xs text-slate-500">{vehicle.type} • {vehicle.year} • {vehicle.fuel}</p>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-700">{vehicle.plate}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${insuranceExpired ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
          {insuranceExpired ? <TriangleAlert size={12} /> : <ShieldCheck size={12} />} Insurance {vehicle.insuranceStatus}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${pucExpired ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-600"}`}>
          {pucExpired ? <TriangleAlert size={12} /> : <ShieldCheck size={12} />} PUC {vehicle.pucStatus}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          View Details
        </Link>
        <Link
          to={`/vehicles/${vehicle.id}/qr`}
          className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
        >
          View QR
        </Link>
      </div>
    </article>
  );
};

export default VehicleCard;
