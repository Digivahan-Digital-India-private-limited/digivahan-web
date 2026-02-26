import React from "react";
import { useNavigate } from "react-router-dom";

const ViewTrandingCars = () => {
  const navigate = useNavigate();
  const cars = [
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
  ];
  return (
    <div className="bg-gray-100 max-w-5xl mx-auto h-screen md:h-full rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        All Trending Cars
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg">{car.name}</h3>
            <p className="text-gray-600">{car.price}</p>
            <p className="text-sm text-gray-500">{car.fuel}</p>
            <p className="text-yellow-500 font-semibold">⭐ {car.rating}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/manage-tranding-car")}
        className="mt-4 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  );
};

export default ViewTrandingCars;
