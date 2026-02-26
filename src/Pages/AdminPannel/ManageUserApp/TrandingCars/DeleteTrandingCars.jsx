import React, { useState } from "react";

const DeleteTrandingCars = () => {
  const [cars, setCars] = useState([
    {
      id: 1,
      name: "Tata Nexon",
      price: "₹8-15 Lakhs",
      fuel: "Petrol/Diesel/EV",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Maruti Swift",
      price: "₹6-9 Lakhs",
      fuel: "Petrol/CNG",
      rating: 4.3,
    },
    {
      id: 3,
      name: "Hyundai Creta",
      price: "₹11-20 Lakhs",
      fuel: "Petrol/Diesel",
      rating: 4.6,
    },
  ]);
  return (
    <div className="bg-gray-100 max-w-5xl mx-auto h-screen md:h-full rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Delete Trending Car
      </h2>
      <div className="space-y-3">
        {cars.map((car) => (
          <div
            key={car.id}
            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-red-50"
          >
            <div>
              <h3 className="font-semibold">{car.name}</h3>
              <p className="text-sm text-gray-600">{car.price}</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${car.name}?`)) {
                  setCars(cars.filter((c) => c.id !== car.id));
                  alert("Car deleted successfully! ✅");
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        // onClick={() => setCurrentView("dashboard")}
        className="mt-4 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  );
};

export default DeleteTrandingCars;
