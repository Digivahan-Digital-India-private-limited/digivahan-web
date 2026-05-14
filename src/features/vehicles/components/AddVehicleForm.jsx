import React, { useState } from "react";

const AddVehicleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    rcNumber: "",
    vehicleName: "",
    type: "Car",
    fuel: "Petrol",
    year: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">RC Number</label>
        <input
          name="rcNumber"
          value={formData.rcNumber}
          onChange={handleChange}
          placeholder="e.g. DL1CS3305"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Vehicle Name</label>
        <input
          name="vehicleName"
          value={formData.vehicleName}
          onChange={handleChange}
          placeholder="e.g. Hyundai i20"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            <option>Car</option>
            <option>Bike</option>
            <option>Scooter</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fuel</label>
          <select
            name="fuel"
            value={formData.fuel}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            <option>Petrol</option>
            <option>Diesel</option>
            <option>CNG</option>
            <option>Electric</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Year</label>
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="2023"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Add to Garage
      </button>
    </form>
  );
};

export default AddVehicleForm;
