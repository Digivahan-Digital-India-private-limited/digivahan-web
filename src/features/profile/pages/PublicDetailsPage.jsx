import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../services/profileApi";

const PublicDetailsPage = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["user-profile"], queryFn: getProfile });
  const [formData, setFormData] = useState({
    displayName: "",
    publicEmail: "",
    city: "",
  });

  useEffect(() => {
    if (!profile) return;
    setFormData({
      displayName: profile.name || "",
      publicEmail: profile.email || "",
      city: profile.address || "",
    });
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Public details updated");
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync({
        name: formData.displayName,
        email: formData.publicEmail,
        address: formData.city,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update public details");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Public Details</h2>
      <input name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Display Name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
      <input name="publicEmail" type="email" value={formData.publicEmail} onChange={handleChange} placeholder="Public Email" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
      <input name="city" value={formData.city} onChange={handleChange} placeholder="City / Public Location" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
      <button type="submit" disabled={mutation.isPending} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70">
        {mutation.isPending ? "Saving..." : "Save Public Details"}
      </button>
    </form>
  );
};

export default PublicDetailsPage;
