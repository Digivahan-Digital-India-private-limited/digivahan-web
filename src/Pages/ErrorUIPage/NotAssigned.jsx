import React from "react";
import { useNavigate } from "react-router-dom";
import NotAssignedImage from "../../assets/not-assigned.png";

const NotAssigned = ({ message }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen max-w-xl mx-auto bg-white flex flex-col items-center justify-between text-center p-4">
      {/* Top Illustration */}
      <div className="">
        <img
          src={NotAssignedImage}
          alt="QR Not Assigned"
          className="w-72 mx-auto"
        />
      </div>

      {/* Text Content */}
      <div className="">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Not Assigned
        </h2>

        <p className="text-sm text-gray-600 leading-6 max-w-xs mx-auto">
          This QR code is currently not linked to any vehicle or is invalid.
          Please try rescanning the QR code or contact our support team for
          assistance.
        </p>

        {/* 🔴 Server Error Message */}
        <p className="text-xs text-red-500">{message}</p>
      </div>

      {/* Bottom Button */}
      <div className="md:w-80 w-[90%]">
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

export default NotAssigned;
