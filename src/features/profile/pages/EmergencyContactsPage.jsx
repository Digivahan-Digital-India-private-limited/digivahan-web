import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import EmergencyContactCard from "../components/EmergencyContactCard";
import {
  createEmergencyContact,
  deleteEmergencyContact,
  listEmergencyContacts,
} from "../services/profileApi";

const EmergencyContactsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: "",
  });

  const { data: emergencyContacts = [], isLoading } = useQuery({
    queryKey: ["user-emergency-contacts"],
    queryFn: listEmergencyContacts,
  });

  const addMutation = useMutation({
    mutationFn: createEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-emergency-contacts"] });
      setFormData({ name: "", relation: "", phone: "" });
      setIsAdding(false);
      toast.success("Emergency contact added");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-emergency-contacts"] });
      toast.success("Emergency contact deleted");
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContact = async (event) => {
    event.preventDefault();
    try {
      await addMutation.mutateAsync(formData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add emergency contact");
    }
  };

  const handleDelete = async (contactId) => {
    const confirmed = window.confirm("Delete this emergency contact?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(contactId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete emergency contact");
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Emergency Contacts</h2>
            <p className="text-sm text-slate-500">People who can be reached quickly in critical situations.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding((prev) => !prev)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {isAdding ? "Close" : "Add Contact"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile/emergency-contacts/add")}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Open Full Add Form
          </button>
        </div>
      </section>

      {isAdding && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form onSubmit={handleAddContact} className="grid grid-cols-1 gap-2 sm:grid-cols-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              required
            />
            <input
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              placeholder="Relation"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              required
            />
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {addMutation.isPending ? "Saving..." : "Save"}
            </button>
          </form>
        </section>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading emergency contacts...
        </div>
      ) : emergencyContacts.length ? (
        emergencyContacts.map((contact) => (
          <EmergencyContactCard
            key={contact.id}
            contact={contact}
            onEdit={(contactId) => navigate(`/profile/emergency-contacts/${contactId}/edit`)}
            onDelete={handleDelete}
            deleting={deleteMutation.isPending}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No emergency contacts found.
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsPage;
