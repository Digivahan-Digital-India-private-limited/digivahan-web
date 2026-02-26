import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Fuel, Save } from "lucide-react";

const FuelPriceManager = () => {
  const navigate = useNavigate();

  const [fuelPrices, setFuelPrices] = useState([
    { state: "Delhi", cng: 75.61, petrol: 96.72, diesel: 89.62 },
    { state: "Mumbai", cng: 76.5, petrol: 106.31, diesel: 94.27 },
    { state: "Bangalore", cng: 80.0, petrol: 101.94, diesel: 87.89 },
    { state: "Kolkata", cng: 76.2, petrol: 104.67, diesel: 92.76 },
    { state: "Chennai", cng: 79.5, petrol: 102.63, diesel: 94.24 },
    { state: "Hyderabad", cng: 77.8, petrol: 109.66, diesel: 97.82 },
    { state: "Pune", cng: 78.0, petrol: 106.39, diesel: 92.25 },
    { state: "Ahmedabad", cng: 76.9, petrol: 96.46, diesel: 92.91 },
  ]);

  const handlePriceChange = (index, field, value) => {
    const updated = [...fuelPrices];
    updated[index][field] = value;
    setFuelPrices(updated);
  };

  // 🔥 ADDING VALIDATION HERE
  const handleSave = () => {
    // Check if any value is empty or NaN
    const allFilled = fuelPrices.every(
      (item) =>
        item.cng !== "" &&
        item.petrol !== "" &&
        item.diesel !== "" &&
        !isNaN(item.cng) &&
        !isNaN(item.petrol) &&
        !isNaN(item.diesel)
    );

    if (!allFilled) {
      alert("Please fill all input fields!");
      return;
    }

    alert("Fuel prices updated successfully! ✅");
    console.log("Saved prices:", fuelPrices);
  };
  return (
    <div className="w-full h-screen overflow-y-auto p-3">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/manage-user")}
          className="flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Manage User App
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-3 rounded-lg">
            <Fuel className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Update Fuel Price
            </h1>
            <p className="text-gray-600 text-sm">Edit state-wise fuel prices</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-orange-500 to-red-500 text-white">
                <th className="px-4 py-4 text-left font-semibold">
                  State Name
                </th>
                <th className="px-4 py-4 text-left font-semibold">
                  CNG Price (₹/kg)
                </th>
                <th className="px-4 py-4 text-left font-semibold">
                  Petrol Price (₹/L)
                </th>
                <th className="px-4 py-4 text-left font-semibold">
                  Diesel Price (₹/L)
                </th>
              </tr>
            </thead>
            <tbody>
              {fuelPrices.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {item.state}
                  </td>

                  {/* CNG */}
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      step="0.01"
                      value={item.cng}
                      onChange={(e) =>
                        handlePriceChange(
                          index,
                          "cng",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </td>

                  {/* Petrol */}
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      step="0.01"
                      value={item.petrol}
                      onChange={(e) =>
                        handlePriceChange(
                          index,
                          "petrol",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </td>

                  {/* Diesel */}
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      step="0.01"
                      value={item.diesel}
                      onChange={(e) =>
                        handlePriceChange(
                          index,
                          "diesel",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Save size={20} />
            Update All Price
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelPriceManager;
