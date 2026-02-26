import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyNumber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, flowType } = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSendCode = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    toast.success("Code sent successfully!");
    
    // Route based on flow type
    if (flowType === "forgot-password") {
      setTimeout(() => navigate("/ios/reset-password", { state: { flowType: "forgot-password" } }), 1000);
    } else {
      // New user registration flow
      setTimeout(() => navigate("/ios/verify-otp", { state: { userType: "new" } }), 1000);
    }
  };

  return (
    <div className="min-h-dvh bg-[#E8F5E9] flex flex-col overflow-auto relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-none">
        {/* Main Content */}
        <div className="px-4 pt-12 pb-32">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/Tranparent Logo In Black 1.svg"
              alt="Digivahan Logo"
              className="w-58 h-auto object-contain"
            />
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-[28px] shadow-xl overflow-visible max-w-[380px] mx-auto relative">
            {/* Dark Card with Phone Icon */}
            <div className="bg-[#4A4A4A] pt-8 pb-14 px-6 relative overflow-hidden rounded-t-[28px]">
              {/* Background wave pattern */}
              <div className="absolute inset-0 opacity-[0.06]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wave-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M0 40 Q 20 20, 40 40 T 80 40" stroke="white" strokeWidth="2.5" fill="none"/>
                      <path d="M0 55 Q 20 35, 40 55 T 80 55" stroke="white" strokeWidth="2.5" fill="none"/>
                      <path d="M0 70 Q 20 50, 40 70 T 80 70" stroke="white" strokeWidth="2.5" fill="none"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wave-pattern)"/>
                </svg>
              </div>

              {/* Phone Icon with masked number */}
              <div className="relative flex items-center justify-center mb-0">
                <img
                  src="/Vector.png"
                  alt="Phone"
                  className="w-[90px] h-[90px] object-contain"
                />
              </div>
            </div>

            {/* Phone Button Badge - Overlapping dark and white sections */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[158px] z-20">
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium bg-[#4CAF50] text-white shadow-lg"
              >
                <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                Phone
              </button>
            </div>

            {/* White Content Section */}
            <div className="pt-12 pb-8 px-6 bg-white rounded-b-[28px]">
              {/* Title */}
              <h2 className="text-gray-900 font-semibold text-[18px] mb-2 text-center">
                Verify Your Number
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-[11.5px] text-center mb-6 leading-relaxed">
                Please verify the number associated with your account. And don't share your OTP with any one.
              </p>

              {/* Form */}
              <form onSubmit={handleSendCode} className="space-y-5">
                {/* Phone Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                    <img
                      src="https://flagcdn.com/w20/in.png"
                      alt="India"
                      className="w-5 h-3.5 object-cover rounded-sm"
                    />
                    <span className="text-gray-600 text-[14px] font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9897000001"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength="10"
                    className="w-full h-[50px] pl-[82px] pr-11 py-3 border border-gray-300 rounded-[20px] focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] text-gray-700 placeholder-gray-400 bg-white text-[14px] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPhoneNumber("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Send Code Button */}
                <button
                  type="submit"
                  className="w-full h-[50px] bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3d8b40] text-white font-semibold rounded-[25px] shadow-md transition-all duration-200 text-[14px]"
                >
                  Send Code
                </button>
              </form>
            </div>
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

export default VerifyNumber;
