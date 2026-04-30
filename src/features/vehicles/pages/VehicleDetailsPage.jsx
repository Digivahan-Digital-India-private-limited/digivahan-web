import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteVehicle,
  getVehicleById,
  updateVehicle,
} from "../services/vehiclesApi";

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleName: "",
    rcNumber: "",
    type: "Car",
    fuel: "Petrol",
    year: "",
  });

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["user-vehicle", id],
    queryFn: () => getVehicleById(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => updateVehicle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicle", id] });
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
      setIsEditing(false);
      toast.success("Vehicle updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
      toast.success("Vehicle deleted successfully");
      navigate("/vehicles", { replace: true });
    },
  });

  useEffect(() => {
    if (!vehicle) {
      return;
    }

    setFormData({
      vehicleName: vehicle.name,
      rcNumber: vehicle.plate,
      type: vehicle.type,
      fuel: vehicle.fuel,
      year: vehicle.year,
    });
  }, [vehicle]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update vehicle");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this vehicle from your garage?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete vehicle");
    }
  };

  if (isLoading || !vehicle) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading vehicle details...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{vehicle.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{vehicle.plate} • {vehicle.type} • {vehicle.year}</p>
          </div>
          <img src={vehicle.image} alt={vehicle.name} className="h-24 w-36 rounded-xl border border-slate-200 bg-slate-50 object-contain" />
        </div>

        {isEditing ? (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleInputChange}
              placeholder="Vehicle Name"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <input
              name="rcNumber"
              value={formData.rcNumber}
              onChange={handleInputChange}
              placeholder="RC Number"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <input
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Vehicle Type"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <input
              name="fuel"
              value={formData.fuel}
              onChange={handleInputChange}
              placeholder="Fuel Type"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <input
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="Model Year"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Ownership</p>
              <p className="text-sm font-semibold text-slate-900">{vehicle.ownership}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Fuel</p>
              <p className="text-sm font-semibold text-slate-900">{vehicle.fuel}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Insurance</p>
              <p className="text-sm font-semibold text-slate-900">{vehicle.insuranceStatus}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">PUC</p>
              <p className="text-sm font-semibold text-slate-900">{vehicle.pucStatus}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Link to={`/vehicles/${vehicle.id}/qr`} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Generate QR</Link>
          {isEditing ? (
            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Vehicle
            </button>
          )}
          {isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default VehicleDetailsPage;
