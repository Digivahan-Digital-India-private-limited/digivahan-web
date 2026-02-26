import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    toast.success("Proceed to OTP verification!");
    setTimeout(() => navigate("/ios/verify-otp", { state: { flowType: "forgot-password" } }), 1000);
  };

  return (
    <div className="min-h-dvh bg-[#B8B8B8] flex flex-col overflow-auto relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-none">
        {/* Main Content */}
        <div className="px-6 pt-12 pb-32">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img
              src="/Tranparent Logo In Black 1@2x.png"
              alt="Digivahan Logo"
              className="w-52 h-auto object-contain"
            />
          </div>

          {/* Container with Profile Picture Overlap */}
          <div className="relative mt-24">
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

            {/* Reset Password Card Container */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Top Section with Name */}
              <div className="bg-[#E8F5E9] pt-20 pb-6 px-6 text-center">
                <h3 className="text-gray-900 font-semibold text-lg">
                  Rajat Malik
                </h3>
              </div>

              {/* Form Section */}
              <div className="pt-8 pb-8 px-6">
                {/* Heading */}
                <div className="mb-8">
                  <h2 className="text-gray-900 font-bold text-xl mb-2">
                    Reset Password
                  </h2>
                  <div className="w-16 h-1 bg-[#4CAF50] rounded-full"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-5">
                  {/* Password Input */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2 text-sm">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        autoComplete="new-password"
                        className="w-full min-h-12 pl-16 pr-12 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] text-gray-800 placeholder-gray-400 bg-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-[#4CAF50]" />
                        ) : (
                          <Eye className="w-5 h-5 text-[#4CAF50]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2 text-sm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        autoComplete="new-password"
                        className="w-full min-h-12 pl-16 pr-12 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] text-gray-800 placeholder-gray-400 bg-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-[#4CAF50]" />
                        ) : (
                          <Eye className="w-5 h-5 text-[#4CAF50]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3d8b40] text-white font-semibold rounded-lg shadow-sm transition-all duration-200 text-sm mt-6"
                  >
                    Save
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

export default ResetPassword;
