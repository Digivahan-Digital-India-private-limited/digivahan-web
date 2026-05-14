import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VehicleList from "../components/VehicleList";
import { listVehicles } from "../services/vehiclesApi";

const MyGaragePage = () => {
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["user-vehicles"],
    queryFn: listVehicles,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">My Garage</h2>
          <p className="text-sm text-slate-500">Manage all your registered vehicles.</p>
        </div>

        <Link
          to="/vehicles/add"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Add Vehicle
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading vehicles...
        </div>
      ) : (
        <VehicleList vehicles={vehicles} />
      )}
    </div>
  );
};

export default MyGaragePage;
