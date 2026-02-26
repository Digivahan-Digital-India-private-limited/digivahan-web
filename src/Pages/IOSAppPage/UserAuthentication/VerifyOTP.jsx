import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, flowType } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleOtpChange = (index, value) => {
    // Only allow numbersStill
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    toast.success("OTP verified successfully!");
    
    // Route to appropriate page based on user type and flow
    let targetPage = "/ios/account-created"; // Default for new users
    
    if (flowType === "forgot-password") {
      targetPage = "/ios/password-changed";
    } else if (userType === "old") {
      targetPage = "/ios/login-success";
    }
    
    setTimeout(() => navigate(targetPage), 1000);
  };

  return (
    <div className="min-h-dvh bg-[#F5F5DC] flex flex-col overflow-auto relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-none">
        {/* Main Content */}
        <div className="px-6 pt-8 pb-32">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/Tranparent Logo In Black 1@2x.png"
              alt="Digivahan Logo"
              className="w-52 h-auto object-contain"
            />
          </div>

          {/* Container with Profile Picture Overlap */}
          <div className="relative mt-28">
            {/* Profile Picture - Positioned to overlap */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
              <div className="w-32 h-32 rounded-full border-4 border-[#4CAF50] bg-white p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* OTP Card Container */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Dark Card Section */}
              <div className="bg-[#424242] pt-20 pb-6 px-6 relative overflow-hidden rounded-t-3xl">
                {/* Background pattern - subtle waves */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="wave-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                        <path d="M0 60 Q 30 30, 60 60 T 120 60" stroke="white" strokeWidth="4" fill="none"/>
                        <path d="M0 80 Q 30 50, 60 80 T 120 80" stroke="white" strokeWidth="4" fill="none"/>
                        <path d="M0 100 Q 30 70, 60 100 T 120 100" stroke="white" strokeWidth="4" fill="none"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#wave-pattern)"/>
                  </svg>
                </div>

                {/* User Name */}
                <div className="relative text-center">
                  <h3 className="text-white text-xl font-semibold">
                    Rajat Malik
                  </h3>
                </div>
              </div>

              {/* White Content Section */}
              <div className="pt-6 pb-8 px-6">
                {/* Title */}
                <h2 className="text-gray-800 font-semibold text-lg mb-2 text-center">
                  Enter the OTP
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-xs text-center mb-6 leading-relaxed px-3">
                  Please enter the OTP received on your registered phone number  ends with 1476. And don't share your OTP with any one.
                </p>

                {/* Form */}
                <form onSubmit={handleVerify} className="space-y-5">
                  {/* OTP Inputs */}
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-14 text-center text-xl font-medium border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 text-gray-600 bg-white shadow-sm"
                        placeholder="0"
                        required
                      />
                    ))}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3d8b40] text-white font-semibold rounded-xl shadow-sm transition-all duration-200 text-base"
                  >
                    Verify
                  </button>
                </form>
              </div>
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

export default VerifyOTP;
