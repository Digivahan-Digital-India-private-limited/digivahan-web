import React from "react";
import UnderMantenance from "../../assets/under-mantenance.png";
import { useNavigate } from "react-router-dom";

const Undermaintenance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between text-center px-6 py-10">

      {/* Illustration */}
      <div className="mt-6">
        <img
          src={UnderMantenance}
          alt="Under Maintenance"
          className="w-72 mx-auto"
        />
      </div>

      {/* Text Content */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Under Maintenance
        </h2>

        <p className="text-sm text-gray-600 leading-6 max-w-xs mx-auto">
          This feature is temporarily under maintenance.
          Kindly try again after some time and rescan the QR code.
        </p>
      </div>

      {/* Home Button */}
      <div className="w-full mb-6">
        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Undermaintenance;
