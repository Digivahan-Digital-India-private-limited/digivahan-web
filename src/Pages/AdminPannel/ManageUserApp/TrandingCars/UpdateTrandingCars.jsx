import React, { useState } from "react";
import { ArrowLeft, Search, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpdateTrandingCars = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [cars] = useState([
    {
      id: "TC-001",
      searchKey: "UK1275DR",
      brand: "Maruti Suzuki",
      model: "Swift",
      price: "₹ 800000",
      mileage: "22 km/l",
      topSpeed: "165 km/h",
    },
    {
      id: "TC-002",
      searchKey: "DL9999AA",
      brand: "Tata",
      model: "Nexon",
      price: "₹ 1100000",
      mileage: "20 km/l",
      topSpeed: "170 km/h",
    },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    brand: "",
    model: "",
    price: "",
    mileage: "",
    topSpeed: "",
  });

  const handleSearch = () => {
    const found = cars.find(
      (c) =>
        c.searchKey.toLowerCase() === query.toLowerCase() ||
        c.id.toLowerCase() === query.toLowerCase() ||
        c.brand.toLowerCase().includes(query.toLowerCase()) ||
        c.model.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setFormData(found);
      setShowForm(true);
    } else {
      alert("Car not found 😕");
      setShowForm(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Links */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => navigate("/manage-tranding-car")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Manage User App
          </button>
          <br />
          <button
            onClick={() => navigate("/manage-user")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Menu
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Pencil className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Update Trending Car</h2>
              <p className="text-gray-500">Search and update car details</p>
            </div>
          </div>
          {/* Search */}
          <p className="mb-2 font-medium">Search by Car ID / Brand / Model</p>
          <div className="flex gap-3 mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter car ID, brand name, or model name"
              className="flex-1 border rounded-xl px-4 py-3"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 flex items-center gap-2 rounded-xl"
            >
              <Search size={18} /> Search
            </button>
          </div>

          {/* Edit Form */}
          {showForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label>Trending Car ID</label>
                <input
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label>Brand Name</label>
                <input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label>Model Name</label>
                <input
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label>Price</label>
                <input
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label>Mileage</label>
                <input
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData({ ...formData, mileage: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label>Top Speed</label>
                <input
                  value={formData.topSpeed}
                  onChange={(e) =>
                    setFormData({ ...formData, topSpeed: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div className="col-span-2 flex justify-end mt-6">
                <button
                  onClick={() => alert("Car Updated Successfully ✅")}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl"
                >
                  ✏ Update Car
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateTrandingCars;
