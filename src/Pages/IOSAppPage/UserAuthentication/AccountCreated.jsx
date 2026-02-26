import React from "react";
import { useNavigate } from "react-router-dom";

const AccountCreated = () => {
  const navigate = useNavigate();

  const handleOkay = () => {
    navigate("/ios/dashboard");
  };

  return (
    <div className="min-h-dvh bg-[#B8B8B8] flex flex-col overflow-auto relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-none">
        {/* Main Content */}
        <div className="px-6 pt-12 pb-32">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <img
              src="/Tranparent Logo In Black 1@2x.png"
              alt="Digivahan Logo"
              className="w-52 h-auto object-contain"
            />
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {/* Success Badge Icon */}
            <div className="flex justify-center mb-6">
              <img
                src="/success 1.png"
                alt="Success"
                className="w-28 h-28 object-contain"
              />
            </div>

            {/* Title */}
            <h2 className="text-gray-900 font-bold text-2xl mb-4 text-center">
              Account Created
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed px-2">
              Welcome to Digivahan – your smart companion for all vehicle-related services. Explore features like QR scan connect, nearby essentials, and vehicle challan info.
            </p>

            {/* Okay Button */}
            <button
              onClick={handleOkay}
              className="w-full h-11 bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3d8b40] text-white font-semibold rounded-lg shadow-sm transition-all duration-200 text-base"
            >
              Okay
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Decoration */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <img
          src="/Footer Design.png"
          alt="Footer Design"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default AccountCreated;
