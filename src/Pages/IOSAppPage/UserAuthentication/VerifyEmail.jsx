import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("OTP sent successfully!");
    setTimeout(() => navigate("/ios/verify-otp", { state: { loginMethod: "email" } }), 1000);
  };

  return (
    <div className="min-h-dvh bg-[#E8F5E9] flex flex-col overflow-auto relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-none">
        {/* Main Content */}
        <div className="px-6 pt-12 pb-32">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/Tranparent Logo In Black 1.svg"
              alt="Digivahan Logo"
              className="w-48 h-auto object-contain"
            />
          </div>

          {/* White Card Container */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* Dark Section with Email Icon and Toggle */}
            <div className="bg-[#424242] px-6 pt-8 pb-16 relative">
              {/* Wave Pattern Background */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="wave-email" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#wave-email)"/>
              </svg>

              {/* Email Icon with Badge */}
              <div className="flex justify-center mb-6 relative">
                <div className="relative">
                  <div className="bg-[#2E7D32] rounded-full w-24 h-24 flex items-center justify-center">
                    <Mail className="w-12 h-12 text-white" />
                  </div>
                  {/* Dots/Asterisks Badge */}
                  <div className="absolute -right-2 top-1 bg-white rounded-md px-2 py-0.5 shadow-sm">
                    <span className="text-gray-800 text-xs font-medium">••****</span>
                  </div>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="flex items-center justify-center gap-3 relative z-10">
                {/* Phone Button - Inactive */}
                <button
                  type="button"
                  onClick={() => navigate("/ios/verify-number")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-500 active:scale-95 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Phone</span>
                </button>

                {/* Email Button - Active */}
                <button
                  type="button"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D32] active:scale-95 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" fill="white"/>
                    <circle cx="8" cy="8" r="4" fill="#2E7D32"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Email</span>
                </button>
              </div>
            </div>

            {/* White Section with Form */}
            <div className="px-6 py-6">
              {/* Title */}
              <h2 className="text-gray-800 font-semibold text-lg mb-2 text-center">
                Verify Your Email
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-[13px] text-center mb-6 leading-relaxed">
                Please verify the email associated with your account. And don't share your OTP with any one.
              </p>

              {/* Form */}
              <form onSubmit={handleSendCode} className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jkwandikers10en@SecureG.com"
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full min-h-12 pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32] text-gray-800 placeholder-gray-400 bg-white text-base"
                  />
                </div>

                {/* Send Code Button */}
                <button
                  type="submit"
                  className="w-full min-h-12 bg-[#2E7D32] active:bg-[#1B5E20] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all duration-200 text-base"
                >
                  Send Code
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <img
          src="/Footer%20Design.png"
          alt="Footer Design"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default VerifyEmail;
