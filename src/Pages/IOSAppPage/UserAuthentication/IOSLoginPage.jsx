import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, Lock, User } from "lucide-react";

const IOSLoginPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("old"); // "old" or "new"
  const [loginMethod, setLoginMethod] = useState("phone"); // "email" or "phone"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Login form data
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    countryCode: "+91",
  });

  // Registration form data
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Old user login - directly go to OTP verification
    // Phone number is already collected from the form
    toast.success("Phone number verified!");
    setTimeout(() => {
      navigate("/ios/verify-otp", { state: { userType: "old" } });
    }, 1000);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to Terms and Conditions");
      return;
    }

    // Navigate to phone number verification for new users
    toast.success("Registration submitted!");
    setTimeout(() => {
      navigate("/ios/verify-number", { state: { userType: "new" } });
    }, 1000);
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "email" ? "phone" : "email");
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col overflow-auto relative">
      {/* Scrollable Content */}
      <div className={`flex-1 overflow-y-auto overscroll-none ${userType === "new" ? "pb-4" : ""}`}>
        {/* Main Content */}
        <div className={`px-6 pt-20 ${userType === "new" ? "pb-8" : "pb-32"}`}>
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-12">
            <img
              src="/Tranparent Logo In Black 1@2x.png"
              alt="Digivahan Logo"
              className="w-60 h-auto object-contain"
            />
          </div>

          {/* User Type Toggle */}
          <div className="flex justify-center mb-20">
            <div className="inline-flex rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setUserType("old")}
                className={`px-9 py-2.5 font-semibold text-sm transition-all duration-200 rounded-l-lg ${
                  userType === "old"
                    ? "bg-[#4CAF50] text-white"
                    : "bg-[#D3D3D3] text-gray-700"
                }`}
              >
                I'm Old User
              </button>
              <button
                type="button"
                onClick={() => setUserType("new")}
                className={`px-9 py-2.5 font-semibold text-sm transition-all duration-200 rounded-r-lg ${
                  userType === "new"
                    ? "bg-[#4CAF50] text-white"
                    : "bg-[#D3D3D3] text-gray-700"
                }`}
              >
                I'm New User
              </button>
            </div>
          </div>

          {/* Conditional Forms */}
          {userType === "old" ? (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone Number Input */}
              {loginMethod === "phone" ? (
                <div>
                  <label className="block text-black font-normal mb-2.5 text-base">
                    Phone Number
                  </label>
                  <div className="relative bg-white border border-gray-300 rounded-xl shadow-sm">
                    <div className="flex items-center px-3 py-3.5">
                      <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                        <img
                          src="https://flagcdn.com/w20/in.png"
                          alt="India"
                          className="w-6 h-4 object-cover rounded-sm"
                        />
                        <span className="text-gray-700 text-sm font-normal whitespace-nowrap">India (IN)</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 ml-3">
                        <Phone className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-base bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-black font-normal mb-2.5 text-base">
                    Email Address
                  </label>
                  <div className="relative bg-white border border-gray-300 rounded-xl shadow-sm">
                    <div className="flex items-center px-4 py-3.5 gap-3">
                      <Mail className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-base bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Login with email checkbox and Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="loginWithEmail"
                    checked={loginMethod === "email"}
                    onChange={toggleLoginMethod}
                    className="w-4 h-4 accent-[#4CAF50] border-gray-300 rounded cursor-pointer"
                  />
                  <Mail className="w-4 h-4 text-[#4CAF50]" />
                  <label htmlFor="loginWithEmail" className="text-sm text-gray-700 cursor-pointer select-none">
                    Login with email
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/ios/verify-number", { state: { flowType: "forgot-password" } })}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-12 bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3d8b40] text-white font-semibold rounded-xl shadow-sm transition-all duration-200 mt-6 text-base"
              >
                Login
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* First Name */}
              <div>
                <label className="block text-gray-800 font-medium mb-1.5 text-[15px]">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    placeholder="Enter your first name"
                    required
                    autoComplete="given-name"
                    autoCapitalize="words"
                    className="w-full min-h-12 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] text-gray-800 placeholder-gray-400 bg-white text-base"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-800 font-medium mb-1.5 text-[15px]">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    placeholder="Enter your last name"
                    required
                    autoComplete="family-name"
                    autoCapitalize="words"
                    className="w-full min-h-12 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] text-gray-800 placeholder-gray-400 bg-white text-base"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-gray-800 font-medium mb-1.5 text-[15px]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="w-full min-h-12 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] text-gray-800 placeholder-gray-400 bg-white text-base"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-800 font-medium mb-1.5 text-[15px]">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Phone className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="+91* Enter your phone number"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    className="w-full min-h-12 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] text-gray-800 placeholder-gray-400 bg-white text-base"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-800 font-medium mb-1.5 text-[15px]">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="new-password"
                    className="w-full min-h-12 pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] text-gray-800 placeholder-gray-400 bg-white text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2E7D32] p-2 min-w-11 min-h-11 flex items-center justify-center"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-800 font-medium mb-1.5 text-[15px]">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                    className="w-full min-h-12 pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] text-gray-800 placeholder-gray-400 bg-white text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2E7D32] p-2 min-w-11 min-h-11 flex items-center justify-center"
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-5 h-5 min-w-5 min-h-5 accent-[#2E7D32] border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="text-[13px] text-gray-500 leading-tight">
                  I Agree to{" "}
                  <span className="text-[#2E7D32] font-medium">
                    Terms and Condition
                  </span>{" "}
                  and{" "}
                  <span className="text-[#2E7D32] font-medium">
                    privacy policy
                  </span>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full min-h-13 bg-[#2E7D32] active:bg-[#1B5E20] active:scale-[0.98] text-white font-semibold py-4 rounded-full shadow-md transition-all duration-200 mt-4 text-base"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Footer Decoration */}
      {userType === "old" && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <img
            src="/Footer Design.png"
            alt="Footer Design"
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default IOSLoginPage;
