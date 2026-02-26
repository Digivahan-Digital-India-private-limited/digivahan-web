import React from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyVirtualQREmpty() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-green-50 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-green-50 border-b border-gray-200">
        {/* Status Bar */}
        <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-gray-700">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>📡</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900">My Virtual QR Code</h1>

          {/* Notification Bell */}
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
        {/* Illustration - Empty Garage */}
        <div className="flex justify-center mb-8">
          <img
            src="/Empty garage image.png"
            alt="Empty Garage"
            className="w-full max-w-sm h-auto"
          />
        </div>

        {/* Text Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Garage is empty
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Garage is empty please add your vehicle to the garage and experience
            the luxury of digivahan.
          </p>
        </div>

        {/* Add Vehicle Button */}
        <div className="w-full max-w-md mt-auto mb-6">
          <button
            onClick={() => navigate("/ios/my-garage")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
