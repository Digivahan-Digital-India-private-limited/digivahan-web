import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddTrandingCars = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="bg-white max-w-6xl mx-auto h-screen overflow-y-auto p-6 rounded-lg shadow">
      {/* Back */}
      <button
        onClick={() => navigate("/manage-tranding-car")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="mr-2" size={18} /> Back to Manage Trending Car
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-3 rounded-full">
          <Plus className="text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Add Trending Car</h2>
          <p className="text-gray-500">Fill in all the car details</p>
        </div>
      </div>

      {/* BASIC INFO */}
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ["Trending Car ID", "trendingId"],
          ["Brand Name", "brand"],
          ["Model Name", "model"],
        ].map(([label, name]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />
        ))}

        <select
          name="type"
          onChange={handleChange}
          className="border rounded-lg px-4 py-3"
        >
          <option>Select Type</option>
          <option>SUV</option>
          <option>Sedan</option>
          <option>Hatchback</option>
        </select>

        {[
          ["Price", "price"],
          ["Price Display", "priceDisplay"],
          ["Mileage", "mileage"],
          ["Top Speed", "topSpeed"],
          ["Image URL", "image"],
        ].map(([label, name]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />
        ))}
      </div>

      {/* SPECIFICATIONS */}
      <h3 className="text-lg font-semibold mt-8 mb-4">Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ["Engine", "engine"],
          ["Transmission", "transmission"],
          ["Tank Capacity", "tank"],
          ["Seat Height", "seatHeight"],
          ["Weight", "weight"],
        ].map(([label, name]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />
        ))}
      </div>

      {/* DETAILED SPEC */}
      <h3 className="text-lg font-semibold mt-8 mb-4">
        Detailed Specifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["Max Power", "power"],
          ["Torque", "torque"],
          ["Riding Modes", "modes"],
          ["Gear Pattern", "gear"],
        ].map(([label, name]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />
        ))}
      </div>

      {/* DIMENSIONS */}
      <h3 className="text-lg font-semibold mt-8 mb-4">Dimensions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ["Bootspace", "boot"],
          ["Ground Clearance", "clearance"],
          ["Length", "length"],
          ["Width", "width"],
          ["Height", "height"],
        ].map(([label, name]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />
        ))}
      </div>

      {/* FEATURES */}
      <h3 className="text-lg font-semibold mt-8 mb-4">Features</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          "ABS",
          "Airbags",
          "Bluetooth",
          "Cruise Control",
          "Parking Sensors",
          "Sunroof",
        ].map((f) => (
          <label key={f} className="flex items-center gap-2">
            <input type="checkbox" />
            {f}
          </label>
        ))}
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end mt-10">
        <button
          onClick={() => {
            console.log(form);
            alert("Car Added Successfully ✅");
            navigate("/manage-tranding-car");
          }}
          className="bg-green-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-green-700"
        >
          <Plus /> Add Car
        </button>
      </div>
    </div>
  );
};

export default AddTrandingCars;
