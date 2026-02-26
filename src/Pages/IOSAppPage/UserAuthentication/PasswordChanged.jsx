import React from "react";
import { useNavigate } from "react-router-dom";

const PasswordChanged = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/ios/login");
  };

  const handleLoginWithNumber = () => {
    navigate("/ios/login");
  };

  return (
    <div className="min-h-dvh bg-[#BEBEBE] flex flex-col overflow-auto relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-none pt-8">
        {/* Main Content */}
        <div className="px-6 w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img
              src="/Tranparent Logo In Black 1.svg"
              alt="Digivahan Logo"
              className="w-48 h-auto object-contain"
            />
          </div>

          {/* Success Dialogue Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <img
                src="/success%201.png"
                alt="Success Badge"
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Title */}
            <h2 className="text-gray-900 font-bold text-xl mb-4 text-center">
              Password Changed
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed px-2">
              Your password has been changed. For your security, please use the new password next time you log in.
            </p>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full min-h-12 bg-[#2E7D32] active:bg-[#1B5E20] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all duration-200 text-base"
            >
              Login
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-8">
            <span className="text-gray-500 text-sm font-medium">OR</span>
          </div>

          {/* Login with Number Button */}
          <button
            onClick={handleLoginWithNumber}
            className="w-full min-h-12 bg-gray-400 active:bg-gray-500 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all duration-200 text-base"
          >
            Login with number
          </button>
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

export default PasswordChanged;
