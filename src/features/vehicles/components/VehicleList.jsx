import React from "react";
import VehicleCard from "./VehicleCard";

const VehicleList = ({ vehicles = [] }) => {
  if (!vehicles.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-slate-900">No vehicles added yet</h3>
        <p className="mt-1 text-sm text-slate-500">Start by adding your first vehicle to DigiVahan virtual garage.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default VehicleList;
