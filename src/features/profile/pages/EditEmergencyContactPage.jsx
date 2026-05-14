import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { listEmergencyContacts, updateEmergencyContact } from "../services/profileApi";

const EditEmergencyContactPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", relation: "", phone: "" });

  const { data: contacts = [] } = useQuery({
    queryKey: ["user-emergency-contacts"],
    queryFn: listEmergencyContacts,
  });

  useEffect(() => {
    const current = contacts.find((item) => item.id === String(id));
    if (!current) {
      return;
    }

    setFormData({
      name: current.name || "",
      relation: current.relation || "",
      phone: current.phone || "",
    });
  }, [contacts, id]);

  const mutation = useMutation({
    mutationFn: (payload) => updateEmergencyContact(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-emergency-contacts"] });
      toast.success("Emergency contact updated");
      navigate("/profile/emergency-contacts");
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update emergency contact");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Edit Emergency Contact</h2>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
      <input name="relation" value={formData.relation} onChange={handleChange} placeholder="Relation" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
      <button type="submit" disabled={mutation.isPending} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70">
        {mutation.isPending ? "Saving..." : "Update Contact"}
      </button>
    </form>
  );
};

export default EditEmergencyContactPage;
