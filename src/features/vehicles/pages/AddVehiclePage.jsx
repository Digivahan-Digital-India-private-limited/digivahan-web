import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddVehicleForm from "../components/AddVehicleForm";
import { createVehicle } from "../services/vehiclesApi";

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-vehicles"] });
    },
  });

  const handleSubmit = async (payload) => {
    try {
      await mutateAsync(payload);
      toast.success("Vehicle added successfully");
      navigate("/vehicles");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add vehicle");
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add New Vehicle</h2>
        <p className="text-sm text-slate-500">Enter your vehicle details to add it in virtual garage. This is mock UI for now.</p>
      </section>

      <AddVehicleForm onSubmit={handleSubmit} />

      {isPending && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-500 shadow-sm">
          Saving vehicle details...
        </div>
      )}
    </div>
  );
};

export default AddVehiclePage;
