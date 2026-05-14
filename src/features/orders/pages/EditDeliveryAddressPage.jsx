import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditDeliveryAddressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    line1: "Haridwar Bypass Road",
    city: "Haridwar",
    state: "Uttarakhand",
    pincode: "249401",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    navigate(`/orders/${id}/review`);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Edit Delivery Address</h2>
        <p className="text-sm text-slate-500">Update the address for this order delivery.</p>
      </section>

      <form onSubmit={handleSave} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input name="line1" value={address.line1} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="Address line" required />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input name="city" value={address.city} onChange={handleChange} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="City" required />
          <input name="state" value={address.state} onChange={handleChange} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="State" required />
          <input name="pincode" value={address.pincode} onChange={handleChange} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="Pincode" required />
        </div>

        <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          Save and Continue
        </button>
      </form>
    </div>
  );
};

export default EditDeliveryAddressPage;
